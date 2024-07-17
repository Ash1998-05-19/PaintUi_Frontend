
"use client";

import { Button, Drawer } from "flowbite-react";
import { useState } from "react";
import Select from 'react-select';

export default function FilterModal({modalValue, handleClose, companyOptions, categoryOptions, productOptions, payLoad, setPayLoad, setIsRefresh}) {
    console.log("modl value", modalValue)
    console.log("handle close",handleClose)
    console.log("CategoryOption", categoryOptions)
  const [isOpen, setIsOpen ] = useState(modalValue.modalValue);
console.log("open modal", isOpen)

const [selectedOrder, setSelectedOrder] = useState({ value: 'descending', label: 'Descending' });



  const sortByOptions = [
    { value: 'Name', label: 'Name' },
    { value: 'Price', label: 'Price' },
    { value: 'createdAt', label: 'Created Date' },
  ];

  const orderOptions = [
    { value: 'ASC', label: 'Ascending' },
    { value: 'DESC', label: 'Descending' },
  ];

  const changeHandle = (type,data) => {
    setPayLoad( prev =>  {
    return {
    ...prev,
    [type]:data
    }
     }
    )
    }

    const changeSortHandle = (type,data) => {
      setPayLoad( prev =>  {
      return {
      ...prev,
      [type]:data.value
      }
       }
      )
      }

      const clearFilters = () => {
        setPayLoad({
          categoryIds: [],
          companyIds: [],
          productIds: [],
          sortBy: 'createdAt',
          sortOrder: 'DESC',
        });
        setIsRefresh(prev => prev + 1);
        handleClose();
      };

      console.log("FilterModalPayload", payLoad);
  

  return (
    <>
     
      <Drawer open={modalValue} onClose={handleClose} position="right">
        <Drawer.Header title="Filters" />
        <Drawer.Items>
        <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="mb-4">
              <label className="block text-gray-700" >Select Company:</label>
              <Select
               onChange = { (option) => changeHandle("companyIds",option)}
                options={companyOptions?.companies?.map((element) => ({
                  value: element?.CompanyId,
                  label: element?.Name,
                }))}
                value = {payLoad?.companyIds}
                isMulti
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Select Category:</label>
              <Select
              onChange = { (option) => changeHandle("categoryIds",option)}
              options={categoryOptions?.categories?.map((element) => ({
                value: element?.CategoryId,
                label: element?.Name,
              }))}
              value = {payLoad?.categoryIds}
                isMulti
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Select Product:</label>
              <Select
              onChange = { (option) => changeHandle("productIds",option)}
                options={productOptions?.products?.map((element) => ({
                  value: element?.ProductId,
                  label: element?.Name,
                }))}
                value = {payLoad?.productIds}
                isMulti
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Sort By:</label>
              <Select
              onChange = { (option) => changeSortHandle("sortBy",option)}
             
                options={sortByOptions}
                className="basic-single-select"
                classNamePrefix="select"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Order By:</label>
              <Select
              onChange = { (option) => changeSortHandle("sortOrder",option)}
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
                  setIsRefresh(prev => prev + 1);
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


