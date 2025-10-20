import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/user";
import Footer from "../components/user/footer";

export default function Maindashboard() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
