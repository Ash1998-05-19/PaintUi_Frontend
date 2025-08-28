"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ListPagination from "@/components/common/pagination";
import SearchInput from "@/components/common/searchDebounceInput";
import SpinnerComp from "@/components/common/spinner";
import SOfilterModal from "@/components/common/SOfilterModal";
import { toast } from "react-toastify";
import {
  getsalesOrders,
  updateSalesOrder,
} from "@/apiFunction/salesOrderApi/salesOrderApi";

export default function SalesOrders() {
  // State for orders data
  const [orders, setOrders] = useState({
    data: [],
    totalItems: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [isRefresh, setIsRefresh] = useState(0);
  const [sortOrder, setSortOrder] = useState("DESC");
  const [sortBy, setSortBy] = useState("OrderDate");
  const [totalPages, setTotalPages] = useState(1);

  // Filters state
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    status: "",
    retailer: "",
    userId: null,
  });

  // Status options for dropdown based on current status
  const getStatusOptions = (currentStatus) => {
    switch (currentStatus) {
      case "Accepted":
        return [
          { value: "Dispatched", label: "Dispatch" },
          // { value: "Cancelled", label: "Cancel" }
        ];
      case "Dispatched":
        return [{ value: "Delivered", label: "Deliver" }];
      case "Delivered":
        return []; // No options for delivered status
      default:
        return []; // No options for other statuses
    }
  };

  // Fetch sales orders with all filters
  const fetchSalesOrders = async () => {
    try {
      setIsLoading(true);
      const response = await getsalesOrders(
        page,
        10, // limit per page
        searchData,
        filters.dateFrom,
        filters.dateTo,
        {
          retailer: filters.retailer,
          userId: filters.userId?.value,
          status: filters.status,
          sortOrder,
          sortBy,
        },
        setIsLoading
      );

      if (response?.resData?.data) {
        setOrders({
          data: response.resData.data,
          totalItems: response.resData.total || 0,
          totalPages: response.resData.totalPages || 1,
        });
        setTotalPages(response.resData.totalPages || 1);
      } else {
        toast.error(response?.message || "Failed to fetch orders");
      }
    } catch (error) {
      toast.error("Error fetching sales orders");
      console.error("Error fetching sales orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when any filter changes
  useEffect(() => {
    fetchSalesOrders();
  }, [page, searchData, isRefresh, filters, sortOrder, sortBy]);

  const resetFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      status: "",
      retailer: "",
      userId: null,
    });
    setSortOrder("DESC");
    setSortBy("OrderDate");
    setIsRefresh((prev) => prev + 1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-300 text-black";
      case "Accepted":
        return "bg-green-300 text-black";
      case "Dispatched":
        return "bg-blue-300 text-black";
      case "Rejected":
        return "bg-red-300 text-black";
      case "Cancelled":
        return "bg-red-700 text-black";
      case "Delivered":
        return "bg-purple-300 text-black";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setIsLoading(true);
      const payload = {
        Status: newStatus,
      };

      const response = await updateSalesOrder(orderId, payload, setIsLoading);

      if (response?.resData?.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setIsRefresh((prev) => prev + 1);
      } else {
        toast.error(response?.message || "Failed to update order status");
      }
    } catch (error) {
      toast.error("Error updating order status");
      console.error("Error updating order status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      {isLoading && <SpinnerComp />}

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <h1 className="text-2xl text-black-600 underline mb-3 font-bold">
          Sales Orders
        </h1>

        <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
          <div></div>
          <div className="flex">
            <i
              className="bi bi-funnel mr-2 font-medium text-2xl cursor-pointer"
              onClick={() => setFilterModalOpen(true)}
            ></i>
            <div>
              <SearchInput
                setSearchData={(value) => {
                  setSearchData(value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>

        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Order Number
              </th>
              <th scope="col" className="px-6 py-3">
                Order Date
              </th>
              <th scope="col" className="px-6 py-3">
                Total Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Retailer
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.data.map((order, index) => {
              const statusOptions = getStatusOptions(order.Status);
              const canChangeStatus = statusOptions.length > 0;

              return (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{order.OrderNumber}</td>
                  <td className="px-6 py-4">
                    {new Date(order.OrderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{order.TotalAmount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`${getStatusColor(
                        order.Status
                      )} px-3 py-1 rounded-full`}
                    >
                      {order.Status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {order.Customer?.FirstName} {order.Customer?.LastName}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <Link href={`/admin/salesOrders/${order.SalesOrderId}`}>
                        <i className="bi bi-eye text-blue-600 text-xl"></i>
                      </Link>

                      {canChangeStatus ? (
                        <select
                          value={order.Status}
                          onChange={(e) =>
                            handleStatusChange(
                              order.SalesOrderId,
                              // order.Status,
                              e.target.value
                            )
                          }
                          className={`${getStatusColor(
                            order.Status
                          )} text-white px-2 py-1 rounded hover:opacity-80 cursor-pointer`}
                        >
                          <option
                            value={order.Status}
                            className="bg-white text-black"
                          >
                            {order.Status}
                          </option>
                          {statusOptions.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                              className="bg-white text-black"
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={`${getStatusColor(
                            order.Status
                          )} px-3 py-1 rounded-full text-xs`}
                        >
                          {order.Status}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {orders.data.length === 0 && !isLoading && (
          <p className="text-center text-2xl font-bold text-gray-500 py-4">
            No orders found matching your criteria
          </p>
        )}
      </div>

      {orders.data.length > 0 && (
        <div className="mt-4">
          <ListPagination
            data={orders}
            pageNo={(newPage) => {
              setPage(newPage);
              window.scrollTo(0, 0);
            }}
            pageVal={page}
          />
        </div>
      )}

      <SOfilterModal
        modalValue={filterModalOpen}
        handleClose={() => setFilterModalOpen(false)}
        setFromDate={(date) =>
          setFilters((prev) => ({ ...prev, dateFrom: date }))
        }
        setToDate={(date) => setFilters((prev) => ({ ...prev, dateTo: date }))}
        firstDate={filters.dateFrom}
        lastDate={filters.dateTo}
        setIsRefresh={setIsRefresh}
        setUserId={(id) => setFilters((prev) => ({ ...prev, userId: id }))}
        userValue={filters.userId}
        setStatusFilter={(status) =>
          setFilters((prev) => ({ ...prev, status: status.value }))
        }
        statusFilterValue={{
          value: filters.status,
          label: filters.status || "All Status",
        }}
        setSortOrder={setSortOrder}
        sortOrderValue={sortOrder}
        setSortBy={setSortBy}
        sortBy={sortBy}
        resetFilters={resetFilters}
      />
    </section>
  );
}
