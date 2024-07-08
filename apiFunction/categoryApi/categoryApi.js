import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/utils/constant";
import { PAGE_LIMIT } from "@/utils/constant";



export const addCategory = async (payload,setLoading=()=>{}) => {
  const token = Cookies.get("token");
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE_URL}/category/addCategory`, {
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




export const getCategory = async (page,searchData,setLoading=()=>{}) => {
  const token = Cookies.get("token");
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE_URL}/category/getCategories?page=${page}&pageSize=${PAGE_LIMIT}&search=${searchData}`, {
      method: "GET",
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

export const getCategoryListForProduct = async (page,setLoading=()=>{}) => {
  const token = Cookies.get("token");
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE_URL}/category/getCategories?page=${page}&pageSize=${PAGE_LIMIT}&pagination=false`, {
      method: "GET",
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


export const deleteCategory = async (id,setLoading=()=>{}) => {
  const token = Cookies.get("token");
  setLoading(true);
  console.log(id)
  try {
    const res = await fetch(`${API_BASE_URL}/category/deleteCategory/${id}`, {
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

export const updateCategory = async (payload,id,setLoading=()=>{}) => {
  const token = Cookies.get("token");
  setLoading(true);
  console.log(id)
  try {
    const res = await fetch(`${API_BASE_URL}/category/updateCategory/${id}`, {
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


