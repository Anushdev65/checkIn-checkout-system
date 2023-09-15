import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useFormik } from "formik";
import { useCreateUserMutation } from "../services/api/user";
import MUILoading from "../components/MUITools/MUILoading";
import MUIToast from "../components/MUITools/MUIToast";
import SigninForm from "../components/Forms/SignInForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../styles/registeruser.css";

const initialValues = {
  email: "",
  password: "",
};

export default function SignUp() {
  const [registerUser, { isLoading, data, error, isSuccess }] =
    useCreateUserMutation();
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
      const body = {
        email: values.email,
        password: values.password,
      };
      registerUser(body);
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      resetForm();
      navigate("/login");
    }
  }, [isSuccess, resetForm, navigate]);

  return (
    <>
      {isLoading ? (
        <MUILoading />
      ) : (
        <Container component="main" maxWidth="xs">
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
            <SigninForm
              handleBlur={handleBlur}
              touched={touched}
              errors={errors}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              values={values}
            />
          </Box>
        </Container>
      )}
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
    </>
  );
}
