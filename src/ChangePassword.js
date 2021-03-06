import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import { Avatar, Backdrop, Button, CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Tooltip, Typography } from "@material-ui/core";
import GlobalState from "./GlobalState";
import CssBaseline from "@material-ui/core/CssBaseline";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Alert from "@material-ui/lab/Alert";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import UserService from "./services/UserService";

const useStyles = makeStyles((theme) => ({
    root: {
        height: "80vh",
      },
      
      paper: {
        margin: theme.spacing(8, 4),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
    
      timeLeft: {
        color: theme.palette.secondary.main,
        marginLeft: theme.spacing(1),
        fontWeight: "500",
      },
    
      timeLeftThin: {
        color: theme.palette.secondary.main,
        // marginLeft: theme.spacing(1),
        fontWeight: "400",
      },


}));

export default function ChangePassword() {
  const classes = useStyles();
  
  const [error, setError] = React.useState(null)
  const [successfullyFinished, setSuccessfullyFinished] = React.useState(false)

  const [showPassword, setShowPassword] = React.useState(false);
  const [submiting, setSubmiting] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = React.useState("");

  const [passwordError, setPasswordError] = React.useState(false);
  const [newPasswordError, setNewPasswordError] = React.useState(false);
  const [newPasswordRepeatError, setNewPasswordRepeatError] = React.useState(false);

  const passwordChanged = (event) => {
    setPassword(event.target.value);
    setPasswordError(false);
  };

  const newPasswordChanged = (event) => {
    setNewPassword(event.target.value);
    setNewPasswordError(false);
    setNewPasswordRepeatError(false);
  };

  const newPasswordRepeatChanged = (event) => {
    setNewPasswordRepeat(event.target.value);
    setNewPasswordError(false);
    setNewPasswordRepeatError(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = () =>
  {
      if (!validate())
      {
          return
      }

      const payload = {
          password: password,
          newPassword: newPassword
      }

      setSubmiting(true)
      UserService.changePassword(payload).then(res => {
          setSubmiting(false)
          if (res.data.status === "OK") {
            setError(null)  
            setSuccessfullyFinished(true);
            clearForm()
          } else if (res.data.status === "FAILED") {
            setError(res.data.error);
          } else {
            setError("Sorry, something went wrong, please try again.");
          }

      }).catch(err => {
        setSubmiting(false);
        console.error(err);
        setError("Sorry, something went wrong, please try again.");
      })

  }

  const clearForm = () =>
  {
      setPassword('')
      setNewPassword('')
      setNewPasswordRepeat('')
  }

  const validate = () => {

    let error = false

    setSuccessfullyFinished(false);

    setError(null)

    if (!password || password.length < 1)
    {
        setPasswordError(true)
        error = true
    }

    if (!newPassword || newPassword.length < 1)
    {
        setNewPasswordError(true)
        error = true
    }

    if (!newPasswordRepeat || newPasswordRepeat.length < 1)
    {
        setNewPasswordRepeatError(true)
        error = true
    }

    if (error)
        return false

    if (newPassword.length < 8)
    {
        setNewPasswordError(true)
        setNewPasswordRepeatError(true)
        setError("Password must be 8 or more characters in length");
        return false
    }

    if (newPassword !== newPasswordRepeat)
    {
        setNewPasswordError(true)
        setNewPasswordRepeatError(true)
        setError("Password and Repeat Password do not match");
        return false
    }

    return !error

  }

  return (
    <React.Fragment>
      <Grid
        container
        component="main"
        className={classes.root}
        justify="center"
      >
        <CssBaseline />

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Change Password
            </Typography>

            {successfullyFinished && (
            <div className={classes.alert}>
              <Alert severity="success">
                <div
                  style={{
                    lineHeight: "2.5rem",
                    fontSize: "1rem",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  Success - Your password is sucesssfully changed.
                </div>
              </Alert>
            </div>
          )}

            {error && !successfullyFinished && (
              <div className={classes.alert}>
                <Alert severity="error">
                  {" "}
                  <div style={{ lineHeight: "1.5rem", textAlign: "justify" }}>
                    {error}
                  </div>
                </Alert>
              </div>
            )}

            <FormControl
              style={{marginTop:"50px"}}  
              fullWidth
              required
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password1">
                {" "}
                Current Password{" "}
              </InputLabel>
              <OutlinedInput
                error={passwordError}
                id="outlined-adornment-password1"
                name="outlined-adornment-password1"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={passwordChanged}
                autoComplete="new-password"
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
                labelWidth={150}
              />
            </FormControl>

            <FormControl
              fullWidth
              required
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password2">
                {" "}
                New Password{" "}
              </InputLabel>
              <OutlinedInput
                error={newPasswordError}
                id="outlined-adornment-password2"
                name="outlined-adornment-password2"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={newPasswordChanged}
                autoComplete="new-password"
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
                labelWidth={150}
              />
            </FormControl>

            <FormControl
              fullWidth
              required
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password3">
                {" "}
                Repeat New Password{" "}
              </InputLabel>
              <OutlinedInput
                error={newPasswordRepeatError}
                id="outlined-adornment-password3"
                name="outlined-adornment-password3"
                type={showPassword ? "text" : "password"}
                value={newPasswordRepeat}
                onChange={newPasswordRepeatChanged}
                autoComplete="new-password"
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
                labelWidth={200}
              />
            </FormControl>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={changePassword}
              className={classes.submit}
            >
              Change password
            </Button>
          </div>
        </Grid>
      </Grid>

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
                  Please wait ...{" "}
                </span>
              </Grid>
            </Grid>
          </Backdrop>
    </React.Fragment>
  );
}
