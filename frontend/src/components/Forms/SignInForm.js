import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MUIError from "../../components/MUITools/MUIError";

const SigninForm = ({
  handleBlur,
  touched,
  errors,
  handleChange,
  handleSubmit,
  values,
  updateProfile,
}) => {
  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            error={Boolean(touched.email && errors.email)}
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="off"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <MUIError touch={touched.email} error={errors.email} value={false} />
        </Grid>

        <Grid item xs={12}>
          <TextField
            error={Boolean(touched.password && errors.password)}
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            autoComplete="off"
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
      </Grid>
      <Button
        id="button"
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        {updateProfile ? "Update" : "Register"}
      </Button>
    </Box>
  );
};

export default SigninForm;
