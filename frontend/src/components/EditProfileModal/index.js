import CloseIcon from "@mui/icons-material/Close";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


import "../styles/muimodal.css";
import MUIToast from "./MUIToast";
import SigninForm from "./SigninForm";
import { setUser } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
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

export default function MUIModal({ open, handleClose, userId }) {
  const { id: idParam } = useParams();
  const { data: adminInfo } = useGetMyProfileQuery();
  const [trigger, { data: userData }] = useLazyGetUserByIdQuery();
  const id = idParam || userId;
  const dispatch = useDispatch();
  // const { data: userData } = useGetUserByIdQuery(id);
  // const { data: userDataTable } = useGetUserByIdQuery(userId);

  useEffect(() => {
    if (id) {
      trigger(id);
    }
  }, [trigger, id]);

  const userInfo = id ? userData : adminInfo;
  const [updateProfile, { data: adminUpdate, error: adminError, isSuccess }] =
    useUpdateProfileMutation();
  const [updateUserByAdmin, { data: userUpdate, error: userUpdateError }] =
    useUpdateUserByAdminMutation();

  const data = adminUpdate || userUpdate;
  const error = adminError || userUpdateError;

  const {
    handleBlur,
    touched,
    errors,
    handleChange,
    handleSubmit,
    values,
    handleReset,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: userInfo?.data?.firstName || "",
      lastName: userInfo?.data?.lastName || "",
      role: userInfo?.data?.roles?.length ? userInfo?.data?.roles : [],
      phoneNumber: userInfo?.data?.phoneNumber || "",
      gender: userInfo?.data?.gender || "",
      userImage: userInfo?.data?.profile || "",
    },
    validationSchema: userUpdateProfileSchema,
    onSubmit: (values, action) => {
      const body = {
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender,
        phoneNumber: `${values.phoneNumber}`,
        roles: values.role,
        profile: values.userImage,
      };

      id ? updateUserByAdmin({ body, id }) : updateProfile(body);
      handleClose();
    },
  });

  useEffect(() => {
    if (isSuccess && !id) {
      dispatch(setUser(data?.data));
      setUSerInfo({ user: data?.data });
      resetForm();
      handleReset();
    }
  }, [handleReset, resetForm, id, data, isSuccess, dispatch, handleClose]);

  return (
    <div>
      <BootstrapDialog
        onClose={() => {
          values.userImage = "";
          handleReset();
          handleClose();
        }}
        aria-labelledby="customized-dialog-title"
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        maxWidth={"sm"}
        fullWidth={true}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() => {
            handleReset();
            handleClose();
          }}
        >
          Update Profile
        </BootstrapDialogTitle>
        <DialogContent dividers className="custom-dialog">
          <Container component="main" maxWidth="sm" sx={{ mb: 2 }}>
            <CssBaseline />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <SigninForm
                handleBlur={handleBlur}
                touched={touched}
                errors={errors}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                values={values}
                updateProfile={true}
                user={userInfo?.data}
                id={id}
              />
            </Box>
          </Container>
        </DialogContent>
      </BootstrapDialog>
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
    </div>
  );
}
