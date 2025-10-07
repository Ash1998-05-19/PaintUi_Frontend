"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import ListPagination from "@/components/common/pagination";
import SearchInput from "@/components/common/searchDebounceInput";
import SpinnerComp from "@/components/common/spinner";
import POfilterModal from "@/components/common/POfilterModal";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import {
  getPurchaseOrders,
  updatePurchaseOrderStatus,
} from "@/apiFunction/purchaseOrderApi/purchaseOrderApi";

export default function PurchaseOrdersWrapper() {
  return (
    <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
      <PurchaseOrders />
    </Suspense>
  );
}

function PurchaseOrders() {
  const searchParams = useSearchParams();
  const retailer = searchParams.get("retailerId");
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
  const [sortBy, setSortBy] = useState("createdAt");
  const [totalPages, setTotalPages] = useState(1);

  // Filters state
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    status: "",
    retailer: "",
    userId: null,
  });

  useEffect(() => {
    if (retailer) {
      setFilters((prev) => ({
        ...prev,
        userId: { value: retailer },
      }));
    }
  }, [retailer]);
  // Status options for dropdown
  const statusOptions = {
    Pending: [
      { value: "Accepted", label: "Accept" },
      { value: "Rejected", label: "Reject" },
    ],
    default: [
      { value: "Pending", label: "Pending" },
      { value: "Accepted", label: "Accepted" },
      { value: "Rejected", label: "Rejected" },
    ],
  };

  // Fetch data when any filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPurchaseOrders();
    }, 100); // Small delay to ensure state is updated

    return () => clearTimeout(timer);
  }, [page, searchData, isRefresh, filters, sortOrder, sortBy]);

  // Fetch purchase orders with all filters
  const fetchPurchaseOrders = async () => {
    try {
      setIsLoading(true);
      const response = await getPurchaseOrders(
        page,
        searchData,
        filters.dateFrom,
        filters.dateTo,
        10,
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
          totalItems: response.resData.pagination.total || 0,
          totalPages: response.resData.pagination.totalPages || 1,
        });
        setTotalPages(response.resData.totalPages || 1);
      } else {
        toast.error(response?.message || "Failed to fetch orders");
      }
    } catch (error) {
      toast.error("Error fetching purchase orders");
      console.error("Error fetching purchase orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const resetFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      status: "",
      retailer: "",
      userId: null,
    });
    setSortOrder("DESC");
    setSortBy("createdAt");
    setIsRefresh((prev) => prev + 1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-300 text-black";
      case "Accepted":
        return "bg-green-300 text-black";
      case "Rejected":
        return "bg-red-300 text-black";
      case "Cancelled":
        return "bg-red-700 text-black";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setIsLoading(true);

      const currentOrder = orders.data.find(
        (order) => order.PurchaseOrderId === orderId
      );
      if (currentOrder && currentOrder.Status === newStatus) {
        toast.info("Status is already set to " + newStatus);
        setIsLoading(false);
        return;
      }

      const payload = {
        orderId: orderId,
        Status: newStatus,
      };

      const response = await updatePurchaseOrderStatus(payload, setIsLoading);

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
          Purchase Orders
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
              <th scope="col" className="px-6 py-3">
                Sales Order
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.data.map((order, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{order.OrderNumber}</td>
                <td className="px-6 py-4">{order.OrderDate}</td>
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
                  {order.User?.FirstName} {order.User?.LastName}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <Link
                      href={`/admin/purchaseOrders/${order.PurchaseOrderId}`}
                    >
                      <i className="bi bi-eye text-blue-600 text-xl"></i>
                    </Link>
                    {order.Status === "Cancelled" ? (
                      <span
                        className={`${getStatusColor(
                          order.Status
                        )} px-3 py-1 rounded-full`}
                      >
                        Cancelled
                      </span>
                    ) : ["Accepted", "Rejected"].includes(order.Status) ? (
                      <span
                        className={`${getStatusColor(
                          order.Status
                        )} px-3 py-1 rounded-full`}
                      >
                        {order.Status}
                      </span>
                    ) : (
                      <select
                        value={order.Status}
                        onChange={(e) => {
                          handleStatusChange(
                            order.PurchaseOrderId,
                            e.target.value
                          );
                        }}
                        className={`${getStatusColor(
                          order.Status
                        )} text-white px-2 py-1 rounded hover:opacity-80 cursor-pointer`}
                      >
                        {/* Show current status as first option */}
                        <option
                          value={order.Status}
                          disabled
                          className="bg-white text-black"
                        >
                          Current: {order.Status}
                        </option>

                        {order.Status === "Pending"
                          ? statusOptions.Pending.map((option) => (
                              <option
                                key={option.value}
                                value={option.value}
                                className="bg-white text-black"
                              >
                                {option.label}
                              </option>
                            ))
                          : statusOptions.default
                              .filter(
                                (opt) =>
                                  opt.value !== order.Status &&
                                  opt.value !== "Pending"
                              )
                              .map((option) => (
                                <option
                                  key={option.value}
                                  value={option.value}
                                  className="bg-white text-black"
                                >
                                  {option.label}
                                </option>
                              ))}
                      </select>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    {order.SalesOrder ? (
                      <Link
                        href={`/admin/salesOrders/${order.SalesOrder.SalesOrderId}`}
                        className="text-blue-600 hover:underline"
                      >
                        {order.SalesOrder.OrderNumber}
                      </Link>
                    ) : order.Status === "Pending" ? (
                      <span className="cursor-not-allowed opacity-50">
                        <i className="bi bi-eye text-gray-400 text-xl"></i>
                      </span>
                    ) : order.Status === "Rejected" ? (
                      <span className="cursor-not-allowed opacity-50">
                        <i className="bi bi-eye text-gray-400 text-xl"></i>
                      </span>
                    ) : (
                      <Link
                        href={`/admin/salesOrders/addSO/${order.PurchaseOrderId}`}
                      >
                        <p className="text-blue-600 text-md">Generate SO</p>
                        {/* <i className="text-blue-600 text-xl">Generate SO</i> */}
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && !isLoading && (
          <p className="text-center text-2xl font-bold text-gray-500 py-4">
            No orders found matching your criteria
          </p>
        )}
      </div>

      {orders.data.length > 0 && (
        <div className="mt-4">
          <ListPagination
            data={orders}
            pageNo={handlePageChange}
            pageVal={page}
          />
        </div>
      )}

      <POfilterModal
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
