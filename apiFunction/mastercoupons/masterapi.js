import Cookies from "js-cookie";

const { API_BASE_URL } = require("@/utils/constant");

export const couponMasterGetAll = async (
  page,
  searchData,
  payLoadData,
  pageSize,
  setLoading = () => {}
) => {
  const token = Cookies.get("token");
  setLoading(true);
  try {
    const res = await fetch(
      `${API_BASE_URL}/couponMaster/getAllCouponMasters `,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          page: page,
          pageSize: pageSize,
          productName: searchData,
        }),
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
    toast.error("someting went wrong");
  }
};

export const couponMasterGetById = async (
  page,
  searchData,
  payLoadData,
  pageSize,
  setLoading = () => {}
) => {
  const token = Cookies.get("token");
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE_URL}/coupon/getCoupons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        sortBy: "CouponMasterId",
        page: page,
        pageSize: pageSize,
        search: searchData,
        categoryIds: payLoadData?.categoryIds?.map((cat) => cat.value),
        companyIds: payLoadData?.companyIds?.map((comp) => comp.value),
        productCode: payLoadData?.productCode,
        productName: payLoadData?.productName,
        fromDate: payLoadData?.fromDate,
        toDate: payLoadData?.toDate,
        fromExpiryDate: payLoadData?.fromExpiryDate,
        toExpiryDate: payLoadData?.toExpiryDate,
        sortOrder: payLoadData.sortOrder,
        couponMasterId: payLoadData.couponMasterId,
      }),
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

export const getMasterCouponById = async (id, setLoading = () => {}) => {
  const token = Cookies.get("token");
  setLoading(true);
  try {
    const res = await fetch(
      `${API_BASE_URL}/couponMaster/getCouponMasterById/${id}`,
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
    toast.error("someting went wrong");
  }
};

export const updateMasterCoupon = async (payload, id, setLoading = () => {}) => {
  const token = Cookies.get("token");
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE_URL}/couponMaster/updateCouponMaster/${id}`, {
      method: "PUT",
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
      //toast.error(resData.message);
      setLoading(false);
      return { errMessage: resData.message };
    }
  } catch (error) {
    setLoading(false);
    toast.error("someting went wrong");
  }
};

export const deleteDownloadFile = async (id,setLoading=()=>{}) => {
    const token = Cookies.get("token");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/couponMaster/removeFileFromCouponMaster/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const resData = await res.json();
  
      if (resData) {
          setLoading(false);
          return {resData};
        } else {
          //toast.error(resData.message);
          setLoading(false);
          return {errMessage:resData.message};
        }
      } catch (error) {
        setLoading(false);
        toast.error("someting went wrong");
      }
  };
