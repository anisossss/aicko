import Tv from "@/pages/tv";
import Login from "@/pages/login";
import { createBrowserRouter } from "react-router-dom";
import Series from "@/pages/series";
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
    element: <Tv />
  },
  {
    path: "movies",
    element: <Movies />
  },
  {
    path: "profile",
    element: <Profile />
  },
  {
    path: "series",
    element: <Series />
  }
]);
