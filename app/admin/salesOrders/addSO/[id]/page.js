"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { getPurchaseOrderById } from "@/apiFunction/purchaseOrderApi/purchaseOrderApi";
import { createSalesOrder } from "@/apiFunction/salesOrderApi/salesOrderApi";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import SpinnerComp from "@/components/common/spinner";

export default function AddSalesOrder() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const router = useRouter();
  const params = useParams();
  const purchaseOrderId = params?.id;

  // Fetch purchase order data
  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      try {
        setIsLoading(true);
        const response = await getPurchaseOrderById(
          purchaseOrderId,
          setIsLoading
        );
        // console.log("response",response)

        if (response?.resData?.data) {
          setPurchaseOrder(response.resData.data);

          // Set default quantities from purchase order items
          // response.data.items?.forEach((item, index) => {
          //   setValue(`quantity_${index}`, item.Quantity);
          // });
        } else {
          toast.error(response?.message || "Failed to fetch purchase order");
          router.push("/admin/purchaseOrders");
        }
      } catch (error) {
        toast.error("Error fetching purchase order");
        console.error("Error:", error);
        router.push("/admin/purchaseOrders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchaseOrder();
  }, [purchaseOrderId]);

  const submitSalesOrder = async (data) => {
    if (!purchaseOrder) return;

    // Check if sales order already exists
    if (purchaseOrder.SalesOrder) {
      toast.error("Sales order already exists for this purchase order");
      return;
    }

    // Prepare order items from the form data
    const orderItems = purchaseOrder.items.map((item, index) => ({
      ProductId: item.ProductId,
      Quantity: Number(data[`quantity_${index}`]),
      UnitPrice: item.UnitPrice,
    }));

    const salesOrderData = {
      CustomerId: purchaseOrder.CreatedBy, // Using CreatedBy as CustomerId
      PurchaseOrderId: purchaseOrder.PurchaseOrderId,
      items: orderItems,
    };

    try {
      setIsLoading(true);
      const res = await createSalesOrder(salesOrderData, setIsLoading);
      if (res?.resData?.success) {
        router.push("/admin/purchaseOrders");
        toast.success("Sales order created successfully!");
      } else {
        toast.error(res?.message || "Failed to create sales order");
      }
    } catch (error) {
      toast.error("An error occurred while creating the sales order");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!purchaseOrder) {
    return <SpinnerComp />;
  }

  // Check if sales order already exists
  // if (purchaseOrder.SalesOrder) {
  //   return (
  //     <section className="p-4">
  //       <div className="flex justify-between items-center mb-6">
  //         <h1 className="text-2xl font-bold text-gray-800">Sales Order Exists</h1>
  //         <Link href="/admin/purchaseOrders">
  //           <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors">
  //             Back to Orders
  //           </button>
  //         </Link>
  //       </div>
  //       <div className="bg-white p-6 rounded-lg shadow-md">
  //         <p className="text-lg mb-4">A sales order already exists for this purchase order:</p>
  //         <div className="grid grid-cols-2 gap-4 mb-4">
  //           <div>
  //             <label className="block text-sm font-medium text-gray-500">Sales Order Number</label>
  //             <p className="font-medium">{purchaseOrder.SalesOrder.OrderNumber}</p>
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium text-gray-500">Date</label>
  //             <p className="font-medium">
  //               {new Date(purchaseOrder.SalesOrder.OrderDate).toLocaleDateString()}
  //             </p>
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium text-gray-500">Total Amount</label>
  //             <p className="font-medium">${purchaseOrder.SalesOrder.TotalAmount}</p>
  //           </div>
  //         </div>
  //         <Link
  //           href={`/admin/salesOrders/${purchaseOrder.PurchaseOrderId}`}
  //           className="text-blue-600 hover:underline"
  //         >
  //           View Sales Order Details
  //         </Link>
  //       </div>
  //     </section>
  //   );
  // }

  return (
    <section className="p-4">
      {isLoading && <SpinnerComp />}
      <ToastContainer />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Create New Sales Order
        </h1>
        <Link href="/admin/purchaseOrders">
          <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors">
            Back to Orders
          </button>
        </Link>
      </div>

      <form
        onSubmit={handleSubmit(submitSalesOrder)}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        {/* Purchase Order Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Purchase Order Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Order Number
              </label>
              <p className="font-medium">{purchaseOrder.OrderNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Date
              </label>
              <p className="font-medium">
                {new Date(purchaseOrder.OrderDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Customer
              </label>
              <p className="font-medium">
                {purchaseOrder.User?.FirstName} {purchaseOrder.User?.LastName}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Order Items
          </h2>
          <div className="space-y-4">
            {purchaseOrder.items?.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Product
                  </label>
                  <p className="font-medium">{item.Product?.Name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Purchased Qty
                  </label>
                  <p className="font-medium">{item.Quantity}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Unit Price
                  </label>
                  <p className="font-medium">₹{item.UnitPrice}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Sales Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    setValue={item.Quantity}
                    defaultValue={item.Quantity}                    
                    min="1"
                    {...register(`quantity_${index}`, {
                      required: "Quantity is required",
                      validate: (value) => {
                        const numValue = Number(value);
                        if (numValue <= 0)
                          return "Quantity must be greater than 0";
                        // if (numValue > item.Quantity)
                        //   return `Cannot exceed purchased quantity (${item.Quantity})`;
                        return true;
                      },
                    })}
                    onInput={(e) => {
                      // Prevent negative values and zero
                      if (e.target.value <= 0) {
                        e.target.value = 1;
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors[`quantity_${index}`]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors[`quantity_${index}`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[`quantity_${index}`].message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Sales Order"}
          </button>
        </div>
      </form>
    </section>
  );
}