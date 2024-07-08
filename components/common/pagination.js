// 

import React, { useEffect } from "react";

const ListPagination = ({ data, pageNo, pageVal }) => {
  const totalPages = data?.totalPages;
  const currentPage = pageVal;

  useEffect(() => {
    // Check if the current page is greater than the total number of pages after deleting a record
    if (currentPage > totalPages && totalPages > 0) {
      // Navigate to the previous page
      pageNo(totalPages);
    }
  }, [currentPage, totalPages, pageNo]);

  // Calculate the starting and ending indexes of the pagination numbers
  let startPage, endPage;
  if (totalPages <= 5) {
    // Less than or equal to 5 pages
    startPage = 1;
    endPage = totalPages;
  } else {
    // More than 5 pages
    if (currentPage <= 3) {
      startPage = 1;
      endPage = 5;
    } else if (currentPage + 1 >= totalPages) {
      startPage = totalPages - 4;
      endPage = totalPages;
    } else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }
  }

  // Generate an array of pages to display
  const pages = [...Array(endPage + 1 - startPage).keys()].map(
    (i) => startPage + i
  );

  return (
    <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
      <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
        Total Records{" "}
        {data?.totalItems?(<span className="font-semibold text-gray-900 dark:text-white">{data?.totalItems}</span>):(<span className="font-semibold text-gray-900 dark:text-white">{data?.users?.length}</span>)}
        
      </span>
      <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
        <li>
          <a
            href="#"
            onClick={() => pageVal > 1 && pageNo(pageVal - 1)}
            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Previous
          </a>
        </li>
        {pages.map((page) => (
          <li
            key={page}
            className={`flex items-center justify-center px-3 h-8 ${
              page === currentPage
                ? "text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                : "leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            }`}
            onClick={() => pageNo(page)}
            style={{ cursor: "pointer" }}
          >
            <a className="page-link">{page}</a>
          </li>
        ))}
        <li>
          <a
            href="#"
            onClick={() => data?.totalPages > pageVal && pageNo(pageVal + 1)}
            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default ListPagination;
