"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import Image from "next/image";

// Validation Schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Only Gmail addresses are allowed")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include uppercase, lowercase, number, and special character"
    )
    .required("Password is required")
});

export default function Login() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const response = await login(values.email, values.password);
        console.log(response);
        // Handle successful login here (e.g., store tokens, redirect)
        router.push('/dashboard'); // Redirect to dashboard after successful login
      } catch (error) {
        console.error("Login failed:", error);
        setStatus("Login failed. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-white font-poppins text-gray-900 flex items-center justify-center p-4 sm:p-6 ">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        // className="w-full max-w-5xl bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
        // className="w-full max-w-5xl  shadow bg-gray-50 rounded-3xl  overflow-hidden  py-5 grid grid-cols-1 md:grid-cols-2"
        className="w-full max-w-5xl   rounded-3xl  overflow-hidden  py-5 grid grid-cols-1 md:grid-cols-2"


      >
        {/* Image Section */}
        <div className="hidden md:block relative">
          {/* Semi-transparent overlay for better text visibility */}
          <div className="absolute inset-0  z-10"></div>
          
          <Image
            src="/taskmanageimg.png"
            alt="Login Background"
            layout="fill"
            objectFit="contain"
            className="absolute inset-0 w-full h-full p-2"
          />
          
          {/* Text Container - Now with responsive text */}
          <div className="relative z-20 p-6  sm:p-8 lg:p-10 flex flex-col justify-end h-full">
            <div className="bg-white/80 p-4 sm:p-6 rounded-xl backdrop-blur-sm">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl lg:text-2xl text-gray-900 font-bold mb-2 sm:mb-4"
              >
                Welcome to Our Platform
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm sm:text-base lg:text-lg text-gray-700 font-medium"
              >
                Streamline your workflow and boost productivity with our
                innovative solutions.
              </motion.p>
            </div>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="p-6 sm:p-8 lg:p-10 flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Login Header */}
            <div className="mb-6 sm:mb-8 lg:mb-10 text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-poppins font-semibold tracking-tight text-black mb-1 sm:mb-2">
                Welcome Back
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium">
                Sign in to continue to your dashboard
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Email Input */}
              <div className="relative">
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    {...formik.getFieldProps('email')}
                    className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
                    placeholder="you@gmail.com"
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-xs sm:text-sm mt-1">
                    {formik.errors.email}
                  </div>
                )}
              </div>

              {/* Password Input */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    {...formik.getFieldProps('password')}
                    className="w-full pl-10 pr-12 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
                    placeholder="Enter your password"
                  />
                </div>
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 text-xs sm:text-sm mt-1">
                    {formik.errors.password}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full bg-black text-white text-sm sm:text-base font-bold py-2 sm:py-3 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign In
                <ArrowUpRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>

              {/* Form Status/Error Message */}
              {formik.status && (
                <div className="text-red-500 text-xs sm:text-sm text-center mt-2">
                  {formik.status}
                </div>
              )}
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}