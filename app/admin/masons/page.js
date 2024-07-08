
"use client";

import { useEffect, useState } from "react";
import { getretailerDetailById } from "@/apiFunction/userApi/userApi";
import { toast } from "react-toastify"; 

const MasonsPage = ( params ) => {
  const [retailerData, setRetailerData] = useState(null);
  console.log("masons params", params)

  useEffect(() => {
    fetchRetailer();
    console.log("use effect worked");
  }, []);

  const fetchRetailer = async () => {
    let retailer = await getretailerDetailById(params?.searchParams?.id);
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
        <ul>
          {retailerData.relatedMasons.map((mason) => (
            <li key={mason.UserId} className="mb-4">
              <strong>Name:</strong> {mason.FirstName} {mason.LastName} <br />
              <strong>Email:</strong> {mason.Email} <br />
              <strong>Phone:</strong> {mason.Phone} <br />
              <strong>Active:</strong> {mason.IsActive ? "Yes" : "No"} <br />
              <strong>Created At:</strong> {new Date(mason.createdAt).toLocaleString()}
              <ul className="mt-2">
                {mason.ScannedCoupons.map((coupon, index) => (
                  <li key={index} className="mt-2">
                    <strong>Coupon Code:</strong> {coupon.CouponCode} <br />
                    <strong>Amount:</strong> {coupon.Amount} <br />
                    <strong>Redeem Date:</strong> {new Date(coupon.RedeemDateTime).toLocaleString()}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MasonsPage;
