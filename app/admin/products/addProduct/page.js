"use client";
import Link from "next/link";
import { useState ,useRef, useEffect} from "react";
import { useForm, Controller  } from 'react-hook-form';
import { getCategoryListForProduct } from "@/apiFunction/categoryApi/categoryApi";

import { getCompanyListForProduct } from "@/apiFunction/companyApi/companyApi";
import { addProduct } from "@/apiFunction/productApi/productApi";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Select from 'react-select';
//import { addAmenity } from "@/api-functions/amenity/addAmenity";
//import { ImageString  } from "@/api-functions/auth/authAction";
//import { AddFaqAPi } from "@/api-functions/faq/addFaq";





export default function AddProduct() {
  const [page, setPage] = useState(1);
  const [searchData, setSearchData] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [category, setCategory] = useState(null);
  const [company, setCompany] = useState(null);
  const [productCode, setProductCode] = useState('');

  const { register, handleSubmit, watch,control, formState: { errors } } = useForm();

  const onSubmit = data => {
    console.log(data);
  };

  useEffect(() => {
    getAllCompanies();
    getAllCategories();
  }, []);
  const getAllCompanies = async () => {
    let companies = await getCompanyListForProduct(page);
    if (!companies?.resData?.message) {
      setCompanyList(companies?.resData);
      return false;
    } else {
      toast.error(companies?.message);
      return false;
    }
  };

  
  const getAllCategories = async () => {
    let categories = await getCategoryListForProduct(page);
    if (!categories?.resData?.message) {
      setCategoryList(categories?.resData);
      return false;
    } else {
      toast.error(categories?.message);
      return false;
    }
  };

  console.log("categoryList",categoryList);
  console.log("companyList",companyList);

  useEffect(() => {
    generateProductCode();
  }, [company, watch('productName'), watch('volume')]);

  const generateProductCode = () => {
    const productName = watch('productName');
    const volume = watch('volume');
    if (company && productName && volume) {
      const companyCode = company.label.slice(0, 3).toUpperCase();
      const prodCode = productName.slice(0, 3).toUpperCase();
      const volumeCode = (volume * 1000).toString();
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const code = `${companyCode}${prodCode}${volumeCode}-${randomDigits}`;
      setProductCode(code);
    } else {
      setProductCode('');
    }
  };

  

  const [productName, setProductName] = useState('');

  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [volume, setVolume] = useState('');
  const [price, setPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [sgstPercentage, setSgstPercentage] = useState('');
  const [cgstPercentage, setCgstPercentage] = useState('');
  const [igstPercentage, setIgstPercentage] = useState('');

  const handleCategoryChange = (selectedOption) => {
    setCategory(selectedOption);
  };

  const handleCompanyChange = (selectedOption) => {
    setCompany(selectedOption);
  };


  const router = useRouter();

  const submitForm = async (data) => {
    console.log("register data",data);
    const ProductDetails={
      Name: data.productName,
      CategoryId: category.value,
      CompanyId: company.value,
      WeightInGrams: data.weight,
      HeightInCm: data.height,
      WidthInCm: data.width,
      VolumeInLiter: data.volume,
      Price: data.price,
      DiscountPercentage: data.discountPercentage,
      SGSTPercentage: data.sgstPercentage,
      CGSTPercentage: data.cgstPercentage,
      IGSTPercentage: data.igstPercentage,
      ProductCode: productCode,
    }
    console.log("productDetails",ProductDetails)
    let res = await addProduct(ProductDetails)
    console.log("Response data", res);
     if(!res?.resData?.message){

       router.push("/admin/products");
       toast.success("Product Added Successfully");
      }else{
        toast.error(res?.resData?.message);
        return false;
      }
  };
  
  return (
    <section>
       <h1 className="text-2xl text-black-600 underline mb-3 font-bold">
        Add Your Product Details
      </h1>
      <Link href="/admin/products">
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
          <label htmlFor="productName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Product Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="productName"
            {...register('productName', { required: 'Product Name is required' })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Product Name"
          />
          {errors.productName && <span className="text-red-500">{errors.productName.message}</span>}
        </div>

        {/* <div className="w-full">
            <label htmlFor="productCode" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Product Code
            </label>
            <input
              type="text"
              id="productCode"
              value={productCode}
              disabled
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Product Code"
            />
          </div> */}
        
        <div className="w-full">
          <label htmlFor="company" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Category <span className="text-red-600">*</span>
          </label>
        <Controller
          name="category"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              {...field}
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                handleCategoryChange(value);
              }}
              options={categoryList?.data?.map((element) => ({
                value: element?.CategoryId,
                label: element?.Name,
              }))}
              id="category"
              className="text-gray-900 text-sm rounded-lg dark:text-white"
              placeholder="Select Category"
              isClearable
            />
          )}
        />
        {errors.category && <span className="text-red-600">This field is required</span>}
      </div>
        
      <div className="w-full">
          <label htmlFor="company" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Company <span className="text-red-600">*</span>
          </label>
        <Controller
          name="company"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              {...field}
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                handleCompanyChange(value);
              }}
              options={companyList?.data?.map((element) => ({
                value: element?.CompanyId,
                label: element?.Name,
              }))}
              id="company"
              className="text-gray-900 text-sm rounded-lg dark:text-white"
              placeholder="Select Company"
              isClearable
            />
          )}
        />
        {errors.company && <span className="text-red-600">This field is required</span>}
      </div>
        
        <div className="w-full">
          <label htmlFor="weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Weight (in grams)
          </label>
          <input
            type="number"
            id="weight"
            {...register('weight')}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Weight"
          />
          {errors.weight && <span className="text-red-500">{errors.weight.message}</span>}
        </div>

        <div className="w-full">
          <label htmlFor="height" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Height (in cm)
          </label>
          <input
            type="number"
            step="0.01"
            id="height"
            {...register('height')}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Height"
          />
        </div>
        
        <div className="w-full">
          <label htmlFor="width" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Width (in cm)
          </label>
          <input
            type="number"
            step="0.01"
            id="width"
            {...register('width')}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Width"
          />
        </div>

        <div className="w-full">
          <label htmlFor="volume" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Volume (in liters)
          </label>
          <input
            type="number"
            step="0.01"
            id="volume"
            {...register('volume')}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Volume"
          />
        </div>

        <div className="w-full">
          <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Price  <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            id="price"
            {...register('price', { required: 'Price is required' })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Price"
          />
          {errors.price && <span className="text-red-500">{errors.price.message}</span>}
        </div>

        <div className="w-full">
            <label
              htmlFor="discountPercentage"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Discount Percentage
            </label>
            <input
              type="number"
              step="0.01"
              id="discountPercentage"
              {...register("discountPercentage", {
                max: {
                  value: 100, // Replace 100 with the desired maximum value
                  message:
                    " Discount Percentage must be less than or equal to 100",
                },
              })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Discount Percentage"
            />
            {errors.discountPercentage && (
              <span className="text-red-500">
                {errors.discountPercentage.message}
              </span>
            )}
          </div>

          <div className="w-full">
            <label
              htmlFor="sgstPercentage"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              SGST Percentage
            </label>
            <input
              type="number"
              step="0.01"
              id="sgstPercentage"
              {...register("sgstPercentage", {
                max: {
                  value: 100, // Replace 100 with the desired maximum value
                  message: " SGST Percentage must be less than or equal to 100",
                },
              })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="SGST Percentage"
            />
            {errors.sgstPercentage && (
              <span className="text-red-500">
                {errors.sgstPercentage.message}
              </span>
            )}
          </div>

          <div className="w-full">
            <label
              htmlFor="cgstPercentage"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              CGST Percentage
            </label>
            <input
              type="number"
              step="0.01"
              id="cgstPercentage"
              {...register("cgstPercentage", {
                max: {
                  value: 100, // Replace 100 with the desired maximum value
                  message: " CGST Percentage must be less than or equal to 100",
                },
              })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="CGST Percentage"
            />
            {errors.cgstPercentage && (
              <span className="text-red-500">
                {errors.cgstPercentage.message}
              </span>
            )}
          </div>

          <div className="w-full">
            <label
              htmlFor="igstPercentage"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              IGST Percentage
            </label>
            <input
              type="number"
              step="0.01"
              id="igstPercentage"
              {...register("igstPercentage", {
                max: {
                  value: 100, // Replace 100 with the desired maximum value
                  message: " IGST Percentage must be less than or equal to 100",
                },
              })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="IGST Percentage"
            />
            {errors.igstPercentage && (
              <span className="text-red-500">
                {errors.igstPercentage.message}
              </span>
            )}
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
