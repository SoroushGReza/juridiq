import { useState, useEffect } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { useLocation } from "react-router-dom";

const useAuthStatus = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      setIsAuthenticated(true);
      const checkAdminStatus = async () => {
        try {
          const { data: user } = await axiosReq.get("/accounts/profile/");
          setIsAdmin(user.is_staff || user.is_superuser);
        } catch (err) {
          console.error("Error fetching user status:", err);
          setIsAdmin(false);
        }
      };
      checkAdminStatus();
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  }, [location]);

  return { isAdmin, isAuthenticated };
};

export default useAuthStatus;
