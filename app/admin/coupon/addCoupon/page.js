"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { getProductListForCoupon } from "@/apiFunction/productApi/productApi";
import { addCoupon } from "@/apiFunction/couponApi/couponApi";
import { useRouter } from "next/navigation";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SpinnerComp from "@/components/common/spinner";

export default function AddCoupon() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);

  const [couponCode, setCouponCode] = useState("AUTO_GENERATED_CODE");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [expiryDateTime, setExpiryDateTime] = useState(null);
  const [amount, setAmount] = useState("");
  const [product, setProduct] = useState(null);
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
    setSelectedProduct(selectedOption);
  };

  useEffect(() => {
    getAllProducts();
  }, [page, searchData, payLoad]);

  const getAllProducts = async () => {
    let products = await getProductListForCoupon(page, searchData, payLoad);
    if (!products?.resData?.message) {
      setProductList(products?.resData);
      return false;
    } else {
      toast.error(products?.message);
      return false;
    }
  };

  const router = useRouter();

  const submitForm = async (data) => {
    const selectProductAmount = productList?.data
      ?.filter((item) => item.ProductId === selectedProduct.value)
      .map((item) => item.Price);
    if (parseInt(data.amount) > parseInt(selectProductAmount[0])) {
      toast.warning(
        `Amount should be less then from product Amount ${selectProductAmount[0]} `
      );
      return false;
    }

    const CouponDetails = {
      ProductId: selectedProduct.value,
      ExpiryDateTime: data.expiryDateTime,
      Amount: parseInt(data.amount),
      Quantity: parseInt(data.quantity)
    };
    let res = await addCoupon(CouponDetails,setIsLoading);
    if (!res?.message) {
      router.push("/admin/master/coupons");
      toast.success("Coupon Added Succefully");
    } else {
      toast.error(res?.resData?.message);
      return false;
    }
  };

  return (
    <section>
      {isLoading && <SpinnerComp />}
      <h1 className="text-2xl text-black-600 underline mb-3 font-bold">
        Add Your Coupon Details
      </h1>
      <Link href="/admin/master/coupons">
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
          {/* <div className="w-full">
          <label htmlFor="couponCode" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Coupon Code
          </label>
          <input
            type="text"
            id="couponCode"
            {...register('couponCode')}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            disabled
          />
        </div> */}

          <div className="w-full">
            <label
              htmlFor="productName"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Product Name <span className="text-red-600">*</span>
            </label>

            <Controller
              name="productName"
              control={control}
              rules={{ required: "Product Name is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  value={selectedProduct}
                  onChange={(value) => {
                    field.onChange(value);
                    handleProductChange(value);
                  }}
                  options={productList?.data?.map((element) => ({
                    value: element?.ProductId,
                    label: element?.Name,
                  }))}
                  id="productName"
                  className="text-gray-900 text-sm rounded-lg dark:text-white"
                  placeholder="Select Product"
                  isClearable
                />
              )}
            />

            {errors.productName && (
              <span className="text-red-500">{errors.productName.message}</span>
            )}
          </div>

          <div className="w-full">
            <label
              htmlFor="amount"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Amount <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              id="amount"
              min = "0"
               
              {...register("amount", { required: "Amount is required" })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Amount"
            />
            {errors.amount && (
              <span className="text-red-500">{errors.amount.message}</span>
            )}
          </div>

          <div className="w-full">
            <label
              htmlFor="quantity"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Quantity <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              id="quantity"
              min = "0"
               max = "25000"
              {...register("quantity", {
                required: "Quantity is required",
              })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Quantity"
            />
            {errors.quantity && (
              <span className="text-red-500">{errors.quantity.message}</span>
            )}
          </div>
          <div className="w-full">
            <label
              htmlFor="expiryDateTime"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Expiry Date & Time <span className="text-red-600">*</span>
            </label>
            <Controller
              name="expiryDateTime"
              control={control}
              rules={{ required: "Expiry Date & Time is required" }}
              render={({ field }) => (
                <input
                  type="datetime-local"
                  value={
                    field.value
                      
                  }
                  onChange={(e) => field.onChange(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Select Expiry Date & Time"
                />
              )}
            />
            {errors.expiryDateTime && (
              <span className="text-red-500">
                {errors.expiryDateTime.message}
              </span>
            )}
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
