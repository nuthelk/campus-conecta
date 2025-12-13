import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../layouts/Layout";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { ProtectedRoute, PublicRoute } from "../components/ProtectedRoute";
import Home from "../app/home";
import LoginPage from "../app/login";
import RegisterPage from "../app/register";
import CreatePostPage from "../app/create-post";
import Posts from "@/app/posts";
import ProfilePage from "@/app/profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "register",
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        ),
      },
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "home",
            element: <Home />,
          },
          {
            path: "create-post",
            element: <CreatePostPage />,
          },
          {
            path: "posts",
            element: <Posts />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
]);
