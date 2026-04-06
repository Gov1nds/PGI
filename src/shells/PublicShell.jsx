import { Outlet } from "react-router-dom";
import { PublicNavbar, Footer } from "../components/Shared";
export default function PublicShell() { return <><PublicNavbar/><main className="min-h-[70vh]"><Outlet/></main><Footer/></>; }
