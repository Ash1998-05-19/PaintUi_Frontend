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
import SearchInput from "@/components/common/searchDebounceInput";
import SpinnerComp from "@/components/common/spinner";
import DateRange from "@/components/common/dateRange";
import { ExportToExcel } from "@/components/common/exportToCsv";
//import Cookies from "js-cookie";
export default function Ledger(params) {
  //   const roleData = Cookies.get("roles") ?? "";
  //   const name = Cookies.get("name");
  //   const roles = roleData && JSON.parse(roleData);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [ledgerExcelData, setLedgerExcelData] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [listData, setListData] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [isRefresh, setIsRefresh] = useState(0);
  const [userId, setUserId] = useState(
    params?.searchParams?.id ? params?.searchParams?.id : null
  );
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState("");
  console.log("listData", listData);
  console.log("ledger params data", params);

  useEffect(() => {
    getAllLedgers();
  }, [page, searchData, isRefresh, fromDate, toDate]);
  const getAllLedgers = async () => {
    setIsLoading(true);
    let ledgers = await getLedger(page, searchData, userId, fromDate, toDate);
    console.log("ledger details", ledgers);
    if (!ledgers?.resData?.message) {
      setListData(ledgers?.resData);
      setIsLoading(false);
      return false;
    } else {
      toast.error(ledgers?.message);
      return false;
    }
  };

  useEffect(() => {
    if (listData?.ledgerEntries) {
      const keysToSelect = ["FirstName", "LastName", "EntryType", "Amount"];

      const filterCsvData = (data, keys) => {
        return data.map((item) => {
          let newItem = {};
          keys.forEach((key) => {
            // Handle nested UserDetail keys
            if (key in item) {
              newItem[key] = item[key];
            } else if (key in item.UserDetail) {
              newItem[key] = item.UserDetail[key];
            }
          });
          return newItem;
        });
      };

      setLedgerExcelData(filterCsvData(listData.ledgerEntries, keysToSelect));
    }
  }, [listData]);

  const searchInputChange = (e) => {
    setSearchData(e);
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
      {isLoading && <SpinnerComp />}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <h1 className="text-2xl text-black-600 underline mb-3 font-bold">
          Ledger
        </h1>
        <DateRange
          setFromDate={setFromDate}
          setToDate={setToDate}
          startDate={fromDate}
          endDate={toDate}
        />
        <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
          <div className="flex ">
            <div>
              {Object.keys(params?.searchParams || {}).length === 0 && (
                <>
                  <Link href={"/admin/ledger/addLedger"}>
                    {" "}
                    <button
                      className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      type="button"
                    >
                      + Add Ledger
                    </button>
                  </Link>
                </>
              )}
            </div>

            <div className="mt-0">
              {listData?.ledgerEntries?.length > 0 && (
                <ExportToExcel
                  apiData={ledgerExcelData}
                  fileName={"Ledger_Data"}
                />
              )}
            </div>
          </div>

          <div>
            <SearchInput setSearchData={searchInputChange} />
          </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {/* <th scope="col" className="px-6 py-3">
                Ledger Id
              </th> */}
              <th scope="col" className="px-6 py-3">
                User Name
              </th>
              <th scope="col" className="px-6 py-3">
                Entry Type
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
              {/* <th scope="col" className="px-6 py-3">
                Note
              </th> */}

              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {listData?.ledgerEntries?.length > 0 &&
              listData?.ledgerEntries?.map((item, index) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  {/* <td className="px-6 py-4">{item?.LedgerId}</td> */}
                  <td className="px-6 py-4">{item?.UserDetail?.FirstName}</td>
                  <td className="px-6 py-4">{item?.EntryType}</td>
                  <td className="px-6 py-4">{item?.Amount}</td>
                  {/* <td className="px-6 py-4">{item?.Note}</td> */}
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
        {listData?.ledgerEntries?.length === 0 && (
          <p className="text-center text-2xl font-bold text-gray-500">
            No data found
          </p>
        )}
      </div>

      <DeleteModal
        isOpen={isPopupOpen}
        title="Are you sure you want to delete this Ledger entry ?"
        confirmLabel="Yes, I'm sure"
        cancelLabel="No, cancel"
        onConfirm={handleDelete}
        onCancel={handleCancel}
      />
      {listData?.ledgerEntries?.length > 0 && (
        <div className="mt-4">
          <ListPagination
            data={listData}
            pageNo={handlePageChange}
            pageVal={page}
          />
        </div>
      )}
    </section>
  );
}
