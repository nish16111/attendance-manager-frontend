import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { extractApiError } from "../../API/HomeAPI";
import { useAuth } from "../../auth/AuthContext";

const authModes = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in to continue managing attendance records.",
    cta: "Sign in",
    icon: <LoginRoundedIcon />,
  },
  register: {
    title: "Create your account",
    subtitle: "Register once and start using the dashboard right away.",
    cta: "Create account",
    icon: <PersonAddAltRoundedIcon />,
  },
};

const loginSchema = Yup.object({
  login: Yup.string().trim().required("Username or email is required"),
  password: Yup.string()
    .min(6, "Password should be at least 6 characters")
    .required("Password is required"),
});

const registerSchema = Yup.object({
  username: Yup.string()
    .trim()
    .min(3, "Username should be at least 3 characters")
    .required("Username is required"),
  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password should be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const handleAuthSuccess = () => {
    const nextPath = location.state?.from?.pathname || "/";
    navigate(nextPath, { replace: true });
  };

  const isLogin = mode === "login";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 6 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 14% 18%, rgba(22,163,74,0.12) 0%, transparent 28%), radial-gradient(circle at 88% 12%, rgba(12,122,107,0.18) 0%, transparent 26%), radial-gradient(circle at 72% 76%, rgba(245,158,11,0.12) 0%, transparent 24%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
            gap: { xs: 2, md: 0 },
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              position: "relative",
              minHeight: { xs: 230, md: "100%" },
              borderRadius: { xs: 5, md: "32px 0 0 32px" },
              overflow: "hidden",
              p: { xs: 3, sm: 4, md: 5 },
              background:
                "linear-gradient(160deg, #0f4c5c 0%, #0c7a6b 50%, #89a63f 100%)",
              color: "common.white",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: -60,
                right: -30,
                width: 220,
                height: 220,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                filter: "blur(2px)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 40,
                right: 40,
                width: 110,
                height: 110,
                borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.08)",
                transform: "rotate(18deg)",
              }}
            />

            <Stack spacing={2.5} sx={{ position: "relative", maxWidth: 420 }}>
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 3,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "rgba(255,255,255,0.14)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                <AutoAwesomeRoundedIcon />
              </Box>

              <Box>
                <Typography
                  variant="overline"
                  sx={{ letterSpacing: "0.22em", opacity: 0.78 }}
                >
                  Attendance Manager
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    mt: 1.2,
                    fontWeight: 800,
                    lineHeight: 1.08,
                    fontSize: { xs: "2.2rem", sm: "2.8rem" },
                  }}
                >
                  Simple, calm access to your workspace.
                </Typography>
              </Box>

              <Typography sx={{ opacity: 0.86, maxWidth: 360 }}>
                A cleaner sign-in experience for your admin dashboard, designed
                to feel lighter on desktop and mobile.
              </Typography>
            </Stack>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: { xs: 5, md: "0 32px 32px 0" },
              border: "1px solid",
              borderColor: "rgba(18,35,56,0.08)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(250,252,249,0.94) 100%)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 24px 80px rgba(15, 76, 92, 0.08)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Stack spacing={3.2} sx={{ width: "100%" }}>
              <Stack spacing={1}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    p: 0.6,
                    borderRadius: 99,
                    bgcolor: "rgba(12,122,107,0.06)",
                    border: "1px solid rgba(12,122,107,0.08)",
                  }}
                >
                  <Button
                    fullWidth
                    variant={isLogin ? "contained" : "text"}
                    onClick={() => setMode("login")}
                    sx={{
                      borderRadius: 99,
                      py: 1.15,
                    }}
                  >
                    Sign in
                  </Button>
                  <Button
                    fullWidth
                    variant={!isLogin ? "contained" : "text"}
                    onClick={() => setMode("register")}
                    sx={{
                      borderRadius: 99,
                      py: 1.15,
                    }}
                  >
                    Register
                  </Button>
                </Stack>

                <Box sx={{ pt: 1.5 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                    {authModes[mode].title}
                  </Typography>
                  <Typography color="text.secondary">
                    {authModes[mode].subtitle}
                  </Typography>
                </Box>
              </Stack>

              {isLogin ? (
                <Formik
                  initialValues={{ login: "", password: "" }}
                  validationSchema={loginSchema}
                  onSubmit={async (values, helpers) => {
                    helpers.setStatus(undefined);

                    try {
                      const session = await login(values);

                      if (!session?.accessToken) {
                        throw new Error("No access token returned from login");
                      }

                      toast.success("Signed in successfully");
                      handleAuthSuccess();
                    } catch (error) {
                      const message = extractApiError(error, "Could not sign in");
                      helpers.setStatus(message);
                    } finally {
                      helpers.setSubmitting(false);
                    }
                  }}
                >
                  {({
                    errors,
                    handleBlur,
                    handleChange,
                    isSubmitting,
                    status,
                    touched,
                    values,
                  }) => (
                    <Form>
                      <Stack spacing={2}>
                        {status ? <Alert severity="error">{status}</Alert> : null}

                        <TextField
                          fullWidth
                          name="login"
                          label="Username or email"
                          value={values.login}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.login && Boolean(errors.login)}
                          helperText={touched.login && errors.login}
                        />

                        <TextField
                          fullWidth
                          type="password"
                          name="password"
                          label="Password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.password && Boolean(errors.password)}
                          helperText={touched.password && errors.password}
                        />

                        <Button
                          type="submit"
                          size="large"
                          variant="contained"
                          startIcon={
                            isSubmitting ? (
                              <CircularProgress size={18} color="inherit" />
                            ) : (
                              authModes.login.icon
                            )
                          }
                          disabled={isSubmitting}
                          sx={{
                            mt: 1,
                            py: 1.4,
                            borderRadius: 3,
                            background:
                              "linear-gradient(135deg, #0c7a6b 0%, #0f4c5c 100%)",
                          }}
                        >
                          {isSubmitting ? "Signing in" : authModes.login.cta}
                        </Button>
                      </Stack>
                    </Form>
                  )}
                </Formik>
              ) : (
                <Formik
                  initialValues={{
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                  }}
                  validationSchema={registerSchema}
                  onSubmit={async (values, helpers) => {
                    helpers.setStatus(undefined);

                    try {
                      const session = await register(values);

                      if (!session?.accessToken) {
                        throw new Error(
                          "No access token returned from registration"
                        );
                      }

                      toast.success("Account created successfully");
                      handleAuthSuccess();
                    } catch (error) {
                      const message = extractApiError(
                        error,
                        "Could not create account"
                      );
                      helpers.setStatus(message);
                    } finally {
                      helpers.setSubmitting(false);
                    }
                  }}
                >
                  {({
                    errors,
                    handleBlur,
                    handleChange,
                    isSubmitting,
                    status,
                    touched,
                    values,
                  }) => (
                    <Form>
                      <Stack spacing={2}>
                        {status ? <Alert severity="error">{status}</Alert> : null}

                        <TextField
                          fullWidth
                          name="username"
                          label="Username"
                          value={values.username}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.username && Boolean(errors.username)}
                          helperText={touched.username && errors.username}
                        />

                        <TextField
                          fullWidth
                          name="email"
                          label="Email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                        />

                        <TextField
                          fullWidth
                          type="password"
                          name="password"
                          label="Password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.password && Boolean(errors.password)}
                          helperText={touched.password && errors.password}
                        />

                        <TextField
                          fullWidth
                          type="password"
                          name="confirmPassword"
                          label="Confirm password"
                          value={values.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.confirmPassword &&
                            Boolean(errors.confirmPassword)
                          }
                          helperText={
                            touched.confirmPassword && errors.confirmPassword
                          }
                        />

                        <Button
                          type="submit"
                          size="large"
                          variant="contained"
                          startIcon={
                            isSubmitting ? (
                              <CircularProgress size={18} color="inherit" />
                            ) : (
                              authModes.register.icon
                            )
                          }
                          disabled={isSubmitting}
                          sx={{
                            mt: 1,
                            py: 1.4,
                            borderRadius: 3,
                            background:
                              "linear-gradient(135deg, #89a63f 0%, #0c7a6b 100%)",
                          }}
                        >
                          {isSubmitting
                            ? "Creating account"
                            : authModes.register.cta}
                        </Button>
                      </Stack>
                    </Form>
                  )}
                </Formik>
              )}

              <Divider />

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center" }}
              >
                {isLogin
                  ? "Use your username or email with password to continue."
                  : "Fill in your details to create a new admin account."}
              </Typography>
            </Stack>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthPage;
