import { ReactNode, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isValid, setIsValid] = useState<boolean>(true);
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const response = await fetch(`/api/token-validation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ token })
        });

        if (!response.ok) {
          throw new Error("Token validation failed");
        }

        const result = await response.json();
        setIsValid(result.valid);
      } catch (error) {
        console.error("Error validating token:", error);
        setIsValid(false);
      }
    };

    validateToken();
  }, [token]);

  return isValid ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
