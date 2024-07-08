"use client";

import Link from "next/link";
import Switch from "react-switch";
//import Spinner from "@/components/common/loading";
//import Pagination from "@/components/common/pagination";
//import Popup from "@/components/common/popup";
import { useEffect, useState } from "react";
import { getUser, updateUser } from "@/apiFunction/userApi/userApi";
import { deleteUser } from "@/apiFunction/userApi/userApi";
import { ToastContainer, toast } from "react-toastify";
import DeleteModal from "@/components/common/deleteModal";
import ListPagination from "@/components/common/pagination";
import { UserDetailModal } from "@/components/common/userDetailModal";
//import Cookies from "js-cookie";
export default function User() {
//   const roleData = Cookies.get("roles") ?? "";
//   const name = Cookies.get("name");
//   const roles = roleData && JSON.parse(roleData);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [listData, setListData] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [isRefresh, setIsRefresh] = useState(0);
  const [page, setPage] = useState(1);
  const [searchData, setSearchData] = useState("");
  const [openUserModal, setOpenUserModal] = useState(false);
  const [modalUserId, setModalUserId] = useState("");
  console.log("listData", listData);

  useEffect(() => {
    getAllUsers();
  }, [page, searchData, isRefresh]);
  const getAllUsers = async () => {
    let users = await getUser(page, searchData);
    if (!users?.resData?.message) {
      setListData(users?.resData);
      return false;
    } else {
      toast.error(users?.message);
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
      const res = await deleteUser(deleteId);
      console.log("delete response", res);
      if (res.resData.message == "User deleted successfully") {
        toast.success("User deleted successfully");
        setIsPopupOpen(false); // Close the modal
        getAllUsers();
      } else {
        toast.error(res?.message || "Error deleting user");
      }
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const toggleChange = async (id, isActive) => {
    console.log("toggle change id", id);
    const payload = {
      IsActive: !isActive,
    };
    let users = await updateUser(payload, id);
    console.log("toggle Users", users);
    if (!users?.resData?.message) {
      setIsRefresh((prev) => prev + 1);
      return false;
    } else {
      toast.error(users?.message);
      return false;
    }
  };

  const OpenUserModal = (id) =>{
    setOpenUserModal (true);
    setModalUserId(id);
  }

  const handleCancel = () => {
    setDeleteId("");
    setIsPopupOpen(false);
  };
  const deleteUserModal = async (id) => {
    setDeleteId(id);
    setIsPopupOpen(true);
  };


  return (
    <section>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <h1 className="text-2xl text-black-600 underline mb-3 font-bold">
          Users
        </h1>
        <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
          <div>
            <Link href={"/admin/users/addUser"}>
              {" "}
              <button
                className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                type="button"
              >
                + Add Retailer
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
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Type
              </th>
              <th scope="col" className="px-6 py-3">
                Mobile
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
        

              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {listData?.users?.map((item, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td
                  className="px-6 py-4 cursor-pointer"
                  onClick={() =>
                    item?.Role?.Name === "Retailer" && OpenUserModal(item.UserId)
                  }
                  style={{
                    color: item?.Role?.Name === "Retailer" ? "blue" : "inherit",
                  }}
                >
                  {item?.FirstName}
                </td>
                <td className="px-6 py-4">{item?.Role?.Name}</td>
                <td className="px-6 py-4">{item?.Phone}</td>
                <td className="px-6 py-4">{item?.Email}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {item?.IsActive ? (
                      <Link
                        href={`/admin/users/updateUser/${item.UserId}`}
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

                    <Switch
                      onChange={() => toggleChange(item?.UserId, item?.IsActive)}
                      checked={item?.IsActive}
                    />

                    <Link
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      <i
                        onClick={() => deleteUserModal(item.UserId)}
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
      <div className="mt-4">
        <ListPagination
          data={listData}
          pageNo={handlePageChange}
          pageVal={page}
        />
      </div>
      <DeleteModal
        isOpen={isPopupOpen}
        title="Are you sure you want to delete this User ?"
        confirmLabel="Yes, I'm sure"
        cancelLabel="No, cancel"
        onConfirm={handleDelete}
        onCancel={handleCancel}
      />
      <UserDetailModal
      modalValue = {openUserModal}
      setOpenUserModal = {setOpenUserModal}
      userIdValue = {modalUserId}
      />
    </section>
  );
}
