"use client";
import Link from "next/link";
import { useState ,useRef, useEffect} from "react";
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from "react-toastify";
import { getUserById } from "@/apiFunction/userApi/userApi";
import { updateUser } from "@/apiFunction/userApi/userApi";
import { useRouter } from "next/navigation";
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
  const onSubmit = data => console.log(data);
  
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (userObj) {
      console.log("User object data", userObj)
      setValue("firstName", userObj.response.FirstName);
      setValue("lastName", userObj.LastName);
      setValue("email", userObj.response.Email);
      setValue("phone", userObj.response.Phone);
      setValue ("password", userObj.Password);
    }
  }, [userObj]);

  const fetchUser = async () => {
    try {
      const userData = await getUserById(params?.params?.userId);
      setUserObj(userData?.resData);
      console.log("user data", userData);

      // Pre-fill form fields with product data
      
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };



  const handleEnabledChange = (e) => {
    console.log("isEnabled Value",e.target.value)
    setIsEnabled(e.target.value==="true");
  };

  const submitForm = async (data) => {
    console.log("user payload data", data);
    const UserDetails = {
      FirstName: data?.firstName,
      LastName: data?.lastName,
      Email: data?.email,
      Phone: data?.phone,
      Password : data?.password
    };

    console.log("user details", UserDetails);

    try {
      const res = await updateUser(UserDetails, params?.params?.userId);
      console.log("user response", res);
      if (!res.resData.message) {
        router.push("/admin/users");
        toast.success("User Updated Successfully");
      } else {
        console.error(res.resData.message);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  
  return (
    <section>
       <h1 className="text-2xl text-black-600 underline mb-3 font-bold">
        Update Your User Details
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
      <form onSubmit={handleSubmit(submitForm)} className="mb-5">
      <div className="grid gap-4 w-1/2 mb-4 md:grid-cols-1">
        <div>
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
            className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Phone"
          />
          {errors.phone && <span className="text-red-600">{errors.phone.message}</span>}
        </div>
        <div>
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
                required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
            className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Password"
          />
          {errors.password && <span className="text-red-600">{errors.password.message}</span>}
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
