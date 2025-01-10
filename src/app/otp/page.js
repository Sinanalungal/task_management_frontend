"use client"

import React, { useState, useRef, useEffect } from 'react';
import { motion } from "framer-motion";
import { Mail, ArrowUpRight, KeyRound, Timer } from "lucide-react";
import { otpresend, otpverification } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef([]);
  const router = useRouter();




  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);
    setError('');

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pastedData.some(char => isNaN(char))) {
      setError('Please paste numbers only');
      return;
    }
    
    const newOTP = [...otp];
    pastedData.forEach((value, index) => {
      if (index < 6) newOTP[index] = value;
    });
    setOtp(newOTP);
    
    // Focus last filled input or first empty input
    const lastFilledIndex = newOTP.findLastIndex(val => val !== '');
    const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
    inputRefs.current[focusIndex].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (otp.some(digit => digit === '')) {
      setError('Please enter all digits');
      return;
    }

    setIsSubmitting(true);
    try {
      const email = sessionStorage.getItem('registrationEmail');
      const otpString = otp.join('');
      await otpverification(email,otpString)
      router.push('/dashboard')
    } catch (error) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const onResendOTP=async ()=>{
    try{
      const email = sessionStorage.getItem('registrationEmail');
      if (!email){
        toast.error('Register again to continue..')
        router.push('/register');
      }else{
        
        await otpresend(email)
      }
    }catch(error){
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen bg-white font-poppins text-gray-900 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-md rounded-3xl overflow-hidden py-5"
      >
        <div className="p-6 sm:p-8 lg:p-10">
          {/* OTP Header */}
          <div className="mb-6 sm:mb-8 lg:mb-10 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-black mb-1 sm:mb-2">
              Verify Your Email
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium">
              We've sent a code to your email
            </p>
            <div className={`mt-2 flex items-center justify-center space-x-2 text-gray-600`}>
              <Timer className="w-4 h-4" />
              <span className="text-sm">
                { `Valid for: 60 seconds`}
              </span>
            </div>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center space-x-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
                />
              ))}
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white text-sm sm:text-base font-bold py-2 sm:py-3 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Verify Email
              <ArrowUpRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>

            {/* Resend OTP */}
            <div className="text-center">
              <button
                type="button"
                onClick={onResendOTP}
                className="text-sm sm:text-base text-gray-600 hover:text-black transition-colors"
              >
                Didn't receive the code? Resend
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPVerification;