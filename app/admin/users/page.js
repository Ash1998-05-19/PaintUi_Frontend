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
import SearchInput from "@/components/common/searchDebounceInput";
import SpinnerComp from "@/components/common/spinner";
import { UserDetailPopover } from "@/components/common/userDetailPopover";
import DateRange from "@/components/common/dateRange";
//import Cookies from "js-cookie";
export default function User(params) {
  //   const roleData = Cookies.get("roles") ?? "";
  //   const name = Cookies.get("name");
  //   const roles = roleData && JSON.parse(roleData);
  console.log("params data of user", params)

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [listData, setListData] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [isRefresh, setIsRefresh] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchData, setSearchData] = useState("");
  const [openUserModal, setOpenUserModal] = useState(false);
  const [modalUserId, setModalUserId] = useState("");
  const [userType, setUserType] = useState(params.searchParams.Type?params.searchParams.Type:"Retailer");
  console.log("listData", listData);

  useEffect(() => {
    getAllUsers();
  }, [page, searchData, isRefresh, userType, fromDate, toDate]);
  const getAllUsers = async () => {
    setIsLoading(true);
    console.log("userType", userType);
    let users = await getUser(page, searchData, userType, fromDate, toDate);
    if (!users?.resData?.message) {
      setListData(users?.resData);
      setIsLoading(false);
      return false;
    } else {
      setIsLoading(false);
      toast.error(users?.message);
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

  const OpenUserModal = (id) => {
    setOpenUserModal(true);
    setModalUserId(id);
  };

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
      {isLoading && <SpinnerComp />}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <h1 className="text-2xl text-black-600 underline mb-3 font-bold">
          Users
        </h1>
        <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
          <div>
            {userType != "Mason" && (
              <Link href={"/admin/users/addUser"}>
                {" "}
                <button
                  className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  type="button"
                >
                  + Add Retailer
                </button>
              </Link>
            )}
          </div>
          <DateRange
          setFromDate={setFromDate}
          setToDate={setToDate}
          startDate={fromDate}
          endDate={toDate}
        />
          <div>
            <SearchInput setSearchData={searchInputChange} />
          </div>
        </div>

        <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
          <ul
            className="flex flex-wrap -mb-px text-sm font-medium text-center"
            id="default-styled-tab"
            data-tabs-toggle="#default-styled-tab-content"
            data-tabs-active-classNamees="text-purple-600 hover:text-purple-600 dark:text-purple-500 dark:hover:text-purple-500 border-purple-600 dark:border-purple-500"
            data-tabs-inactive-classNamees="dark:border-transparent text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300"
            role="tablist"
          >
            <li className="me-2" role="presentation">
              <button
                onClick={() => setUserType("Retailer")}
                className={`${
                  userType === "Retailer" ? "text-blue-700" : ""
                } inline-block p-4 border-b-2 rounded-t-lg`}
                id="profile-styled-tab"
                data-tabs-target="#styled-profile"
                type="button"
                role="tab"
                aria-controls="profile"
                aria-selected={userType === "Retailer"}
              >
                Retailer
              </button>
            </li>
            <li className="me-2" role="presentation">
              <button
                onClick={() => setUserType("Mason")}
                className={`${
                  userType === "Mason" ? "text-blue-700" : ""
                } inline-block p-4 border-b-2 rounded-t-lg`}
                id="dashboard-styled-tab"
                data-tabs-target="#styled-dashboard"
                type="button"
                role="tab"
                aria-controls="dashboard"
                aria-selected={userType === "Mason"}
              >
                Mason
              </button>
            </li>
          </ul>
        </div>
        <div id="default-styled-tab-content">
          <div
            className={`${
              userType === "Retailer" ? "" : "hidden"
            }  p-4 rounded-lg bg-gray-50 dark:bg-gray-800`}
            id="styled-profile"
            role="tabpanel"
            aria-labelledby="profile-tab"
          >
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                 
                  <th scope="col" className="px-6 py-3">
                    Mobile
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Mason Count
                  </th>
                  <th scope="col" className="px-6 py-3">
                    ShopName
                  </th>
                 
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {listData?.users?.length > 0 &&
                  listData?.users
                    ?.filter((item) => item?.Role?.Name !== "Admin")
                    ?.map((item, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td
                          className="px-6 py-4 cursor-pointer"
                          style={{
                            color:
                              item?.Role?.Name === "Retailer"
                                ? "blue"
                                : "inherit",
                          }}
                        >
                          {item?.Role?.Name === "Retailer" ? (
                            <UserDetailPopover userIdValue={item.UserId}>
                              <span>{item.FirstName}</span>
                            </UserDetailPopover>
                          ) : (
                            <span>{item.FirstName}</span>
                          )}
                        </td>

                       
                        <td className="px-6 py-4">{item?.Phone}</td>
                        <td className="px-6 py-4">{item?.Email || "-"}</td>
                        <td className="px-6 py-4">{item?.masonCount}</td>
                        <td className="px-6 py-4">{item?.ShopName || "-"}</td>
                    
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
                              onChange={() =>
                                toggleChange(item?.UserId, item?.IsActive)
                              }
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
          <div
            className={`${
              userType === "Mason" ? "" : "hidden"
            }  p-4 rounded-lg bg-gray-50 dark:bg-gray-800`}
            id="styled-dashboard"
            role="tabpanel"
            aria-labelledby="dashboard-tab"
          >
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
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
                {listData?.users?.length > 0 &&
                  listData?.users
                    ?.filter((item) => item?.Role?.Name !== "Admin")
                    ?.map((item, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td
                          className="px-6 py-4 cursor-pointer"
                          style={{
                            color:
                              item?.Role?.Name === "Retailer"
                                ? "blue"
                                : "inherit",
                          }}
                        >
                          {item?.Role?.Name === "Retailer" ? (
                            <UserDetailPopover userIdValue={item.UserId}>
                              <span>{item.FirstName}</span>
                            </UserDetailPopover>
                          ) : (
                            <span>{item.FirstName}</span>
                          )}
                        </td>

                      
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
                              onChange={() =>
                                toggleChange(item?.UserId, item?.IsActive)
                              }
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
        </div>

        {listData?.users?.length === 0 && (
          <p className="text-center text-2xl font-bold text-gray-500">
            No data found
          </p>
        )}
      </div>
      {listData?.users?.length > 0 && (
        <div className="mt-4">
          <ListPagination
            data={listData}
            pageNo={handlePageChange}
            pageVal={page}
          />
        </div>
      )}

      <DeleteModal
        isOpen={isPopupOpen}
        title="Are you sure you want to delete this User ?"
        confirmLabel="Yes, I'm sure"
        cancelLabel="No, cancel"
        onConfirm={handleDelete}
        onCancel={handleCancel}
      />
      <UserDetailModal
        modalValue={openUserModal}
        setOpenUserModal={setOpenUserModal}
        userIdValue={modalUserId}
      />
    </section>
  );
}
