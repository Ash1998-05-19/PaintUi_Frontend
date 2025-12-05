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
import LedgerFilterModal from "@/components/common/ledgerFilterModal";
//import Cookies from "js-cookie";
export default function Ledger(params) {
  //   const roleData = Cookies.get("roles") ?? "";
  //   const name = Cookies.get("name");
  //   const roles = roleData && JSON.parse(roleData);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [ledgerExcelData, setLedgerExcelData] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortOrder, setSortOrder] = useState(""); 
const [sortBy, setSortBy] = useState(""); 
  const [listData, setListData] = useState(false);
  const [filterModalvalue, setFilterModalValue] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [isRefresh, setIsRefresh] = useState(0);
  const [userId, setUserId] = useState(
    params?.searchParams?.id ? params?.searchParams?.id : null
  );

  const [payLoad, setPayLoad] = useState({
    userIds: [],
  });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState("");

  useEffect(() => {
    getAllLedgers();
  }, [page, searchData, isRefresh]);
  const getAllLedgers = async () => {
    setIsLoading(true);
    let ledgers = await getLedger(page, searchData, userId, fromDate, toDate, sortOrder, sortBy);
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
      const keysToSelect = [
        "FirstName",
        "LastName",
        "EntryType",
        "Amount",
        "creditSum",
        "debitSum",
        "netAmount",
      ];

      const filterCsvData = (data, userSumsData, keys) => {
        return data.map((item) => {
          let newItem = {};
          keys.forEach((key) => {
            // Handle nested UserDetail keys
            if (data.indexOf(item) == 0) {
              if (userSumsData?.length > 0) {
                userSumsData?.map((subitem) => {
                  if (key in subitem) {
                    newItem[key] = subitem[key];
                  }
                });
              }
            }

            if (key in item) {
              newItem[key] = item[key];
            } else if (key in item.UserDetail) {
              newItem[key] = item.UserDetail[key];
            }
          });
          return newItem;
        });
      };

      setLedgerExcelData(
        filterCsvData(listData.ledgerEntries, listData.userSums, keysToSelect)
      );
    }
  }, [listData]);

  const searchInputChange = (e) => {
    setSearchData(e);
  };
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const openFilterModal = async () => {
    setFilterModalValue(true);
  };

  const closeFilterModal = async () => {
    setFilterModalValue(false);
  };

  const handleDelete = async () => {
    try {
      const res = await deleteLedger(deleteId);
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

        <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
          <div className="flex ">
            <div>
              {Object.keys(params?.searchParams || {}).length === 0 && (
                <>
                  <Link href={"/admin/ledger/addLedger"}>
                    {" "}
                    <button
                      className="py-2.5 px-5 me-2 mt-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
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
          <div className="flex">
            <i
              className="bi bi-funnel mt-2 mr-2 font-medium text-2xl"
              onClick={openFilterModal}
            ></i>
            <div>
              <SearchInput setSearchData={searchInputChange} />
            </div>
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
                Sales Order
              </th>
              <th scope="col" className="px-6 py-3">
                Entry Type
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Transaction Date
              </th>
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
                  <td className="px-6 py-4">{item?.SODetail?.OrderNumber || "_"}</td>
                  <td className="px-6 py-4">{item?.EntryType}</td>
                  <td className="px-6 py-4">{item?.Amount}</td>
                  <td className="px-6 py-4">
                    {item?.TransactionDate
                      ? new Date(item.TransactionDate)
                          .toISOString()
                          .split("T")[0]
                      : "-"}
                  </td>

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
      <LedgerFilterModal
        modalValue={filterModalvalue}
        handleClose={closeFilterModal}
        userOptions={listData}
        setFromDate={setFromDate}
        setToDate={setToDate}
        firstDate={fromDate}
        lastDate={toDate}
        setIsRefresh={setIsRefresh}
        setUserId={setUserId}
        userValue={userId}
        setSortOrder = {setSortOrder}
        sortOrderValue = {sortOrder}
        setSortBy = {setSortBy}
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
      {userId && listData?.userSums ? (
        <div className="flex justify-center mt-3 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 h-20">
          <div className="grid grid-cols-3 gap-4 justify-center items-center w-full">
            <div className="text-center">
              <h1 className="text-md font-bold text-gray-500">
                CreditSum :{" "}
                <span className="text-sm font-semibold text-black">
                  {listData?.userSums[0]?.creditSum}
                </span>
              </h1>
            </div>
            <div className="text-center">
              {" "}
              <h1 className="text-md font-bold text-gray-500">
                DebitSum :{" "}
                <span className="text-sm font-semibold text-black">
                  {listData?.userSums[0]?.debitSum}
                </span>
              </h1>
            </div>
            <div className="text-center">
              {" "}
              <h1 className="text-md font-bold text-gray-500">
                NetAmout :{" "}
                <span className="text-sm font-semibold text-black">
                  {listData?.userSums[0]?.netAmount}
                </span>
              </h1>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
