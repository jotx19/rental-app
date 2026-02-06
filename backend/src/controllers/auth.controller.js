import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import sendMail from '../lib/mailer.js';
import generateOTP from '../lib/generateOTP.js';

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });

        if (password.length < 6) {
            return res.status(400).json({ message: "Password should be at least 6 characters long" });
        }

        const hashedPwd = await bcrypt.hash(password, 12);

        const newUser = new User({
            name,
            email,
            password: hashedPwd,
            verified: true,
        });
        if (newUser){
            await newUser.save();

            const token = generateToken(newUser._id)

            res.status(201).json({
             token,
             _id: newUser._id,
             name: newUser.name,
             email: newUser.email,
             profilepic: newUser.profilePic
        });
        } else (
            res.status(400).json({message: "Invalid User Data"})
        )

    } catch (error) {
        console.log('Error in signup', error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "User not found" });

        if (user.otp !== otp || new Date() > user.otpExpiry)
            return res.status(400).json({ message: "Invalid or expired OTP" });

        user.verified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        const token = generateToken(user._id)

        res.status(200).json({
            message: "Login Successful",
            token,
            _id: user._id,
            name: user.name,
            email: user.email,
            profilepic: user.profilePic
        })

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};


export const resendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "User not found" });

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

export const emailVerification = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "User with this email does not exist" });

        // Generate OTP and send to user if the email exists
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 20 * 60 * 1000);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        await sendMail(email, 'Your OTP Code for Email Verification', otp);
        res.json({ message: 'OTP sent successfully.' });

    } catch (error) {
        console.log('Error in email verification request', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const login = async (req, res)=>{
    const {email, password}=req.body;
    try {
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message: "Wrong credentials"});
        }
            
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect){
            return res.status(400).json({message: "Wrong credentials"});
        }

        const token = generateToken(user._id)

        res.status(200).json({
            message: "Login Successful",
            token,
            _id: user._id,
            name: user.name,
            email: user.email,
            profilepic: user.profilePic
        })
    } catch (error) {
        console.log("Unable to login")
        res.status(500).json({message: "Internal Server Error"});
        
    }
};
export const logout = (req, res) => {
    res.clearCookie("jwt", {
        maxAge: 0,
        httpOnly: true,
        sameSite: 'None',
        secure: true,
    });
    res.json({ message: "Logged out successfully" });
};

export const loginWithGoogle = (req, res )=>{
    try {
        const user = req.user;

        const token = generateToken(user._id)

        res.status(200).json({
            message: "Login Successful",
            token,
            _id: user._id,
            name: user.name,
            email: user.email,
            profilepic: user.profilePic
        })
    } catch (error) {
        console.log("Unable to login with Google", error)
        res.status(500).json({message: "Internal Server Error"});
        
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in Authentication Check", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
