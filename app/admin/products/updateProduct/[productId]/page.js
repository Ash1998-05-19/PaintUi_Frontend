"use client";
import Link from "next/link";
import { useState ,useRef, useEffect} from "react";
import { useForm } from 'react-hook-form';
import { getCategory } from "@/apiFunction/categoryApi/categoryApi";
import { getCompany } from "@/apiFunction/companyApi/companyApi";
import { addProduct } from "@/apiFunction/productApi/productApi";
import { getProductById } from "@/apiFunction/productApi/productApi";
import { updateProduct } from "@/apiFunction/productApi/productApi";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Select from 'react-select';
//import { addAmenity } from "@/api-functions/amenity/addAmenity";
//import { ImageString  } from "@/api-functions/auth/authAction";
//import { AddFaqAPi } from "@/api-functions/faq/addFaq";





export default function UpdateProduct(params ) {
  const [page, setPage] = useState(1);
  const [searchData, setSearchData] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [product, setProduct] = useState(null);

  const { register, handleSubmit, setValue, getValues, watch,  formState: { errors } } = useForm();

  console.log("params",params);

  const onSubmit = data => {
    console.log(data);
  };

  useEffect(() => {
    getAllCompanies();
    getAllCategories();
    fetchProduct();
  }, []);

  useEffect(() => {
    if(product){

      setValue("productName", product.Name);
      console.log("ProductName", product.Name);
      setValue("category", { value: product.CategoryId, label: product?.Category?.Name });
      setValue("company", { value: product.CompanyId, label: product?.Company?.Name });
      setValue("weight", product.WeightInGrams);
      setValue("height", product.HeightInCm);
      setValue("width", product.WidthInCm);
      setValue("volume", product.VolumeInLiter);
      setValue("price", product.Price);
      setValue("discountPercentage", product.DiscountPercentage);
      setValue("sgstPercentage", product.SGSTPercentage);
      setValue("cgstPercentage", product.CGSTPercentage);
      setValue("igstPercentage", product.IGSTPercentage);
      setValue('productCode', product.ProductCode);
    }
  }, [product]);

  const fetchProduct = async () => {
    try {
      const productData = await getProductById(params?.params?.productId);
      setProduct(productData?.resData?.product);
      console.log("product data", productData);

      // Pre-fill form fields with product data
      
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const getAllCompanies = async () => {
    let companies = await getCompany(page, searchData);
    if (!companies?.resData?.message) {
      setCompanyList(companies?.resData);
      return false;
    } else {
      toast.error(companies?.message);
      return false;
    }
  };

  
  const getAllCategories = async () => {
    let categories = await getCategory(page, searchData);
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

  

  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState(null);
  const [company, setCompany] = useState(null);
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
    
    console.log("selectedOption", selectedOption)
    setValue("category", selectedOption);
    
  };

  const handleCompanyChange = (selectedOption) => {
   
    console.log("selectedOption", selectedOption)
    setValue("company", selectedOption);
  };


  const router = useRouter();
  console.log("Router", router);

  const submitForm = async (data) => {
    const ProductDetails = {
      Name: data.productName,
      CategoryId: data.category.value,
      CompanyId: data.company.value,
      WeightInGrams: data.weight,
      HeightInCm: data.height,
      WidthInCm: data.width,
      VolumeInLiter: data.volume,
      Price: data.price,
      DiscountPercentage: data.discountPercentage,
      SGSTPercentage: data.sgstPercentage,
      CGSTPercentage: data.cgstPercentage,
      IGSTPercentage: data.igstPercentage,
    };

    try {
      const res = await updateProduct(ProductDetails, params?.params?.productId);
      if (!res.resData.message) {
        router.push("/admin/products");
        toast.success("Product Updated Successfully");
      } else {
        toast.error(res?.resData?.message);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  
  return (
    <section>
       <h1 className="text-2xl text-black-600 underline mb-3 font-bold">
        Update Your Product Details
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
            Product Name
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

        <div className="w-full">
          <label htmlFor="productCode" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Product Code
          </label>
          <input
            type="text"
            id="productCode"
            {...register('productCode')}
            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Product Code"
            disabled 
          />
        </div>
        
        <div className="w-full">
          <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Category
          </label>
          {(<Select
            value={watch("category")}
            onChange={handleCategoryChange}
            options={categoryList?.categories?.map((element) => ({
              value: element?.CategoryId,
              label: element?.Name,
            }))}
            id="category"
            className="text-gray-900 text-sm rounded-lg dark:text-white"
            placeholder="Select Category"
            
          />)}
          
        </div>
        
        <div className="w-full">
          <label htmlFor="company" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Company
          </label>
          {(<Select
            value={watch("company")}
            onChange={handleCompanyChange}
            options={companyList?.companies?.map((element) => ({
              value: element?.CompanyId,
              label: element?.Name,
            }))}
            id="company"
            className="text-gray-900 text-sm rounded-lg dark:text-white"
            placeholder="Select Company"
            
          />)}
          
        </div>
        
        <div className="w-full">
          <label htmlFor="weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Weight (in grams)
          </label>
          <input
            type="number"
            id="weight"
            {...register('weight', { required: 'Weight is required' })}
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
            Price
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
