import { Outlet } from "react-router";

function PrivateRoute() {
  const isLoggedIn = Boolean(localStorage.getItem("isLoggedIn"));

  if (!isLoggedIn) {
    window.location.href = "/";
    return null;
  }
  return <Outlet />;
}

export default PrivateRoute;
