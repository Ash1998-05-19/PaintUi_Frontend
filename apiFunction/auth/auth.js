//import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/utils/constant";



export const LoginAdmin = async (payload,setLoading=()=>{}) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/user/adminLogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const resData = await res.json();
      console.log('resData',resData)
  
      if (resData?.token) {
        //toast.success("SuccessFully Login");
        Cookies.set("token", resData?.token);
         Cookies.set("firstName", resData?.admin?.FirstName);
         Cookies.set("lastName", resData?.admin?.LastName);
         Cookies.set("email", resData?.admin?.Email);
        // Cookies.set("name", resData?.firstName);
        // Cookies.set("roles", JSON.stringify(resData?.role));
  
        setLoading(false);
        return {token:resData?.token};
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