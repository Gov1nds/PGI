import { Navigate } from "react-router-dom";
import { useVendorAuth } from "../context/VendorAuthContext";
import { LoadingState } from "./Shared";

export default function VendorProtectedRoute({ children }) {
  const { vendorUser, vendorLoading } = useVendorAuth();
  if (vendorLoading) return <LoadingState />;
  if (!vendorUser) return <Navigate to="/vendor/login" replace />;
  return children;
}
