
"use client";

import { Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { getretailerDetailById } from "@/apiFunction/userApi/userApi";
import { ToastContainer, toast } from "react-toastify";

export function UserDetailModal({modalValue, setOpenUserModal, userIdValue}) {
  const [retailerData, setRetailerData] = useState(null);

  // useEffect(()=>{
  //   fetchRetailer();
  //   console.log("use effect worked")
  // },[userIdValue])

 

  // const fetchRetailer = async () => {
  //   let retailer = await getretailerDetailById(userIdValue);
  //   if (retailer?.resData?.success) {
  //     console.log("retailer data", retailer);
  //     setRetailerData(retailer.resData.response);
  //   } else {
  //     toast.error(retailer?.message);
  //     return false;
  //   }
  // };

  return (
    <>
    <Modal show={modalValue} onClose={() => setOpenUserModal(false)}>
      <Modal.Header>Related Operations</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          {userIdValue ? (
            <>
              <ul>
                <li className="mb-4">
                  <a
                    href={`/admin/ledger?id=${userIdValue}`}
                    className="text-blue-500 hover:underline"
                    onClick={() => {
                      // Handle Ledger details click
                    }}
                  >
                    Ledger Entries
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href={`/admin/masons?id=${userIdValue}`}
                    className="text-blue-500 hover:underline"
                    onClick={() => {
                      // Handle Mason details click
                    }}
                  >
                    Related Masons
                  </a>
                </li>
                <li className="mb-4">
                  <a
                   href={`/admin/coupon?id=${userIdValue}`}
                    className="text-blue-500 hover:underline"
                    onClick={() => {
                      // Handle Coupon details click
                    }}
                  >
                    Scanned Coupons
                  </a>
                </li>
              </ul>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </Modal.Body>
    </Modal>
  </>
    
    
  );
}
