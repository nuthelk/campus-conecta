import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../layouts/Layout";
import { DashboardLayout } from "../layouts/DashboardLayout";
import Home from "../app/home";
import LoginPage from "../app/login";
import RegisterPage from "../app/register";
import CreatePostPage from "../app/create-post";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          {
            path: "home",
            element: <Home />,
          },
          {
            path: "create-post",
            element: <CreatePostPage />,
          },
        ],
      },
    ],
  },
]);
