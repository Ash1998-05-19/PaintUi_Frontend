"use client";

import { useCallback, useState } from "react";
import Styles from "../page.module.css"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginAdmin } from "@/apiFunction/auth/auth";

import { ToastContainer, toast } from "react-toastify";
import SpinnerComp from "@/components/common/spinner";
//import { loginUser } from "@/api-functions/auth/authAction";

export default function Login() {
  const router = useRouter();
  const [Mobile, setMobile] = useState("");
  const [Password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleMobile = useCallback((value) => {
    setMobile(() => value.target.value);
  }, []);
  const handlePassword = useCallback((value) => {
    setPassword(() => value.target.value);
  }, []);
  const login = async () => {
    setIsLoading(true);
    //router.push('/dashboard');
   //Check if the field is empty
   if (Mobile === "") {
    setIsLoading(false);
    toast.error("Phone number cannot be empty");
    return false;
  }

  // Check if the number has exactly 10 digits
  if (!/^\d{10}$/.test(Mobile)) {
    setIsLoading(false);
    toast.error("Phone number must be 10 digits long");
    return false;
  }

  // Check if the number starts with 9, 8, or 7
  if (!/^[789]/.test(Mobile)) {
    setIsLoading(false);
    toast.error("Phone number must start with 9, 8, or 7");
    return false;
  }
    // Validate Password
    if (Password.length < 5) {
      setIsLoading(false);
      toast.error("Password must be at least 5 characters long");
      return false;
    }
    const LoginData = {
      Phone : Mobile,
      Password : Password
    }
    let res = await LoginAdmin(LoginData)
    console.log(res);
   
    if(res.token){
      toast.success("LogIn Successfully")
      setIsLoading(false);
      router.push("/admin/dashboard");
     

    }else{
      toast.error(res.errMessage);
      setIsLoading(false);
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
              Login to your account
            </h1>
            <form className="space-y-4 md:space-y-6">
            <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Phone number
                </label>
                <input
                  type="tel"
                  value={Mobile}
                  onChange={handleMobile}
                  placeholder="phone number"
                  id="phone"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  value={Password}
                  onChange={handlePassword}
                  name="password"
                  id="password"
                  placeholder="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                />
              </div>
              <div className="flex items-center justify-between">
                {/* <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required=""
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                </div> */}
                <Link
                  href="/forgotPassword"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </Link>
              </div>
              <button
                onClick={login}
                type="button"
                className={`${Styles.signInBtn} w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
              >
                Login
              </button>
              {/* <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </Link>
              </p> */}
              
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
