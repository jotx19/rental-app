import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '../store/useAuthStore';
import { Loader, Mail } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp';
import toast from 'react-hot-toast';

const EmailVerifyPage = () => {
    const [email, setEmail] = useState<string>('');
    const [userOtp, setUserOtp] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [sending, setSending] = useState<boolean>(false);
    const [verifying, setVerifying] = useState<boolean>(false);
    const [otpSent, setOtpSent] = useState<boolean>(false);
    const { sendEmailVerification, verify } = useAuthStore();
    const navigate = useNavigate();

    const handleEmailSubmit = async () => {
        if (!email) {
            toast.error('Please enter your email');
            return;
        }

        setIsSubmitting(true);
        setSending(true);
        try {
            await sendEmailVerification(email);
            setOtpSent(true);
        } catch (error) {
            console.error('Error sending email verification:', error);
        } finally {
            setIsSubmitting(false);
            setSending(false);
        }
    };

    const handleOtpVerify = async () => {
        if (!userOtp || userOtp.length !== 6) {
            toast.error('Please enter a valid OTP.');
            return;
        }

        setVerifying(true);
        try {
            await verify(email, userOtp);
            navigate('/');
        } catch (error) {
            console.error('Error verifying OTP:', error);
        } finally {
            setVerifying(false);
        }
    };

    const handleResendOtp = async () => {
        if (sending) return;
        setSending(true);
        try {
            await sendEmailVerification(email);
            setOtpSent(true);
        } catch (error) {
            console.error('Error resending OTP:', error);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen py-10 px-4">
            <div className="w-full max-w-md px-6 py-8 rounded-lg">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold">Login to Housing</h1>
                </div>

                {!otpSent ? (
                    <>
                        <div className="mb-4">
                            <input
                                type="email"
                                id="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border rounded-lg"
                            />
                        </div>

                        <Button
                            onClick={handleEmailSubmit}
                            disabled={isSubmitting}
                            className="w-full py-3 rounded-lg h-12 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <Loader className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <Mail className="h-5 w-5" />
                                    Continue with Email
                                </>
                            )}
                        </Button>
                    </>
                ) : (
                    <div className="mt-6 flex flex-col items-center gap-4 mx-auto">
                        <p className='flex text-center'>If you have an account, we have sent a code to your Email. Enter it below.</p>
                        <InputOTP maxLength={6} value={userOtp} onChange={setUserOtp} className="text-2xl justify-center">
                            <InputOTPGroup>
                                <InputOTPSlot index={0} className="w-12 h-12" />
                                <InputOTPSlot index={1} className="w-12 h-12" />
                                <InputOTPSlot index={2} className="w-12 h-12" />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={3} className="w-12 h-12" />
                                <InputOTPSlot index={4} className="w-12 h-12" />
                                <InputOTPSlot index={5} className="w-12 h-12" />
                            </InputOTPGroup>
                        </InputOTP>

                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                            Didn't get an email?{" "}
                            {sending ? (
                                <span className="cursor-pointer text-primary hover:opacity-85 underline">
                                    <Loader className="h-4 w-4 animate-spin" />
                                </span>
                            ) : (
                                <span
                                    className="cursor-pointer text-primary hover:opacity-85 underline"
                                    onClick={handleResendOtp}
                                >
                                    Resend OTP
                                </span>
                            )}
                        </p>

                        <Button
                            onClick={handleOtpVerify}
                            disabled={verifying || !userOtp}
                            className="w-full py-3 bg-primary rounded-lg hover:bg-primary-dark transition-all duration-300"
                        >
                            {verifying ? (
                                <Loader className="h-5 w-5 animate-spin" />
                            ) : (
                                'Verify OTP'
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailVerifyPage;
