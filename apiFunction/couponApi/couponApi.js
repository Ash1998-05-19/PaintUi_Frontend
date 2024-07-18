import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/utils/constant";
import { PAGE_LIMIT } from "@/utils/constant";



export const addCoupon = async (payload,quantity,setLoading=()=>{}) => {
  const token = Cookies.get("token");
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE_URL}/coupon/addCoupon?quantity=${quantity}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const resData = await res.json();
    console.log('resData',resData)

    if (resData) {
      console.log('working')
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
    console.log("error message ", error);
  }
};


export const getCoupon = async (page,searchData,payLoadData,pageSize,setLoading=()=>{}) => {
  const token = Cookies.get("token");
  setLoading(true);
  console.log("coupon api payload", payLoadData)
  try {
    const res = await fetch(`${API_BASE_URL}/coupon/getCoupons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      
      body: JSON.stringify({
        page : page,
        pageSize : pageSize,
        search : searchData,
        categoryIds : payLoadData?.categoryIds?.map(cat => cat.value),
        companyIds : payLoadData?.companyIds?.map(comp => comp.value),
        productCode : payLoadData?.productCode,
        productName : payLoadData?.productName,
        reedemed : payLoadData?.reedemed,
        unReedemed : payLoadData?.unReedemed,
        fromDate : payLoadData?.fromDate,
        toDate : payLoadData?.toDate,
        fromExpiryDate : payLoadData?.fromExpiryDate,
        toExpiryDate : payLoadData?.toExpiryDate,
        masonsCoupon : payLoadData?.masonsCoupon?.map(mas => mas.value),
        retailersCoupon : payLoadData?.retailersCoupon?.map(ret => ret.value ? ret.value : ret),
        sortOrder : payLoadData.sortOrder,


      })
    });
    const resData = await res.json();
    console.log('resData',resData)

    if (resData) {
        console.log('working')
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
      console.log("error message ", error);
    }
};

  export const deleteCoupon = async (id,setLoading=()=>{}) => {
    const token = Cookies.get("token");
    setLoading(true);
    console.log(id)
    try {
      const res = await fetch(`${API_BASE_URL}/coupon/deleteCoupon/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const resData = await res.json();
      console.log('resData',resData)
  
      if (resData) {
          console.log('working')
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
        console.log("error message ", error);
      }
  };

  export const updateCoupon = async (payload,id,setLoading=()=>{}) => {
    const token = Cookies.get("token");
    setLoading(true);
    console.log(id)
    try {
      const res = await fetch(`${API_BASE_URL}/coupon/updateCoupon/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const resData = await res.json();
      console.log('resData',resData)
  
      if (resData) {
        console.log('working')
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
      console.log("error message ", error);
    }
  };

  export const getCouponById = async (id,setLoading=()=>{}) => {
    const token = Cookies.get("token");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/coupon/getCouponById/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const resData = await res.json();
      console.log('resIdData',resData)
  
      if (resData) {
        console.log('working')
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
      console.log("error message ", error);
    }
  };