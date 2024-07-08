"use client";

import Link from "next/link";
//import Spinner from "@/components/common/loading";
//import Pagination from "@/components/common/pagination";
//import Popup from "@/components/common/popup";
import { useEffect, useState } from "react";
import Switch from "react-switch";
import { getLedger } from "@/apiFunction/ledgerApi/ledgerApi";
import { deleteLedger } from "@/apiFunction/ledgerApi/ledgerApi";
import { ToastContainer, toast } from "react-toastify";
import ListPagination from "@/components/common/pagination";
import DeleteModal from "@/components/common/deleteModal";
//import Cookies from "js-cookie";
export default function Ledger() {
//   const roleData = Cookies.get("roles") ?? "";
//   const name = Cookies.get("name");
//   const roles = roleData && JSON.parse(roleData);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [listData, setListData] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [isRefresh, setIsRefresh] = useState(0);
  const [page, setPage] = useState(1);
  const [searchData, setSearchData] = useState("");
  console.log("listData", listData);

  useEffect(() => {
    getAllLedgers();
  }, [page, searchData, isRefresh]);
  const getAllLedgers = async () => {
    let ledgers = await getLedger(page, searchData);
    console.log("ledger details", ledgers);
    if (!ledgers?.resData?.message) {
      setListData(ledgers?.resData);
      return false;
    } else {
      toast.error(ledgers?.message);
      return false;
    }
  };

  const searchInputChange = (e) => {
    setSearchData(e.target.value);
  };
  const handlePageChange = (newPage) => {
    console.log(newPage);
    setPage(newPage);
  };

  const handleDelete = async () => {
    try {
      const res = await deleteLedger(deleteId);
      console.log("delete response", res);
      if (!res?.message) {
        toast.success("Ledger deleted successfully");
        setIsPopupOpen(false); 
        getAllLedgers(); 
      } else {
        toast.error(res?.message || "Error deleting ledger");
      }
    } catch (error) {
      toast.error("Failed to delete ledger");
    }
  };
  const handleCancel = () => {
    setDeleteId("");
    setIsPopupOpen(false);
  };
  const deleteLedgerModal = async (id) => {
    setDeleteId(id);
    setIsPopupOpen(true);
  };
  return (
    <section>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <h1 className="text-2xl text-black-600 underline mb-3 font-bold">
          Ledger
        </h1>
        <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
        <div>
            <Link href={"/admin/ledger/addLedger"}>
              {" "}
              <button
                className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                type="button"
              >
                + Add Ledger
              </button>
            </Link>
          </div>
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              id="table-search"
              className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search"
              onChange={searchInputChange}
            />
          </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Ledger Id
              </th>
              <th scope="col" className="px-6 py-3">
                User Id
              </th>
              <th scope="col" className="px-6 py-3">
               Entry Type
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
             
              
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {listData?.ledgerEntries?.map((item, index) => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4">{item?.LedgerId}</td>
                <td className="px-6 py-4">{item?.UserId}</td>
                <td className="px-6 py-4">{item?.EntryType}</td>
                <td className="px-6 py-4">{item?.Amount}</td>

                
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                
                      <Link
                        href={`/admin/ledger/updateLedger/${item.LedgerId}`}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        <i
                          className="bi bi-pencil-square"
                          style={{ fontSize: "1.5em" }}
                        ></i>
                      </Link>
                   

                    
                    {/* <Switch
                      onChange={() =>
                        toggleChange(item?.CategoryId, item?.IsActive)
                      }
                      checked={item?.IsActive}
                    /> */}

                    <Link
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      <i
                        onClick={() => deleteLedgerModal(item.LedgerId)}
                        className="bi bi-trash-fill"
                        style={{ color: "red", fontSize: "1.5em" }}
                      ></i>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteModal
        isOpen={isPopupOpen}
        title="Are you sure you want to delete this Ledger entry ?"
        confirmLabel="Yes, I'm sure"
        cancelLabel="No, cancel"
        onConfirm={handleDelete}
        onCancel={handleCancel}
      />

      <div className="mt-4">
        <ListPagination
          data={listData}
          pageNo={handlePageChange}
          pageVal={page}
        />
      </div>
    </section>
  );
}
