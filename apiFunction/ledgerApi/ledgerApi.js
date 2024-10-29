import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/utils/constant";
import { PAGE_LIMIT } from "@/utils/constant";

export const addLedger = async (payload, setLoading = () => {}) => {
  const token = Cookies.get("token");
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE_URL}/ledger/addLedgerEntry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const resData = await res.json();

    if (resData?.success) {
      setLoading(false);
      return { resData };
    } else {
      //toast.error(resData.message);
      setLoading(false);
      return { errMessage: resData.error };
    }
  } catch (error) {
    setLoading(false);
    toast.error("someting went wrong");
  }
};

export const deleteLedger = async (id, setLoading = () => {}) => {
  const token = Cookies.get("token");
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE_URL}/ledger/deleteLedgerEntry/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const resData = await res.json();

    if (resData) {
      setLoading(false);
      return { resData };
    } else {
      //toast.error(resData.message);
      setLoading(false);
      return { errMessage: resData.message };
    }
  } catch (error) {
    setLoading(false);
    toast.error("someting went wrong");
  }
};

export const getLedger = async (
  page,
  searchData,
  userId,
  fromDate,
  toDate,
  sortOrder,
  sortBy,
  setLoading = () => {}
) => {
  const token = Cookies.get("token");
  setLoading(true);
  try {
    const res = await fetch(
      `${API_BASE_URL}/ledger/getAllLedgerEntries?page=${page}&pageSize=${PAGE_LIMIT}&search=${searchData}${
        userId
          ? userId.value
            ? `&userIds=${userId.value}`
            : `&userIds=${userId}`
          : ""
      }${fromDate ? `&fromDate=${fromDate}` : ""}${
        toDate ? `&toDate=${toDate}` : ""
      }${sortOrder ? `&sortOrder=${sortOrder?.value}` : ""}${
        sortBy ? `&sortBy=${sortBy}` : ""
      }`,
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
      //toast.error(resData.message);
      setLoading(false);
      return { errMessage: resData.message };
    }
  } catch (error) {
    setLoading(false);
    toast.error("something went wrong");
  }
};

export const getLedgerById = async (id, setLoading = () => {}) => {
  const token = Cookies.get("token");
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE_URL}/ledger/getLedgerEntryById/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const resData = await res.json();

    if (resData) {
      setLoading(false);
      return { resData };
    } else {
      //toast.error(resData.message);
      setLoading(false);
      return { errMessage: resData.message };
    }
  } catch (error) {
    setLoading(false);
    toast.error("someting went wrong");
  }
};

export const updateLedger = async (payload, id, setLoading = () => {}) => {
  const token = Cookies.get("token");
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE_URL}/ledger/updateLedgerEntry/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const resData = await res.json();

    if (resData?.success) {
      setLoading(false);
      return { resData };
    } else {
      //toast.error(resData.message);
      setLoading(false);
      return { errMessage: resData.error };
    }
  } catch (error) {
    setLoading(false);
    toast.error("someting went wrong");
  }
};
