import { useEffect, Suspense, lazy } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Toaster } from "react-hot-toast";
import Loader from "./components/Loader";

// Lazy load components
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Channel = lazy(() => import("./pages/Channel"));

const App = () => {
  const ProtectedRoute = ({ children }) => {
    const discordToken = Cookies.get("discordToken");
    const navigate = useNavigate();

    useEffect(() => {
      if (!discordToken) {
        navigate("/login");
      }
    }, [discordToken, navigate]);

    return <>{children}</>;
  };

  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/channel/:id"
            element={
              <ProtectedRoute>
                <Channel />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Suspense>
      <Toaster reverseOrder={false} position="top-center" />
    </>
  );
};

export default App;
