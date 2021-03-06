import React, { useEffect, useRef, useState } from "react";
import BookService from "./services/BookService";
import Typography from "@material-ui/core/Typography";
import {
  Backdrop,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  makeStyles,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
} from "@material-ui/core";
import GlobalState from "../GlobalState";
import { withStyles } from "@material-ui/core/styles";

import CreditCardIcon from "@material-ui/icons/CreditCard";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";

import DialogTitle from "@material-ui/core/DialogTitle";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";

import Alert from "@material-ui/lab/Alert";

import PropTypes from "prop-types";
import LinearProgress from "@material-ui/core/LinearProgress";
import Box from "@material-ui/core/Box";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { corporates } from "./Corporates";
import NumberFormat from "react-number-format";

import AddIcon from "@material-ui/icons/Add";
import { validate } from "email-validator";
import DateRangeIcon from "@material-ui/icons/DateRange";
import { CalendarColors } from "./calendar-admin/colors";

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

  CalendarIcon: {
    color: theme.palette.primary.main,
  },

  DateTimeLabel: {
    fontWeight: "500",
    color: theme.palette.primary.main,
  },

  backdrop: {
    zIndex: theme.zIndex.drawer + 5,
    color: "#fff",
  },

  PriceLabelPaid:{
    color: theme.palette.primary.main,
    fontWeight: "600"
  },

  PriceLabelNotPaid:{
    color: theme.palette.secondary.main,
    fontWeight: "600"
  },

  BoxDisabled: {
    width : "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid",
    fontSize: "1.2rem",
    fontWeight: "500",
    textAlign: "center",
    borderColor: "#ddd",
    cursor: "not-allowed",
    color: "#ddd",
    transition: "all 0.2s ease",
  },

  BoxGynae: {
    width : "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid",
    fontSize: "1.2rem",
    fontWeight: "500",
    textAlign: "center",
    cursor: "pointer",
    borderColor: CalendarColors.GYNAE_COLOR,
    color: CalendarColors.GYNAE_COLOR,
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: CalendarColors.GYNAE_COLOR,
      color: "#fff"
    }
  
  },

  BoxGP: {
    width : "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid",
    fontSize: "1.2rem",
    fontWeight: "500",
    textAlign: "center",
    cursor: "pointer",
    borderColor: CalendarColors.GP_COLOR,
    color: CalendarColors.GP_COLOR,
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: CalendarColors.GP_COLOR,
      color: "#fff"
    }
  },

  BoxSTD: {
    width : "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid",
    fontSize: "1.2rem",
    fontWeight: "500",
    textAlign: "center",
    cursor: "pointer",
    borderColor: CalendarColors.STD_COLOR,
    color: CalendarColors.STD_COLOR,
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: CalendarColors.STD_COLOR,
      color: "#fff"
    }
  },



}));

const Packages = [
  { packageName: "Consultation with Consultant Gynaecologist" },
  { packageName: `Coil Fitting/Coil Removal` },
  { packageName: `Well Woman Check` },
  { packageName: `Sexual Health Screening` },
  { packageName: `Pre-pregnancy/Fertility check` },
  { packageName: `Gynaecological Ultrasound` },
  { packageName: `HPV Vaccination` },
  { packageName: `Cervical / Pap Smear` },
  { packageName: `HPV Treatment / Wart Cryo-Therapy` },
];

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix=""
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

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

export default function NewBookingDialog(props) {
  const classes = useStyles();

  const [state, setState] = React.useContext(GlobalState);

  const handleClose = () => {    
    props.handleClose();
  };


  const timeDisabled = () =>
  {
    return props.time.indexOf(':15') > 0 || props.time.indexOf(':45') > 0 || props.time.indexOf('09') >= 0 
  }

  const clinicClicked = (clinic) =>
  {
    props.clinicClicked(clinic)
  }

  return (
    <React.Fragment>
      {props.date && props.time && (
        <React.Fragment>
          <Dialog
            maxWidth="xs"
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
                  <AddIcon style={{ color: "#f50057", fontSize: "3rem" }} />
                </Grid>

                <Grid item>
                  <div
                    style={{
                      color: "#f50057",
                      paddingBottom: "10px",
                      fontWeight: "800",
                    }}
                  >
                    {" "}
                    ADD New Booking{" "}
                  </div>
                </Grid>
              </Grid>

              <Divider />
            </DialogTitle>
            <DialogContent>
              <div
                style={{
                  height: "310px",
                }}
              >
                <Grid
                  container
                  direction="row"
                  justify="stretch"
                  spacing={2}
                  alignItems="center"
                >
                  <Grid item xs={12}>
                    <Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="center"
                      spacing={1}
                    >
                      <Grid item>
                        <DateRangeIcon className={classes.CalendarIcon} />
                      </Grid>
                      <Grid item>
                        <span className={classes.DateTimeLabel}>
                          {props.date} , {props.time}
                        </span>
                      </Grid>
                    </Grid>
                  </Grid>


                  <Grid item xs={12}>
                    <div className={timeDisabled() ? classes.BoxDisabled : classes.BoxGynae} onClick={() => !timeDisabled() ? clinicClicked("gynae") : null}>
                      GYNAE
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div className={timeDisabled() ? classes.BoxDisabled : classes.BoxGP}  onClick={() => !timeDisabled() ? clinicClicked("gp") : null}>
                      GP
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div className={classes.BoxSTD} onClick={() => clinicClicked("std")}>
                      STD
                    </div>
                  </Grid>

                </Grid>

                <div
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "20px",
                  }}
                >
                  <Grid
                    container
                    direction="row"
                    justify="flex-end"
                    alignItems="center"
                    spacing={1}
                  >
                    <Grid item>
                      <Button
                        onClick={handleClose}
                        style={{ width: "100px" }}
                      >
                        close
                      </Button>
                    </Grid>
                   
                  </Grid>
                </div>
              </div>

            </DialogContent>
          </Dialog>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
