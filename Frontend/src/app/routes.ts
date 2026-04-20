import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Root from "./pages/Root";
import Home from "./pages/Home";
import Finance from "./pages/Finance";
import Services from "./pages/Services";
import Config from "./pages/Config";
import ProfileSettings from "./pages/config/ProfileSettings";
import PrivacySecurity from "./pages/config/PrivacySecurity";
import About from "./pages/config/About";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "finance", Component: Finance },
      { path: "services", Component: Services },
      { path: "config", Component: Config },
    ],
  },
  {
    path: "/config/profile",
    Component: ProfileSettings,
  },
  {
    path: "/config/privacy",
    Component: PrivacySecurity,
  },
  {
    path: "/config/about",
    Component: About,
  },
]);