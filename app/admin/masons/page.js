
"use client";

import { useEffect, useState } from "react";
import { getretailerDetailById } from "@/apiFunction/userApi/userApi";
import { toast } from "react-toastify"; 


const MasonsPage = ( params ) => {
  const [retailerData, setRetailerData] = useState(null);
  const [userId, setUserId] = useState(params?.searchParams?.id ?params?.searchParams?.id:null);
  console.log("masons params", params)

  useEffect(() => {
    fetchRetailer();
    console.log("use effect worked");
  }, []);

  const fetchRetailer = async () => {
    let retailer = await getretailerDetailById(userId);
    if (retailer?.resData?.success) {
      console.log("retailer data", retailer);
      setRetailerData(retailer.resData.response);
    } else {
      toast.error(retailer?.message);
      return false;
    }
  };

  return (
    <div>
      <h1>Related Masons</h1>
      {retailerData ? (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3">
                  Active
                </th>
                <th scope="col" className="px-6 py-3">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3">
                  Scanned Coupons
                </th>
              </tr>
            </thead>
            <tbody>
              {retailerData?.relatedMasons.map((mason) => (
                <tr
                  key={mason.UserId}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4">{mason.FirstName} {mason.LastName}</td>
                  <td className="px-6 py-4">{mason.Email}</td>
                  <td className="px-6 py-4">{mason.Phone}</td>
                  <td className="px-6 py-4">{mason.IsActive ? "Yes" : "No"}</td>
                  <td className="px-6 py-4">{new Date(mason.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" className="px-6 py-3">Coupon Code</th>
                          <th scope="col" className="px-6 py-3">Amount</th>
                          <th scope="col" className="px-6 py-3">Redeem Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mason.ScannedCoupons.map((coupon, index) => (
                          <tr
                            key={index}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                          >
                            <td className="px-6 py-4">{coupon.CouponCode}</td>
                            <td className="px-6 py-4">{coupon.Amount}</td>
                            <td className="px-6 py-4">{new Date(coupon.RedeemDateTime).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MasonsPage;
