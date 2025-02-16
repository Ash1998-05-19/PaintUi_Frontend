"use client";

import { Button, Drawer } from "flowbite-react";
import { useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";

export default function CouponFilterModal({
  modalValue,
  handleClose,
  userOptions,
  companyOptions,
  categoryOptions,
  productOptions,
  payLoad,
  setPayLoad,
  setIsRefresh,
}) {
  // console.log("modl value", modalValue);
  // console.log("handle close", handleClose);
  // console.log("CategoryOption", categoryOptions);
  // console.log("UserOption", userOptions);
  // console.log("Product Option", productOptions);
  const [isOpen, setIsOpen] = useState(modalValue.modalValue);
  const [selectProduct,setSelectProduct]=useState("")
  //console.log("open modal", isOpen);

  const [selectedOrder, setSelectedOrder] = useState({
    value: "descending",
    label: "Descending",
  });

  const orderOptions = [
    { value: "ASC", label: "Ascending" },
    { value: "DESC", label: "Descending" },
  ];

  const changeHandle = (type, data) => {
    if (type === "reedemed" && data) {
      setPayLoad((prev) => ({
        ...prev,
        reedemed:data,
        unReedemed:false
      }));
    }
    if (type === "unReedemed" && data) {
      setPayLoad((prev) => ({
        ...prev,
        reedemed:false,
        unReedemed:data
      }));
    }

    if (type === "productIds" && data) {
      setSelectProduct(data)
      const product = data; 
      setPayLoad((prev) => ({
        ...prev,
        productCode: product?.label.match(/Code: (\S+)\)/)?.[1] || "",
        productName: product?.label.split(" (Code:")[0] || "",
      }));
    } else {
      setPayLoad((prev) => ({
        ...prev,
        [type]: data,
      }));
    }
  };

  const handleDateChange = (type, data) => {
    setPayLoad((prev) => {
      return {
        ...prev,
        [type]: data,
      };
    });
  };

  const changeSortHandle = (type, data) => {
    setPayLoad((prev) => {
      return {
        ...prev,
        [type]: data.value,
      };
    });
  };

  const clearFilters = () => {
    setPayLoad({
      categoryIds: [],
      companyIds: [],
      redeemed: undefined, 
      fromDate: "",
      toDate: "",
      fromExpiryDate: "",
      toExpiryDate: "",
      masonsCoupon: [],
      retailersCoupon: [],
      sortOrder: "DESC",
    });
    setSelectProduct("")
    setIsRefresh((prev) => prev + 1);
    handleClose();
  };

 // console.log("FilterModalPayload", payLoad);

  return (
    <>
      <Drawer open={modalValue} onClose={handleClose} position="right">
        <Drawer.Header title="Filters" />
        <Drawer.Items>
          <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="mb-4">
              <label className="block text-gray-700">Select Company:</label>
              <Select
                onChange={(option) => changeHandle("companyIds", option)}
                options={companyOptions?.companies?.map((element) => ({
                  value: element?.CompanyId,
                  label: element?.Name,
                }))}
                value={payLoad?.companyIds}
                isMulti
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Select Category:</label>
              <Select
                onChange={(option) => changeHandle("categoryIds", option)}
                options={categoryOptions?.categories?.map((element) => ({
                  value: element?.CategoryId,
                  label: element?.Name,
                }))}
                value={payLoad?.categoryIds}
                isMulti
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Select Product:</label>
              <Select
                onChange={(option) => changeHandle("productIds", option)}
                options={productOptions?.products?.map((element) => ({
                  value: element?.ProductId,
                  label: `${element?.Name} (Code: ${element?.ProductCode})`,
                }))}
                value={selectProduct}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>
            <div className="flex justify-around mb-4">
              <div>
                <input
                  type="radio"
                  id="redeemed"
                  name="status"
                  value="reedemed"
                  checked={payLoad?.reedemed === true}
                  onChange={() => changeHandle("reedemed", true)}
                  className="mr-2"
                />
                <label htmlFor="redeemed">Redeemed</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="unredeemed"
                  name="status"
                  value="unReedemed"
                  checked={payLoad?.unReedemed === true}
                  onChange={() => changeHandle("unReedemed", true)}
                  className="mr-2"
                />
                <label htmlFor="unredeemed">Unredeemed</label>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">From Creation Date:</label>
              <input
                type="date"
                value={payLoad?.fromDate || ""}
                onChange={(e) => handleDateChange("fromDate", e.target.value)}
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">To Creation Date:</label>
              <input
                type="date"
                value={payLoad?.toDate || ""}
                onChange={(e) => handleDateChange("toDate", e.target.value)}
                className="w-full"
                disabled={!payLoad?.fromDate}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">From Expiry Date:</label>
              <input
                type="date"
                value={payLoad?.fromExpiryDate || ""}
                onChange={(e) =>
                  handleDateChange("fromExpiryDate", e.target.value)
                }
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">To Expiry Date:</label>
              <input
                type="date"
                value={payLoad?.toExpiryDate || ""}
                onChange={(e) =>
                  handleDateChange("toExpiryDate", e.target.value)
                }
                className="w-full"
                disabled={!payLoad?.fromExpiryDate}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">From Redeemed Date:</label>
              <input
                type="date"
                value={payLoad?.fromRedeemDate || ""}
                onChange={(e) =>
                  handleDateChange("fromRedeemDate", e.target.value)
                }
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">To Redeemed Date:</label>
              <input
                type="date"
                value={payLoad?.toRedeemDate  || ""}
                onChange={(e) =>
                  handleDateChange("toRedeemDate", e.target.value)
                }
                className="w-full"
                disabled={!payLoad?.fromRedeemDate}
              />
            </div>
            {/* <div className="mb-4">
              <label className="block text-gray-700">Mason Coupons:</label>
              <Select
                 onChange={(option) => changeHandle('masonsCoupon', option)}
                options={userOptions?.users
                  ?.filter((element) => element?.RoleId === 3)
                  ?.map((element) => ({
                    value: element?.UserId,
                    label: `${element?.FirstName}`,
                  }))}
                  value={payLoad?.masonsCoupon}
                  isMulti
                className="basic-single-select"
                classNamePrefix="select"
              />
            </div> */}
            <div className="mb-4">
              <label className="block text-gray-700">Retailer Coupons:</label>
              <Select
                onChange={(option) => changeHandle('retailersCoupon', option)}
                options={userOptions?.users
                  ?.filter((element) => element?.RoleId === 2)
                  ?.map((element) => ({
                    value: element?.UserId,
                    label: `${element?.FirstName}`,
                  }))}
                  value={payLoad?.retailersCoupon}
                  isMulti
                className="basic-single-select"
                classNamePrefix="select"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Order By:</label>
              <Select
                onChange={(option) => changeSortHandle("sortOrder", option)}
                options={orderOptions}
                className="basic-single-select"
                classNamePrefix="select"
              />
            </div>
            <div className="mb-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="bg-white text-black border border-black py-2 px-4 mr-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300"
              >
                Clear Filters
              </button>

              <button
                onClick={() => {
                  setIsRefresh((prev) => prev + 1);
                  handleClose();
                }}
                className="bg-black text-white py-2 px-4 mr-2 rounded hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </Drawer.Items>
      </Drawer>
    </>
  );
}
