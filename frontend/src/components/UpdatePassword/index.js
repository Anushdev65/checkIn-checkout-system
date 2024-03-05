import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import MUIError from "../MUITools/MUIError";
import MUILoading from "../MUITools/MUILoading";
import MUIToast from "../MUITools/MUIToast";
import { removeLevelInfo } from "../../localStorage/localStorage";
import { useUpdatePasswordMutation } from "../../services/api/user";
import "../../styles/update.css";
import NavBar from "../NavBar";
const initialValues = {
  oldPassword: "",
  password: "",
  confirmPassword: "",
};

export default function UpdatePasswordForm() {
  const [updatePassword, { isLoading, data, error, isSuccess }] =
    useUpdatePasswordMutation();
  const navigate = useNavigate();

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
      updatePassword({
        password: values.password,
        oldPassword: values.oldPassword,
      });
    },
  });

  React.useEffect(() => {
    if (isSuccess) resetForm();
    if (data) {
      setTimeout(() => {
        navigate("/login");
        removeLevelInfo();
      }, 3000);
    }
  }, [resetForm, navigate, data, isSuccess]);

  return (
    <>
      <NavBar />
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
      {isLoading || data ? (
        <MUILoading />
      ) : (
        <Container
          component="main"
          maxWidth="xs"
          sx={{ mt: "2rem" }}
          className="update-container"
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Typography
              component="h6"
              variant="h6"
              sx={{ fontWeight: "bold", fontSize: 12 }}
              id="contain-update"
            >
              Password must be minimum of eight characters, with no space , at
              least one uppercase letter, one lowercase letter, one number and
              one special character.
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    error={touched.oldPassword && errors.oldPassword}
                    required
                    fullWidth
                    name="oldPassword"
                    label="Password"
                    type="password"
                    id="oldPassword"
                    autoComplete="oldPassword"
                    value={values.oldPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <MUIError
                    touch={touched.oldPassword}
                    error={errors.oldPassword}
                    value={false}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={touched.password && errors.password}
                    required
                    fullWidth
                    name="password"
                    label="New-Password"
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
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={touched.confirmPassword && errors.confirmPassword}
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm-Password"
                    type="password"
                    id="confirmPassword"
                    autoComplete="ConfirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <MUIError
                    touch={touched.confirmPassword}
                    error={errors.confirmPassword}
                    value={false}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Container>
      )}
    </>
  );
}
