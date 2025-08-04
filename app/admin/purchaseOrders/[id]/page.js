"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SpinnerComp from "@/components/common/spinner";
import SearchInput from "@/components/common/searchDebounceInput";
import ListPagination from "@/components/common/pagination";
import "flowbite/dist/flowbite.min.css";

export default function PurchaseOrder(params) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Dummy data for purchase orders
  const [listData, setListData] = useState({
    totalItems: 3,
    coupons: [
      {
        id: 1,
        Product: { Name: "Asian Paints Premium Emulsion" },
        quantity: 50,
        price: 2500.0,
        orderDate: "2024-01-15",
      },
      {
        id: 2,
        Product: { Name: "Berger Weather Coat" },
        quantity: 30,
        price: 1800.0,
        orderDate: "2024-01-16",
      },
      {
        id: 3,
        Product: { Name: "Dulux Velvet Touch" },
        quantity: 25,
        price: 2100.0,
        orderDate: "2024-01-17",
      },
    ],
  });

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const inquiryItem = [10, 20, 30, 40, 50];

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchInputChange = (e) => {
    setSearchData(e);
  };
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const enquiryType = (pageValue) => {
    setPageSize(pageValue);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <section>
        {isLoading && <SpinnerComp />}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <h1 className="text-2xl text-black-600 underline mb-3 font-bold">
            Purchase Order
          </h1>
          <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
            <div>
              <Link href={"/admin/purchaseOrders"}>
                <button className="py-2.5 px-5 me-2 mt-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
                  Back
                </button>
              </Link>
            </div>

            {listData?.coupons?.length != 0 && (
              <li className="me-2 list-none relative">
                <button
                  ref={buttonRef}
                  onClick={toggleDropdown}
                  className="text-black bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-gray-100 focus:ring-4 focus:outline-none focus:ring-white-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                >
                  Items per Page [{pageSize}]
                  <svg
                    className="w-2.5 h-2.5 ms-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>
                <div
                  ref={dropdownRef}
                  className={`z-10 ${
                    isDropdownOpen ? "block" : "hidden"
                  } absolute top-full mt-2 bg-white divide-y divide-white rounded-lg shadow w-44`}
                >
                  <ul className="p-2 text-sm text-gray-700 list-none">
                    {inquiryItem.map((item, index) => (
                      <li key={index} onClick={() => enquiryType(item)}>
                        <Link
                          href=""
                          className="block px-4 py-2 hover:bg-gray-200 hover:text-black"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            )}

            <div className="flex">
              <div>
                <SearchInput setSearchData={searchInputChange} />
              </div>
            </div>
          </div>

          <div className="orderTable">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Product Name</th>
                  <th scope="col" className="px-6 py-3">Quantity</th>
                  <th scope="col" className="px-6 py-3">Price (₹)</th>
                  <th scope="col" className="px-6 py-3">Order Date</th>
                </tr>
              </thead>
              <tbody>
                {listData?.coupons?.map((item, index) => (
                  <tr key={index} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 capitalize">{item.Product.Name}</td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4">{item.price}</td>
                    <td className="px-6 py-4">{item.orderDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {listData?.coupons?.length === 0 && (
              <h1 className="text-center text-3xl font-bold text-gray-500 mt-16">
                No data found
              </h1>
            )}
          </div>
        </div>
        
        {listData?.coupons?.length > 0 && (
          <div className="mt-4">
            <ListPagination
              data={listData}
              pageNo={handlePageChange}
              pageVal={page}
            />
          </div>
        )}
      </section>
    </>
  );
}
