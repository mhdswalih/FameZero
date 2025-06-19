import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import AuthRoutes from "./routes/AuthRoutes";
import { lazy, Suspense } from "react";
import Loader from "./Components/ui/Loader";
import AdminAuth from "./routes/AdminAuth";
import HotelAuth from "./routes/HotelAuth";
const UserRoutes = lazy(() => import("./routes/UserRoutes"));

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
