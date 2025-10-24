// App.tsx
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy } from "react";
import Loader from "./Components/ui/Loader";

// Lazy loaded routes
const AuthRoutes = lazy(() => import("./routes/AuthRoutes.tsx"));
const AdminAuth = lazy(() => import("./routes/AdminAuth.tsx"));
const HotelAuth = lazy(() => import("./routes/HotelAuth.tsx"));

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