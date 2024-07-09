"use client";

import { useCallback, useState } from "react";
import Styles from "../../page.module.css"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserForgotPassword } from "@/apiFunction/auth/auth";

import { ToastContainer, toast } from "react-toastify";
import SpinnerComp from "@/components/common/spinner";


export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return re.test(email.toLowerCase());
  };


  const handleEmail = useCallback((value) => {
    setEmail(() => value.target.value);
    setIsValid(true);
  }, []);
  const submitForm = async () => {
    const isValidEmail = validateEmail(email);
    setIsValid(isValidEmail);
    if (!isValidEmail) {
      toast.error('Invalid Email');
      return false;
    }
    setIsLoading(true)
    const Email = email;
    let res = await  UserForgotPassword({ Email });
    console.log("forgotPassword data", res)
    if (res.successMessage?.success == true) {
      toast.success(res?.successMessage?.message);
      setIsLoading(false)
      router.push("/")
    } else {
      toast.error(res?.errMessage?.message);
      setIsLoading(false)
      return;
    }
  };
  return (
    
    <section

      className={` ${Styles.loginMain} bg-gray-50 dark:bg-gray-900 h-100`}
    >
      {isLoading &&    <SpinnerComp/>  }
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className={` ${Styles.mt7} flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white`}
        >
          <img
            className="w-28 h-28 mr-2 rounded-full"
            src="/images/logo-3.jpg"
            alt="logo"
          />
        </a>
        <div
          className={`${Styles.loginBoxMain} bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700`}
        >
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Forgot Password
            </h1>
            <form className="space-y-4 md:space-y-6">
            <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmail}
                  placeholder="Enter Email id"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
        
              <button
                onClick={submitForm}
                type="button"
                className={`${Styles.signInBtn} w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
              >
                Send
              </button>
              
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
