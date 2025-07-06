import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../assets/css/BackofficeLayout.css";

export default function BackOffice() {
  return (
    <div className="backoffice-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <Outlet/>
        </div>
      </div>
    </div>
  );
}
