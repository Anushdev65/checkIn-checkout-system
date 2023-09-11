import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EnhancedEncryptionOutlinedIcon from "@mui/icons-material/EnhancedEncryptionOutlined";
import FeedbackIcon from "@mui/icons-material/Feedback";
import FoodBankOutlinedIcon from "@mui/icons-material/FoodBankOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import * as React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import "../../styles/navbar.css";
const drawerWidth = 240;

const navData = [
  {
    name: "Home",
    icon: <FoodBankOutlinedIcon />,
  },
  {
    name: "Track Logs",
    icon: <FeedbackIcon />,
  },
  {
    name: "My Profile",
    icon: <AccountBoxIcon />,
    // link: "/myprofile",
  },
  {
    name: "Update Password",
    icon: <EnhancedEncryptionOutlinedIcon />,
    // link: "/auth/update-password",
  },
];

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MUINavbar() {
  // state for tracking whether the user has scrolled
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Theme for the user interface
  const theme = useTheme();

  // State for managing the open/close state of the drawer
  const [open, setOpen] = React.useState(true);

  // State for tracking the currently active navigation link
  const [activeLink, setActiveLink] = React.useState("");

  // Location object to get the current pathname
  const location = useLocation();

  // Effect to add a scroll event listener when the component mounts
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    // Add the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Remove the scroll event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Effect to set the active link based on the current pathname
  React.useEffect(() => {
    // Get the stored active link from local storage
    const storedActiveLink = localStorage.getItem("activeLink");
    if (storedActiveLink) {
      setActiveLink(storedActiveLink);
    }
    // Find the active navigation item based on the current pathname
    const activeNavItem = navData.find((item) => {
      return location.pathname === item.link;
    });

    if (activeNavItem) {
      setActiveLink(activeNavItem.name);
    }
  }, [location.pathname]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNavLinkClick = (name) => {
    setActiveLink(name);
    localStorage.setItem("activeLink", name);
  };

  const renderList = (data) => {
    return data.map((item) => (
      <ListItem key={item.name} disablePadding sx={{ display: "block" }}>
        <NavLink
          to={item.link}
          style={{
            textDecoration: "none",
            color: "black",
          }}
          onClick={() => handleNavLinkClick(item.name)}
        >
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
              backgroundColor:
                activeLink === item.name
                  ? "rgba(124, 53, 118, 0.9)"
                  : "transparent",
              color:
                activeLink === item.name ? "rgba(96, 71%, 73%, 0.9)" : "black",

              "&:hover": {
                backgroundColor:
                  activeLink === item.name
                    ? "rgba(8, 3, 8, 0.9)"
                    : "rgba(8, 3, 8, 0.9)",
                color: activeLink === item.name ? "darkgray" : "white",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
                color:
                  activeLink === item.name ? "white" : "rgb(148, 147, 147)",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </NavLink>
      </ListItem>
    ));
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <div className={`nav-container ${isScrolled ? "scrolled" : ""}`}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1, textAlign: "center" }}
            >
              Track your working hours!!
            </Typography>

            <img
              alt=""
              style={{
                height: "40px",
                width: "40px",
                marginRight: "16px",
                borderRadius: "100%",
              }}
            />
          </Toolbar>
        </div>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>{renderList(navData)}</List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
