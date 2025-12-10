import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../layouts/Layout";
import LoginPage from "../login";
import RegisterPage from "../register";

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
    ],
  },
]);
