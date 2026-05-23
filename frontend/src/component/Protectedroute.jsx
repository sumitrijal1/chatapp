import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {

   const { data } = useSelector((state) => state.auth);

   return data ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;