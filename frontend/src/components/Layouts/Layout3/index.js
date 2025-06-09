import { Outlet } from "react-router-dom";
import Header from "../../Header";
import SideBar from "../../SideBar";
import "./Layout3.css";
import MostOrdered from "../../MostOrdered";

function Layout3() {
  return (
    <>
      <div className="layout-app-container">
        <div className="sidebar-component">
          <SideBar />
        </div>
        <main className="content-container">
          <div className={"header-container layout3"}>
            <Header />
          </div>
            <Outlet />
        </main>
        <div className="right-compo">
            <MostOrdered/>
        </div>
      </div>
    </>
  );
}

export default Layout3;
