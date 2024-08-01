"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import Styles from "./dashboard.module.css";
import { getdashboardData } from "@/apiFunction/dashboard/dashboardApi";
import { useEffect, useState } from "react";
import SpinnerComp from "@/components/common/spinner";

export default function Dashboard(params) {
  const [dashboardData, setDashboardData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log("params data of dashboard", params);
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
    <div className={Styles.background}>
    <section className="flex justify-center item-center ">
      {isLoading && <SpinnerComp />}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 lg:grid-cols-3 items-center justify-center mt-4">
        <div
          className={`${Styles.firstCard} max-w-sm p-6 h-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center `}
        >
          <img
            src="/images/retailer.png" // Ensure the path is correct
            alt="Coupon"
            className="w-9 h-9 mb-3"
          />
          <Link href="/admin/users">
            <h5 className="mb-2 text-2xl font-semibold tracking-tight">
              Total Retailer Count
            </h5>
          </Link>
          <p className={`mb-3 mt-2 font-semibold text-2xl`}>
            {dashboardData.retailerCount}
          </p>
        </div>

        <div
          className={`${Styles.secondCard} h-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center `}
        >
          <img
            src="/images/mason.png" // Ensure the path is correct
            alt="Coupon"
            className="w-9 h-9 mb-3"
          />
          <Link href="/admin/users?Type=Mason">
            <h5 className="mb-2 text-2xl font-semibold tracking-tight">
              Total Mason Count
            </h5>
          </Link>
          <p className={`mb-3 mt-2 font-semibold text-2xl`}>
            {dashboardData.masonCount}
          </p>
        </div>

        <div
          className={`${Styles.fifthCard} h-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center `}
        >
          <img
            src="/images/company.png" // Ensure the path is correct
            alt="Coupon"
            className="w-9 h-9 mb-3"
          />
          <Link href="/admin/companies">
            <h5 className="mb-2 text-2xl font-semibold tracking-tight">
              Total Companies Count
            </h5>
          </Link>
          <p className={`mb-3 mt-2 font-semibold text-2xl`}>
            {dashboardData.companyCount}
          </p>
        </div>

        <div
          className={`${Styles.sixthCard} h-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center `}
        >
          <img
            src="/images/product.png" // Ensure the path is correct
            alt="Coupon"
            className="w-9 h-9 mb-3"
          />
          <Link href="/admin/products">
            <h5 className="mb-2 text-2xl font-semibold tracking-tight">
              Total Products Count
            </h5>
          </Link>
          <p className={`mb-3 mt-2 font-semibold text-2xl`}>
            {dashboardData.productCount}
          </p>
        </div>

        <div
          className={`${Styles.thirdCard} h-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center `}
        >
          <img
            src="/images/coupon.png" // Ensure the path is correct
            alt="Coupon"
            className="w-9 h-9 mb-3"
          />

          <Link href="/admin/coupon?Redeemed=true&flag=true">
            <h5 className="mb-2 text-2xl font-semibold tracking-tight ">
              Scanned Coupon Count 
            </h5>
           
          </Link>
          <p className="text-xs font-bold tracking-tight ">(Current Month)</p>
          <p className="mb-3 mt-2 font-semibold text-2xl">
            {dashboardData.scannedCouponsCount}
          </p>
        </div>

        <div
          className={`${Styles.fourthCard} h-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center `}
        >
          <img
            src="/images/amount.png" // Ensure the path is correct
            alt="Coupon"
            className="w-9 h-9 mb-3"
          />
          <Link href="#">
            <h5 className="mb-2 text-2xl font-semibold tracking-tight ">
              Scanned Coupon Amount 
            </h5>
          </Link>
          <p className="text-xs font-bold tracking-tight ">(Current Month)</p>
          <p className="mb-3 mt-2 font-semibold text-2xl">
            {dashboardData.scannedCouponsAmount}
          </p>
        </div>
      </div>
    </section>
    </div>
  );
}
