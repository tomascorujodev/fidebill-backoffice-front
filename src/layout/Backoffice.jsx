import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function BackOffice() {
  return (
    <>
      <div className="container">
      <Navbar />
      </div>
      <Outlet/>
    </>
  );
}
