import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket } from "../store/authslice";


const ProtectedRoute = () => {
   const dispatch = useDispatch()

   const { data } = useSelector((state) => state.auth);
   const token = localStorage.getItem("token")
   if(token){
      dispatch(connectSocket())
   }


   return data ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;