import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/utils/constant";
import { PAGE_LIMIT } from "@/utils/constant";

export const createSalesOrder = async (payload, setLoading = () => {}) => {
  const token = Cookies.get("token");
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE_URL}/salesOrder/createSalesOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const resData = await res.json();

    if (resData) {
      setLoading(false);
      return { resData };
    } else {
      setLoading(false);
      return { errMessage: resData.message };
    }
  } catch (error) {
    setLoading(false);
    toast.error("Something went wrong");
    throw error;
  }
};

export const getsalesOrders = async (
  page = 1,
  limit = PAGE_LIMIT,
  searchData = "",
  fromDate = "",
  toDate = "",
  filters = {},
  setLoading = () => {}
) => {
  const token = Cookies.get("token");
  
  setLoading(true);
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (searchData) params.append("search", searchData);
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);
    if (filters.status) params.append("status", filters.status);
    if (filters.userId) params.append("retailer", filters.userId);
    if (filters.sortOrder) params.append("order", filters.sortOrder);
    if (filters.sortBy) params.append("orderBy", filters.sortBy);

    const res = await fetch(
      `${API_BASE_URL}/salesOrder/getSalesOrders?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const resData = await res.json();

    if (resData) {
      setLoading(false);
      return { resData };
    } else {
      setLoading(false);
      return { errMessage: resData.message };
    }
  } catch (error) {
    setLoading(false);
    toast.error("Something went wrong");
    throw error;
  }
};

export const getSalesOrderById = async (id, setLoading = () => {}) => {
  const token = Cookies.get("token");
  setLoading(true);
  try {
    const res = await fetch(
      `${API_BASE_URL}/salesOrder/getSalesOrderById/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const resData = await res.json();

    if (resData) {
      setLoading(false);
      return { resData };
    } else {
      setLoading(false);
      return { errMessage: resData.message };
    }
  } catch (error) {
    setLoading(false);
    toast.error("Something went wrong");
    throw error;
  }
};

export const updateSalesOrder = async (id, payload, setLoading = () => {}) => {
  const token = Cookies.get("token");
  setLoading(true);
  try {
    const res = await fetch(
      `${API_BASE_URL}/salesOrder/updateSalesOrder/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const resData = await res.json();

    if (resData) {
      setLoading(false);
      return { resData };
    } else {
      setLoading(false);
      return { errMessage: resData.message };
    }
  } catch (error) {
    setLoading(false);
    toast.error("Something went wrong");
    throw error;
  }
}