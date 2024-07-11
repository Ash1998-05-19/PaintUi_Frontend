"use client";
import Link from "next/link";
import { useState ,useRef} from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useForm } from 'react-hook-form';
import { addCategory } from "@/apiFunction/categoryApi/categoryApi";
export default function AddCategory() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => console.log(data);
  
  const router = useRouter();

  
  const submitForm = async (data) => {
    console.log("register data",data);
    const CategoryDetails={
      Name : data.categoryName
    }
    console.log("categoryDetails",CategoryDetails)
    let res = await addCategory(CategoryDetails)
    console.log("Response data", res);
     if(!res?.resData?.message){
      console.log("Response",res?.resData?.message )
       router.push("/admin/categories");
       toast.success("Category Added Succesfully");
      }else{
        toast.error(res?.resData?.message);
        return false;
      }
  };
  
  return (
    <section>
       <h1 className="text-2xl text-black-600 underline mb-3 font-bold">
        Add Your Category Details
      </h1>
      <Link href="/admin/categories">
        <div className="mb-5 mt-5">
          <button
            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            type="button"
          >
            Back
          </button>
        </div>
      </Link>
      <form onSubmit={handleSubmit(submitForm)} className="mb-5">
      <div className="w-1/2 mb-4">
        <label
          htmlFor="categoryName"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Category Name <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="categoryName"
          {...register("categoryName", { required: "Category Name is required" })}
          className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.categoryName ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Category Name"
        />
        {errors.categoryName && <span className="text-red-600">{errors.categoryName.message}</span>}
      </div>
      <input
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      />
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
