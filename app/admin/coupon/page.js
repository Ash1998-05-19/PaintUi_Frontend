"use client";

import Link from "next/link";
//import Spinner from "@/components/common/loading";
//import Pagination from "@/components/common/pagination";
//import Popup from "@/components/common/popup";
import { useEffect, useRef, useState } from "react";
import Switch from "react-switch";
import html2canvas from "html2canvas"; // Import html2canvas for rendering HTML to canvas
import style from "./pdf.module.css";
import {
  getCoupon,
  updateCouponPaidStatus,
} from "@/apiFunction/couponApi/couponApi";
import { deleteCoupon } from "@/apiFunction/couponApi/couponApi";
import { updateCoupon } from "@/apiFunction/couponApi/couponApi";
import { getCategory } from "@/apiFunction/categoryApi/categoryApi";
import { getCompany } from "@/apiFunction/companyApi/companyApi";
import { getProduct } from "@/apiFunction/productApi/productApi";
import { getUser } from "@/apiFunction/userApi/userApi";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { ToastContainer, toast } from "react-toastify";
import ListPagination from "@/components/common/pagination";
import DeleteModal from "@/components/common/deleteModal";
import FilterModal from "@/components/common/filterModal";
import CouponFilterModal from "@/components/common/couponFilterModal";
import SpinnerComp from "@/components/common/spinner";
import SearchInput from "@/components/common/searchDebounceInput";
//import Cookies from "js-cookie";
import "flowbite/dist/flowbite.min.css";
import GeneratePDF from "@/components/common/PdfConvert";
export default function Coupon(params) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [filterModalvalue, setFilterModalValue] = useState(false);
  const [listData, setListData] = useState(false);
  const [userData, setUserData] = useState(false);
  const [productList, setProductList] = useState(false);
  const [payLoad, setPayLoad] = useState({
    categoryIds: [],
    companyIds: [],
    productCode: params?.searchParams?.productCode
      ? params?.searchParams?.productCode
      : "",
    productName: "",
    reedemed: params?.searchParams?.Redeemed ? true : false,
    flag: params?.searchParams?.flag ? true : false,
    unReedemed: false,
    fromDate: "",
    toDate: "",
    fromExpiryDate: "",
    toExpiryDate: "",
    masonsCoupon: [],
    retailersCoupon: params?.searchParams?.id ? [params?.searchParams?.id] : [],
    sortOrder: "DESC",
  });
  const [isRefresh, setIsRefresh] = useState(0);
  const [deleteId, setDeleteId] = useState();
  const [couponCodes, setCouponCodes] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [isdeleted, setIsDeleted] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState("");
  //console.log("listData", listData);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const inquiryItem = [10, 20, 30, 40, 50];
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false);
    }
  };
  useEffect(() => {
    // Attach event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    initFlowbite(); // Call initCarousels() when component mounts
  }, []);

  useEffect(() => {
    // console.log("params data", params?.searchParams?.id)
    // if(payLoad?.retailersCoupon?.length>0 && params?.searchParams?.id != undefined){
    //   console.log("Get all coupon function called")
    //   getAllCoupons(payLoad);
    // }
    // if(!params?.searchParams?.id){
    //   console.log("coupon function called without params")
    //   getAllCoupons(payLoad);
    // }
    getAllCoupons(payLoad);
    getAllProducts();
    getAllCategories();
    getAllCompanies();
    getAllUsers();
  }, [page, searchData, isRefresh, params, isdeleted, pageSize]);

  //console.log("Outside get all coupon payload data", payLoad)

  const [coupons, setCoupons] = useState([]);
  const [selectedCoupons, setSelectedCoupons] = useState([]);
  const [masterCheckbox, setMasterCheckbox] = useState(false);

  // Get Coupons including checking redeem date
  const getAllCoupons = async (payLoadData) => {
    setIsLoading(true);
    let coupons = await getCoupon(page, searchData, payLoadData, pageSize);
    if (!coupons?.resData?.message) {
      setListData(coupons?.resData);
      setCoupons(coupons?.resData?.coupons);
      setIsLoading(false);
      return false;
    } else {
      toast.error(coupons?.message);
      setIsLoading(false);
      return false;
    }
  };

  const hasPaidCoupons =
    coupons &&
    coupons.length > 0 &&
    coupons.some((coupon) => coupon.Paid == true);

  const [isChecked, setIsChecked] = useState(hasPaidCoupons ? true : false);

  const handleMasterCheckboxChange = (e) => {
    const isCheckedIn = e.target.checked;
    setIsChecked(isCheckedIn);
    setMasterCheckbox(!isChecked);

    if (isChecked) {
      const couponsWithRedeemDate = coupons.filter(
        (coupon) => coupon.RedeemDateTime
      );
      setSelectedCoupons(
        couponsWithRedeemDate.map((coupon) => coupon.CouponId)
      );
    } else {
      const couponsWithRedeemDate = coupons.filter(
        (coupon) => coupon.RedeemDateTime
      );
      setSelectedCoupons(
        couponsWithRedeemDate.map((coupon) => coupon.CouponId)
      );
    }
  };

  // Update Paid status for selected coupons
  const handleUpdateStatus = async () => {
    setIsLoading(true);

    const data = {
      couponIds: selectedCoupons,
      Paid: masterCheckbox,
    };


    const response = await updateCouponPaidStatus(data);

    if (response?.resData.success) {
      toast.success(response?.resData.message);
      setIsLoading(false);
      setIsRefresh((prev) => prev + 1);
    } else {
      toast.error("Failed to update coupon statuses");
      setIsLoading(false);
      setIsRefresh((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const couponsWithRedeemDate = coupons.filter(
      (coupon) => coupon.RedeemDateTime
    );
    const allSelected = couponsWithRedeemDate.every((coupon) =>
      selectedCoupons.includes(coupon.CouponId)
    );
    setMasterCheckbox(allSelected);
  }, [selectedCoupons, coupons]);

  useEffect(() => {
    if (selectedCoupons.length > 0) {
      handleUpdateStatus();
    }
  }, [selectedCoupons]);

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

  const searchInputChange = (e) => {
    setSearchData(e);
  };
  const handlePageChange = (newPage) => {
    // console.log(newPage);
    setPage(newPage);
  };

  const openFilterModal = async () => {
    setFilterModalValue(true);
    //console.log("filter")
  };

  const closeFilterModal = async () => {
    setFilterModalValue(false);
  };

  const handleDelete = async () => {
    try {
      const res = await deleteCoupon(deleteId);
      //console.log("delete response", res)
      if (res.resData.message == "Coupon deleted successfully") {
        toast.success("Coupon deleted successfully");
        setIsPopupOpen(false); // Close the modal
        setIsDeleted((prev) => prev + 1);
      } else {
        toast.error(res?.message || "Error deleting coupon");
      }
    } catch (error) {
      toast.error("Failed to delete coupon");
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
  const updateCouponDetails = async (id, payload) => {
    // console.log("id", id);
    // console.log("payload", payload);
    let coupons = await updateCoupon(payload, id);
    // console.log("responseCoupon", coupons);
    if (!coupons?.message) {
      toast.success(coupons?.resData?.message);
      setIsRefresh((prev) => prev + 1);
      return false;
    } else {
      toast.error(coupons?.message);
      return false;
    }
  };
  const toggleChange = async (id, isActive) => {
    //console.log("toggle change id", id);
    // console.log("toggleChange run")
    const payload = {
      IsActive: !isActive,
    };
    updateCouponDetails(id, payload);
  };

  const enquiryType = (pageValue) => {
    setPageSize(pageValue);

    setIsDropdownOpen(false);
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleCheckboxChange = (selectedId) => async (event) => {
    // console.log("handleCheckboxChange run")
    setIsLoading(true);
    const newValue = event.target.checked;
    const payload = {
      Paid: newValue,
    };
    const id = selectedId;
    updateCouponDetails(id, payload);
  };
  const contentToConvert = (
    <div>
      <h1>My Sample PDF</h1>
      <p>This is the content that will be converted to a PDF file.</p>
    </div>
  );
  const hasRedeemDateCoupons =
    coupons &&
    coupons.length > 0 &&
    coupons.some((coupon) => coupon.RedeemDateTime);

  const contentRef = useRef();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [qrCodes, setQrCodes] = useState([]); // Store generated QR codes

  // Generate QR codes for each coupon
  useEffect(() => {
    const generateQrCodes = async () => {
      const generatedQrCodes = await Promise.all(
        listData.coupons.map(async (coupon) => {
          try {
            const qrCode = await QRCode.toDataURL(coupon.CouponCode);
            return qrCode;
          } catch (error) {
            console.error(
              "Error generating QR Code for coupon:",
              coupon.CouponCode,
              error
            );
            return ""; // Return empty string if error occurs
          }
        })
      );
      setQrCodes(generatedQrCodes);
    };

    if (listData && listData.coupons) {
      generateQrCodes();
    }
  }, [listData]);

  // Check if all QR codes are loaded
  useEffect(() => {
    if (
      qrCodes.length === listData?.coupons?.length &&
      qrCodes.every((qr) => qr)
    ) {
      setIsImageLoaded(true); // Enable the button when all QR codes are loaded
    }
  }, [qrCodes, listData.coupons]);

  // Handle PDF generation for two coupons per page
  const handleDownload = async () => {
    setIsGenerating(true); // Set generating state to true

    // Temporarily make content visible and on-screen
    const contentDiv = document.getElementById("main");
    contentDiv.style.visibility = "visible"; // Temporarily make it visible for PDF capture
    contentDiv.style.position = "relative"; // Ensure it is in normal position for rendering

    const pdf = new jsPDF("p", "pt", "a4");

    try {
      // Loop through each coupon, but two coupons per page
      for (let i = 0; i < listData.coupons.length; i += 2) {
        const coupon1 = listData.coupons[i];
        const coupon2 = listData.coupons[i + 1]; // Get the second coupon (if available)

        // Create references for the current coupon elements (i and i+1)
        const couponElement1 = contentRef.current.children[i];
        const couponElement2 = contentRef.current.children[i + 1];

        const canvas1 = await html2canvas(couponElement1, {
          scale: 1.5, // Lower resolution for smaller size
          useCORS: true, // Ensure external images like QR codes are loaded
        });

        const imgData1 = canvas1.toDataURL("image/jpeg", 0.7); // Use JPEG with compression (0.7 is 70% quality)

        // Add the first coupon to the PDF
        if (i > 0) {
          pdf.addPage();
        }

        const canvas2 = couponElement2
          ? await html2canvas(couponElement2, {
              scale: 1.5, // Lower resolution
              useCORS: true,
            })
          : null;

        const imgData2 = canvas2 ? canvas2.toDataURL("image/jpeg", 0.8) : null; // Compress the second image

        // Add the first coupon (top half of the page)
        pdf.addImage(imgData1, "JPEG", 0, 0, 595, 360); // Adjusted for the upper half of the page (421px height)

        if (imgData2) {
          // Add the second coupon (bottom half of the page)
          pdf.addImage(imgData2, "JPEG", 0, 421, 595, 360); // Adjusted for the lower half of the page
        }
      }

      // Save the generated PDF
      pdf.save("coupons.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false); // Reset generating state
      contentDiv.style.visibility = "hidden"; // Hide the content again after the PDF is generated
    }
  };

  return (
    <>
      <section>
        {isLoading && <SpinnerComp />}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <h1 className="text-2xl text-black-600 underline mb-3 font-bold">
            Coupons
          </h1>
          <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
            {Object.keys(params?.searchParams || {}).length === 0 ? (
              <>
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
              </>
            ) : (
              <>
                <div></div> <div></div>
              </>
            )}
            {listData?.coupons?.length != 0 && (
              // <button
              //   onClick={generatePDF}
              //   className="py-2.5 px-5 me-2 mb-2 mr-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              //   type="button"
              // >
              //   Generate QR
              // </button>
              <button
                className="py-2.5 px-5 me-2 mt-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                type="button"
                onClick={handleDownload}
                disabled={!isImageLoaded}
              >
                Generate QR
              </button>
            )}
            {listData?.coupons?.length != 0 && (
              <li className="me-2 list-none relative">
                {" "}
                {/* Ensure relative positioning */}
                <button
                  ref={buttonRef}
                  id="dropdownPossessionButton"
                  onClick={toggleDropdown}
                  className="text-black bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-gray-100 focus:ring-4 focus:outline-none focus:ring-white-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-white-600 dark:hover:bg-white-700 dark:focus:ring-white-800"
                  type="button"
                >
                  Items per Page [{pageSize}]
                  <svg
                    className="w-2.5 h-2.5 ms-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>
                <div
                  ref={dropdownRef}
                  id="dropdownPossession"
                  className={`z-10 ${
                    isDropdownOpen ? "block" : "hidden"
                  } absolute top-full mt-2 bg-white divide-y divide-white rounded-lg shadow w-44 dark:bg-white`}
                >
                  <ul
                    className="p-2 text-sm text-gray-700 dark:text-gray-200 list-none"
                    aria-labelledby="dropdownPossessionButton"
                  >
                    {inquiryItem.map((item, index) => (
                      <li key={index} onClick={() => enquiryType(item)}>
                        <Link
                          href=""
                          className="block px-4 py-2 hover:bg-gray-200 hover:text-black dark:hover:bg-gray-600 dark:hover:text-gray-200"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            )}

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
          <div className="couponTable">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Coupon Code
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Product Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Created Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Expiry Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Redeemed Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Redeemed
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Category Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Company Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Redeemed By User
                  </th>
                  {/* <th scope="col" className="px-6 py-3">
                  Redeemed To User
                </th> */}
                  <th scope="col" className="px-6 py-3 flex">
                    Paid
                    {hasRedeemDateCoupons && (
                      <input
                        className="w-5 h-5 text-blue-600 ml-2 bg-gray-300 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none"
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleMasterCheckboxChange}
                      />
                    )}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {listData?.coupons?.length > 0 &&
                  listData?.coupons?.map((item, index) => (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-6 py-4">{item?.CouponCode}</td>
                      <td className="px-6 py-4 capitalize">
                        {item?.Product?.Name}
                      </td>
                      <td className="px-6 py-4">
                        {item?.createdAt?.slice(0, 10)}
                      </td>
                      <td className="px-6 py-4">
                        {item?.ExpiryDateTime?.slice(0, 10)}
                      </td>
                      <td className="px-6 py-4">
                        {item?.RedeemDateTime?.slice(0, 10) || "-"}
                      </td>
                      <td className="px-6 py-4">{item?.Amount}</td>
                      <td className="px-6 py-4">
                        {item?.RedeemByUser ? "Yes" : "No"}
                      </td>
                      <td className="px-6 py-4">
                        {item?.Product?.Category?.Name}
                      </td>
                      <td className="px-6 py-4">
                        {item?.Product?.Company?.Name}
                      </td>
                      <td className="px-6 py-4">
                        {item?.RedeemByUser?.FirstName || "-"}
                      </td>
                      {/* <td className="px-6 py-4">
                      {item?.RedeemToUser?.FirstName || "-"}
                    </td> */}
                      <td className="px-6 py-4">
                        {item?.RedeemByUser ? (
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={item.Paid}
                              onChange={handleCheckboxChange(item.CouponId)}
                              className="w-5 h-5 text-blue-600 bg-gray-300 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none"
                            />
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {item?.IsActive ? (
                            <Link
                              href={`/admin/coupon/updateCoupon/${item.CouponId}`}
                              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            >
                              <i
                                className="bi bi-pencil-square"
                                style={{ fontSize: "1.5em" }}
                              ></i>
                            </Link>
                          ) : (
                            <button
                              className="font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed"
                              disabled
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
                              toggleChange(item?.CouponId, item?.IsActive)
                            }
                             checked={item?.IsActive}
                          />
                        </label>
                      </div>
                    </Link> */}
                          <Switch
                            onChange={() =>
                              toggleChange(item?.CouponId, item?.IsActive)
                            }
                            checked={item?.IsActive}
                          />

                          <Link
                            href="#"
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                          >
                            <i
                              onClick={() => deleteCouponModal(item.CouponId)}
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
            {listData?.coupons?.length === 0 && (
              <h1 className="text-center text-3xl font-bold text-gray-500 mt-16">
                No data found
              </h1>
            )}
          </div>
        </div>
        {listData?.coupons?.length > 0 && (
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
          title="Are you sure you want to delete this Coupon ?"
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

      <>
        {/* Loading Screen */}
        {isGenerating && (
          <div className={`${style.loadingOverlay}`}>
            <div className={`${style.loadingSpinner}`}>Generating PDF...</div>
          </div>
        )}

        <div
          id="main"
          style={{
            visibility: "hidden",
            position: "absolute",
            left: "-9999px", // Move off-screen
          }}
        >
          <div id="rep1" ref={contentRef}>
            {listData.coupons?.length > 0 ? (
              listData.coupons.map((coupon, index) => (
                <div
                  key={coupon.CouponId}
                  className={`${style.bgColor} text-white mb-8 my-14 pb-2`}
                >
                  <div className="bg-white">
                    <img
                      src="/images/trubsond-logo-png.png"
                      alt="Logo"
                      width={150}
                      height={150}
                    />
                  </div>
                  <div className="flex justify-between px-6">
                    <div className="w-2/3 text-sm mr-4 mt-4 mb-2">
                      <h1 className="underline">प्रक्रिया:</h1>
                      <p className="text-justify">
                        अपना कूपन रिडीम करने के लिए अपने नज़दीकी ट्रूबॉन्ड
                        रिटेलर से संपर्क करें और तुरंत कूपन का भुगतान प्राप्त
                        करें।
                      </p>
                    </div>
                    <div className="py-5">
                      <h1 className="text-nowrap text-xl">
                        Coupon Code: {coupon.CouponCode}
                      </h1>
                    </div>
                  </div>
                  <div className="flex justify-between px-6 text-sm">
                    <div className="w-2/3">
                      <h2 className={`${style.underLineText}`}>
                        नियम और शर्ते &nbsp;:
                      </h2>
                      <ol>
                        <li className="flex">
                          <span className={`${style.dot}`}>&#x2022;</span>
                          <p>यह योजना केवल चुनिंदा उत्पादों पर ही उपलब्ध है।</p>
                        </li>
                        <li className="flex">
                          <span className={`${style.dot}`}>&#x2022;</span>
                          <p>
                            यह कूपन केवल अधिकृत डिस्ट्रीब्यूटर पर ही रिडीम किया
                            जा सकेगा।
                          </p>
                        </li>
                        <li className="flex">
                          <span className={`${style.dot}`}>&#x2022;</span>
                          <p>
                            एक QR कोड केवल एक ही बार स्कैन करने के लिए मान्य
                            होगा।
                          </p>
                        </li>
                        <li className="flex">
                          <span className={`${style.dot}`}>&#x2022;</span>
                          <p>इस कूपन को नकद राशि नहीं माना जा सकता।</p>
                        </li>
                        <li className="flex">
                          <span className={`${style.dot}`}>&#x2022;</span>
                          <p>कटे-फटे कूपन मान्य नहीं होंगे।</p>
                        </li>
                        <li className="flex">
                          <span className={`${style.dot}`}>&#x2022;</span>
                          <p>अन्य सभी सामान्य नियम और शर्तें लागू होंगी।</p>
                        </li>
                        <li className="flex">
                          <span className={`${style.dot}`}>&#x2022;</span>
                          <p>
                            इस कूपन को रिडीम करने की शर्तें कंपनी के पास
                            सुरक्षित हैं, और कंपनी इस योजना में परिवर्तन करने का
                            अधिकार रखती है।
                          </p>
                        </li>
                        <li className="flex">
                          <span className={`${style.dot}`}>&#x2022;</span>
                          <p>कंपनी का निर्णय ही सर्वमान्य होगा।</p>
                        </li>
                      </ol>
                    </div>
                    <div className="px-5">
                      {qrCodes[index] && (
                        <img
                          src={qrCodes[index]}
                          alt={`QR Code for ${coupon.CouponCode}`}
                          className="mt-4"
                        />
                      )}
                    </div>
                  </div>
                  <small className={`${style.smallText} px-6 pb-2`}>
                    *किसी भी सहायता के लिए हमारी हेल्पलाइन पर संपर्क करें - [
                    +91 79765 74376]*
                  </small>
                </div>
              ))
            ) : (
              <p>No coupons available</p>
            )}
          </div>
        </div>
      </>
    </>
  );
}
