"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ListPagination from "@/components/common/pagination";
import SearchInput from "@/components/common/searchDebounceInput";
import SpinnerComp from "@/components/common/spinner";
import POfilterModal from "@/components/common/POfilterModal";
import { toast } from "react-toastify";

export default function PurchaseOrders() {
  // State for orders data
  const [orders, setOrders] = useState([
    {
      orderId: "PO-001",
      orderDate: "2024-01-15",
      totalAmount: "₹15,000",
      status: "Pending",
      retailer: "ABC Store",
    },
    {
      orderId: "PO-002",
      orderDate: "2024-01-14",
      totalAmount: "₹25,000",
      status: "Accepted",
      retailer: "XYZ Mart",
    },
    {
      orderId: "PO-003",
      orderDate: "2024-01-13",
      totalAmount: "₹35,000",
      status: "Dispatch",
      retailer: "Super Paint Shop",
    },
  ]);

  // Filter and UI states
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    status: "",
    retailer: "",
    userId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [page, setPage] = useState(1);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [isRefresh, setIsRefresh] = useState(0);
  const [sortOrder, setSortOrder] = useState("DESC");
  const [sortBy, setSortBy] = useState("createdAt");

  // Status options for dropdown
  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Accepted", label: "Accepted" },
    { value: "Dispatch", label: "Dispatch" },
    { value: "Rejected", label: "Rejected" },
    { value: "Delivered", label: "Delivered" },
  ];

  // Apply filters whenever filters state changes
  useEffect(() => {
    applyFilters();
  }, [filters, isRefresh, orders]);

  const applyFilters = () => {
    let result = [...orders];

    // Date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= fromDate;
      });
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      result = result.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate <= toDate;
      });
    }

    // Status filter
    if (filters.status) {
      result = result.filter(order => order.status === filters.status);
    }

    // Retailer name filter
    if (filters.retailer) {
      result = result.filter(order =>
        order.retailer.toLowerCase().includes(filters.retailer.toLowerCase())
      );
    }

    // User ID filter (if applicable)
    if (filters.userId) {
      result = result.filter(order => 
        order.retailer.toLowerCase().includes(filters.userId.toLowerCase())
      );
    }

    // Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.orderDate);
      const dateB = new Date(b.orderDate);
      return sortOrder === "ASC" ? dateA - dateB : dateB - dateA;
    });

    setFilteredOrders(result);
  };

  const resetFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      status: "",
      retailer: "",
      userId: "",
    });
    setIsRefresh(prev => prev + 1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-300 text-black";
      case "Accepted": return "bg-green-300 text-black";
      case "Dispatch": return "bg-blue-300 text-black";
      case "Rejected": return "bg-red-300 text-black";
      case "Delivered": return "bg-purple-300 text-black";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.orderId === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      })
    );
    toast.success(`Order status updated to ${newStatus}`);
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
                setSearchData={(value) => setFilters(prev => ({...prev, retailer: value}))}
              />
            </div>
          </div>
        </div>

        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Order Number</th>
              <th scope="col" className="px-6 py-3">Order Date</th>
              <th scope="col" className="px-6 py-3">Total Amount</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Retailer</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{order.orderId}</td>
                <td className="px-6 py-4">{order.orderDate}</td>
                <td className="px-6 py-4">{order.totalAmount}</td>
                <td className="px-6 py-4">
                  <span className={`${getStatusColor(order.status)} px-3 py-1 rounded-full`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">{order.retailer}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <Link href={`/admin/purchaseOrders/${order.orderId}`}>
                      <i className="bi bi-eye text-blue-600 text-xl"></i>
                    </Link>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                      className={`${getStatusColor(order.status)} text-white px-2 py-1 rounded hover:opacity-80 cursor-pointer`}
                    >
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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <p className="text-center text-2xl font-bold text-gray-500 py-4">
            No orders found matching your criteria
          </p>
        )}
      </div>

      {filteredOrders.length > 0 && (
        <div className="mt-4">
          <ListPagination
            data={{ totalPages: Math.ceil(filteredOrders.length / 10) }}
            pageNo={setPage}
            pageVal={page}
          />
        </div>
      )}

      <POfilterModal
        modalValue={filterModalOpen}
        handleClose={() => setFilterModalOpen(false)}
        setFromDate={(date) => setFilters(prev => ({...prev, dateFrom: date}))}
        setToDate={(date) => setFilters(prev => ({...prev, dateTo: date}))}
        firstDate={filters.dateFrom}
        lastDate={filters.dateTo}
        setIsRefresh={setIsRefresh}
        setUserId={(id) => setFilters(prev => ({...prev, userId: id}))}
        setStatusFilter={(status) => setFilters(prev => ({...prev, status: status.value}))}
        statusFilterValue={{value: filters.status, label: filters.status || "All Status"}}
        setSortOrder={setSortOrder}
        sortOrderValue={{value: sortOrder, label: sortOrder === "ASC" ? "Ascending" : "Descending"}}
        setSortBy={setSortBy}
        resetFilters={resetFilters}
      />
    </section>
  );
}