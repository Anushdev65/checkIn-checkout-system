import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MUIError from "../components/MUITools/MUIError";
import MUILoading from "../components/MUITools/MUILoading";
import MUIToast from "../components/MUITools/MUIToast";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { setLevelInfo, setUserInfo } from "../localStorage/localStorage";
import { useLoginUserMutation } from "../services/api/user";

// Initial form values
const initialValues = {
  email: "",
  password: "",
};

const defaultTheme = createTheme();

export default function UserLogin() {
  const navigate = useNavigate();

  // Using the useLoginUserMutation hook to handle user login
  const [loginUser, { data, error, isSuccess }] = useLoginUserMutation();

  // Formik hooks for form handling and validation
  const {
    handleBlur,
    touched,
    errors,
    handleChange,
    handleSubmit,
    values,
    resetForm,
  } = useFormik({
    initialValues,
    onSubmit: (values) => {
      loginUser(values);
    },
  });

  // const levelInfo = JSON.parse(getLevelInfo());
  // const userInfo = JSON.parse(getUserInfo());
  // useEffect(() => {
  //   if (isSuccess) resetForm();
  //   setLevelInfo((prevInfo) => ({
  //     ...prevInfo,
  //     token: data?.data.token,
  //   }));
  //   setUserInfo((prevInfo) => ({
  //     ...prevInfo,
  //     user: data?.data.user,
  //   }));
  //   if (data?.data.token) {
  //     navigate("/");
  //   }
  // }, [resetForm, data, navigate, isSuccess]);

  React.useEffect(() => {
    if (isSuccess) resetForm();
    setLevelInfo({
      token: data?.data.token,
    });
    setUserInfo({ user: data?.data.user });
    if (data?.data.token) {
      navigate("/home");
    }
  }, [resetForm, data, navigate, isSuccess]);
  return (
    <div className="login-container">
      {data ? (
        <MUIToast
          initialValue={true}
          message={data.message}
          severity="success"
        />
      ) : error ? (
        <MUIToast
          initialValue={true}
          message={error.data.message}
          severity="error"
        />
      ) : (
        <></>
      )}
      {data ? (
        <MUILoading />
      ) : (
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <MUIError
                  touch={touched.email}
                  error={errors.email}
                  value={false}
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  required
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <MUIError
                  touch={touched.password}
                  error={errors.password}
                  value={false}
                />

                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Login
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="/forgot-password" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="/register" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      )}
    </div>
  );
}
