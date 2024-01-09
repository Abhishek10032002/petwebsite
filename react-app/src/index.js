import './index.css';
import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Home from './component/Home';
import Login from './component/Login';
import Signup from './component/Signup';
import AddProduct from './component/AddProduct';
import LikedProducts from './component/LikedProducts';
import ProductDetail from './component/ProductDetail';
import CategoryPage from './component/CategoryPage';
import MyProducts from './component/MyProducts';
import MyProfile from './component/MyProfile';
import HealthFood from './component/HealthFood';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Home/>
    ),
  },
  {
    path: "/healthandfood",
    element:(<HealthFood/>)
  },
  {
    path: "/category/:catName",
    element: (
      <CategoryPage/>
    ),
  },
  {
    path: "about",
    element: <div>About</div>,
  },
  {
    path: "/login",
    element:(<Login/>)
  },
  {
    path: "/signup",
    element:(<Signup/>)
  },
  {
    path: "/add-product",
    element:(<AddProduct/>)
  },
  {
    path: "/liked-products",
    element:(<LikedProducts/>)
  },
  {
    path: "/my-products",
    element:(<MyProducts/>)
  },
  {
    path: "/product/:productId",
    element:(<ProductDetail/>)
  },
  {
    path: "/my-profile",
    element:(<MyProfile/>)
  }
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
