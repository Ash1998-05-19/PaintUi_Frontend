"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import Styles from "./dashboard.module.css"
import { getdashboardData } from "@/apiFunction/dashboard/dashboardApi";
import { useEffect, useState } from "react";
import SpinnerComp from "@/components/common/spinner";

export default function App() {
  const [dashboardData, setDashboardData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getAllDashboardData();
  }, []);
  const getAllDashboardData = async () => {
    setIsLoading(true)
    let dashboardData = await getdashboardData();
    console.log("dashboardData",dashboardData)
    if (dashboardData?.resData?.success) {
      setDashboardData(dashboardData?.resData?.data);
      setIsLoading(false)
      return false;
    } else {
      toast.error(dashboardData?.message);
      setIsLoading(false)
      return false;
    }
  };
  return (
    <section>
      {isLoading &&    <SpinnerComp/>  }
      <div className="flex flex-wrap justify-between ml-4">
        <div className={`${Styles.firstCard} max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center `}>
          <svg
            className="w-7 h-7  mb-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
          </svg>
          <Link href="/admin/users">
            <h5 className="mb-2 text-2xl font-semibold tracking-tight">
              Total Retailer Count
            </h5>
          </Link>
          <p className={`mb-3 mt-2 font-semibold text-6xl`}>
          {dashboardData.retailerCount}
          </p>
        </div>

        <div className={`${Styles.secondCard} max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center `}>
          <svg
            className="w-7 h-7  mb-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 7a2 2 0 0 1-2 2h-.28a2 2 0 0 0-1.77 1.06l-.62 1.08a2 2 0 0 0 0 1.72l.62 1.08A2 2 0 0 0 18.72 15H19a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h.28a2 2 0 0 0 1.77-1.06l.62-1.08a2 2 0 0 0 0-1.72l-.62-1.08A2 2 0 0 0 5.28 9H5A2 2 0 0 1 3 7V4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3z"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 15h10M7 9h10"
            />
          </svg>

          <Link href="/admin/coupon">
            <h5 className="mb-2 text-2xl font-semibold tracking-tight ">
              Scanned Coupon Count
            </h5>
          </Link>
          <p className="mb-3 mt-2 font-semibold text-6xl">
          {dashboardData.scannedCouponsCount}
          </p>
        </div>

        <div className={`${Styles.thirdCard} max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center `}>
          <svg
            className="w-7 h-7  mb-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 7a2 2 0 0 1-2 2h-.28a2 2 0 0 0-1.77 1.06l-.62 1.08a2 2 0 0 0 0 1.72l.62 1.08A2 2 0 0 0 18.72 15H19a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h.28a2 2 0 0 0 1.77-1.06l.62-1.08a2 2 0 0 0 0-1.72l-.62-1.08A2 2 0 0 0 5.28 9H5A2 2 0 0 1 3 7V4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3z"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 15h10M7 9h10"
            />
          </svg>
          <Link href="#">
            <h5 className="mb-2 text-2xl font-semibold tracking-tight ">
            Scanned Coupon Amount 
            </h5>
          </Link>
          <p className="mb-3 mt-2 font-semibold text-6xl">
          {dashboardData.scannedCouponsAmount}
          </p>
        </div>
      </div>
    </section>
  );
}
