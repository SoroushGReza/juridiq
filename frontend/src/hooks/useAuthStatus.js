import { useState, useEffect } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { useLocation } from "react-router-dom";

const useAuthStatus = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDelegatedAdmin, setIsDelegatedAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("access");

    if (token) {
      setIsAuthenticated(true);
      const checkAdminStatus = async () => {
        try {
          const { data: user } = await axiosReq.get("/accounts/status/");
          setIsAdmin(user.is_staff || user.is_superuser);
          setIsDelegatedAdmin(!!user.is_delegated_admin);
        } catch (err) {
          console.error("Error fetching user status:", err);
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      };
      checkAdminStatus();
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
      setIsDelegatedAdmin(false);
      setLoading(false);
    }
  }, [location]);

  return { isAdmin, isDelegatedAdmin, isAuthenticated, loading };
};

export default useAuthStatus;
