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
      main: "#7a1f2b",
      dark: "#57131d",
      light: "#a84859",
    },
    secondary: {
      main: "#8c6a5a",
    },
    success: {
      main: "#7f8f62",
    },
    background: {
      default: "#f8f2ef",
      paper: "#fffdfb",
    },
    text: {
      primary: "#2b1620",
      secondary: "#6e555f",
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: "'Fraunces', 'Manrope', 'Segoe UI', sans-serif",
    h6: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    body1: {
      fontFamily: "'Manrope', 'Segoe UI', sans-serif",
    },
    body2: {
      fontFamily: "'Manrope', 'Segoe UI', sans-serif",
    },
    button: {
      fontFamily: "'Manrope', 'Segoe UI', sans-serif",
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
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: "rgba(255, 251, 249, 0.94)",
        },
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
