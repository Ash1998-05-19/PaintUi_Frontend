"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { getUser } from "@/apiFunction/userApi/userApi";
import { getProductListForCoupon } from "@/apiFunction/productApi/productApi";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Select from "react-select";
import SpinnerComp from "@/components/common/spinner";
import "react-toastify/dist/ReactToastify.css";
import { createSalesOrder } from "@/apiFunction/salesOrderApi/salesOrderApi";

export default function AddSalesOrders() {
  const [page, setPage] = useState(1);
  const [searchData, setSearchData] = useState("");
  const [userList, setUserList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user: null,
      products: [{ product: null, amount: "", unit: "" }],
    },
  });

  // For dynamic rows
  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  useEffect(() => {
    getAllUsers();
    getAllProducts();
  }, [page, searchData]);

  const getAllUsers = async () => {
    const limit = 100000;
    let users = await getUser(
      page,
      searchData,
      "Retailer",
      undefined,
      undefined,
      limit
    );
    if (!users?.resData?.message) {
      setUserList(users?.resData);
    } else {
      toast.error(users?.message);
    }
  };

  const getAllProducts = async () => {
    let products = await getProductListForCoupon(page, searchData, {
      categoryIds: [],
      companyIds: [],
      productIds: [],
      sortBy: "createdAt",
      sortOrder: "DESC",
    });
    if (!products?.resData?.message) {
      setProductList(products?.resData);
    } else {
      toast.error(products?.message);
    }
  };

  const submitForm = async (data) => {
    const payload = {
      CustomerId: data.user.value,
      items: data.products.map((p) => ({
        ProductId: p.product.value,
        Quantity: Number(p.unit),
        UnitPrice: Number(p.amount),
      })),
    };

    try {
      setIsLoading(true);
      const res = await createSalesOrder(payload, setIsLoading);

      if (res?.resData?.success) {
        toast.success("Sales order created successfully!");
        router.push("/admin/salesOrders");
      } else {
        toast.error(result?.message || "Failed to create sales order");
      }
    } catch (error) {
      toast.error("Error creating sales order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="p-6">
      {isLoading && <SpinnerComp />}
      <ToastContainer />

      <h1 className="text-2xl font-bold mb-6">Add Sales Order</h1>
      <Link href="/admin/salesOrders">
        <button className="mb-5 px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200">
          Back
        </button>
      </Link>

      <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
        {/* User Dropdown */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Users <span className="text-red-600">*</span>
          </label>
          <Controller
            name="user"
            control={control}
            rules={{ required: "User is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={userList?.users
                  ?.filter((u) => u.IsActive)
                  .map((u) => ({ value: u.UserId, label: u.FirstName }))}
                placeholder="Select User"
              />
            )}
          />
          {errors.user && (
            <span className="text-red-600">{errors.user.message}</span>
          )}
        </div>

        {/* Dynamic Product Rows */}
        <div className="space-y-4">
          {fields.map((item, index) => (
            <div key={item.id} className="grid grid-cols-3 gap-4 items-end">
              {/* Product Dropdown */}
              <Controller
                name={`products.${index}.product`}
                control={control}
                rules={{ required: "Product is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={productList?.data?.map((p) => ({
                      value: p.ProductId,
                      label: p.Name,
                      price: p.Price, // attach price here
                    }))}
                    placeholder="Select Product"
                    onChange={(selected) => {
                      field.onChange(selected); // update form value for product
                      // Autofill amount with price
                      setValue(
                        `products.${index}.amount`,
                        selected?.price || ""
                      );
                    }}
                  />
                )}
              />

              {/* Product Amount (Controlled so autofill works) */}
              <Controller
                name={`products.${index}.amount`}
                control={control}
                rules={{ required: "Amount required" }}
                render={({ field }) => (
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Amount"
                    {...field}
                    className="border rounded p-2"
                  />
                )}
              />

              {/* Product Unit */}
              <div className="flex items-center">
                <input
                  type="number"
                  step="1"
                  placeholder="Unit"
                  {...register(`products.${index}.unit`, {
                    required: "Unit required",
                  })}
                  className="border rounded p-2 flex-1"
                />

                {/* Show Remove button only if more than 1 row */}
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Product Row Button */}
        <button
          type="button"
          onClick={() => append({ product: null, amount: "", unit: "" })}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          + Add Product
        </button>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md"
          >
            Create Sales Order
          </button>
        </div>
      </form>
    </section>
  );
}
