"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SpinnerComp from "@/components/common/spinner";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { getSalesOrderById } from "@/apiFunction/salesOrderApi/salesOrderApi";

export default function PurchaseOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [listData, setListData] = useState({
    items: [],
    orderDetails: {
      orderDate: "",
      retailer: "",
      status: "",
      totalAmount: "",
    },
  });

  const params = useParams();

  // Fetch purchase order details
  const fetchSalesOrder = async () => {
    try {
      setIsLoading(true);
      const response = await getSalesOrderById(orderId, setIsLoading);

      if (response?.resData?.data) {
        // Assuming response.resData.data.items is the array of items in the order
        setListData({
          items: response.resData.data.items || [],
          orderDetails: {
            orderDate: response.resData.data.OrderDate,
            retailer:
              response.resData.data.Customer.FirstName +
              " " +
              response.resData.data.Customer.LastName,
            status: response.resData.data.Status,
            totalAmount: response.resData.data.TotalAmount,
            // orderId: response.resData.data.orderId
          },
        });
      } else {
        toast.error(response?.message || "Failed to fetch order details");
      }
    } catch (error) {
      toast.error("Error fetching purchase order");
      console.error("Error fetching purchase order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const orderId = params?.id;
  useEffect(() => {
    if (orderId) {
      fetchSalesOrder();
    }
  }, [orderId]);

  console.log("listData", listData);

  return (
    <section>
      {isLoading && <SpinnerComp />}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <h1 className="text-2xl text-black-600 underline mb-3 font-bold">
          Sales Order Details
        </h1>

        <div className="pb-4">
          <Link href={"/admin/salesOrders"}>
            <button className="py-2.5 px-5 me-2 mt-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
              Back to Orders
            </button>
          </Link>
        </div>

        {/* Order Summary Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
              <p className="text-lg font-semibold">
                {listData?.orderDetails?.orderDate
                  ? new Date(listData.orderDetails.orderDate)
                      .toISOString()
                      .split("T")[0]
                  : "-"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Retailer</h3>
              <p className="text-lg font-semibold">
                {/* {listData.orderDetails.retailer} */}
                {listData.orderDetails.retailer || "-"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p
                className={`text-lg font-semibold ${
                   listData.orderDetails.status === "Accepted"
                    ? "text-green-500"
                    : listData.orderDetails.status === "Dispatched"
                    ? "text-blue-500"
                    : listData.orderDetails.status === "Delivered"
                    ? "text-purple-500"
                    : listData.orderDetails.status === "Cancelled"
                }`}
              >
                {listData.orderDetails.status || "-"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Total Amount
              </h3>
              <p className="text-lg font-semibold">
                {listData.orderDetails.totalAmount
                  ? `₹${listData.orderDetails.totalAmount}`
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="orderTable">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Product Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3">
                  Unit Price (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              {listData.items.map((item, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 capitalize">
                    {item.Product?.Name || "-"}
                  </td>
                  <td className="px-6 py-4">{item.Quantity || 0}</td>
                  <td className="px-6 py-4">{item.UnitPrice || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {listData.items.length === 0 && !isLoading && (
            <h1 className="text-center text-3xl font-bold text-gray-500 mt-16">
              No products found in this order
            </h1>
          )}
        </div>
      </div>
    </section>
  );
}
