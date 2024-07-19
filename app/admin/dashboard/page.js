"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import Styles from "./dashboard.module.css";
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
    setIsLoading(true);
    let dashboardData = await getdashboardData();
    console.log("dashboardData", dashboardData);
    if (dashboardData?.resData?.success) {
      setDashboardData(dashboardData?.resData?.data);
      setIsLoading(false);
      return false;
    } else {
      toast.error(dashboardData?.message);
      setIsLoading(false);
      return false;
    }
  };
  return (
    <section className="flex justify-center item-center">
      {isLoading && <SpinnerComp />}
      <div className="grid gap-4 md:grid-cols-3 items-center justify-center">
        <div
          className={`${Styles.firstCard} max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center `}
        >
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

        <div
          className={`${Styles.secondCard} max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center `}
        >
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
              Total Mason Count
            </h5>
          </Link>
          <p className={`mb-3 mt-2 font-semibold text-6xl`}>
            {dashboardData.masonCount}
          </p>
        </div>

        <div
          className={`${Styles.fifthCard} max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center `}
        >
          <svg
            className="w-7 h-7  mb-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 9h18M3 9v12a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V14h4v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V9M3 9L12 3l9 6"
            />
          </svg>
          <Link href="/admin/companies">
            <h5 className="mb-2 text-2xl font-semibold tracking-tight">
              Total Companies Count
            </h5>
          </Link>
          <p className={`mb-3 mt-2 font-semibold text-6xl`}>
            {/* {dashboardData.retailerCount} */} 0
          </p>
        </div>

        <div
          className={`${Styles.sixthCard} max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center `}
        >
          <svg
            className="w-7 h-7  mb-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 9l6-6 6 6v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9z"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 22h6"
            />
          </svg>
          <Link href="/admin/products">
            <h5 className="mb-2 text-2xl font-semibold tracking-tight">
              Total Products Count
            </h5>
          </Link>
          <p className={`mb-3 mt-2 font-semibold text-6xl`}>
            {/* {dashboardData.retailerCount} */} 0
          </p>
        </div>

        <div
          className={`${Styles.thirdCard} max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center `}
        >
          <img
            src="/images/coupon.png" // Ensure the path is correct
            alt="Coupon"
            className="w-7 h-7 mb-3"
          />

          <Link href="/admin/coupon">
            <h5 className="mb-2 text-2xl font-semibold tracking-tight ">
              Scanned Coupon Count
            </h5>
          </Link>
          <p className="mb-3 mt-2 font-semibold text-6xl">
            {dashboardData.scannedCouponsCount}
          </p>
        </div>

        <div
          className={`${Styles.fourthCard} max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center `}
        >
          <img
            src="/images/coupon.png" // Ensure the path is correct
            alt="Coupon"
            className="w-7 h-7 mb-3"
          />
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
