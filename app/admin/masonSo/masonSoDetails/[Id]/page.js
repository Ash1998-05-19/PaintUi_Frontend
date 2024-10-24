"use client";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./masonSodetails.module.css";
import SpinnerComp from "@/components/common/spinner";
import BigNoDataFound from "@/components/common/noDataFound/noDataFound";
import { getMasonSoById } from "@/apiFunction/masonSoApi/masonsoApi";
export default function MasonSoDetails(params) {
  console.log("params", params);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [specificDataObj, SpecificDataObj] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    // const siteId=params?.params?.Id? params?.params?.Id:params?.s?.Id
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const Databyid = await getMasonSoById(params?.params?.Id);
        console.log("Databyid",Databyid)
        SpecificDataObj(Databyid?.resData?.data);
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching user:", error);
        setIsLoading(false)
      }
    };
    fetchData();
  }, []);
console.log("specificDataObj",specificDataObj)
  return (
    <>
      {isLoading && <SpinnerComp />}
      <div className="mb-5 mt-5">
        <Link href="/admin/masonSo">
          <button
                  className="py-2.5 px-5 mt-2 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  type="button"
          >
            Back
          </button>
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4 underline">
      
        MasonSo Details
      </h1>
      {specificDataObj ? (
        <section>
          <div className={`${styles.firstDetailsBox}`}>
            <div>
              <h1 className="text-lg font-bold text-gray-400">
                {" "}
                MasonSo Information
              </h1>
            </div>
            <div className={`${styles.horizontalLine}`}></div>
            <div className=" items-center  w-full">
              <div className="grid gap-2 md:grid-cols-2 grid-cols-1 items-center">
                <div className="mb-4">
                  <h1 className="text-md font-bold text-green-700">
                  Name{" "}
                  </h1>
                  <p className="text-sm font-bold text-gray-700">
                  {specificDataObj?.masonDetails?.FirstName} <span>{specificDataObj?.masonDetails?.LastName}</span>
                  </p>
                </div>
                <div className="mb-4">
                  <h1 className="text-md font-bold text-green-700">
                    Total RewardPoint
                  </h1>
                  <p className="text-sm font-bold text-gray-700">
                    {specificDataObj?.TotalRewardPoint}
                  </p>
                </div>
                <div className="mb-4">
                  <h1 className="text-md font-bold text-green-700">
                    Date of Creation{" "}
                  </h1>
                  <p className="text-sm font-bold text-gray-700">
                    {specificDataObj?.createdAt?.slice(0,10)}
                  </p>
                </div>
            
                
              </div>

              
            </div>
          </div>
          <div className={`h-full ${styles.secondSection}`}>
            {/* secondSectionLeft */}
            <div className={`${styles.secondSectionLeft}`}>
              <div>
                <h1 className="text-lg font-bold text-gray-400">
                  {" "}
                  Product Information
                </h1>
              </div>
              <div className={`${styles.horizontalLine}`}></div>
              {specificDataObj && specificDataObj?.details?.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 grid-cols-1 items-center ">
                  {specificDataObj?.details?.map((item, index) => (
                    <div key={index} className="">
                      <h1 className="text-lg font-bold text-gray-600 mb-2 mt-2">
                        {" "}
                        Product No. {index + 1}
                      </h1>
                        <div className=" border p-2 bg-gray-100 rounded-lg shadow h-full">
                          <div className="grid gap-2 md:grid-cols-2 grid-cols-1 items-center">
                            <div className="mb-4">
                              <h1 className="text-md font-bold text-green-700">
                                Name{" "}
                              </h1>
                              <p className="text-sm font-bold text-gray-700">
                                {item?.Product?.Name}
                              </p>
                            </div>
                            <div className="mb-4">
                              <h1 className="text-md font-bold text-green-700">
                                Quantity
                              </h1>
                              <p className="text-sm font-bold text-gray-700">
                                {item?.Quantity}
                              </p>
                            </div>
                            <div className="mb-4">
                              <h1 className="text-md font-bold text-green-700">
                               RewardPoint
                              </h1>
                              <p className="text-sm font-bold text-gray-700">
                                {item?.RewardPoints}
                              </p>
                            </div>
                          </div>

                        
                        </div>
                     
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 mb-4 ">
                  <BigNoDataFound />
                </div>
              )}
            </div>
          </div>
      
        </section>
      ) : (
        <div className="mt-4 mb-4 "></div>
      )}
    </>
  );
}
