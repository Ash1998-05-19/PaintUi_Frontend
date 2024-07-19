"use client";

import Link from "next/link";
import Switch from "react-switch";
import { ToggleSwitch } from "flowbite-react";
import { deleteProduct } from "@/apiFunction/productApi/productApi";
import { updateProduct } from "@/apiFunction/productApi/productApi";
import { useEffect, useState } from "react";
import { getCategory } from "@/apiFunction/categoryApi/categoryApi";
import { getCompany } from "@/apiFunction/companyApi/companyApi";
import { getProduct } from "@/apiFunction/productApi/productApi";
import ListPagination from "@/components/common/pagination";
import DeleteModal from "@/components/common/deleteModal";

import { ToastContainer, toast } from "react-toastify";
import FilterModal from "@/components/common/filterModal";
import SearchInput from "@/components/common/searchDebounceInput";
import SpinnerComp from "@/components/common/spinner";
//import Cookies from "js-cookie";

export default function Product(params) {
  //   const roleData = Cookies.get("roles") ?? "";
  //   const name = Cookies.get("name");
  //   const roles = roleData && JSON.parse(roleData);
  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(true);
  const [switch3, setSwitch3] = useState(true);

  const [categoryList, setCategoryList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [payLoad, setPayLoad] = useState({
    categoryIds: params?.searchParams?.categoryId ? [params?.searchParams?.categoryId]:[],
    companyIds: params?.searchParams?.companyId ? [params?.searchParams?.companyId]:[],
    productIds: [],
    sortBy: "createdAt",
    sortOrder: "DESC",
  });
  const [companyOptions, setCompanyOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [listData, setListData] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [isRefresh, setIsRefresh] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filterModalvalue, setFilterModalValue] = useState(false);
  const [searchData, setSearchData] = useState("");
  console.log("listData", listData);

  useEffect(() => {
    getAllProducts();
    getAllCategories();
    getAllCompanies();
  }, [page, searchData, params, isRefresh]);

  const getAllProducts = async () => {
    setIsLoading(true);
    let products = await getProduct(page, searchData, payLoad);
    console.log("product data", products);
    if (!products?.resData?.message) {
      setListData(products?.resData);
      setIsLoading(false);
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

  console.log("productPayload", payLoad);

  const searchInputChange = (e) => {
    setSearchData(e);
  };
  const handlePageChange = (newPage) => {
    console.log(newPage);
    setPage(newPage);
  };
  const handleDelete = async () => {
    try {
      const res = await deleteProduct(deleteId);
      console.log("delete response", res);
      if (res.resData.message == "Product deleted successfully") {
        toast.success("Product deleted successfully");
        setIsPopupOpen(false); // Close the modal
        getAllProducts(); // Refresh the product list
      } else {
        toast.error(res?.message || "Error deleting product");
      }
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleCancel = () => {
    setDeleteId("");
    setIsPopupOpen(false);
  };
  const deleteProductModal = async (id) => {
    setDeleteId(id);
    setIsPopupOpen(true);
  };

  const toggleChange = async (id, isActive) => {
    console.log("toggle change id", id);
    const payload = {
      IsActive: !isActive,
    };
    let products = await updateProduct(payload, id);
    console.log("toggleProduct", products);
    if (!products?.resData?.message) {
      if (products?.resData?.product?.IsActive === true) {
        toast.success("Product Activated successfully");
        setIsRefresh((prev) => prev + 1);
        return false;
      }
      if (products?.resData?.product?.IsActive === false) {
        toast.error("Product DeActivated successfully");
        setIsRefresh((prev) => prev + 1);
        return false;
      }
    } else {
      toast.error(products?.message);
      return false;
    }
  };

  const openFilterModal = async () => {
    setFilterModalValue(true);
    console.log("filter");
  };

  const closeFilterModal = async () => {
    setFilterModalValue(false);
  };

  console.log("filterModalValue", filterModalvalue);

  return (
    <section>
      {isLoading &&    <SpinnerComp/>  }
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <h1 className="text-2xl text-black-600 underline mb-3 font-bold">
          Products
        </h1>
        <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
          <div>
          {Object.keys(params?.searchParams || {}).length === 0  && (<>
            <Link href={"/admin/products/addProduct"}>
              {" "}
              <button
                className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                type="button"
              >
                + Add Products
              </button>
            </Link>
          </>)}
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
              <th scope="col" className="px-6 py-3">
                Product Name
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Category Name
              </th>
              <th scope="col" className="px-6 py-3">
                Company Name
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {listData?.products?.length > 0 &&
              listData?.products?.map((item, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                 <Link href={`/admin/coupon?productCode=${item?.ProductCode}`}>
                    <td className="px-6 py-4 text-blue-600 cursor-pointer hover:font-semibold capitalize">
                      {item?.Name}
                    </td>
                  </Link>
                  <td className="px-6 py-4">{item?.Price}</td>
                  <td className="px-6 py-4">{item?.Category?.Name}</td>
                  <td className="px-6 py-4">{item?.Company?.Name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {item?.IsActive ? (
                        <Link
                          href={`/admin/products/updateProduct/${item.ProductId}`}
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
                                toggleChange(item?.ProductId, item?.IsActive)
                              }
                              checked={item?.IsActive}
                            />
                          </label>
                        </div>
                      </Link> */}

                      <Switch
                        onChange={() =>
                          toggleChange(item?.ProductId, item?.IsActive)
                        }
                        checked={item?.IsActive}
                      />

                      <Link
                        href="#"
                        className="font-medium text-blue-600 dark:text-red-500 hover:underline"
                      >
                        <i
                          onClick={() => deleteProductModal(item.ProductId)}
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
        {listData?.products?.length === 0 && (
          <p className="text-center text-2xl font-bold text-gray-500">
            No data found
          </p>
        )}
      </div>
      {listData?.products?.length > 0 && (
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
        title="Are you sure you want to delete this Product ?"
        confirmLabel="Yes, I'm sure"
        cancelLabel="No, cancel"
        onConfirm={handleDelete}
        onCancel={handleCancel}
      />
      <FilterModal
        modalValue={filterModalvalue}
        handleClose={closeFilterModal}
        companyOptions={companyList}
        categoryOptions={categoryList}
        productOptions={listData}
        {...{ payLoad, setPayLoad, setIsRefresh }}
      />
    </section>
  );
}
