import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import GlobalState from "./GlobalState";
import Alert from "@material-ui/lab/Alert";

import logoImage from "./images/optimal-vision-logo.png"

import {
  Grid,
  AppBar,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { IconButton, Toolbar } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import clsx from "clsx";
import Copyright from "./CopyRight";

import { useHistory } from "react-router-dom";
import UserService from "./services/UserService";
import { getMenuId } from "./MenuList";

import { useMediaQuery } from 'react-responsive'
import { borderRadius } from "@material-ui/system";
import { setRole } from "./Role";
import { getGlobalPath } from "./GlobalPath";


const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
  },
  image: {
    backgroundImage: "url(/images/bg.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    // margin: theme.spacing(15, 2),
    padding: theme.spacing(4,4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative"
    // border: `2px solid ${theme.palette.primary.main}`,
    // borderRadius: "8px"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: "#f5f5f5",
  },

  margin: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

  alert: {
    width: "100%",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },

  pageBg:{
    paddingTop: theme.spacing(5),
   
    background: "linear-gradient(274deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 5%, rgba(210,210,210,1) 100%)",
    height: "100vh",
    margin: 0,
    padding:0,
  },

  appbarCenter: {
    position: "absolute",
    // width: "260px",
    top: "-40px",
    right: "0",
    marginLeft: "-145px",
    alignItems: "center",
    justify: "center",
    display: "flex",
    backgroundColor: "#fff",
    padding: "5px 20px 15px 20px",
    borderRadius: "8px"
  },

  logoImage: {
    width: "30px",
    height: "30px",
    marginLeft: "0px",
  },

  appbarTitle: {
    color: "#00a1c5",
    fontSize: "1.2rem",
    fontWeight: "500",
    marginRight: "15px",
  },

  adminPanelLabel: {
    color: theme.palette.secondary.main, 
    fontWeight: "600",
    marginBottom:"20px"
  }




}));

export default function SignIn() {
  const classes = useStyles();
  const [state, setState] = React.useContext(GlobalState);
  const isMobile = useMediaQuery({ maxWidth: 1224 })


  let history = useHistory();

  const [password, setPassword] = React.useState("");

  const [username, setUsername] = React.useState("");

  const [saveChecked, setSaveChecked] = React.useState(false);

  const [showPassword, setShowPassword] = React.useState(false);

  const [error, setError] = React.useState(null);
  const [submiting, setSubmiting] = React.useState(false);

  const signIn = () => {
    setSubmiting(true);

    UserService.signIn({
      username: username,
      password: password,
    })
      .then((res) => {
        setSubmiting(false);
        if (res.data.status === "OK") {
          setError(null);
          const token = res.data.token;
          if (saveChecked) {
            localStorage.setItem("ovadmin-auth-token", token);
          } else {
            sessionStorage.setItem("ovadmin-auth-token", token);
          }

          setState((state) => ({ ...state, signedIn: true }));
          setRole(res.data.roles[0])
          setState((state) => ({ ...state, currentMenuIndex: 0 }));
          history.push(getGlobalPath(`/${getMenuId(res.data.roles[0], 0)}`));
        } else if (res.data.status === "FAILED") {
          setError(res.data.error);
        } else {
          setError("Sorry, something went wrong, please try again.");
        }
      })
      .catch((err) => {
        setSubmiting(false);
        console.error(err);
        setError("Sorry, something went wrong, please try again.");
      });
  };

  const usernameChanged = (event) => {
    setUsername(event.target.value);
    setError(null);
  };

  const passwordChanged = (event) => {
    setPassword(event.target.value);
    setError(null);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const saveCheckedChanged = (event) => {
    setSaveChecked(event.target.checked);
  };

  return (
    <div className={classes.pageBg}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <Paper elevation={20}>
          <div className={classes.paper}>
            {/* <div className={classes.appbarCenter}>
              <span className={classes.appbarTitle}>
                Medical Express Clinic
              </span>

              <img
                className={classes.logoImage}
                src={getGlobalPath("/images/logo.png")}
                alt="logo image"
              />
            </div> */}

            <img src={logoImage} alt="Optimal Vision" style={{marginBottom:"20px"}}/>

            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography
              component="h1"
              variant="h6"
              className={classes.adminPanelLabel}
            >
              Admin Panel
            </Typography>

            {error && (
              <div className={classes.alert}>
                <Alert severity="error">
                  {" "}
                  <div style={{ lineHeight: "1.5rem", textAlign: "justify" }}>
                    {error}
                  </div>
                </Alert>
              </div>
            )}

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="email"
              autoComplete="username"
              value={username}
              onChange={usernameChanged}
              on
              autoFocus
            />
            <FormControl
              fullWidth
              required
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  signIn();
                }
              }}
            >
              <InputLabel htmlFor="outlined-adornment-password">
                {" "}
                Password{" "}
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                name="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={passwordChanged}
                autoComplete="current-password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      tabindex="-1"
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={100}
              />
            </FormControl>

            <FormControlLabel
              style={{ textAlign: "left", width: "100%" }}
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  checked={saveChecked}
                  onChange={saveCheckedChanged}
                />
              }
              label="Remember me"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={signIn}
              className={classes.submit}
            >
              Sign In
            </Button>
          </div>
        </Paper>

        <Backdrop className={classes.backdrop} open={submiting}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <CircularProgress color="inherit" />
            </Grid>
            <Grid item>
              <span style={{ textAlign: "center", color: "#fff" }}>
                {" "}
                {/* Please wait ...{" "} */}
              </span>
            </Grid>
          </Grid>
        </Backdrop>

        <Box mt={5} style={{ color: "#eee" }}>
          {/* <Copyright /> */}
        </Box>
      </Container>
    </div>
  );
}
