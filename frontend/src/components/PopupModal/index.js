import CloseIcon from "@mui/icons-material/Close";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import Box from "@mui/material/Box";
import { Divider } from "@mui/material";
import { Button, TextareaAutosize } from "@mui/material";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import "../../styles/muimodal.css";
import TextField from "@mui/material/TextField";

import { useUserCheckInMutation } from "../../services/api/timeTracking";
import { getUserInfo } from "../../localStorage/localStorage";
import dayjs from "dayjs";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const diologContentElement = document.querySelector(".custom-dialog");
      if (diologContentElement) {
        setIsScrolled(diologContentElement.scrollTop > 0);
      }
    };
    const diologContentElement = document.querySelector(".custom-dialog");
    if (diologContentElement) {
      diologContentElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (diologContentElement) {
        diologContentElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);
  return (
    <DialogTitle
      className={`dialogTitle ${isScrolled ? "scrolled" : ""}`}
      sx={{
        m: 0,
        p: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      {...other}
    >
      <ManageAccountsOutlinedIcon sx={{ mr: 2 }} />
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function CheckInPop({ open, handleClose }) {
  const { user } = getUserInfo();
  const userId = user?._id;

  const currentTime = dayjs();

  const [plannedWorkingHours, setPlannedWorkingHours] = useState("");
  const [workTitle, setWorkTitle] = useState("");

  const predefinedHours = [
    "2 hours",
    "4 hours",
    "6 hours",
    "8 hours",
    "10 hours",
  ];
  // Defining the fetched api of checkIn
  const [userCheckIn, { data: checkInData, error: checkInError }] =
    useUserCheckInMutation();

  const handleCheckIn = async () => {
    try {
      const requestBody = {
        id: userId,
        checkIn: currentTime.format("hh:mm.ss-A"),
        title: workTitle,
        plannedWorkingHours: parseFloat(plannedWorkingHours),
      };

      const response = await userCheckIn({ body: requestBody });

      if (response.error) {
        console.error("Check-In Error", response.error);
      } else {
        console.log("Check-In successful", response.data);
        // Handle successful check-in here
        handleClose();
      }
    } catch (error) {
      console.error("Check-In Error", error);
    }
  };
  // Event handlers to update workTitle and plannedWorking hours

  const handleWorkTitleChange = (event) => {
    setWorkTitle(event.target.value);
  };

  const handlePlannedWorkingHoursChange = (hours) => {
    setPlannedWorkingHours(hours);
  };
  return (
    <div>
      <BootstrapDialog
        onClose={() => {
          handleClose();
        }}
        aria-labelledby="customized-dialog-title"
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        maxWidth={"sm"}
        fullWidth={true}
        style={{
          width: "35%",
          height: "100vh",
          margin: "0 auto",
        }}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() => {
            handleClose();
          }}
        >
          check-In Credentials
        </BootstrapDialogTitle>
        <DialogContent dividers className="custom-dialog">
          <Container component="main">
            <CssBaseline />
            <Box
              component="form"
              noValidate
              // onSubmit={handleSubmit}
              // sx={{ mt: 3 }}
            >
              <div>
                <h5 className="modal-headers">
                  What shall the title of your work be?
                </h5>
                <TextField
                  variant="standard"
                  margin="normal"
                  fullWidth
                  id="title"
                  label="Set the title for your work."
                  name="title"
                  autoFocus
                  value={workTitle} // Binding the value to the workTitle State
                  onChange={handleWorkTitleChange} // Adding event handler
                />
              </div>
              <Divider />
              <div>
                <h5 className="modal-headers">
                  Please choose the number of hours you plan on working!
                </h5>
                <div
                  style={{
                    display: "inline-block",
                  }}
                >
                  {predefinedHours.map((hours) => (
                    <Button
                      key={hours}
                      variant="outlined"
                      onClick={() => {
                        handlePlannedWorkingHoursChange(hours);
                        console.log(`selected hours: ${hours}`);
                      }}
                      style={{
                        margin: "4px",
                        backgroundColor:
                          plannedWorkingHours === hours ? "#1976D2" : "white",
                        color:
                          plannedWorkingHours === hours ? "white" : "black",
                      }}
                    >
                      {hours}
                    </Button>
                  ))}
                </div>
              </div>
              <Divider />

              <div>
                <h5 className="modal-headers">
                  {" "}
                  I don't want to decide, just let me check-in!
                </h5>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleCheckIn}
                  // className="button-changes"
                  style={{
                    marginLeft: "12.5rem",
                  }}
                >
                  Check-In
                </Button>
              </div>
            </Box>
          </Container>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
