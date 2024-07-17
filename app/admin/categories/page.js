"use client";

import Link from "next/link";
import Switch from "react-switch";
//import Spinner from "@/components/common/loading";
//import Pagination from "@/components/common/pagination";
//import Popup from "@/components/common/popup";
import { useEffect, useState } from "react";
import { getCategory } from "@/apiFunction/categoryApi/categoryApi";
import { deleteCategory } from "@/apiFunction/categoryApi/categoryApi";
import { updateCategory } from "@/apiFunction/categoryApi/categoryApi";
import DeleteModal from "@/components/common/deleteModal";
import { ToastContainer, toast } from "react-toastify";
import ListPagination from "@/components/common/pagination";
import SearchInput from "@/components/common/searchDebounceInput";
import SpinnerComp from "@/components/common/spinner";
//import Cookies from "js-cookie";

export default function Category() {
  //   const roleData = Cookies.get("roles") ?? "";
  //   const name = Cookies.get("name");
  //   const roles = roleData && JSON.parse(roleData);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [listData, setListData] = useState("");
  const [deleteId, setDeleteId] = useState();
  const [isRefresh, setIsRefresh] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchData, setSearchData] = useState("");
  console.log("listData", listData);

  useEffect(() => {
    getAllCategories();
  }, [page, searchData, isRefresh]);
  const getAllCategories = async () => {
    setIsLoading(true);
    let categories = await getCategory(page, searchData);
    if (!categories?.resData?.message) {
      setListData(categories?.resData);
      setIsLoading(false);
      return false;
    } else {
      toast.error(categories?.message);
      return false;
    }
  };

  const searchInputChange = (e) => {
    setSearchData(e);
  };
  const handlePageChange = (newPage) => {
    console.log(newPage);
    setPage(newPage);
  };
  const handleDelete = async () => {
    try {
      const res = await deleteCategory(deleteId);
      console.log("delete response", res);
      if (res.resData.message == "Category deleted successfully") {
        toast.success("Category deleted successfully");
        setIsPopupOpen(false); // Close the modal
        getAllCategories(); // Refresh the product list
      } else {
        toast.error(res?.message || "Error deleting category");
      }
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const handleCancel = () => {
    setDeleteId("");
    setIsPopupOpen(false);
  };
  const deleteCategoryModal = async (id) => {
    setDeleteId(id);
    setIsPopupOpen(true);
  };

  const toggleChange = async (id, isActive) => {
    console.log("toggle change id", id);
    const payload = {
      IsActive: !isActive,
    };
    let categories = await updateCategory(payload, id);
    console.log("toggle Categories", categories);
    if (!categories?.resData?.message) {
      setIsRefresh((prev) => prev + 1);
      return false;
    } else {
      toast.error(categories?.message);
      return false;
    }
  };

  return (
    <section>
      {isLoading &&    <SpinnerComp/>  }
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <h1 className="text-2xl text-black-600 underline mb-3 font-bold">
          Categories
        </h1>
        <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
          <div>
            <Link href={"/admin/categories/addCategory"}>
              {" "}
              <button
                className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                type="button"
              >
                + Add Categories
              </button>
            </Link>
          </div>
          <div>
              <SearchInput setSearchData={searchInputChange} />
            </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Category Name
              </th>
              <th scope="col" className="px-6 py-3">
                Created Date
              </th>
              <th scope="col" className="px-6 py-3">
                Modified Date
              </th>
      
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
          {listData?.categories?.length > 0 && (
              listData?.categories?.map((item, index) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4">{item?.Name}</td>
                  <td className="px-6 py-4">{item?.createdAt?.slice(0, 10)}</td>
                  <td className="px-6 py-4">{item?.updatedAt?.slice(0, 10)}</td>
  
                  {/* <td className="px-6 py-4 text-blue-600 dark:text-blue-500">
                      <i
                        className={` ${
                          item?.IsEnabled
                            ? "bi bi-hand-thumbs-up-fill text-green-600	"
                            : "bi bi-hand-thumbs-down-fill text-red-500"
                        } `}
                        style={{ fontSize: "24px" }}
                      ></i>
                    </td>
                
                  {roles.includes("Admin") && (
                    <td className="px-6 py-4 text-blue-600 dark:text-blue-500">
                      <i
                        className={` ${
                          item.IsFeatured
                            ? "bi bi-hand-thumbs-up-fill text-green-600	"
                            : "bi bi-hand-thumbs-down-fill text-red-500"
                        } `}
                        style={{ fontSize: "24px" }}
                      ></i>
                    </td>
                  )}
                  {roles.includes("Developer") && (
                    <td className="px-6 py-4 text-black-600 dark:text-black-500 ">
                      { item?.IsEnabled ? (<span>Completed</span> ) :<span>Pending</span>}
                   
                  </td>
                  )} */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                    {item?.IsActive ? (
                        <Link
                        href={`/admin/categories/updateCategory/${item.CategoryId}`}
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          <i
                            className="bi bi-pencil-square"
                            style={{ fontSize: "1.5em" }}
                          ></i>
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        >
                          <i
                            className="bi bi-pencil-square"
                            style={{ fontSize: "1.5em" }}
                          ></i>
                        </button>
                      )}
  
                      {/* <Link
                        href="#"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        <div className="flex items-center space-x-2">
                          <label className="inline-flex items-center mb-0.5 cursor-pointer">
                            <input
                              type="checkbox"
                              onChange={() =>
                                toggleChange(item?.CategoryId, item?.IsActive)
                              }
                               checked={item?.IsActive}
                            />
                          </label>
                        </div>
                      </Link> */}
  
                      <Switch
                        onChange={() =>
                          toggleChange(item?.CategoryId, item?.IsActive)
                        }
                        checked={item?.IsActive}
                      />
  
                      <Link
                        href="#"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        <i
                          onClick={() => deleteCategoryModal(item.CategoryId)}
                          className="bi bi-trash-fill"
                          style={{ color: "red", fontSize: "1.5em" }}
                        ></i>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
          )}

          
          </tbody>
        </table>
        {listData?.categories?.length === 0 && (

          <p className="text-center text-2xl font-bold text-gray-500">No data found</p>)}
      </div>

      <div className="mt-4">
        <ListPagination
          data={listData}
          pageNo={handlePageChange}
          pageVal={page}
        />
      </div>

      <DeleteModal
        isOpen={isPopupOpen}
        title="Are you sure you want to delete this Category ?"
        confirmLabel="Yes, I'm sure"
        cancelLabel="No, cancel"
        onConfirm={handleDelete}
        onCancel={handleCancel}
      />
    </section>
  );
}
