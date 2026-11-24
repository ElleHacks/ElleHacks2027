import { Outlet } from "react-router-dom";
import NavBar from "./NavBar/NavBar";

// `bare` pages (like the application form) draw their own full-width background
function Layout({ bare = false }) {
  return (
    <>
      <NavBar />
      <main className={bare ? "application-page" : "page"}>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
