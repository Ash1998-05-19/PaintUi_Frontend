"use client";

import { useCallback, useState } from "react";
import Styles from "./page.module.css"
import Link from "next/link";

import { useRouter } from "next/navigation";
import { LoginAdmin } from "@/apiFunction/auth/auth";

import { ToastContainer, toast } from "react-toastify";
import SpinnerComp from "@/components/common/spinner";
import Login from "./(auth)/logIn/page";
//import { loginUser } from "@/api-functions/auth/authAction";

export default function MainPage() {
  
  return (
    <Login/>
  );
}
