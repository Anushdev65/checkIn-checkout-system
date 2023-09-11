import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

// Displays a loading spinner in the center of the screen.
export default function MUILoading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress disableShrink />
    </div>
  );
}
