import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EmailIcon from "@mui/icons-material/Email";
import FemaleIcon from "@mui/icons-material/Female";
import GroupsIcon from "@mui/icons-material/Groups";
import MaleIcon from "@mui/icons-material/Male";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { useGetMyProfileQuery } from "../../services/api/user";
import NavBar from "../NavBar";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// import MUIModal from "./MUIModal";
import "../../styles/myprofile.css";
const MyProfile = () => {
  const { id } = useParams();
  const { data: myProfileData } = useGetMyProfileQuery();
  const [openModal, setOpenModal] = useState(false);

  const handleEditProfile = () => {
    setOpenModal(true);
  };

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
  }, []);

  return (
    <>
      <NavBar />
      <Container component="main">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Container
            style={{
              backgroundColor: "rgb(231, 229, 229)",
              borderTopLeftRadius: "50px",
              width: "850px",
              height: "180px",
            }}
          >
            <img
              src="/classic.jpg"
              alt=""
              style={{
                width: "100%",
                height: "150px",
                marginTop: "20px",
              }}
            ></img>
          </Container>

          <Typography className="myprofile" component="h1" variant="h5" mt={1}>
            {"My profile"}
          </Typography>

          <Button
            className="button-btn"
            variant="contained"
            onClick={handleEditProfile}
          >
            <EditOutlinedIcon />
            Edit Profile
          </Button>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            <Grid
              container
              spacing={2}
              style={{
                marginRight: "15px",
                height: "130px",
                textAlign: "left",
                // marginTop: "0.5px",
              }}
            >
              <Grid item xs={12}>
                <Typography
                  sx={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "row",
                  }}
                >
                  <PersonIcon sx={{ position: "relative", bottom: "2px" }} />
                  {myProfileData?.data?.firstName} {""}
                  {myProfileData?.data?.lastName}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  sx={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "row",
                  }}
                >
                  <EmailIcon sx={{ position: "relative", bottom: "2px" }} />
                  {myProfileData?.data?.email}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  sx={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "row",
                  }}
                >
                  <PhoneIcon sx={{ position: "relative", bottom: "2px" }} />
                  {myProfileData?.data?.phoneNumber}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  sx={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "row",
                  }}
                >
                  {" "}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  sx={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "row",
                  }}
                ></Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  sx={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "row",
                  }}
                ></Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default MyProfile;
