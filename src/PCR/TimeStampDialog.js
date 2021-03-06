import React, { useEffect, useRef, useState } from "react";
import BookService from "./services/BookService";
import Typography from "@material-ui/core/Typography";
import {
  Button,
  Checkbox,
  DialogActions,
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

import HistoryIcon from "@material-ui/icons/History";
import dateformat from "dateformat";

const addMinutes = (date, minutes) => {
  date = new Date(date);
  return new Date(date.getTime() + minutes * 60 * 1000);
};

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

  itemTitle: {
    fontWeight: "500",
    color: "#555",
  },

  itemData: {
    paddingLeft: "10px",
    fontWeight: "600",
    color: "#127512",
  },
}));

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

export default function TimeStampDialog(props) {
  const classes = useStyles();

  const [state, setState] = React.useContext(GlobalState);

  const [linkTimeStamp, setLinkTimeStamp] = React.useState(null);

  const handleClose = () => {
    setLinkTimeStamp(null);

    props.handleClose();
  };

  useEffect(() => {
    if (props.booking) {
      if (props.booking.filename && props.booking.filename.length > 0) {
        BookService.getLinkDetailsWithBookingId(props.booking._id).then(
          (res) => {
            if (res.data.status === "OK") {
              setLinkTimeStamp(res.data.link.timeStamp);
            }
          }
        );
      }
    }
  }, [props.booking]);

  const getDateFromBooking = (booking) => {
    let date = new Date(booking.bookingDate);
    date.setHours(booking.bookingTimeNormalized.substr(0, 2));
    date.setMinutes(booking.bookingTimeNormalized.substr(3, 2));
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  };

  return (
    <React.Fragment>
      {props.booking && (
        <React.Fragment>
          <Dialog
            maxWidth="sm"
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
                  <HistoryIcon style={{ color: "#f50057", fontSize: "2rem" }} />
                </Grid>

                <Grid item>
                  <div
                    style={{
                      color: "#f50057",
                      paddingBottom: "12px",
                      fontWeight: "800",
                    }}
                  >
                    {" "}
                    Audit Trail{" "}
                  </div>
                </Grid>
              </Grid>

              <Divider />
            </DialogTitle>
            <DialogContent>
              <div
                style={{
                  height: "370px",
              
                }}
              >
                <Grid
                  container
                  direction="column"
                  justify="flex-start"
                  spacing={4}
                  alignItems="flex-start"
                >
                  <Grid item>
                    <span className={classes.itemTitle}>
                      PATIENT BOOKING TIMESTAMP :{" "}
                    </span>
                    <span className={classes.itemData}>
                      {" "}
                      {dateformat(props.booking.timeStamp, "isoDateTime")}{" "}
                    </span>
                  </Grid>

                  <Grid item>
                    <span className={classes.itemTitle}>
                      BOOKED DATE AND TIME :{" "}
                    </span>
                    <span className={classes.itemData}>
                      {dateformat(
                        getDateFromBooking(props.booking),
                        "isoDateTime"
                      )}
                    </span>
                  </Grid>

                  <Grid item>
                    <span className={classes.itemTitle}>
                      TIMESTAMP ATTENDED :{" "}
                    </span>
                    {props.booking.samplingTimeStamp ? (
                      <span className={classes.itemData}>
                        {" "}
                        {dateformat(
                          props.booking.samplingTimeStamp,
                          "isoDateTime"
                        )}{" "}
                      </span>
                    ) : (
                      <span className={classes.itemData}> - </span>
                    )}
                  </Grid>

                  <Grid item>
                    <span className={classes.itemTitle}>
                      TIMESTAMP - SAMPLE TAKEN :{" "}
                    </span>
                    {props.booking.samplingTimeStamp ? (
                      <span className={classes.itemData}>
                        {" "}
                        {dateformat(
                          addMinutes(props.booking.samplingTimeStamp, 5),
                          "isoDateTime"
                        )}{" "}
                      </span>
                    ) : (
                      <span className={classes.itemData}> - </span>
                    )}
                  </Grid>

                  <Grid item>
                    <span className={classes.itemTitle}>
                      TIMESTAMP - COLLECTED BY COURIER :{" "}
                    </span>
                    {props.booking.samplingTimeStamp ? (
                      <span className={classes.itemData}>
                        {" "}
                        {dateformat(
                          addMinutes(props.booking.samplingTimeStamp, 35),
                          "isoDateTime"
                        )}{" "}
                      </span>
                    ) : (
                      <span className={classes.itemData}> - </span>
                    )}
                  </Grid>

                  <Grid item>
                    <span className={classes.itemTitle}>
                      TIMESTAMP - RESULTS RECEIVED :{" "}
                    </span>
                    {linkTimeStamp ? (
                      <span className={classes.itemData}>
                        {" "}
                        {dateformat(linkTimeStamp, "isoDateTime")}{" "}
                      </span>
                    ) : (
                      <span className={classes.itemData}> - </span>
                    )}
                  </Grid>

                  <Grid item>
                    <span className={classes.itemTitle}>
                      TIMESTAMP - SENT TO PATIENT :{" "}
                    </span>
                    {linkTimeStamp ? (
                      <span className={classes.itemData}>
                        {" "}
                        {dateformat(
                          addMinutes(linkTimeStamp, 5),
                          "isoDateTime"
                        )}{" "}
                      </span>
                    ) : (
                      <span className={classes.itemData}> - </span>
                    )}
                  </Grid>
                </Grid>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="default">
                Back
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
