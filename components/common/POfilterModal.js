"use client";

import { Drawer } from "flowbite-react";
import { useState, useEffect } from "react";
import { getUser } from "@/apiFunction/userApi/userApi";
import Select from "react-select";
import DateRange from "./dateRange";
import { toast } from "react-toastify";

export default function POfilterModal({
  modalValue,
  handleClose,
  setFromDate,
  setToDate,
  firstDate,
  lastDate,
  setIsRefresh,
  setUserId,
  userValue,
  setSortOrder,
  sortOrderValue,
  setSortBy,
  sortBy,
  setStatusFilter,
  statusFilterValue,
  resetFilters,
}) {
  const [userList, setUserList] = useState([]);
  const [page] = useState(1);
  const [searchData] = useState("");
  const [userType] = useState("Retailer");

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    const limit = 100000;
    const fromDate = undefined;
    const toDate = undefined;
    let users = await getUser(
      page,
      searchData,
      userType,
      fromDate,
      toDate,
      limit
    );
    if (!users?.resData?.message) {
      setUserList(users?.resData?.users || []);
    } else {
      toast.error(users?.message);
    }
  };

  const orderOptions = [
    { value: "ASC", label: "Ascending" },
    { value: "DESC", label: "Descending" },
  ];

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Pending", label: "Pending" },
    { value: "Accepted", label: "Accepted" },
    // { value: "Dispatch", label: "Dispatch" },
    { value: "Rejected", label: "Rejected" },
    // { value: "Delivered", label: "Delivered" },
  ];

  const sortByOptions = [
    { value: "createdAt", label: "Order Date" },
    { value: "TotalAmount", label: "Total Amount" },
  ];

  const updateuserId = (e) => {
    setUserId(e);
  };

  const handleStatusChange = (selectedOption) => {
    setStatusFilter(selectedOption);
  };

  const handleSortOrderChange = (selectedOption) => {
    setSortOrder(selectedOption.value);
  };

  const handleSortByChange = (selectedOption) => {
    setSortBy(selectedOption.value);
  };

  const clearAllFilters = () => {
    resetFilters();
    handleClose();
  };

  return (
    <>
      <Drawer open={modalValue} onClose={handleClose} position="right">
        <Drawer.Header title="Filters" />
        <Drawer.Items>
          <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            {/* Retailer Select */}
            <div className="mb-4">
              <label className="block text-gray-700">Select Retailer:</label>
              <Select
                onChange={updateuserId}
                options={userList?.map((element) => ({
                  value: element?.UserId,
                  label: `${element?.FirstName} ${element?.LastName}`,
                }))}
                value={userValue}
                className="basic-multi-select"
                classNamePrefix="select"
                isClearable
              />
            </div>

            {/* Date Range */}
            <DateRange
              setFromDate={setFromDate}
              setToDate={setToDate}
              startDate={firstDate}
              endDate={lastDate}
            />

            {/* Status Filter */}
            <div className="mb-4">
              <label className="block text-gray-700">Order Status:</label>
              <Select
                onChange={handleStatusChange}
                options={statusOptions}
                value={statusOptions.find(option => option.value === statusFilterValue.value)}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Sort By:</label>
              <Select
                onChange={handleSortByChange}
                options={sortByOptions}
                value={sortByOptions.find((option) => option.value === sortBy)}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>

            {/* Sort Order */}
            <div className="mb-4">
              <label className="block text-gray-700">Sort Order:</label>
              <Select
                onChange={handleSortOrderChange}
                options={orderOptions}
                value={orderOptions.find(
                  (option) => option.value === sortOrderValue
                )}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>

            {/* Action Buttons */}
            <div className="mb-4 flex justify-end">
              <button
                onClick={clearAllFilters}
                className="bg-white text-black border border-black py-2 px-4 mr-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300"
              >
                Clear Filters
              </button>

              <button
                onClick={() => {
                  setIsRefresh((prev) => prev + 1);
                  handleClose();
                }}
                className="bg-black text-white py-2 px-4 mr-2 rounded hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </Drawer.Items>
      </Drawer>
    </>
  );
}