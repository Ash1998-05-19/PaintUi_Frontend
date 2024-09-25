"use client";

import { Popover } from "flowbite-react";

export function UserDetailPopover({ userIdValue, children }) {
  const content = (
    <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
      <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Related Operations
        </h3>
      </div>
      <div className="px-3 py-2">
        <ul>
          <li className="mb-4">
            <a
              href={`/admin/ledger?id=${userIdValue}`}
              className="text-blue-500 hover:underline"
            >
              Ledger Entries
            </a>
          </li>
          <li className="mb-4">
            <a
              href={`/admin/masons?id=${userIdValue}`}
              className="text-blue-500 hover:underline"
            >
              Related Masons
            </a>
          </li>
          <li className="mb-4">
            <a
              href={`/admin/coupon?id=${userIdValue}`}
              className="text-blue-500 hover:underline"
            >
              Scanned Coupons
            </a>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <Popover content={content} placement="right">
      {children}
    </Popover>
  );
}
