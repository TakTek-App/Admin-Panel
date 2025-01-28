import {
  Box,
  IconButton,
  Toolbar,
  CssBaseline,
  Typography,
  styled,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import {
  Business,
  Category,
  Home,
  HomeRepairService,
  Logout,
  People,
} from "@mui/icons-material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const PersistentDrawer = () => {
  const { setSignedIn } = useAuth();
  const logout = () => {
    setSignedIn(false);
  };
  const navigate = useNavigate();
  // const theme = useTheme();
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };

  const itemList = [
    { text: "Home", icon: <Home />, onClick: () => navigate("/home") },
    { text: "Users", icon: <People />, onClick: () => navigate("/users") },
    {
      text: "Services",
      icon: <HomeRepairService />,
      onClick: () => navigate("/services"),
    },
    {
      text: "Categories",
      icon: <Category />,
      onClick: () => navigate("/categories"),
    },
    {
      text: "Companies",
      icon: <Business />,
      onClick: () => navigate("/companies"),
    },
    {
      text: "Logout",
      icon: <Logout />,
      onClick: () => logout(),
    },
  ];
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                mr: 2,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">TakTek Admin Panel</Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        anchor="left"
        open={open}
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <DrawerHeader>
          {/* <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? <ChevronLeft /> : <ChevronRight />}
          </IconButton> */}
        </DrawerHeader>
        <Divider />
        <List>
          {itemList.map((item) => {
            const { text, icon, onClick } = item;
            return (
              <ListItemButton key={text} onClick={onClick}>
                {icon && <ListItemIcon>{icon}</ListItemIcon>}
                <ListItemText primary={text} />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>
      {/* <Main open={open}>
        {children}
      </Main> */}
    </Box>
  );
};

export default PersistentDrawer;
