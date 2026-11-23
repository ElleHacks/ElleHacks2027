import { Outlet } from "react-router-dom";
import "./DashboardLayout.css";
import Sidebar from "./Sidebar";                                     

function DashboardLayout() {
  return (
    <div className="dash">
        <Sidebar />
        <main className="dash-panel">
            <Outlet />
        </main>
    </div>
  );
}

export default DashboardLayout;