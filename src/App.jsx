import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { LoadingState, ProtectedRoute } from "./components/Shared";
import PublicShell from "./shells/PublicShell";
import AppShell from "./shells/AppShell";
import ProjectShell from "./shells/ProjectShell";
import VendorShell from "./shells/VendorShell";
import { Home, Analyze, Login, Register, Pricing, Insights, Contact, NotFound } from "./pages/public/Pages";

const L = ({children}) => <Suspense fallback={<LoadingState/>}>{children}</Suspense>;

const Dashboard = lazy(()=>import("./pages/app/Pages").then(m=>({default:m.Dashboard})));
const ProjectsList = lazy(()=>import("./pages/app/Pages").then(m=>({default:m.ProjectsList})));
const SourcingCasesList = lazy(()=>import("./pages/app/Pages").then(m=>({default:m.SourcingCasesList})));
const Marketplace = lazy(()=>import("./pages/app/Pages").then(m=>({default:m.Marketplace})));
const Analytics = lazy(()=>import("./pages/app/Pages").then(m=>({default:m.Analytics})));
const RFQsList = lazy(()=>import("./pages/app/Pages").then(m=>({default:m.RFQsList})));
const OrdersList = lazy(()=>import("./pages/app/Pages").then(m=>({default:m.OrdersList})));
const ShipmentsList = lazy(()=>import("./pages/app/Pages").then(m=>({default:m.ShipmentsList})));
const Reports = lazy(()=>import("./pages/app/Pages").then(m=>({default:m.Reports})));

const PO = lazy(()=>import("./pages/project/Pages").then(m=>({default:m.ProjectOverview})));
const PS = lazy(()=>import("./pages/project/Pages").then(m=>({default:m.ProjectStrategy})));
const PV = lazy(()=>import("./pages/project/Pages").then(m=>({default:m.ProjectVendors})));
const PR = lazy(()=>import("./pages/project/Pages").then(m=>({default:m.ProjectRFQ})));
const PC = lazy(()=>import("./pages/project/Pages").then(m=>({default:m.ProjectCompare})));
const PCh = lazy(()=>import("./pages/project/Pages").then(m=>({default:m.ProjectChat})));
const POr = lazy(()=>import("./pages/project/Pages").then(m=>({default:m.ProjectOrders})));
const PT = lazy(()=>import("./pages/project/Pages").then(m=>({default:m.ProjectTracking})));
const PA = lazy(()=>import("./pages/project/Pages").then(m=>({default:m.ProjectAnalytics})));
const PH = lazy(()=>import("./pages/project/Pages").then(m=>({default:m.ProjectHistory})));

const VL = lazy(()=>import("./pages/vendor/Pages").then(m=>({default:m.VendorLogin})));
const VD = lazy(()=>import("./pages/vendor/Pages").then(m=>({default:m.VendorDashboardPage})));
const VR = lazy(()=>import("./pages/vendor/Pages").then(m=>({default:m.VendorRFQsPage})));
const VOr = lazy(()=>import("./pages/vendor/Pages").then(m=>({default:m.VendorOrdersPage})));
const VP = lazy(()=>import("./pages/vendor/Pages").then(m=>({default:m.VendorPerformancePage})));

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicShell/>}>
        <Route path="/" element={<Home/>}/>
        <Route path="/analyze" element={<Analyze/>}/>
        <Route path="/pricing" element={<Pricing/>}/>
        <Route path="/insights" element={<Insights/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/marketplace" element={<L><Marketplace/></L>}/>
      </Route>

      {/* Authenticated App (left-rail layout) */}
      <Route element={<ProtectedRoute><AppShell/></ProtectedRoute>}>
        <Route path="/dashboard" element={<L><Dashboard/></L>}/>
        <Route path="/sourcing-cases" element={<L><SourcingCasesList/></L>}/>
        <Route path="/projects" element={<L><ProjectsList/></L>}/>
        <Route path="/rfqs" element={<L><RFQsList/></L>}/>
        <Route path="/orders-list" element={<L><OrdersList/></L>}/>
        <Route path="/shipments" element={<L><ShipmentsList/></L>}/>
        <Route path="/analytics" element={<L><Analytics/></L>}/>
        <Route path="/reports" element={<L><Reports/></L>}/>
      </Route>

      {/* Project (sidebar layout) */}
      <Route path="/project/:id" element={<ProtectedRoute allowGuest><ProjectShell/></ProtectedRoute>}>
        <Route index element={<L><PO/></L>}/>
        <Route path="strategy" element={<L><PS/></L>}/>
        <Route path="vendors" element={<L><PV/></L>}/>
        <Route path="rfq" element={<L><PR/></L>}/>
        <Route path="compare" element={<L><PC/></L>}/>
        <Route path="chat" element={<L><PCh/></L>}/>
        <Route path="orders" element={<L><POr/></L>}/>
        <Route path="tracking" element={<L><PT/></L>}/>
        <Route path="analytics" element={<L><PA/></L>}/>
        <Route path="history" element={<L><PH/></L>}/>
      </Route>

      {/* Vendor Portal */}
      <Route path="/vendor/login" element={<L><VL/></L>}/>
      <Route element={<VendorShell/>}>
        <Route path="/vendor/dashboard" element={<L><VD/></L>}/>
        <Route path="/vendor/rfqs" element={<L><VR/></L>}/>
        <Route path="/vendor/orders" element={<L><VOr/></L>}/>
        <Route path="/vendor/performance" element={<L><VP/></L>}/>
      </Route>

      {/* 404 */}
      <Route path="*" element={<PublicShell/>}><Route path="*" element={<NotFound/>}/></Route>
    </Routes>
  );
}
