import React from "react";
import { Typography } from "@mui/material";

// Displays an error message when a form field is touched, has an error, and is not filled.
const MUIError = ({ touch, error, value }) => {
  if (touch && error && !value) {
    return (
      <Typography variant="body2" color="error">
        {String(error)}
      </Typography>
    );
  }
  return null;
};

export default MUIError;
