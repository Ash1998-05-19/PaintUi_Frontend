"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SpinnerComp from "@/components/common/spinner";
import { getPurchaseOrderById } from "@/apiFunction/purchaseOrderApi/purchaseOrderApi";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

export default function PurchaseOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [listData, setListData] = useState({
    items: [],
    orderDetails: {},
  });

  const params = useParams();
  const orderId = params?.id;

  // Fetch purchase order details
  const fetchPurchaseOrder = async () => {
    try {
      setIsLoading(true);
      const response = await getPurchaseOrderById(orderId, setIsLoading);
      

      if (response?.resData?.data) {
        setListData({
          items: response.resData.data.items || [],
          orderDetails: {
            orderDate: response.resData.data.OrderDate,
            retailer:
              response.resData.data.User.FirstName +
              " " +
              response.resData.data.User.LastName,
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

  useEffect(() => {
    if (orderId) {
      fetchPurchaseOrder();
    }
  }, [orderId]);
 

  return (
    <section>
      {isLoading && <SpinnerComp />}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <h1 className="text-2xl text-black-600 underline mb-3 font-bold">
          Purchase Order Details
        </h1>

        <div className="pb-4">
          <Link href={"/admin/purchaseOrders"}>
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
                {listData.orderDetails.orderDate || "-"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Retailer</h3>
              <p className="text-lg font-semibold">
                {listData.orderDetails.retailer}
                {/* {listData.orderDetails.retailer || '-'} */}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p
                className={`text-lg font-semibold ${
                  listData.orderDetails.status === "Pending"
                    ? "text-yellow-500"
                    : listData.orderDetails.status === "Accepted"
                    ? "text-green-500"
                    : listData.orderDetails.status === "Dispatch"
                    ? "text-blue-500"
                    : listData.orderDetails.status === "Delivered"
                    ? "text-purple-500"
                    : listData.orderDetails.status === "Cancelled"
                    ? "text-red-500"
                    : "text-gray-500"
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
