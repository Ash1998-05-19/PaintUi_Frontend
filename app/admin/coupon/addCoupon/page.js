"use client";
import Link from "next/link";
import { useState ,useRef, useEffect} from "react";
import { useForm, Controller } from 'react-hook-form';
import { ToastContainer, toast } from "react-toastify";
import { getProductListForCoupon } from "@/apiFunction/productApi/productApi";
import { addCoupon } from "@/apiFunction/couponApi/couponApi";
import { useRouter } from "next/navigation";
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';



  
export default function AddCoupon() {
  const { register, handleSubmit, control, formState: { errors } } = useForm();

  const onSubmit = data => {
    console.log(data);
  };
    const [couponCode, setCouponCode] = useState('AUTO_GENERATED_CODE');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [expiryDateTime, setExpiryDateTime] = useState(null);
  const [amount, setAmount] = useState('');
  const [product, setProduct] = useState(null);
  const [listData, setListData] = useState(false);
  const [payLoad, setPayLoad] = useState({categoryIds : [], companyIds: [], productIds: [], sortBy :"createdAt", sortOrder : "DESC" })
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(1);
  const [searchData, setSearchData] = useState("");
  const [redeemTo, setRedeemTo] = useState('');
  const [redeemBy, setRedeemBy] = useState('');
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
    console.log("register data",data);
    console.log("selected product", selectedProduct)
    console.log("expiry date time", expiryDateTime)
    
    const CouponDetails={
      ProductId : selectedProduct.value,
      ExpiryDateTime : expiryDateTime,
      Amount : data.amount,
    }
    console.log("couponDetails",CouponDetails)
    let res = await addCoupon(CouponDetails, data.quantity)
    console.log("Response data", res);
     if(!res?.message){

       router.push("/admin/coupon");
       toast.success("Coupon Added Succefully");
      }else{
        toast.error(res?.resData?.message);
        return false;
      }
  };


  
  return (
    <section>
       <h1 className="text-2xl text-black-600 underline mb-3 font-bold">
        Add Your Coupon Details
      </h1>
      <Link href="/admin/coupon">
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
            <label htmlFor="productName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Product Name <span className="text-red-600">*</span>
            </label>
            {productList?.data?.length > 0 ? (
              <Controller
                name="productName"
                control={control}
                rules={{ required: 'Product Name is required' }}
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
            ) : (null)}
            {errors.productName && <span className="text-red-500">{errors.productName.message}</span>}
          </div>
        
       
        <div className="w-full">
          <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Amount <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            id="amount"
            {...register('amount', { required: 'Amount is required' })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Amount"
          />
          {errors.amount && <span className="text-red-500">{errors.amount.message}</span>}
        </div>

        <div className="w-full">
      <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Quantity <span className="text-red-600">*</span>
      </label>
      <input
        type="number"
        id="quantity"
        {...register('quantity', { required: 'Quantity is required' })}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        placeholder="Quantity"
      />
      {errors.quantity && <span className="text-red-500">{errors.quantity.message}</span>}
    </div>
    <div className="w-full">
            <label htmlFor="expiryDateTime" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Expiry Date & Time <span className="text-red-600">*</span>
            </label>
            <Controller
              name="expiryDateTime"
              control={control}
              rules={{ required: 'Expiry Date & Time is required' }}
              render={({ field }) => (
                <DatePicker
                  selected={expiryDateTime}
                  onChange={(date) => {
                    setExpiryDateTime(date);
                    field.onChange(date);
                  }}
                  showTimeSelect
                  dateFormat="Pp"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholderText="Select Expiry Date & Time"
                />
              )}
            />
            {errors.expiryDateTime && <span className="text-red-500">{errors.expiryDateTime.message}</span>}
          </div>
        </div>
        

      
      <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded-lg">Submit</button>
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
