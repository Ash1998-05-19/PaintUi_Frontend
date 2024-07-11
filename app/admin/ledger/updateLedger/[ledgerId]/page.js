"use client";
import Link from "next/link";
import { useState ,useRef, useEffect} from "react";
import { useForm, Controller  } from 'react-hook-form';
import { getLedgerById } from "@/apiFunction/ledgerApi/ledgerApi";
import { updateLedger } from "@/apiFunction/ledgerApi/ledgerApi";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Select from 'react-select';
//import { addAmenity } from "@/api-functions/amenity/addAmenity";
//import { ImageString  } from "@/api-functions/auth/authAction";
//import { AddFaqAPi } from "@/api-functions/faq/addFaq";





export default function UpdateLedger(params) {
    const [ledgerObj, setLedgerObj] = useState(null);
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
    fetchLedger();
  }, []);

  useEffect(() => {
    if (ledgerObj) {
      console.log("User object data", ledgerObj)
      setValue("entryType", ledgerObj?.ledgerEntry?.EntryType);
      setValue("amount", ledgerObj?.ledgerEntry?.Amount);
    }
  }, [ledgerObj]);

  const fetchLedger = async () => {
    try {
      const ledgerData = await getLedgerById(params?.params?.ledgerId);
      setLedgerObj(ledgerData?.resData);
      console.log("ledger data", ledgerData);
  
    } catch (error) {
      console.error("Error fetching ledger:", error);
    }
  };


  const submitForm = async (data) => {
    console.log("user payload data", data);
    const LedgerDetails = {
      EntryType: data?.entryType,
      Amount: data?.amount,
    };

    console.log("user details", LedgerDetails);

    try {
      const res = await updateLedger(LedgerDetails, params?.params?.ledgerId);
      console.log("ledger response", res);
      if (!res.resData.message) {
        router.push("/admin/ledger");
        toast.success("Ledger Updated Successfully");
      } else {
        console.error(res.resData.message);
      }
    } catch (error) {
      console.error("Error updating ledger:", error);
    }
  };
  
  return (
    <section>
       <h1 className="text-2xl text-black-600 underline mb-3 font-bold">
        Update Your Ledger Details
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
        <div className="w-full">
          <label htmlFor="entryType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Entry Type <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="entryType"
            {...register('entryType', { required: 'Entry Type is required' })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Entry Type"
          />
          {errors.entryType && <span className="text-red-500">{errors.entryType.message}</span>}
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

  
      </div>

      <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded-lg">Submit</button>
    </form>

    </section>
  );
}
