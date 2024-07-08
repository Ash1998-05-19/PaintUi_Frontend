import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/utils/constant";
import { PAGE_LIMIT } from "@/utils/constant";



export const addProduct = async (payload,setLoading=()=>{}) => {
  const token = Cookies.get("token");
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE_URL}/product/addProduct`, {
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

export const getProduct = async (page,searchData,payLoad,setLoading=()=>{}) => {
    const token = Cookies.get("token");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/product/getProducts`, {
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
          productIds : payLoad?.productIds?.map(prod => prod.value),
          sortBy : payLoad.sortBy,
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

  export const getProductListForCoupon = async (page,searchData,payLoad,setLoading=()=>{}) => {
    const token = Cookies.get("token");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/product/getProducts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        
        body: JSON.stringify({
          page : page,
          pagination: "false",
          search : searchData,
          categoryIds : payLoad?.categoryIds?.map(cat => cat.value),
          companyIds : payLoad?.companyIds?.map(comp => comp.value),
          productIds : payLoad?.productIds?.map(prod => prod.value),
          sortBy : payLoad.sortBy,
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


  export const deleteProduct = async (id,setLoading=()=>{}) => {
    const token = Cookies.get("token");
    setLoading(true);
    console.log(id)
    try {
      const res = await fetch(`${API_BASE_URL}/product/deleteProduct/${id}`, {
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



export const getProductById = async (id,setLoading=()=>{}) => {
  const token = Cookies.get("token");
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE_URL}/product/getProductById/${id}`, {
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


export const updateProduct = async (payload,id,setLoading=()=>{}) => {
  const token = Cookies.get("token");
  setLoading(true);
  console.log(id)
  try {
    const res = await fetch(`${API_BASE_URL}/product/updateProduct/${id}`, {
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

