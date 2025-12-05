"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import SpinnerComp from "@/components/common/spinner";
import SearchInput from "@/components/common/searchDebounceInput";
import ListPagination from "@/components/common/pagination";
import DeleteModal from "@/components/common/deleteModal";
import CouponFilterModal from "@/components/common/couponFilterModal";
import {
  couponMasterGetAll,
  deleteDownloadFile,
} from "@/apiFunction/mastercoupons/masterapi";
import Switch from "react-switch";
import { updateCoupon } from "@/apiFunction/couponApi/couponApi";
import { getCategory } from "@/apiFunction/categoryApi/categoryApi";
import { getCompany } from "@/apiFunction/companyApi/companyApi";
import { getProduct } from "@/apiFunction/productApi/productApi";
import { getUser } from "@/apiFunction/userApi/userApi";
import { VIEW_PDF_URL } from "@/utils/constant";

const CouponsSection = ({ params }) => {
  const [searchData, setSearchData] = useState("");
  const [listData, setListData] = useState({ coupons: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageData, setPageData] = useState([]);
  const [qrCodes, setQrCodes] = useState([]); // Store generated QR codes here
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [filterModalvalue, setFilterModalValue] = useState(false);
  const [userData, setUserData] = useState(false);
  const [productList, setProductList] = useState(false);
  const [isRefresh, setIsRefresh] = useState(0);
  const [deleteId, setDeleteId] = useState();
  const [isdeleted, setIsDeleted] = useState(0);
  const [payLoad, setPayLoad] = useState({
    categoryIds: [],
    companyIds: [],
    productCode: params?.searchParams?.productCode
      ? params?.searchParams?.productCode
      : "",
    productName: "",
    fromDate: "",
    toDate: "",
    fromExpiryDate: "",
    toExpiryDate: "",
    sortOrder: "DESC",
    couponMasterId: params?.params?.id,
  });

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const enquiryType = (pageValue) => {
    setPageSize(pageValue);

    setIsDropdownOpen(false);
  };

  useEffect(() => {
    getAllProducts();
    getAllCategories();
    getAllCompanies();
    getAllUsers();
  }, [page, searchData, isRefresh, pageSize,isdeleted]);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        setIsLoading(true);
  
        const products = await couponMasterGetAll(
          page,
          searchData,
          payLoad,
          pageSize
        );
  
        if (products?.resData?.coupons) {
          setListData(products.resData);
          setPageData(products.resData);
        } else {
          toast.error(products?.message || "Error: No coupons data found.");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("An error occurred while fetching products");
      } finally {
        setIsLoading(false);
      }
    };
  
    getAllProducts();
  }, [page, searchData, pageSize, isdeleted]);

  const searchInputChange = (e) => {
    setSearchData(e);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const openFilterModal = async () => {
    setFilterModalValue(true);
    //console.log("filter")
  };

  const closeFilterModal = async () => {
    setFilterModalValue(false);
  };

  const handleDelete = async () => {
    const res = await deleteDownloadFile(deleteId);
   

    if (res.resData.success) {
      toast.success("Coupon deleted successfully");
      setIsPopupOpen(false); // Close the modal
      setIsDeleted((prev) => prev + 1);
    } else {
      toast.error(res?.message || "Error deleting coupon");
    }
  };

  const handleCancel = () => {
    setDeleteId("");
    setIsPopupOpen(false);
  };

  const deleteCouponModal = async (id) => {
    setDeleteId(id);
    setIsPopupOpen(true);
  };

  const getAllUsers = async () => {
    //const roleId = 2;
    let users = await getUser(page, searchData);
    //console.log("User data", users)
    if (!users?.resData?.message) {
      setUserData(users?.resData);
      return false;
    } else {
      toast.error(users?.message);
      return false;
    }
  };

  const getAllProducts = async () => {
    let products = await getProduct(page, searchData, payLoad);
    if (!products?.resData?.message) {
      setProductList(products?.resData);
      return false;
    } else {
      toast.error(products?.message);
      return false;
    }
  };

  const getAllCompanies = async () => {
    let companies = await getCompany(page, searchData);
    if (!companies?.resData?.message) {
      setCompanyList(companies?.resData);
      return false;
    } else {
      toast.error(companies?.message);
      return false;
    }
  };

  const getAllCategories = async () => {
    let categories = await getCategory(page, searchData);
    if (!categories?.resData?.message) {
      setCategoryList(categories?.resData);
      return false;
    } else {
      toast.error(categories?.message);
      return false;
    }
  };

  const downloadCouponFile = (fileName) => {
    const fileUrl = `${VIEW_PDF_URL}/${fileName}`;
    window.open(fileUrl, "_blank");
  };

  return (
    <>
      <section>
        {isLoading && <SpinnerComp />}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <h1 className="text-2xl text-black-600 underline mb-3 font-bold">
            Coupons Master
          </h1>
          <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
            {Object.keys(params?.searchParams || {}).length === 0 && (
              <div>
                <Link href={"/admin/coupon/addCoupon"}>
                  <button
                    className="py-2.5 px-5 me-2 mt-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    type="button"
                  >
                    + Generate Coupons
                  </button>
                </Link>
              </div>
            )}

            <div className="flex">
              {/* <i
                className="bi bi-funnel mt-2 mr-2 font-medium text-2xl"
                onClick={openFilterModal}
              ></i> */}
              <SearchInput setSearchData={searchInputChange} />
            </div>
          </div>

          <div className="couponTable">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Product Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Company Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Created Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Expiry Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {listData?.coupons?.length > 0 ? (
                  listData.coupons.map((item, index) => (
                    <tr
                      key={item.CouponId}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 py-4">{item.Product?.Name}</td>
                      <td className="px-6 py-4">
                        {item.Product?.Company?.Name}
                      </td>
                      <td className="px-6 py-4">{item.Quantity}</td>
                      <td className="px-6 py-4">{item.Amount}</td>
                      <td className="px-6 py-4">
                        {item.createdAt?.slice(0, 10)}
                      </td>
                      <td className="px-6 py-4">
                        {item.ExpiryDateTime?.slice(0, 10)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {/* <Link
                            href={`/admin/master/updatecoupons/${item.CouponMasterId}`}
                          >
                            <i
                              className="bi bi-pencil-square"
                              style={{ fontSize: "1.5em" }}
                            ></i>
                          </Link> */}

                          <div className="relative group">
                            <Link href={`/admin/coupon/${item.CouponMasterId}`}>
                              <i
                                className="bi bi-eye-fill"
                                style={{ color: "green", fontSize: "1.5em" }}
                              ></i>
                            </Link>

                            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                              View all Coupon
                            </div>
                          </div>

                          <div className="relative group">
                            {item.FileName == "" ? (
                              <div></div>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    downloadCouponFile(item.FileName)
                                  } // Wrap in an anonymous function
                                >
                                  <i
                                    className="bi bi-download"
                                    style={{ color: "blue", fontSize: "1.5em" }}
                                  ></i>
                                </button>

                                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                  Preview Coupon
                                </div>
                              </>
                            )}
                          </div>

                          <div className="relative group">
                            {item.FileName == "" ? (
                              <div></div>
                            ) : (
                              <>
                                <Link
                                  href="#"
                                  onClick={() =>
                                    deleteCouponModal(item.CouponMasterId)
                                  }
                                >
                                  <i
                                    className="bi bi-trash-fill"
                                    style={{ color: "red", fontSize: "1.5em" }}
                                  ></i>
                                </Link>

                                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                  Delete Pdf
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center py-4">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pageData && (
            <div className="mt-4">
              <ListPagination
                data={listData} // Using coupons data
                pageNo={handlePageChange}
                pageVal={page} // Current page number
              />
            </div>
          )}
        </div>

        <DeleteModal
          isOpen={isPopupOpen}
          title="Are you sure you want to delete this Coupon Pdf?"
          confirmLabel="Yes, I'm sure"
          cancelLabel="No, cancel"
          onConfirm={handleDelete}
          onCancel={handleCancel}
        />

        <CouponFilterModal
          modalValue={filterModalvalue}
          handleClose={closeFilterModal}
          userOptions={userData}
          companyOptions={companyList}
          categoryOptions={categoryList}
          productOptions={productList}
          {...{ payLoad, setPayLoad, setIsRefresh }}
        />
      </section>
    </>
  );
};

export default CouponsSection;
