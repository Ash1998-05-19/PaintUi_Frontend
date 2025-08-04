"use client";

import { Button, Drawer } from "flowbite-react";
import { useState, useEffect } from "react";
import { getUser } from "@/apiFunction/userApi/userApi";
import Select from "react-select";
import DateRange from "./dateRange";

export default function POfilterModal({
  modalValue,
  handleClose,
  userOptions,
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
  setStatusFilter,
  statusFilterValue,
  setRetailerFilter,
  retailerFilterValue
}) {
  const [userList, setUserList] = useState([]);
  const [page, setPage] = useState(1);
  const [searchData, setSearchData] = useState("");
  const [userType, setUserType] = useState("Retailer");

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
      setUserList(users?.resData);
      return false;
    } else {
      toast.error(users?.message);
      return false;
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
    { value: "Dispatch", label: "Dispatch" },
  ];

  const updateuserId = (e) => {
    setUserId(e);
  };

  const handleStatusChange = (selectedOption) => {
    setStatusFilter(selectedOption);
  };

  const handleRetailerChange = (e) => {
    setRetailerFilter(e.target.value);
  };

  const clearFilters = () => {
    setUserId("");
    setFromDate("");
    setToDate("");
    setSortOrder("");
    setSortBy("");
    setStatusFilter({ value: "", label: "All Status" });
    setRetailerFilter("");
    setIsRefresh((prev) => prev + 1);
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
                options={userList?.users?.map((element) => ({
                  value: element?.UserId,
                  label: element?.FirstName,
                }))}
                value={userValue}
                className="basic-multi-select"
                classNamePrefix="select"
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
                value={statusFilterValue}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>

            {/* Action Buttons */}
            <div className="mb-4 flex justify-end">
              <button
                onClick={clearFilters}
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