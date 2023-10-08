import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

function PauseTimerDialog({
  open,
  onClose,
  onReasonSubmit,
  reason,
  setReason,
}) {
  // const [reason, setReason] = useState("");

  const handleReasonChange = (event) => {
    setReason(event.target.value);
    console.log("Reason changed:", event.target.value);
  };

  const handleSubmit = () => {
    // Call the onReasonSubmit callback with the reason
    onReasonSubmit(reason);
    console.log("Submitting reason:", reason);
    // Clear the reason field and close the dialog
    setReason("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      {/* <DialogTitle>Pause Timer</DialogTitle> */}
      <DialogContent>
        <TextField
          label="Reason for Pause"
          variant="outlined"
          fullWidth
          value={reason}
          onChange={handleReasonChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PauseTimerDialog;
