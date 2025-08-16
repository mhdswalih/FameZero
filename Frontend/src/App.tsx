import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import AuthRoutes from "./Routes/AuthRoutes";
import { lazy, Suspense } from "react";
import Loader from "./Components/ui/Loader";
import AdminAuth from "./Routes/AdminAuth";
import HotelAuth from "./Routes/HotelAuth";
const UserRoutes = lazy(() => import("./Routes/UserRoutes"));

function App() {
  return (
    <>
      <Toaster
        reverseOrder={false}
        position="bottom-right"
      />
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/user/*" element={<UserRoutes />} />
            <Route path="/hotel/*" element={<HotelAuth />} />
            <Route path="/admin/*" element={<AdminAuth />} />
            <Route path="/*" element={<AuthRoutes />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;
