import Tv from "@/pages/tv";
import Login from "@/pages/login";
import DashboardWrapper from "@/wrappers/dashboard.wrapper";
import { createBrowserRouter } from "react-router-dom";
import Movies from "@/pages/movies";
import Profile from "@/pages/profile";
import Home from "@/pages/home";

export const router = createBrowserRouter([
  {
    path: "",
    element: <Login />
  },
  {
    path: "home",
    element: <Home />
  },
  {
    path: "tv",
    element: (
      // <DashboardWrapper>
      <Tv />
      // </DashboardWrapper>
    )
  },
  {
    path: "movies",
    element: (
      // <DashboardWrapper>
        <Movies />
      // </DashboardWrapper>
    )
  },
  {
    path: "profile",
    element: (
      <DashboardWrapper>
        <Profile />
      </DashboardWrapper>
    )
  }
]);
