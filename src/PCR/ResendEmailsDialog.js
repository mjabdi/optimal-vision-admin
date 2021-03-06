import React, { useEffect, useRef, useState } from "react";
import BookService from "./services/BookService";
import Typography from "@material-ui/core/Typography";
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Link,
  makeStyles,
  TextField,
  Tooltip,
} from "@material-ui/core";
import GlobalState from "./../GlobalState";
import { withStyles } from "@material-ui/core/styles";

import SendIcon from "@material-ui/icons/Send";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";

import DialogTitle from "@material-ui/core/DialogTitle";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";

import Alert from "@material-ui/lab/Alert";

import PropTypes from "prop-types";
import LinearProgress from "@material-ui/core/LinearProgress";
import Box from "@material-ui/core/Box";

var interval;

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(1),
  },

  refreshButton: {
    marginLeft: theme.spacing(2),
  },

  checkIcon: {
    color: "green",
  },

  closeIcon: {
    color: "red",
  },

  RefLink: {
    cursor: "pointer",
  },

  BookedLabel: {
    backgroundColor: "#606060",
    color: "#fff",
    paddingRight: "10px",
    paddingLeft: "10px",
  },

  PatientAttendedLabel: {
    backgroundColor: "#0066aa",
    color: "#fff",
    paddingRight: "15px",
    paddingLeft: "10px",
  },

  SampleTakenLabel: {
    backgroundColor: "#0066cc",
    color: "#fff",
    paddingRight: "40px",
    paddingLeft: "10px",
  },

  ReportSentLabel: {
    backgroundColor: "#009900",
    color: "#fff",
    paddingRight: "90px",
    paddingLeft: "10px",
  },

  ReportCertSentLabel: {
    backgroundColor: "#009900",
    color: "#fff",
    paddingRight: "68px",
    paddingLeft: "10px",
  },

  archiveButton: {},

  smartMatchButton: {
    backgroundColor: "#2f942e",
    "&:hover": {
      background: "green",
      color: "#fff",
    },
    textDecoration: "none !important",
    marginRight: "10px",
    // padding: "10px"
  },

  infoTitle: {
    fontWeight: "400",
  },

  infoData: {
    paddingLeft: "10px",
    fontWeight: "800",
  },

  matchButton: {
    marginTop: "30px",
    marginBottom: "20px",
    backgroundColor: "#2f942e",
    "&:hover": {
      background: "green",
      color: "#fff",
    },
    textDecoration: "none !important",
    padding: "10px",
    paddingLeft: "50px",
    paddingRight: "50px",
  },

  resendButton: {
    marginTop: "5px",
    marginBottom: "5px",
    backgroundColor: "#2f942e",
    "&:hover": {
      background: "green",
      color: "#fff",
    },
    textDecoration: "none !important",
    padding: "10px",
    paddingLeft: "50px",
    paddingRight: "50px",
  },

  resendFilesButton: {
    marginTop: "5px",
    marginBottom: "5px",
    backgroundColor: "#3792ad",
    "&:hover": {
      background: "#2f798f",
      color: "#fff",
    },
    textDecoration: "none !important",
    padding: "10px",
    paddingLeft: "50px",
    paddingRight: "50px",
  },

  cancelButton: {
    marginBottom: "10px",
    textDecoration: "none !important",
    padding: "10px",
    paddingLeft: "90px",
    paddingRight: "90px",
  },
}));

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: "#cedbce", //theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#2f942e",
  },
}))(LinearProgress);
function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <BorderLinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography
          style={{ fontWeight: "800", color: "#5e855e" }}
          variant="body2"
          color="textSecondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function ResendEmailsDialog(props) {
  const classes = useStyles();

  const [state, setState] = React.useContext(GlobalState);

  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const [sendJustToPCR, setSendJustToPCR] = React.useState(false);

  const [sendingStatus, setSendingStatus] = React.useState("");

  const [sendingProgress, setSendingProgress] = React.useState(10);

  const [error, setError] = React.useState(false);

  const getProgress = (status) => {
    console.log(`status : ${status}`);

    if (status === "downloadFailed") return 10;
    else if (status === "downloading") return 30;
    else if (status === "downloadSuccess") return 70;
    else if (status === "sent") return 100;
    else return 0;
  };

  const handleClose = () => {
    setSending(false);
    setSent(false);
    setError(false);
    clearInterval(interval);
    props.handleClose();
  };

  useEffect(() => {
    setSendingProgress((prevProgress) =>
      prevProgress >= 100 ? 100 : getProgress(sendingStatus)
    );
  }, [sendingStatus]);

  const resendFilesClicked = (event) => {
    setSending(true);
    setSendingProgress(0);
    setSendingStatus("downloadFailed");
    setSendJustToPCR(true);

    BookService.regenerateFilesWithBookingId(props.booking._id)
      .then((res) => {
        interval = setInterval(() => {
          BookService.getLinkDetailsWithBookingId(props.booking._id).then(
            (res) => {
              if (res.data.status === "OK") {
                setSendingStatus(res.data.link.status);

                if (res.data.link.status === "sent") {
                  setSending(false);
                  setSent(true);
                  clearInterval(interval);
                }
              } else if (res.data.status === "FAILED") {
                setSending(false);
                setSent(false);
                clearInterval(interval);
                setError(true);
              }
            }
          );
        }, 1000);

        setTimeout(() => {
          setError(true);
          clearInterval(interval);
        }, 60000);
      })
      .catch((err) => {
        console.log(err);
        setSending(false);
      });
  };

  const resendEmailsClicked = (event) => {
    setSending(true);
    setSendingProgress(0);
    setSendingStatus("downloadFailed");

    BookService.resendEmailsWithBookingId(props.booking._id)
      .then((res) => {
        interval = setInterval(() => {
          BookService.getLinkDetailsWithBookingId(props.booking._id).then(
            (res) => {
              if (res.data.status === "OK") {
                setSendingStatus(res.data.link.status);

                if (res.data.link.status === "sent") {
                  setSending(false);
                  setSent(true);
                  clearInterval(interval);
                }
              } else if (res.data.status === "FAILED") {
                setSending(false);
                setSent(false);
                clearInterval(interval);
                setError(true);
              }
            }
          );
        }, 1000);

        setTimeout(() => {
          setError(true);
          clearInterval(interval);
        }, 60000);
      })
      .catch((err) => {
        console.log(err);
        setSending(false);
      });
  };

  const cancelResendEmailsClicked = (event) => {
    props.handleClose();
  };

  return (
    <React.Fragment>
      {props.booking && (
        <React.Fragment>
          <Dialog
            maxWidth="md"
            open={props.open}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="draggable-dialog-title">
              <Grid
                container
                spacing={2}
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Grid item>
                  <SendIcon style={{ color: "#2f942e", fontSize: "2rem" }} />
                </Grid>

                <Grid item>
                  <div
                    style={{
                      color: "#2f942e",
                      paddingBottom: "12px",
                      fontWeight: "800",
                    }}
                  >
                    {" "}
                    RESEND EMAILS{" "}
                  </div>
                </Grid>
              </Grid>

              <Divider />
            </DialogTitle>
            <DialogContent>
              <div
                style={{
                  height: "230px",
                }}
              >
                <Grid
                  container
                  direction="column"
                  justify="center"
                  spacing={1}
                  alignItems="center"
                >
                  {!sent && !sending && (
                    <React.Fragment>
                      <Grid item>
                        <div
                          style={{
                            paddingTop: "5px",
                            fontSize: "1rem",
                            fontWeight: "500",
                            color: "#555",
                          }}
                        >
                          Do you want to Resend the LAB Report{" "}
                          {props.booking.certificate ? " and Certificate" : ""}{" "}
                          Now?
                        </div>
                      </Grid>

                      <Grid item>
                        <Button
                          disabled={sending || sent}
                          className={classes.resendButton}
                          variant="contained"
                          color="primary"
                          onClick={resendEmailsClicked}
                        >
                          YES ! RESEND THE EMAILS
                        </Button>
                      </Grid>

                      <Grid item>
                        <Button
                          disabled={sending || sent}
                          className={classes.cancelButton}
                          variant="contained"
                          color="default"
                          onClick={cancelResendEmailsClicked}
                        >
                          NO ! NOT NOW
                        </Button>
                      </Grid>

                      <Grid item>
                        <Button
                          disabled={sending || sent}
                          className={classes.resendFilesButton}
                          variant="contained"
                          color="primary"
                          onClick={resendFilesClicked}
                        >
                          Just Generate The Files and send to
                          pcrresults@medicalexpressclinic.co.uk
                        </Button>
                      </Grid>
                    </React.Fragment>
                  )}

                  {error && !sending && !sent && (
                    <Grid item>
                      <Alert
                        style={{
                          marginTop: "10px",
                          paddingLeft: "50px",
                          paddingRight: "50px",
                        }}
                        severity="error"
                      >
                        Error! — Something is wrong with this record!
                      </Alert>
                    </Grid>
                  )}

                  {(sending || sent) && (
                    <Grid item>
                      <div
                        style={{
                          paddingTop: "50px",
                          color: "#2f942e",
                          fontWeight: "600",
                          fontSize: "1rem",
                        }}
                      >
                        {sending && !sent && "Sending ..."}

                        {sent && !sendJustToPCR && (
                          <Alert
                            style={{
                              marginTop: "10px",
                              paddingLeft: "50px",
                              paddingRight: "50px",
                            }}
                            severity="success"
                          >
                            Success! — The LAB Report{" "}
                            {props.booking.certificate
                              ? " and Certificate "
                              : " "}{" "}
                            Successfully Sent.
                          </Alert>
                        )}

                        {sent && sendJustToPCR && (
                          <Alert
                            style={{
                              marginTop: "10px",
                              paddingLeft: "50px",
                              paddingRight: "50px",
                            }}
                            severity="success"
                          >
                            Success! — The LAB Report{" "}
                            {props.booking.certificate
                              ? " and Certificate "
                              : " "}{" "}
                            Successfully Sent Just to
                            pcrresults@medicalexpressclinic.co.uk .
                          </Alert>
                        )}
                      </div>
                    </Grid>
                  )}
                </Grid>

                {(sending || sent) && (
                  <React.Fragment>
                    <div
                      style={{
                        marginTop: "10px",
                        width: "50%",
                        marginLeft: "27%",
                      }}
                    >
                      <LinearProgressWithLabel
                        variant="determinate"
                        color="primary"
                        value={sendingProgress}
                      />
                    </div>

                    <div
                      style={{
                        paddingTop: "30px",
                        color: "#2f942e",
                        fontWeight: "600",
                        fontSize: "1rem",
                        marginLeft: "45%",
                      }}
                    >
                      {sending && !sent && "PLEASE WAIT ..."}
                    </div>
                  </React.Fragment>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
