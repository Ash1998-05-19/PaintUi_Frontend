"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Styles from "../common/sidebar.module.css";
import { usePathname } from "next/navigation";
import { initFlowbite } from "flowbite";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
export default function SidebarComp({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const firstName = Cookies.get("firstName");
  const lastName = Cookies.get("lastName");
  const email = Cookies.get("email");

  const [activeTab, setActiveTab] = useState(pathname.replace("/", ""));

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  useEffect(() => {
    initFlowbite(); // Call initCarousels() when component mounts
  }, []);

  const logOut = () => {
    Cookies.remove("token");
    Cookies.remove("email");
    Cookies.remove("firstName");
    Cookies.remove("lastName");
    Cookies.remove("phone");
    router.push("/login");
  };
  return (
    <>
      <button
        data-drawer-target="sidebar-multi-level-sidebar"
        data-drawer-toggle="sidebar-multi-level-sidebar"
        aria-controls="sidebar-multi-level-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="sidebar-multi-level-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div
          className={` ${Styles.sidebarMain} h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800`}
        >
          {/* <div className="mb-4 text-center">
            <span className={`ms-3 ${Styles.admintext}`}>Admin</span>
          </div> */}
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                href="/admin/dashboard"
                onClick={() => handleTabClick("/admin/dashboard")}
                className={`${
                  activeTab === "/admin/dashboard"
                    ? Styles.activeTab
                    : Styles.inactiveTab
                } flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
              >
                <svg
                  className={`${
                    activeTab === "/admin/dashboard" ? "" : Styles.inactiveTab
                  } ${
                    Styles.tabSvg
                  } flex-shrink-0 w-5 h-5 text-gray-900 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-black`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>

            <li>
              <Link
                href="/admin/users"
                onClick={() => handleTabClick("/admin/users")}
                className={` ${
                  activeTab === "admin/users"
                    ? Styles.activeTab
                    : Styles.inactiveTab
                } flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
              >
                <svg
                  className={`${
                    activeTab === "admin/users" ? "" : Styles.inactiveTab
                  }  ${
                    Styles.tabSvg
                  }  flex-shrink-0 w-5 h-5 text-gray-900 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-black`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
                <span className={` flex-1 ms-3 whitespace-nowrap`}>Users</span>
              </Link>
            </li>

            <li>
              <Link
                href="/admin/categories"
                onClick={() => handleTabClick("/admin/categories")}
                className={` ${
                  activeTab === "/admin/categories"
                    ? Styles.activeTab
                    : Styles.inactiveTab
                } flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
              >
                <svg
                  className={`${
                    activeTab === "/admin/categories" ? "" : Styles.inactiveTab
                  } ${
                    Styles.tabSvg
                  } flex-shrink-0 w-5 h-5 text-gray-900 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-black`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>

                <span className={` flex-1 ms-3 whitespace-nowrap`}>
                  Categories
                </span>
              </Link>
            </li>

            <li>
              <Link
                href="/admin/companies"
                onClick={() => handleTabClick("/admin/companies")}
                className={` ${
                  activeTab === "/admin/companies"
                    ? Styles.activeTab
                    : Styles.inactiveTab
                } flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
              >
                <svg
                  className={`${
                    activeTab === "/admin/companies" ? "" : Styles.inactiveTab
                  } ${
                    Styles.tabSvg
                  } flex-shrink-0 w-5 h-5 text-gray-900 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-black`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9h18M3 9v12a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V14h4v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V9M3 9L12 3l9 6"
                  />
                </svg>

                <span className={` flex-1 ms-3 whitespace-nowrap`}>
                  Companies
                </span>
              </Link>
            </li>

            <li>
              <a
                href="/admin/products"
                className={` ${
                  activeTab === "admin/products"
                    ? Styles.activeTab
                    : Styles.inactiveTab
                } flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
              >
                <svg
                  className={`${
                    activeTab === "admin/products" ? "" : Styles.inactiveTab
                  } ${
                    Styles.tabSvg
                  } flex-shrink-0 w-5 h-5 text-gray-900 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-black`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 9l6-6 6 6v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9z"
                  />
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 22h6"
                  />
                </svg>

                <span className="flex-1 ms-3 whitespace-nowrap">Product</span>
              </a>
            </li>

            {/* <li>
              <Link
                href="/admin/coupon"
                onClick={() => handleTabClick("/admin/coupon")}
                className={` ${
                  activeTab === "/admin/coupon"
                    ? Styles.activeTab
                    : Styles.inactiveTab
                } flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
              >
                <svg
                  className={`${
                    activeTab === "/admin/coupon" ? "" : Styles.inactiveTab
                  } ${
                    Styles.tabSvg
                  } flex-shrink-0 w-5 h-5 text-gray-900 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-black`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4h16v4a2 2 0 0 1-2 2 2 2 0 0 0 0 4 2 2 0 0 1 2 2v4H4v-4a2 2 0 0 1 2-2 2 2 0 0 0 0-4 2 2 0 0 1-2-2V4z"
                  />
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 9l6 6m0-6l-6 6"
                  />
                </svg>

                <span className={` flex-1 ms-3 whitespace-nowrap`}>Coupon</span>
              </Link>
            </li> */}

            <li>
              <Link
                href="/admin/ledger"
                onClick={() => handleTabClick("/admin/ledger")}
                className={` ${
                  activeTab === "/admin/ledger"
                    ? Styles.activeTab
                    : Styles.inactiveTab
                } flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
              >
                <svg
                  className={`${
                    activeTab === "/admin/ledger" ? "" : Styles.inactiveTab
                  }  ${
                    Styles.tabSvg
                  }  flex-shrink-0 w-5 h-5 text-gray-900 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-black`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m4-12H8m8 4H8m8 4H8M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
                  />
                </svg>

                <span className={` flex-1 ms-3 whitespace-nowrap`}>Ledger</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/masonSo"
                onClick={() => handleTabClick("/admin/masonSo")}
                className={` ${
                  activeTab === "/admin/masonSo"
                    ? Styles.activeTab
                    : Styles.inactiveTab
                } flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
              >
                <svg
                  className={`${
                    activeTab === "/admin/masonSo" ? "" : Styles.inactiveTab
                  } ${
                    Styles.tabSvg
                  } flex-shrink-0 w-5 h-5 text-gray-900 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-black`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>

                <span className={` flex-1 ms-3 whitespace-nowrap`}>
                  Mason So
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/master/coupons"
                onClick={() => handleTabClick("/admin/master/coupons")}
                className={` ${
                  activeTab?.includes("/admin/master/coupons") ||
                  activeTab?.includes("/admin/coupon/addCoupon") ||
                  activeTab?.includes("/admin/coupon") ||
                  activeTab?.includes("/admin/master/updatecoupons")
                    ? Styles.activeTab
                    : Styles.inactiveTab
                } flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
              >
                <svg
                  className={`${
                    activeTab?.includes("/admin/master/coupons") ||
                    activeTab?.includes("/admin/coupon/addCoupon") ||
                    activeTab?.includes("/admin/coupon") ||
                    activeTab?.includes("/admin/master/updatecoupons")
                      ? ""
                      : Styles.inactiveTab
                  } ${
                    Styles.tabSvg
                  } flex-shrink-0 w-5 h-5 text-gray-900 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-black`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4h16v4a2 2 0 0 1-2 2 2 2 0 0 0 0 4 2 2 0 0 1 2 2v4H4v-4a2 2 0 0 1 2-2 2 2 0 0 0 0-4 2 2 0 0 1-2-2V4z"
                  />
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 9l6 6m0-6l-6 6"
                  />
                </svg>

                <span className={` flex-1 ms-3 whitespace-nowrap`}>
                  Coupon Master
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/purchaseOrders"
                onClick={() => handleTabClick("/admin/purchaseOrders")}
                className={` ${
                  activeTab === "/admin/purchaseOrders"
                    ? Styles.activeTab
                    : Styles.inactiveTab
                } flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
              >
                <svg
                  className={`${
                    activeTab === "/admin/purchaseOrders"
                      ? ""
                      : Styles.inactiveTab
                  }  ${
                    Styles.tabSvg
                  }  flex-shrink-0 w-5 h-5 text-gray-900 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-black`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m4-12H8m8 4H8m8 4H8M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
                  />
                </svg>

                <span className={` flex-1 ms-3 whitespace-nowrap`}>
                  Purchase Orders
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/salesOrders"
                onClick={() => handleTabClick("/admin/salesOrders")}
                className={` ${
                  activeTab === "/admin/salesOrders"
                    ? Styles.activeTab
                    : Styles.inactiveTab
                } flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
              >
                <svg
                  className={`${
                    activeTab === "/admin/salesOrders"
                      ? ""
                      : Styles.inactiveTab
                  }  ${
                    Styles.tabSvg
                  }  flex-shrink-0 w-5 h-5 text-gray-900 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-black`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m4-12H8m8 4H8m8 4H8M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
                  />
                </svg>

                <span className={` flex-1 ms-3 whitespace-nowrap`}>
                  Sales Orders
                </span>
              </Link>
            </li>
            {/* <li className="fixed bottom-0 left-0 w-full">
              <button
                onClick={logOut}
                className={` ${
                  activeTab === "/admin/logout"
                    ? Styles.activeTab
                    : Styles.inactiveTab
                } flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
              >
                <svg
                  className={`${
                    activeTab === "/admin/logout" ? "" : Styles.inactiveTab
                  } ${
                    Styles.tabSvg
                  } flex-shrink-0 w-5 h-5 text-gray-900 transition duration-75 dark:text-white group-hover:text-gray-900 dark:group-hover:text-black`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1"
                  />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Log out</span>
              </button>
            </li> */}
          </ul>
        </div>
      </aside>

      <div className="p-4 sm:ml-64">
        <div className="">
          <nav className="">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
              <a
                href=""
                className="flex items-center space-x-3 rtl:space-x-reverse"
              ></a>
              <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                <button
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  id="user-menu-button"
                  aria-expanded="false"
                  data-dropdown-toggle="user-dropdown"
                  data-dropdown-placement="bottom"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src="/images/new_user_logo.png"
                    alt="user photo"
                    style={{ backgroundColor: "white" }}
                  />
                </button>
                <div
                  className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                  id="user-dropdown"
                >
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900 dark:text-white">
                      {firstName} {lastName}
                    </span>
                    <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                      {email}
                    </span>
                  </div>
                  <ul className="py-2" aria-labelledby="user-menu-button">
                    <li>
                      <a
                        href="/admin/changePassword"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Change Password
                      </a>
                    </li>
                    <li onClick={logOut}>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Log out
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </nav>
        </div>

        <div className="mt-3 p-2 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          {children}
          {/* Content for Dashboard tab */}
          {/* {activeTab === 'dashboard' && <Dashboard activeTab={activeTab}/>}
   {activeTab === 'users' && <Login />}
   {activeTab === 'login' && <Login />} */}
        </div>
      </div>
    </>
  );
}
