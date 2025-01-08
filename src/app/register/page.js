"use client"
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Lock, Mail, User, Upload, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Validation Schema
const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Only Gmail addresses are allowed")
    .required("Email is required"),
  username: Yup.string()
    .min(5, "Username must be at least 3 characters")
    .max(15, "Username must be less than 30 characters")
    .matches(
      /^(?=.*[a-zA-Z])(?!(.*_{3,}))[a-zA-Z0-9_]+$/,
      "Username must include at least one letter, and cannot have more than two consecutive underscores"
    )
    .required("Username is required"),  
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include uppercase, lowercase, number, and special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  profilePicture: Yup.mixed()
    .nullable()
    .test('fileSize', 'File too large', (value) => 
      !value || (value && value.size <= 5000000)
    )
    .test('fileFormat', 'Unsupported format', (value) =>
      !value || (value && ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type))
    )
});

export default function Register() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      profilePicture: null
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const formData = new FormData();
        formData.append('email', values.email);
        formData.append('username', values.username);
        formData.append('password', values.password);
        if (values.profilePicture) {
          formData.append('profile_picture', values.profilePicture);
        }

        // Replace with your API endpoint
        // const response = await fetch('/api/register', {
        //   method: 'POST',
        //   body: formData
        // });

        // if (response.ok) {
        //   router.push('/login');
        // } else {
        //   throw new Error('Registration failed');
        // }
      } catch (error) {
        console.error("Registration failed:", error);
        setStatus("Registration failed. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleImageChange = (event) => {
    if (event.currentTarget.files?.[0]) {
      formik.setFieldValue('profilePicture', event.currentTarget.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-white font-poppins text-gray-900 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-5xl rounded-3xl overflow-hidden py-5 grid grid-cols-1 md:grid-cols-2"
      >
        {/* Image Section */}
        <div className="hidden md:block relative">
          <div className="absolute inset-0 z-10"></div>
          <Image
            src="/taskmanageimg.png"
            alt="Register Background"
            layout="fill"
            objectFit="contain"
            className="absolute inset-0 w-full h-full p-2"
          />
          <div className="relative z-20 p-6 sm:p-8 lg:p-10 flex flex-col justify-end h-full">
            <div className="bg-white/80 p-4 sm:p-6 rounded-xl backdrop-blur-sm">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl lg:text-2xl text-gray-900 font-bold mb-2 sm:mb-4"
              >
                Join Our Platform
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm sm:text-base lg:text-lg text-gray-700 font-medium"
              >
                Create an account to start managing your tasks effectively.
              </motion.p>
            </div>
          </div>
        </div>

        {/* Registration Form Section */}
        <div className="p-6 sm:p-8 lg:p-10 flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Register Header */}
            <div className="mb-6 sm:mb-8 lg:mb-10 text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-poppins font-semibold tracking-tight text-black mb-1 sm:mb-2">
                Create Account
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium">
                Sign up to get started with your journey
              </p>
            </div>

            {/* Register Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Email Input */}
              <div className="relative">
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
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
                  <div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.email}</div>
                )}
              </div>

              {/* Username Input */}
              <div className="relative">
                <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    {...formik.getFieldProps('username')}
                    className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
                    placeholder="Enter username"
                  />
                </div>
                {formik.touched.username && formik.errors.username && (
                  <div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.username}</div>
                )}
              </div>

              {/* Password Input */}
              <div className="relative">
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
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
                    className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
                    placeholder="Enter password"
                  />
                </div>
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.password}</div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    {...formik.getFieldProps('confirmPassword')}
                    className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
                    placeholder="Confirm your password"
                  />
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.confirmPassword}</div>
                )}
              </div>

              {/* Profile Picture Upload */}
              <div className="relative">
                <label htmlFor="profilePicture" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Profile Picture (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="profilePicture"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <label
                    htmlFor="profilePicture"
                    className="w-full flex items-center justify-center px-4 py-2 sm:py-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-all"
                  >
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2" />
                    <span className="text-sm sm:text-base text-gray-600">Choose a file</span>
                  </label>
                </div>
                {formik.touched.profilePicture && formik.errors.profilePicture && (
                  <div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.profilePicture}</div>
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
                Create Account
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