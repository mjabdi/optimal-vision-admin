import React, { useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

import { Avatar, Button, Grid, Tooltip, withStyles } from "@material-ui/core";
import GlobalState from "./GlobalState";
import MyMenu from "./Menu";
import { getMenuContent, getMenuId, getMenuIndex } from "./MenuList";

import { useLocation, useHistory } from "react-router-dom";
import Copyright from "./CopyRight";
import { useMediaQuery } from "react-responsive";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import AppsIcon from "@material-ui/icons/Apps";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import dateformat from "dateformat";
import { getRole, setRole, clearRole } from "./Role";
import { getGlobalPath, getMenuIdFromGlobalPath } from "./GlobalPath";

import logoImage from "./images/optimal-vision-logo.png"

const drawerWidth = 240;

const StyledMenu = withStyles((theme) => ({
  paper: {
    marginTop: "10px",
    // marginRight: "5px",
    width: "200px",
    height: "200px",
    border: `1px solid #ddd`,
    borderRadius: "10px",
    paddingTop: "10px",
  },
}))((props) => (
  <Menu
    elevation={4}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuApps = withStyles((theme) => ({
  paper: {
    marginTop: "5px",
    // marginRight: "5px",
    width: "280px",
    height: "280px",
    border: `1px solid #ddd`,
    borderRadius: "10px",
    padding: "10px",
  },
}))((props) => (
  <Menu
    elevation={4}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    // marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    overflowX: "hidden",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),

    [theme.breakpoints.down("sm")]: {
      opacity: 0.9,
    },
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },

  appbarTitle: {
    color: "#00a1c5",
    fontSize: "1.2rem",
    fontWeight: "500",
    marginRight: "15px",
  },

  appbarCenter: {
    position: "fixed",
    width: "260px",
    top: "10px",
    left: "50%",
    marginLeft: "-130px",
    alignItems: "center",
    justify: "center",
    display: "flex",
  },

  logoImage: {
    width: "204px",
    height: "45px",
    // marginLeft: "0px",
  },

  logoImageMenu: {
    width: "136px",
    height: "30px",
  },


  userAvatar: {
    backgroundColor: "#fff",
    borderColor: "#aaa",
    border: "1px solid",
    color: "#aaa",
    cursor: "pointer",
  },

  userAvatarSelected: {
    backgroundColor: "#fff",
    borderColor: theme.palette.primary.main,
    border: "1px solid",
    color: theme.palette.primary.main,
    cursor: "pointer",
  },

  userAvatarBig: {
    backgroundColor: "#fff",
    borderColor: theme.palette.primary.main,
    border: "1px solid",
    color: theme.palette.primary.main,
    width: "60px",
    height: "60px",
  },

  appBarText: {
    color: "#888",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },

  appBarAppsIcon: {
    // color: "#888",
    cursor: "pointer",
    fontSize: "1.8rem",
  },

  appBarAppsIconSelected: {
    cursor: "pointer",
    fontSize: "1.8rem",
    color: theme.palette.primary.main,
  },

  usernameLabel: {
    fontSize: "1.2rem",
    color: theme.palette.primary.main,
    marginTop: "5px",
    marginBottom: "5px",
  },

  lastLoginLabel: {
    color: "#777",
    paddingTop: "5px",
  },

  appsLogo: {
    width: "70px",
    height: "70px",
  },

  appsBox: {
    cursor: "pointer",
    transition: "all 0.1s ease-in-out",
    padding: "2px",
    borderBottom: `5px solid #fff`,
    borderRadius: "5px",
    // border: "2px solid #fff",
    "&:hover": {
      //      border: `2px solid ${theme.palette.primary.main}`,
      //      borderRadius: "10px",
      borderBottom: `5px solid ${theme.palette.primary.main}`,
      transition: "all 0.1s ease-in-out",
    },
  },

  appsBoxSelected: {
    cursor: "pointer",
    transition: "all 0.1s ease-in-out",
    padding: "2px",
    borderBottom: `5px solid${theme.palette.primary.light}`,
    borderRadius: "5px",
    // border: "2px solid #fff",
    "&:hover": {
      //      border: `2px solid ${theme.palette.primary.main}`,
      //      borderRadius: "10px",
      borderBottom: `5px solid ${theme.palette.primary.light}`,
      transition: "all 0.1s ease-in-out",
    },
  },

  appsAdminLabel: {
    color: "#0264d4",
    fontWeight: "600",
    fontSize: "0.95rem",
    marginTop: "-10px",
  },

  appsPCRLabel: {
    color: "#4faef7",
    fontWeight: "600",
    fontSize: "0.95rem",
    marginTop: "-10px",
  },

  appsGynaeLabel: {
    color: "#e83caf",
    fontWeight: "600",
    fontSize: "0.95rem",
    marginTop: "-10px",
  },

  appsGPLabel: {
    color: "#f68529",
    fontWeight: "600",
    fontSize: "0.95rem",
    marginTop: "-10px",
  },

  appsSTDLabel: {
    color: "#f68529",
    fontWeight: "600",
    fontSize: "0.95rem",
    marginTop: "-10px",
  },


  

  appsInToolbar: {
    position: "fixed",
    left: "60px",
    top: "-5px",
    height: "65px",
    width: "200px",
    overflow: "hidden",
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const [state, setState] = React.useContext(GlobalState);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [open, setOpen] = React.useState(isMobile ? false : true);

  const [currentMenuIndex, setCurrentMenuIndex] = React.useState(0);

  const [anchorUserAvatar, setAnchorUserAvatar] = React.useState(null);
  const handleUserAvatarClick = (event) => {
    setAnchorUserAvatar(event.currentTarget);
  };
  const handleUserAvatarClose = () => {
    setAnchorUserAvatar(null);
  };

  const [anchorApps, setAnchorApps] = React.useState(null);
  const handleAppsClick = (event) => {
    setAnchorApps(event.currentTarget);
  };
  const handleAppsClose = () => {
    setAnchorApps(null);
  };

  const history = useHistory();

  let location = useLocation();
  React.useEffect(() => {
    if (!state.role) return;
    const index = getMenuIndex(
      state.role,
      getMenuIdFromGlobalPath(location.pathname)
    );
    setState((state) => ({ ...state, currentMenuIndex: index }));
  }, [location]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setCurrentMenuIndex(state.currentMenuIndex);
    if (isMobile) {
      setOpen(false);
    }
  }, [state.currentMenuIndex]);

  const handleDrawerOpen = () => {
    setOpen(!open);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const handleLogout = () => {
    localStorage.removeItem("ovadmin-auth-token");
    sessionStorage.removeItem("ovadmin-auth-token");
    clearRole();

    setState((state) => ({ signedIn: false }));
    history.replace("./login");
  };

  const appsClicked = (role) => {
    setRole(role);
    setState((state) => ({ ...state, role: role }));
    history.push(getGlobalPath(`/${getMenuId(role, 0)}`));
    handleAppsClose();
  };

  const getAppsLogo = (role) => {
    switch (role) {
      case "admin":
        return (
          <img
            src={getGlobalPath("/images/admin.png")}
            className={classes.appsLogo}
          />
        );
      case "pcr":
        return (
          <img
            src={getGlobalPath("/images/corona.png")}
            className={classes.appsLogo}
          />
        );

      case "gynae":
        return (
          <img
            src={getGlobalPath("/images/woman.png")}
            className={classes.appsLogo}
          />
        );

        case "gp":
        return (
          <img
            src={getGlobalPath("/images/doctor.png")}
            className={classes.appsLogo}
          />
        ); 

        case "std":
          return (
            <img
              src={getGlobalPath("/images/std-icon.png")}
              className={classes.appsLogo}
            />
          ); 

      default:
        return null;
    }
  };

  const getAppsLabel = (role) => {
    switch (role) {
      case "admin":
        return <div className={classes.appsAdminLabel}> {"Admin"} </div>;
      case "pcr":
        return <div className={classes.appsPCRLabel}> {"PCR"} </div>;
      case "gynae":
        return <div className={classes.appsGynaeLabel}> {"Gynae"} </div>;
        case "gp":
          return <div className={classes.appsGPLabel}> {"GP"} </div>;
          case "std":
            return <div className={classes.appsSTDLabel}> {"STD"} </div>;
  
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      {state.userId && state.role && (
        <React.Fragment>
          <div className={classes.root}>
            <CssBaseline />
            <AppBar
              style={{ backgroundColor: "#fff", color: "#555", height: "60px" }}
              position="absolute"
              className={clsx(
                classes.appBar,
                false && open && classes.appBarShift
              )}
            >
              <Toolbar className={classes.toolbar}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  className={clsx(classes.menuButton)}
                >
                  <MenuIcon />
                </IconButton>

                <div className={classes.appsInToolbar}>
                  <Grid container direction="row" alignItems="center">
                    <Grid item>{getAppsLogo(state.role)}</Grid>
                    <Grid item>
                      <div style={{ paddingTop: "8px" }}>
                        {getAppsLabel(state.role)}
                      </div>
                    </Grid>
                  </Grid>
                </div>

                <div className={classes.appbarCenter}>
                  {!isMobile && (
                    <React.Fragment>
                      <img
                        className={classes.logoImage}
                        src={logoImage}
                        alt="logo image"
                      />
                    </React.Fragment> 
                   )}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                    paddingLeft: "2%",
                  }}
                >
                  <Grid
                    container
                    spacing={2}
                    direction="row-reverse"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid item>
                      <Avatar
                        className={
                          anchorUserAvatar
                            ? classes.userAvatarSelected
                            : classes.userAvatar
                        }
                        onClick={handleUserAvatarClick}
                      >
                        <IconButton>
                          <PersonOutlineIcon />
                        </IconButton>
                      </Avatar>
                    </Grid>

                    {state.userId?.roles.find((e) => e === "admin") && (
                      <Grid item>
                        <IconButton onClick={handleAppsClick}>
                          <AppsIcon
                            className={
                              anchorApps
                                ? classes.appBarAppsIconSelected
                                : classes.appBarAppsIcon
                            }
                          />
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>
                </div>
              </Toolbar>
            </AppBar>

            <StyledMenu
              id="user-avatar-menu"
              anchorEl={anchorUserAvatar}
              keepMounted
              open={Boolean(anchorUserAvatar)}
              onClose={handleUserAvatarClose}
            >
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
              >
                <Grid item>
                  <Avatar className={classes.userAvatarBig}>
                    <PersonOutlineIcon style={{ fontSize: "2.5rem" }} />
                  </Avatar>
                </Grid>
                <Grid item>
                  <div className={classes.usernameLabel}>
                    {" "}
                    {state.userId?.username}{" "}
                  </div>
                </Grid>
                {/* <Grid item>
                  <span style={{ color: "#999", fontSize: "0.85rem" }}>
                    Logged in at :
                  </span>
                </Grid>
                <Grid item>
                  <div className={classes.lastLoginLabel}>
                    {dateformat(state.userId?.lastLoginTimeStamp)}
                  </div>
                </Grid> */}

                <Grid item>
                  <Button
                    onClick={handleLogout}
                    variant="outlined"
                    color="secondary"
                    style={{
                      marginTop: "30px",
                      width: "150px",
                      borderRadius: "30px",
                    }}
                  >
                    Logout
                  </Button>
                </Grid>
              </Grid>
            </StyledMenu>

            <StyledMenuApps
              id="apps-menu"
              anchorEl={anchorApps}
              keepMounted
              open={Boolean(anchorApps)}
              onClose={handleAppsClose}
            >
              <Grid container spacing={1}>
                <Grid item>
                  <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    className={
                      state.role === "admin"
                        ? classes.appsBoxSelected
                        : classes.appsBox
                    }
                    onClick={() => appsClicked("admin")}
                  >
                    <Grid item>{getAppsLogo("admin")}</Grid>
                    <Grid item>{getAppsLabel("admin")}</Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    className={
                      state.role === "pcr"
                        ? classes.appsBoxSelected
                        : classes.appsBox
                    }
                    onClick={() => appsClicked("pcr")}
                  >
                    <Grid item>{getAppsLogo("pcr")}</Grid>
                    <Grid item>{getAppsLabel("pcr")}</Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    className={
                      state.role === "gynae"
                        ? classes.appsBoxSelected
                        : classes.appsBox
                    }
                    onClick={() => appsClicked("gynae")}
                  >
                    <Grid item>{getAppsLogo("gynae")}</Grid>
                    <Grid item>{getAppsLabel("gynae")}</Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    className={
                      state.role === "gp"
                        ? classes.appsBoxSelected
                        : classes.appsBox
                    }
                    onClick={() => appsClicked("gp")}
                  >
                    <Grid item>{getAppsLogo("gp")}</Grid>
                    <Grid item>{getAppsLabel("gp")}</Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    className={
                      state.role === "std"
                        ? classes.appsBoxSelected
                        : classes.appsBox
                    }
                    onClick={() => appsClicked("std")}
                  >
                    <Grid item>{getAppsLogo("std")}</Grid>
                    <Grid item>{getAppsLabel("std")}</Grid>
                  </Grid>
                </Grid>

              </Grid>
            </StyledMenuApps>

            <Drawer
              variant={isMobile ? "temporary" : "persistent"}
              classes={{
                paper: clsx(
                  classes.drawerPaper,
                  !open && classes.drawerPaperClose
                ),
              }}
              open={open}
            >
              <div className={classes.toolbarIcon}>
                <React.Fragment>
                  <img
                    className={classes.logoImageMenu}
                    src={logoImage} 
                    alt="logo image"

                  />
                </React.Fragment>
                <IconButton onClick={handleDrawerClose}>
                  <ChevronLeftIcon />
                </IconButton>
              </div>
              <Divider />

              <MyMenu />
            </Drawer>

            <main className={classes.content}>
              <div className={classes.appBarSpacer} />
              <Container
                maxWidth={isMobile ? "xs" : "xl"}
                className={classes.container}
              >
                {getMenuContent(state.role, currentMenuIndex)}
              </Container>
            </main>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
