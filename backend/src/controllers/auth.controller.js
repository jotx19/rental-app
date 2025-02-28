import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import sendMail from '../lib/mailer.js';
import generateOTP from '../lib/generateOTP.js';

export const signup = async (req, res)=>{
    const {name, email, password} = req.body;
    try {
        const existinguser = await User.findOne({email});
        if(existinguser)
          return res.status(400).json({message: "User already exists"});

        if (password.length < 6){
            return res.status(400).json({message: "Password should be atleast 6 characters long"});
        }

    const hashedpwd = await bcrypt.hash(password, 12);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 20 * 60 * 1000);

    const newUser = new User({
        name,
        email,
        password: hashedpwd,
        otp,
        otpExpiry,
    });
    await newUser.save();
    const token = generateToken(newUser._id, res);
    await sendMail(email, "Account Verification", otp);

    return res.status(200).json({message: "User created successfully. Please verify your email"});

    } catch (error) {
        console.log('Error in signup', error);
        return res.status(500).json({message: "Internal server error", error});
    }
}

export const verifyOtp = async (req, res)=>{
    const {email, otp} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user)
          return res.status(400).json({message: "User not found"});

        if( user.otp !== otp || new Date() > user.otpExpiry)
          return res.status(400).json({message: "Invalid OTP"});

        user.verified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        const token = generateToken(user._id, res);  

        res.json({ message: "OTP verified successfully"});

    } catch (error) {
        res.status(500).json({message: "Internal server error", error});
    }
};

export const resendOtp = async (req, res)=>{
    const {email} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user)
          return res.status(400).json({message: "User not found"});
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 20 * 60 * 1000);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        await sendMail(email, 'Your OTP Code', otp);
        res.json({ message: 'OTP resent successfully' });
    } catch (error) {
        console.log('Error in resending OTP', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


export const login = async (req, res)=>{
    const {email, password, otp, useOtp} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user)
          return res.status(400).json({message: "User not found"});

        if(useOtp){
            if (!user.otp || user.otp!== otp || new Date() > user.otpExpiry) {
              return res.status(400).json({message: "Invalid OTP"});
        }
        user.verified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        }else {
            if (!user.verified)
                return res.status(400).json({message: "Email not verified"});
            
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch)
                return res.status(400).json({message: "Invalid credentials"});
        }
        const token = generateToken(user._id, res);
        res.json({message: "Login successful"});
    } catch (error) {
        res.status(500).json({message: "Internal server error", error});
    }
};

export const logout = (req, res)=>{
    res.clearCookie("myToken");
    res.json({message: "Logged out successfully"});
};

export const checkAuth = (req, res) =>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in Authentication Check", error)
        res.status(500).json({message: "Internal Server Error"});
    }
};