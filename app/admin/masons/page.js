"use client";

import { useEffect, useState } from "react";
import { getretailerDetailById } from "@/apiFunction/userApi/userApi";
import { toast } from "react-toastify";
import ListPagination from "@/components/common/pagination";
import SearchInput from "@/components/common/searchDebounceInput";

const MasonsPage = (params) => {
  const [retailerData, setRetailerData] = useState(null);
  const [userId, setUserId] = useState(
    params?.searchParams?.id ? params?.searchParams?.id : null
  );
  const [page, setPage] = useState(1);
  const [searchData, setSearchData] = useState("");

  useEffect(() => {
    fetchRetailer();
  }, [page,searchData]);

  const fetchRetailer = async () => {
    let retailer = await getretailerDetailById(userId,page,searchData);
    if (retailer?.resData?.success) {
      setRetailerData(retailer.resData.response2);
    } else {
      toast.error(retailer?.message);
      return false;
    }
  };
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const searchInputChange = (e) => {
    setSearchData(e);
  };
  return (
    <div>
       <h1 className="text-2xl text-black-600 underline mb-3 font-bold">
       Related Masons
        </h1>
        <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
        

          <div className="flex">
            <div>
              <SearchInput setSearchData={searchInputChange} />
            </div>
          </div>
        </div>
      {retailerData ? (
        retailerData?.relatedMasons?.length > 0 ? (
          <div>
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
                {/* <th scope="col" className="px-6 py-3">
                  Created At
                </th> */}
                {/* <th scope="col" className="px-6 py-3">
                  Scanned Coupons
                </th> */}
              </tr>
            </thead>
            <tbody>
              {retailerData?.relatedMasons.map((mason) => (
                <tr
                  key={mason.UserId}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4">
                    {mason.FirstName} {mason.LastName}
                  </td>
                  <td className="px-6 py-4">{mason.Email}</td>
                  <td className="px-6 py-4">{mason.Phone}</td>
                  <td className="px-6 py-4">{mason.IsActive ? "Yes" : "No"}</td>
                  {/* <td className="px-6 py-4">
                    {new Date(mason.createdAt).toLocaleString()}
                  </td> */}
                  {/* <td className="px-6 py-4">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Coupon Code
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Amount
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Redeem Date
                          </th>
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
                            <td className="px-6 py-4">
                              {new Date(coupon.RedeemDateTime).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
          {retailerData && retailerData?.relatedMasons?.length > 0 && (
          <div className="mt-4">
          <ListPagination
            data={retailerData}
            pageNo={handlePageChange}
            pageVal={page}
          />
        </div>
        )}
          </div>
       
          
        ) : (
          <p className="text-center text-2xl font-bold text-gray-500">
            No data found
          </p>
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MasonsPage;
