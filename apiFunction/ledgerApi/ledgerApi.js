import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/utils/constant";
import { PAGE_LIMIT } from "@/utils/constant";


export const addLedger = async (payload,setLoading=()=>{}) => {
    const token = Cookies.get("token");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/ledger/addLedgerEntry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const resData = await res.json();
      console.log('resData',resData)
  
      if (resData?.success) {
        console.log('working')
        setLoading(false);
        return {resData};
      } else {
        //toast.error(resData.message);
        setLoading(false);
        return {errMessage:resData.error};
      }
    } catch (error) {
      setLoading(false);
      toast.error("someting went wrong");
      console.log("error message ", error);
    }
  };

  export const deleteLedger = async (id,setLoading=()=>{}) => {
    const token = Cookies.get("token");
    setLoading(true);
    console.log(id)
    try {
      const res = await fetch(`${API_BASE_URL}/ledger/deleteLedgerEntry/${id}`, {
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


export const getLedger = async (page,searchData,userId,fromDate, toDate,setLoading=()=>{}) => {
    const token = Cookies.get("token");
    setLoading(true);
    try {
      
      const res = await fetch(`${API_BASE_URL}/ledger/getAllLedgerEntries?page=${page}&pageSize=${PAGE_LIMIT}&search=${searchData}${userId? `&userIds=${userId}` : ''}${fromDate ? `&fromDate=${fromDate}` : ""}${
        toDate ? `&toDate=${toDate}` : ""
      }`, {
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

  export const getLedgerById = async (id,setLoading=()=>{}) => {
    const token = Cookies.get("token");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/ledger/getLedgerEntryById/${id}`, {
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

  export const updateLedger = async (payload,id,setLoading=()=>{}) => {
    const token = Cookies.get("token");
    setLoading(true);
    console.log(id)
    try {
      const res = await fetch(`${API_BASE_URL}/ledger/updateLedgerEntry/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const resData = await res.json();
      console.log('resData',resData)
  
      if (resData?.success) {
        console.log('working')
        setLoading(false);
        return {resData};
      } else {
        //toast.error(resData.message);
        setLoading(false);
        return {errMessage:resData.error};
      }
    } catch (error) {
      setLoading(false);
      toast.error("someting went wrong");
      console.log("error message ", error);
    }
  };