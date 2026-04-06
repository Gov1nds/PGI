import { Outlet } from "react-router-dom";
import { PublicNavbar, Footer } from "../components/Shared";

export default function PublicShell() {
  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <main className="relative min-h-[72vh]">
        <div className="grid-orb one" />
        <div className="grid-orb two" />
        <div className="grid-orb three" />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
