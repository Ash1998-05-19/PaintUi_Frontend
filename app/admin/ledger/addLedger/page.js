"use client";
import Link from "next/link";
import { useState ,useRef, useEffect} from "react";
import { useForm, Controller  } from 'react-hook-form';
import { getCategoryListForProduct } from "@/apiFunction/categoryApi/categoryApi";
import { getUser } from "@/apiFunction/userApi/userApi";
import { addLedger } from "@/apiFunction/ledgerApi/ledgerApi";
import { getCompanyListForProduct } from "@/apiFunction/companyApi/companyApi";
import { addProduct } from "@/apiFunction/productApi/productApi";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Select from 'react-select';
//import { addAmenity } from "@/api-functions/amenity/addAmenity";
//import { ImageString  } from "@/api-functions/auth/authAction";
//import { AddFaqAPi } from "@/api-functions/faq/addFaq";





export default function AddLedger() {
  const [page, setPage] = useState(1);
  const [searchData, setSearchData] = useState("");
  const [userList, setUserList] = useState([]);
  const [users, setUsers] = useState(null);
  const [company, setCompany] = useState(null);
  const [productCode, setProductCode] = useState('');

  const { register, handleSubmit, watch,control, formState: { errors } } = useForm();

  const onSubmit = data => {
    console.log(data);
  };

  useEffect(() => {
    getAllUsers();
  }, [page, searchData]);
  const getAllUsers = async () => {
    let users = await getUser(page, searchData);
    if (!users?.resData?.message) {
      setUserList(users?.resData);
      return false;
    } else {
      toast.error(users?.message);
      return false;
    }
  };

  console.log("User List data",userList);


  const handleUserChange = (selectedOption) => {
    setUsers(selectedOption);
  };

  


  const router = useRouter();

  const submitForm = async (data) => {
    console.log("register data",data);
    const LedgerDetails={
      EntryType: data.entryType,
      RetailerUserId: users.value,
      Amount: data.amount,
      
    }
    console.log("LedgerDetails",LedgerDetails)
    let res = await addLedger(LedgerDetails)
    console.log("Response data", res);
     if(!res?.message){
       router.push("/admin/ledger");
       toast.success("Ledger Added Successfully");
      }else{
        toast.error(res?.resData?.message);
        return false;
      }
  };
  
  return (
    <section>
       <h1 className="text-2xl text-black-600 underline mb-3 font-bold">
        Add Your Ledger Details
      </h1>
      <Link href="/admin/ledger">
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
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Entry Type <span className="text-red-600">*</span>
        </label>
        <div className="flex">
        
        <div className="flex items-center mb-2">
          <input
            type="radio"
            id="entryType1"
            value="Credit"
            {...register('entryType', { required: 'Entry Type is required' })}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="entryType1" className="ml-2  mr-4  text-sm font-medium text-gray-900 dark:text-gray-300">
            Credit
          </label>
        </div>
        <div className="flex items-center mb-2">
          <input
            type="radio"
            id="entryType2"
            value="Debit"
            {...register('entryType', { required: 'Entry Type is required' })}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="entryType2" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Debit
          </label>
        </div>
        {errors.entryType && <span className="text-red-500">{errors.entryType.message}</span>}
      </div>
        </div>

        <div className="w-full">
          <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Amount  <span className="text-red-600">*</span>
          </label>
          <input
            type="amount"
            step="0.01"
            id="price"
            {...register('amount', { required: 'Amount is required' })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Amount"
          />
          {errors.amount && <span className="text-red-500">{errors.amount.message}</span>}
        </div>


        <div className="w-full">
          <label htmlFor="users" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Users <span className="text-red-600">*</span>
          </label>
        <Controller
          name="users"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              {...field}
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                handleUserChange(value);
              }}
              options={userList?.users?.map((element) => ({
                value: element?.UserId,
                label: element?.FirstName,
              }))}
              id="category"
              className="text-gray-900 text-sm rounded-lg dark:text-white"
              placeholder="Select Users"
              isClearable
            />
          )}
        />
        {errors.users && <span className="text-red-600">This field is required</span>}
      </div>

      {/* <div className="w-full">
            <label htmlFor="note" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Note <span className="text-red-600">*</span>
            </label>
            <textarea
              id="note"
              {...register('note', { required: 'note is required' })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter your note"
              rows="4"
            ></textarea>
            {errors.narration && <span className="text-red-500">{errors.narration.message}</span>}
          </div> */}

        
      </div>

      <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded-lg">Submit</button>
    </form>


    </section>
  );
}
