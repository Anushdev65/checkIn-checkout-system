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
        <Grid item xs={12} sm={6}>
          <TextField
            error={Boolean(touched.firstName && errors.firstName)}
            autoComplete="off"
            name="firstName"
            required
            fullWidth
            id="firstName"
            label="First Name"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.firstName}
          />
          <MUIError
            touch={touched.firstName}
            error={errors.firstName}
            value={false}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            error={Boolean(touched.lastName && errors.lastName)}
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="Last name"
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <MUIError
            touch={touched.lastName}
            error={errors.lastName}
            value={false}
          />
        </Grid>

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
        <Grid item xs={12}>
          <TextField
            error={Boolean(touched.phoneNumber && errors.phoneNumber)}
            required
            fullWidth
            id="phoneNumber"
            label="Phone Number"
            name="phoneNumber"
            autoComplete="off"
            value={values.phoneNumber}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <MUIError
            touch={touched.phoneNumber}
            error={errors.phoneNumber}
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
