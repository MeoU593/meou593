import { Outlet } from "react-router-dom";
import "./Layout1.css";

function Layout1() {
  return (
    <>
      <div className="main-default-layout">
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default Layout1;
