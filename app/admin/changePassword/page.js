"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { changePassword } from "@/apiFunction/auth/auth";
import Styles from "./changepassword.module.css";
import Cookies from "js-cookie";
import SpinnerComp from "@/components/common/spinner";

export default function Password(params) {
  const [OldPassword, setOldPassword] = useState("");
  const [NewPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [newPasswordShow, setNewPasswordShow] = useState(false);
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);

  const phone = Cookies.get("phone");

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (event) => {
    const value = event.target.value;
    setNewPassword(value);

    // Check if passwords match when new password changes
    // if (value !== confirmPassword) {
    //   setPasswordsMatch(false);
    // } else {
    //   setPasswordsMatch(true);
    // }
  };

  const handleConfirmPasswordChange = (event) => {
    const value = event.target.value;
    setConfirmPassword(value);

    if (NewPassword !== value) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  };

  const router = useRouter();

  const submitUserForm = async () => {
    if (OldPassword === "") {
      toast.error("Old Password cannot be empty");
      return false;
    }

    if (NewPassword === "") {
      toast.error("New Password cannot be empty");
      return false;
    }

    if (confirmPassword === "") {
      toast.error("Confirm Password cannot be empty");
      return false;
    }

    if (NewPassword !== confirmPassword) {
      toast.error("New Password and Confirm Password should match");
      return false;
    }
    
    setIsLoading(true);

    const UserDetails = {
      Phone: phone,
      oldPassword: OldPassword,
      newPassword: NewPassword,
    };

    let updateUserData = await changePassword(UserDetails);
    // console.log("response message", updateUserData);
    if (updateUserData?.successMessage?.success == true) {
      toast.success(updateUserData?.successMessage?.message);
      setIsLoading(false);
      Cookies.remove("token");
      Cookies.remove("email");
      Cookies.remove("firstName");
      Cookies.remove("lastName");
      Cookies.remove("phone");
      router.push("/login");
      return false;
    } else {
      toast.error(updateUserData?.errMessage);
      setIsLoading(false);
      return false;
    }
  };

  const handleNewPasswordShow = () => {
    setNewPasswordShow(!newPasswordShow);
  };

  const handleConfirmPasswordShow = () => {
    setConfirmPasswordShow(!confirmPasswordShow);
  };

  return (
    <>
      {isLoading && <SpinnerComp />}
      <section>
        <h1 className="text-2xl text-black-600 underline mb-3 font-bold">
          Update Password
        </h1>
        <form className="grid gap-4 mb-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Old Password <span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={OldPassword}
              onChange={handleOldPasswordChange}
              placeholder="Old Password"
            />
          </div>
          <div className="relative">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              New Password <span className="text-red-600">*</span>
            </label>
            <input
              type={newPasswordShow ? "text" : "password"}
              value={NewPassword}
              onChange={handleNewPasswordChange}
              name="NewPassword"
              id="NewPassword"
              placeholder="New Password"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required=""
            />
            <button
              onClick={handleNewPasswordShow}
              type="button"
              className={`text-black absolute end-2.5 bottom-2.5 font-bold rounded-lg text-xl px-4 py-2 ${Styles.eyeButton}`}
            >
              {newPasswordShow ? (
                <i className="bi bi-eye-slash-fill"></i>
              ) : (
                <i className="bi bi-eye-fill"></i>
              )}
            </button>
          </div>
          <div className="relative">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Confirm New Password <span className="text-red-600">*</span>
            </label>
            <input
              type={confirmPasswordShow ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm New Password"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required=""
            />
            <button
              onClick={handleConfirmPasswordShow}
              type="button"
              className={`text-black absolute end-2.5 bottom-2.5 font-bold rounded-lg text-xl px-4 py-2 ${Styles.eyeButton}`}
            >
              {confirmPasswordShow ? (
                <i className="bi bi-eye-slash-fill"></i>
              ) : (
                <i className="bi bi-eye-fill"></i>
              )}
            </button>
            {/* {!passwordsMatch && (
            <p className="text-red-500 text-sm mt-1">
              Passwords should match.
            </p>
          )} */}
          </div>
        </form>
        <button
          onClick={submitUserForm}
          className="text-white mt-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Update
        </button>
      </section>
    </>
  );
}
