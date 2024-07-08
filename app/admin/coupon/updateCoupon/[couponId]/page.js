"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { getProduct } from "@/apiFunction/productApi/productApi";
import { addCoupon } from "@/apiFunction/couponApi/couponApi";
import { updateCoupon } from "@/apiFunction/couponApi/couponApi";
import { getCouponById } from "@/apiFunction/couponApi/couponApi";
import { useRouter } from "next/navigation";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function UpdateCoupon(params) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();

  const [couponCode, setCouponCode] = useState("AUTO_GENERATED_CODE");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [expiryDateTime, setExpiryDateTime] = useState(null);
  const [amount, setAmount] = useState("");
  const [product, setProduct] = useState(null);
  const [couponObj, setCouponObj] = useState(null);
  const [listData, setListData] = useState(false);
  const [payLoad, setPayLoad] = useState({
    categoryIds: [],
    companyIds: [],
    productIds: [],
    sortBy: "createdAt",
    sortOrder: "DESC",
  });
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(1);
  const [searchData, setSearchData] = useState("");
  const [redeemTo, setRedeemTo] = useState("");
  const [redeemBy, setRedeemBy] = useState("");
  const [redeemDateTime, setRedeemDateTime] = useState(null);

  const handleProductChange = (selectedOption) => {
    setValue("productName", selectedOption);
  };

  const handleTimeChange = (date) => {
    setValue("expiryDateTime", date);
  };

  useEffect(() => {
    getAllProducts();
    fetchCoupon();
  }, [page, searchData, payLoad]);

  const getAllProducts = async () => {
    let products = await getProduct(page, searchData, payLoad);
    if (!products?.resData?.message) {
      setProductList(products?.resData);
      return false;
    } else {
      toast.error(products?.message);
      return false;
    }
  };

  useEffect(() => {
    if (couponObj) {
      console.log("Coupon data", couponObj)
      setValue("couponCode", couponObj.coupon.CouponCode);
      console.log("couponCode", couponObj.coupon.CouponCode);
      setValue("productName", {
        value: couponObj.coupon.CouponId,
        label: couponObj.coupon?.Product?.Name,
      });

      setValue("amount", couponObj.coupon.Amount);
      setValue("expiryDateTime", new Date(couponObj.coupon.ExpiryDateTime));
      console.log("expiryDateTime", couponObj.coupon.ExpiryDateTime );
      setValue("quantity", couponObj.coupon.Quantity);
    }
  }, [couponObj]);

  const fetchCoupon = async () => {
    try {
      const couponData = await getCouponById(params?.params?.couponId);
      setCouponObj(couponData?.resData);
      console.log("coupon data", couponData);

      // Pre-fill form fields with product data
    } catch (error) {
      console.error("Error fetching coupon:", error);
    }
  };

  const router = useRouter();

  const submitForm = async (data) => {
    console.log("coupon payload data", data);
    const CouponDetails = {
      ProductId: data?.productName.value,
      ExpiryDateTime: data?.expiryDateTime,
      Amount: data?.amount,
    };

    console.log("coupon details", CouponDetails);

    try {
      const res = await updateCoupon(CouponDetails, params?.params?.couponId);
      console.log("coupon response", res);
      if (!res.resData.message) {
        router.push("/admin/coupon");
        toast.success("Coupon Added Successfully");
      } else {
        console.error(res.resData.message);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <section>
      <h1 className="text-2xl text-black-600 underline mb-3 font-bold">
        Update Your Coupon Details
      </h1>
      <Link href="/faq">
        <div className="mb-5 mt-5">
          <button
            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            type="button"
          >
            Back
          </button>
        </div>
      </Link>
      <form className="mb-5" onSubmit={handleSubmit(submitForm)}>
        <div className="grid gap-4 mb-4 md:grid-cols-2">
          <div className="w-full">
            <label
              htmlFor="couponCode"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Coupon Code
            </label>
            <input
              type="text"
              id="couponCode"
              {...register("couponCode")}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              disabled
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="productName"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Product Name
            </label>

            {
              <Select
                value={watch("productName")}
                onChange={handleProductChange}
                options={productList?.products?.map((element) => ({
                  value: element?.ProductId,
                  label: element?.Name,
                }))}
                id="productName"
                className="text-gray-900 text-sm rounded-lg dark:text-white"
                placeholder="Select Product"
                isClearable
              />
            }
          </div>

          <div className="w-full">
            <label
              htmlFor="amount"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              id="amount"
              {...register("amount", { required: "Amount is required" })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Amount"
            />
            {errors.amount && (
              <span className="text-red-500">{errors.amount.message}</span>
            )}
          </div>

          {/* <div className="w-full">
      <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Quantity
      </label>
      <input
        type="number"
        id="quantity"
        {...register('quantity', { required: 'Quantity is required' })}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        placeholder="Quantity"
      />
      {errors.quantity && <span className="text-red-500">{errors.quantity.message}</span>}
    </div> */}
          <div className="w-full">
            <label
              htmlFor="expiryDateTime"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Expiry Date & Time
            </label>
            <DatePicker
              selected={watch("expiryDateTime")}
              onChange={handleTimeChange}
              showTimeSelect
              dateFormat="Pp"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholderText="Select Expiry Date & Time"
              popperPlacement="right-start"
              popperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [10, 0],
                    },
                  },
                  {
                    name: "preventOverflow",
                    options: {
                      boundary: "viewport",
                    },
                  },
                ],
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white p-2 rounded-lg"
        >
          Submit
        </button>
      </form>

      {/* <div>
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
          onClick={submitForm}
        >
          Submit
        </button>
      </div> */}
    </section>
  );
}
