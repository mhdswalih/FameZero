import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { FooterWithLogo } from "./Components/footer";
import Navbar from "./Components/navbar";
import AboutSection from "./userSide/AboutSection";
import ServicesSection from "./userSide/findFood";
import CarouselWithText from "./userSide/mainContainer";
import LoginPage from "./userSide/Login";
import WhatForThis from "./userSide/AboutPage";
import FoodSection from "./userSide/FoodPage";
import ProductPage from "./userSide/HotelsDetailsPage";
import LeftSidebar from "./userSide/ChatSideBar";
import RightSidebar from "./userSide/Chat";
import Signup from "./userSide/SignIn";
import OTPVerificationPage from "./userSide/Otp";
import { Toaster } from 'react-hot-toast';


function App() {
  return (
    <>
    <Toaster
    reverseOrder = {false}
  position="bottom-right" 
/>
    <Router>
      <Routes>
        {/* Home Route */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <CarouselWithText />
              <AboutSection />
              <ServicesSection />
              <FooterWithLogo />
            </>
          }
        />
        <Route
          path="/FoodSection"
          element={
            <>
              <Navbar />
              <FoodSection />
              <FooterWithLogo />
            </>
          }
        />
        <Route
          path="/HotelsDetails"
          element={
            <>
              <Navbar />
              <ProductPage />
              <FooterWithLogo />
            </>
          }
        />
        <Route
          path="/Chat"
          element={
            <>
              {/* <Navbar /> */}
              <div className="h-screen flex flex-col">
                {/* Top Section (if needed) */}
                <div
                  className="w-full"
                  style={{ backgroundColor: "#fff" }}
                ></div>

                {/* Main Container */}
                <div className="flex-1 container-1 bg-white  ">
                  <div className=" h-full">
                    {/* Flex Container for LeftSidebar and RightSidebar */}
                    <div className="flex flex-col md:flex-row border  rounded  h-165">
                      {/* LeftSidebar - Full width on small screens, 1/3 width on medium and larger screens */}
                      <div className="w-full md:w-1/3 border-r">
                        <LeftSidebar />
                      </div>

                      {/* RightSidebar - Full width on small screens, 2/3 width on medium and larger screens */}
                      <div className="w-full md:w-2/3">
                        <RightSidebar />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          }
        />
        {/* About Route */}
        <Route
          path="/About"
          element={
            <>
              <Navbar />
              <WhatForThis />
              <FooterWithLogo />
            </>
          }
        />

        {/* Login Route (without Navbar) */}
        <Route
          path="/login"
          element={
            <>
              <LoginPage />
             
            </>
          }
        />
        <Route path="/Signup" element={
          <>
          <Signup />
          </>
        }/>
      <Route path="/otp" element={
          <>
          <OTPVerificationPage />
          </>
        }/>
      </Routes>
     
    </Router>
    </>
  );
}

export default App;
