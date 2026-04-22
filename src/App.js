import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute, PublicOnlyRoute } from "./auth/RouteGuards";
import AuthPage from "./pages/AuthPage/AuthPage";
import UserComponent from "./pages/UserPage/UserComponent";

const appTheme = createTheme({
  palette: {
    primary: {
      main: "#0c7a6b",
      dark: "#08695c",
      light: "#3e9d92",
    },
    secondary: {
      main: "#285f8f",
    },
    background: {
      default: "#edf4fb",
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: "'Manrope', 'Segoe UI', sans-serif",
    h4: {
      letterSpacing: "-0.02em",
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route element={<PublicOnlyRoute />}>
              <Route path="/auth" element={<AuthPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<UserComponent />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <ToastContainer position="top-right" autoClose={2600} />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
