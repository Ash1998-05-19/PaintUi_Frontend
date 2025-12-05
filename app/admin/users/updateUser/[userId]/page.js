"use client";
import Link from "next/link";
import { useState ,useRef, useEffect} from "react";
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from "react-toastify";
import { getUserById } from "@/apiFunction/userApi/userApi";
import { updateUser } from "@/apiFunction/userApi/userApi";
import { useRouter } from "next/navigation";
import SpinnerComp from "@/components/common/spinner";
//import { addAmenity } from "@/api-functions/amenity/addAmenity";
//import { ImageString  } from "@/api-functions/auth/authAction";
//import { AddFaqAPi } from "@/api-functions/faq/addFaq";


export default function UpdateUser(params) {
    const [userObj, setUserObj] = useState(null);
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        watch,
        formState: { errors },
      } = useForm();
      const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (userObj) {
      setValue("firstName", userObj.response.FirstName);
      setValue("lastName", userObj.response.LastName);
      setValue("email", userObj.response.Email);
      setValue("phone", userObj.response.Phone);
      // setValue ("password", userObj.Password);
      setValue ("address", userObj.response.Address);
      setValue ("shopName", userObj.response.ShopName);
    }
  }, [userObj]);

  const fetchUser = async () => {
    try {
      const userData = await getUserById(params?.params?.userId);
      setUserObj(userData?.resData);

      // Pre-fill form fields with product data
      
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };



  const handleEnabledChange = (e) => {
    setIsEnabled(e.target.value==="true");
  };

  const submitForm = async (data) => {
    const UserDetails = {
      FirstName: data?.firstName,
      LastName: data?.lastName,
      Email: data?.email,
      Address : data?.address?data?.address:"",
      ShopName : data?.shopName?data?.shopName:"",
      // Password : data?.password
    };


    try {
      const res = await updateUser(UserDetails, params?.params?.userId,setIsLoading);
      if (res?.resData?.success) {
        router.push("/admin/users");
        toast.success("User Updated Successfully");
      } else {
        console.error(res?.errMessage);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  
  return (
    <section>
       {isLoading && <SpinnerComp />}
       <h1 className="text-2xl text-black-600 underline mb-3 font-bold">
        Update Your Retailer User Details
      </h1>
      
        <div className="mb-5 mt-5">
          <Link href="/admin/users">
          <button
            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            type="button"
          >
            Back
          </button>
          </Link>
        </div>
      <form onSubmit={handleSubmit(submitForm)} className="mb-5">
      <div className="grid gap-4 mb-4 md:grid-cols-2">
          <div className="w-full">
          <label
            htmlFor="firstName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white required"
          >
            First Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            {...register("firstName", { required: true })}
            className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="First Name"
          />
          {errors.firstName && <span className="text-red-600">First Name is required</span>}
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white required"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            {...register("lastName", { required: false })}
            className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Last Name"
          />
          {errors.lastName && <span className="text-red-600">Last Name is required</span>}
        </div>

        <div>
          <label
            htmlFor="shopName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white required"
          >
            Shop Name
          </label>
          <input
            type="text"
            id="shopName"
            {...register("shopName", { required: false })}
            className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Shop Name"
          />
          {errors.shopName && <span className="text-red-600">Shop Name is required</span>}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white required"
          >
            Email 
          </label>
          <input
            type="email"
            id="email"
            {...register("email", {
             
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                message: "Only Gmail addresses are allowed",
              },
            })}
            className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Email"
          />
          {errors.email && <span className="text-red-600">{errors.email.message}</span>}
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white required"
          >
            Phone <span className="text-red-600">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            disabled
            {...register("phone", {
              required: "Phone Number is required",
              pattern: {
                value: /^[0-9]*$/,
                message: "Please enter a valid phone number",
              },
              minLength: {
                value: 10,
                message: "Mobile number should be at least 10 digits",
              },
              maxLength: {
                value: 10,
                message: "Mobile number should not exceed 10 digits",
              },
              validate: {
                validFirstDigit: (value) =>
                  /^[789]/.test(value.charAt(0)) ||
                  "First digit must be 7, 8, or 9",
              },
            })}
            className={`bg-gray-200 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Phone"
          />
          {errors.phone && <span className="text-red-600">{errors.phone.message}</span>}
        </div>
        {/* <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white required"
          >
            Password  <span className="text-red-600">*</span>
          </label>
          <input
            type="password"
            id="password"
            {...register("password", {
               
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
            className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Password"
          />
          {errors.password && <span className="text-red-600">{errors.password.message}</span>}
        </div> */}
        <div className="w-full">
            <label
              htmlFor="address"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Address 
            </label>
            <textarea
              id="address"
              {...register("address", { required: false })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter your address"
              rows="4"
            ></textarea>
            {errors.address && (
              <span className="text-red-500">{errors.address.message}</span>
            )}
          </div>
      </div>
      <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
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
