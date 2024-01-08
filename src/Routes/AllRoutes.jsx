import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import LoginAndSignup from "../Pages/SignUp&Login/LoginAndSignup";
import Signup from "../Pages/SignUp&Login/Signup";
import Cart from "../Pages/Cart";
import ProductPage from "../Components/ProductPage/ProductPage";
import { PrivateRoute } from "./PrivateRoute";
import SingleProduct from "../Pages/SingleProduct";
import UserProfile from "..//Pages/UserProfile";
import OrderConfirmation from "../Components/OrderConfirmation";
import Checkout from "../Pages/Checkout";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/login" element={<LoginAndSignup />}></Route>
      <Route path="/products/:category" element={<ProductPage />}></Route>
      <Route path="/product/:id" element={<SingleProduct />}></Route>
      <Route path="/cart" element={<Cart />}></Route>
      <Route path="/success" element={<OrderConfirmation />}></Route>
      <Route path="/user/profile" element={<UserProfile />}></Route>
      <Route path="/checkout" element={<Checkout />}></Route>
    </Routes>
  );
};

export { AllRoutes };
