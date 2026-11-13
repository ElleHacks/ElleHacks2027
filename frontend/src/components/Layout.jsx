import { Outlet } from "react-router-dom";
import NavBar from "./NavBar/NavBar";

// `bare` pages (like the application form) draw their own full-width background
function Layout({ bare = false }) {
  return (
    <>
      <NavBar />
      <main className={bare ? undefined : "page"}>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
