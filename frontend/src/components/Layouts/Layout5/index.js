import { Outlet } from "react-router-dom";
import Header from "../../Header";
import SideBar from "../../SideBar";

function Layout5() {
  return (
    <>
      <div className="layout-app-container">
        <div className="sidebar-component">
          <SideBar />
        </div>
        <main className="content-container">
          <div className={"header-container"}>
            <Header />
          </div>
            <div className="component-full-width">
              <Outlet />
            </div>
        </main>
      </div>
    </>
  );
}

export default Layout5;
