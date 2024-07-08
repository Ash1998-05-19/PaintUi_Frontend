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


export const getCoupon = async (page,searchData,payLoad,setLoading=()=>{}) => {
  const token = Cookies.get("token");
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE_URL}/coupon/getCoupons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      
      body: JSON.stringify({
        page : page,
        search : searchData,
        categoryIds : payLoad?.categoryIds?.map(cat => cat.value),
        companyIds : payLoad?.companyIds?.map(comp => comp.value),
        productCode : payLoad?.productCode,
        productName : payLoad?.productName,
        reedemed : payLoad?.reedemed,
        unReedemed : payLoad?.unReedemed,
        fromDate : payLoad?.fromDate,
        toDate : payLoad?.toDate,
        fromExpiryDate : payLoad?.fromExpiryDate,
        toExpiryDate : payLoad?.toExpiryDate,
        masonsCoupon : payLoad?.masonsCoupon?.map(mas => mas.value),
        retailersCoupon : payLoad?.retailersCoupon?.map(ret => ret.value),
        sortOrder : payLoad.sortOrder,


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