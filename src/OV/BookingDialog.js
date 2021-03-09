import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GlobalState from "../GlobalState";
import Grid from "@material-ui/core/Grid";
import {
  Button,
  Checkbox,
  DialogActions,
  DialogContentText,
  Divider,
  FormControlLabel,
  IconButton,
  TextField,
  Tooltip,
} from "@material-ui/core";
import PDFService from "./services/PDFService";

import { calculatePrice } from "./PriceCalculator";

import bookingService from "./services/BookService";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Draggable from "react-draggable";
import Slide from "@material-ui/core/Slide";

import Paper from "@material-ui/core/Paper";

import DeleteIcon from "@material-ui/icons/Delete";
import BookService from "./services/BookService";

import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  FormatDateFromString,
  RevertFormatDateFromString,
} from "./DateFormatter";
import PayDialog from "./PayDialog";

import PrintIcon from "@material-ui/icons/Print";
import UndoIcon from "@material-ui/icons/Undo";

import SendIcon from "@material-ui/icons/Send";

import HistoryIcon from "@material-ui/icons/History";

import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import { CalendarColors } from "../Admin/calendar-admin/colors";
import InvoiceDialog from "../InvoiceDialog";
import InvoiceService from "../services/InvoiceService";

const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor: "#373737",
    color: "#fff",
    padding: "1px",
    borderRadius: "4px",
    textAlign: "justify",
    paddingRight: "40px",
  },

  boxRed: {
    backgroundColor: "#dc2626",
    color: "#fff",
    padding: "1px",
    borderRadius: "4px",
    textAlign: "justify",
    paddingRight: "40px",
  },

  boxInfo: {
    textAlign: "justify",
    backgroundColor: "#fafafa",
    color: "#333",
    padding: "1px",
    borderRadius: "4px",
    paddingRight: "40px",
    border: "1px solid #eee",
  },

  ul: {
    listStyle: "none",
    padding: "0",
    margin: "0",
  },

  li: {
    marginBottom: "15px",
  },

  icon: {
    marginRight: "8px",
  },

  root: {
    width: "100%",
  },

  lineThrough: {
    textDecoration: "line-through",
  },

  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
    color: theme.palette.text.secondary,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
  },

  infoDetails: {
    textAlign: "left",
  },

  infoTitle: {
    fontWeight: "800",
    marginRight: "10px",
    color: theme.palette.secondary.main,
    fontSize: "0.9rem",
  },

  infoData: {
    fontWeight: "500",
    fontSize: "1rem",
  },

  title: {
    textAlign: "center",
    fontWeight: "600",
    marginLeft: "10px",
    marginBottom: "5px",
  },

  Accordion: {
    backgroundColor: "#f5f5f5",
    color: "#222",
  },

  AccordionDeleted: {
    backgroundColor: "#aaa",
    color: "#555",
  },

  DownloadForm: {
    marginTop: "10px",
    marginBottom: "10px",
  },

  infoDataCharges: {
    fontSize: "18px",
    color: "green",
    fontWeight: "600",
  },

  infoDataChargesHigher: {
    fontSize: "18px",
    color: "red",
    fontWeight: "600",
  },
  BookedLabel: {
    color: "#606060",
    paddingLeft: "5px",
    paddingBottom: "3px",
    paddingTop: "3px",
    fontWeight: "800",
    borderLeft: "5px solid",
    borderColor: "#606060",
    width: "150px",
    display: "inline-block",
  },

  PatientAttendedLabel: {
    color: "#0066aa",
    paddingLeft: "5px",
    paddingBottom: "3px",
    paddingTop: "3px",
    fontWeight: "800",
    borderLeft: "5px solid",
    borderColor: "#0066aa",
    width: "150px",
    display: "inline-block",
  },

  SampleTakenLabel: {
    color: "#0066cc",
    paddingRight: "10px",
    paddingLeft: "5px",
    paddingBottom: "3px",
    paddingTop: "3px",
    fontWeight: "800",
    borderLeft: "5px solid",
    borderColor: "#0066cc",
  },

  ReportSentLabel: {
    color: "#009900",
    paddingRight: "10px",
    paddingLeft: "5px",
    paddingBottom: "3px",
    paddingTop: "3px",
    fontWeight: "800",
    borderLeft: "5px solid",
    borderColor: "#009900",
  },

  ReportCertSentLabel: {
    color: "#009900",
    paddingRight: "10px",
    paddingLeft: "5px",
    paddingBottom: "3px",
    paddingTop: "3px",
    fontWeight: "800",
    borderLeft: "5px solid",
    borderColor: "#009900",
  },

  PositiveLabel: {
    color: "red",
    paddingRight: "10px",
    paddingLeft: "5px",
    paddingBottom: "3px",
    paddingTop: "3px",
    fontWeight: "800",
    borderLeft: "5px solid",
    borderColor: "red",
  },

  EditButton: {
    marginBottom: "20px",
    backgroundColor: "#2f942e",
    "&:hover": {
      background: "green",
      color: "#fff",
    },
    textDecoration: "none !important",
    padding: "10px",
  },

  ResendEmailsButton: {
    // marginBottom : "20px",
    color: "#2f942e",
    borderColor: "#2f942e",
    "&:hover": {
      background: "#fafffa",
      borderColor: "#2f942e",
    },
    textDecoration: "none !important",
    paddingLeft: "50px",
    paddingRight: "50px",
  },

  PayButton: {
    marginLeft: "70px",
    width: "300px",
  },

  printInvoiceButton: {
    marginLeft: "70px",
    fontSize: "0.8rem",
    // width: "300px",
  },

  editInvoiceButton: {
    marginLeft: "10px",
    fontSize: "0.8rem",
  },

  PayLabel: {
    marginLeft: "20px",

    color: "#2f942e",
    fontWeight: "500",
    textAlign: "center",
  },

  RestoreButton: {
    marginBottom: "20px",
    backgroundColor: "#eee",
    color: "#333",
    "&:hover": {
      background: "#f1f1f1",
      color: "#111",
    },
    textDecoration: "none !important",
    padding: "10px",
  },

  DeleteButton: {
    marginBottom: "20px",
    backgroundColor: "#b80012", 
    color: "#fff",
    "&:hover": {
      background: "#d90015",
      color: "#fff",
    },

    padding: "10px",
  },

  SaveButton: {
    marginBottom: "10px",
    padding: "10px",
    color: "#fff",

    backgroundColor:  "#bd0d50",
    "&:hover": {
      background: "#d1175e",
      color: "#fff",
    },
  },

  CancelButton: {
    marginBottom: "20px",
    // padding: "10px"
  },

  TextBox: {
    padding: "0px",
  },

  checkIcon: {
    color: "green",
  },

  checkIconSmall: {
    color: "green",
    paddingTop: "5px",
  },

  closeIcon: {
    color: "red",
  },

  centeredLabel: {
    display: "flex",
    alignItems: "center",
  },

  backdrop: {
    zIndex: theme.zIndex.drawer + 5,
    color: "#fff",
  },

  invoiceNumber: {
    display: "inline-block",
    fontWeight: "500",
    width: "72px",
    fontSize: "1rem",
    color: theme.palette.primary.main,
  },

  dialogTitle: {
    backgroundColor: theme.palette.secondary.main,
    color: "#fff",
  },

  question:{
    fontSize:"1.3rem",
    fontWeight: "400",
    color: theme.palette.secondary.main,
    marginTop:"30px"
  },

  answer:{
    fontSize:"1.3rem",
    fontWeight: "500",
    color: theme.palette.primary.main,
  },



}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PaperComponent(props) {
  return (
    <Draggable
      handle="#alert-dialog-slide-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function BookingDialog(props) {
  const classes = useStyles();

  const [state, setState] = React.useContext(GlobalState);

  const [copied, setCopied] = useState(false);

  const [emailSent, setEmailSent] = React.useState(false);
  const [emailSentInvoice, setEmailSentInvoice] = React.useState(false);

  const [openResendDialog, setOpenResendDialog] = React.useState(false);
  const [openPayDialog, setOpenPayDialog] = React.useState(false);
  const [openRefundDialog, setOpenRefundDialog] = React.useState(false);

  const [openInvoiceDialog, setOpenInvoiceDialog] = React.useState(false);

  const [selectedBooking, setSelectedBooking] = React.useState(null);

  const [editMode, setEditMode] = React.useState({ edit: false, person: null });
  const [deleteMode, setDeleteMode] = React.useState({
    delete: false,
    person: null,
  });
  const [restoreMode, setRestoreMode] = React.useState({
    restore: false,
    person: null,
  });

  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [restoring, setRestoring] = React.useState(false);

  const [validationError, setValidationError] = React.useState({});

  const [bookingDate, setBookingDate] = React.useState("");
  const [bookingTime, setBookingTime] = React.useState("");

  const [fullname, setFullname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [tel, setTel] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [service, setService] = React.useState("");

  const [refreshData, setRefreshData] = React.useState(false);

  const [booking, setBooking] = React.useState(null);

  const [recordChanged, setRecordChanged] = React.useState(false);

  const [fieldChanged, setFieldChanged] = React.useState(false);

  const [openUndoPayDialog, setOpenUndoPayDialog] = React.useState(false);

  const [openTimeStampDialog, setOpenTimeStampDialog] = React.useState(false);

  const [invoice, setInvoice] = React.useState(null);
  const [invoiceLoaded, setInvoiceLoaded] = React.useState(false);

  useEffect(() => {
    if (!props.open) {
      setTimeout(() => {
        setEditMode({ edit: false, person: null });
        setRecordChanged(false);
      }, 500);
    }
  }, [props.open]);

  const bookingDateChanged = (event) => {
    setBookingDate(event.target.value);
    setValidationError({ ...validationError, bookingDateError: false });
    setFieldChanged(!fieldChanged);
  };

  const bookingTimeChanged = (event) => {
    setBookingTime(event.target.value);
    setValidationError({ ...validationError, bookingTimeError: false });
    setFieldChanged(!fieldChanged);
  };

  const fullnameChanged = (event) => {
    setFullname(event.target.value);
    setFieldChanged(!fieldChanged);
  };

  const emailChanged = (event) => {
    setEmail(event.target.value);
    setFieldChanged(!fieldChanged);
  };

  const telChanged = (event) => {
    setTel(event.target.value);
    setFieldChanged(!fieldChanged);
  };

  const serviceChanged = (event) => {
    setService(event.target.value);
    setFieldChanged(!fieldChanged);
  };

  const notesChanged = (event) => {
    setNotes(event.target.value);
    setFieldChanged(!fieldChanged);
  };

  const getStatusLabel = (status) => {
    if (status === "booked") {
      return <div className={classes.BookedLabel}> Booking Made </div>;
    } else if (status === "patient_attended") {
      return (
        <div className={classes.PatientAttendedLabel}> Patient Attended </div>
      );
    } else {
      return "Unknown";
    }
  };

  const handleEditModeChanged = (edit, person) => {
    if (edit) {
      setFullname(person.fullname);
      setBookingDate(FormatDateFromString(person.bookingDate));
      setBookingTime(person.bookingTime.toUpperCase());
      setEmail(person.email);
      setTel(person.phone);
      if (person.notes) {
        setNotes(person.notes);
      }

      setEditMode({ edit: edit, person: person });
    } else if (!edit && !person) {
      setEditMode({ edit: edit, person: person });
      setRecordChanged(false);
    } else if (!edit && person) {
      const booking = {};
      const bookingId = person._id;
      booking.email = email;
      booking.phone = tel;
      booking.fullname = fullname;
      booking.notes = notes;
      booking.service = service;
      booking.bookingDate = RevertFormatDateFromString(bookingDate);
      booking.bookingTime = bookingTime;
      booking.bookingRef = person.bookingRef;

      if (validateBooking(booking)) {
        updateBooking({ bookingId: bookingId, person: booking });
      }
    }
  };

  const validateDate = (str) => {
    var error = false;
    if (!str || str.length !== 10) {
      error = true;
    }

    if (str.charAt(4) !== "-" || str.charAt(7) !== "-") {
      error = true;
    }

    try {
      const result = /^\d{4}-\d{2}-\d{2}$/.test(str);
      if (!result) {
        error = true;
      }

      const year = parseInt(str.substr(0, 4));
      const month = parseInt(str.substr(5, 2));
      const day = parseInt(str.substr(8, 2));

      if (year < 1900) {
        error = true;
      }

      if (month < 1 || month > 12) {
        error = true;
      }

      if (day > 31) {
        error = true;
      }
    } catch (err) {
      error = true;
    }

    return !error;
  };

  const validateTime = (str) => {
    var error = false;

    const result = /^\d{2}:\d{2} AM$|^\d{2}:\d{2} PM$/.test(str);
    if (!result) {
      error = true;
    }

    try {
      const hour = parseInt(str.substr(0, 2));
      const minute = parseInt(str.substr(3, 2));

      if (hour < 0 || hour > 12) {
        error = true;
      }

      if (minute < 0 || minute > 59) {
        error = true;
      }
    } catch (err) {
      error = true;
    }

    return !error;
  };

  const validateBooking = (booking) => {
    var error = false;

    if (!validateDate(booking.bookingDate)) {
      error = true;
      setValidationError({ ...validationError, bookingDateError: true });
    }

    if (!validateTime(booking.bookingTime)) {
      error = true;
      setValidationError({ ...validationError, bookingTimeError: true });
    }
    return !error;
  };

  const updateBooking = (payload) => {
    setSaving(true);
    bookingService
      .updateBooking(payload)
      .then((res) => {
        setSaving(false);
        setEditMode({ edit: false, person: null });
        setRefreshData(!refreshData);
      })
      .catch((err) => {
        setSaving(false);
        setEditMode({ edit: false, person: null });
        console.log(err);
      });
  };

  const deleteBooking = (id) => {
    setDeleting(true);
    bookingService
      .deleteBooking(id)
      .then((res) => {
        setDeleting(false);
        setDeleteMode({ delete: false, person: null });
        setRefreshData(!refreshData);
      })
      .catch((err) => {
        setDeleting(false);
        setDeleteMode({ delete: false, person: null });
        console.log(err);
      });
  };

  const restoreBooking = (id) => {
    setRestoring(true);
    bookingService
      .unDeleteBooking(id)
      .then((res) => {
        setRestoring(false);
        setRestoreMode({ restore: false, person: null });
        setRefreshData(!refreshData);
      })
      .catch((err) => {
        setRestoring(false);
        setRestoreMode({ restore: false, person: null });
        console.log(err);
      });
  };

  const handleDeleteModeChanged = (del, person) => {
    if (del) {
      setDeleteMode({ delete: del, person: person });
    } else if (!del && !person) {
      setDeleteMode({ delete: del, person: person });
    } else if (!del && person) {
      deleteBooking(person._id);
    }
  };

  const handleRestoreModeChanged = (restore, person) => {
    if (restore) {
      setRestoreMode({ restore: restore, person: person });
    } else if (!restore && !person) {
      setRestoreMode({ restore: restore, person: person });
    } else if (!restore && person) {
      restoreBooking(person._id);
    }
  };

  const changeBackToBookingMade = (event, id) => {
    setSaving(true);
    BookService.changeBackToBookingMade(id)
      .then((res) => {
        setSaving(false);
        setRefreshData(!refreshData);
      })
      .catch((err) => {
        console.log(err);
        setSaving(false);
      });
  };

  const changeToPatientAttended = (event, id) => {
    setSaving(true);
    BookService.changeToPatientAttended(id)
      .then((res) => {
        setSaving(false);
        setRefreshData(!refreshData);
      })
      .catch((err) => {
        console.log(err);
        setSaving(false);
      });
  };

  const Pay = () => {
    setSelectedBooking(booking);
    setOpenPayDialog(true);
  };

  const OpenInvoiceDialog = () => {
    setSelectedBooking(booking);
    setInvoice(invoice);
    setOpenInvoiceDialog(true);
  };

  useEffect(() => {
    if (props.booking) {
      BookService.getBookingById(props.booking._id)
        .then((res) => {
          setBooking(res.data);
        })
        .catch((err) => {
          console.log(err);
        });

      setState((state) => ({
        ...state,
        bookingDialogDataChanged: !state.bookingDialogDataChanged
          ? true
          : false,
      }));
    }
  }, [refreshData, state.bookingPayChanged]);

  useEffect(() => {
    if (props.booking) {
      setBooking(props.booking);
    }
  }, [props.booking]);

  const undoPaymentClicked = async () => {
    setSaving(true);
    try {
      await BookService.unPayBooking(booking._id);
      setSaving(false);
      setOpenUndoPayDialog(false);
      setRefreshData(!refreshData);
    } catch (err) {
      console.error(err);
      setSaving(false);
      setOpenUndoPayDialog(false);
    }
  };

  const refundPaymentClicked = async () => {
    setSaving(true);
    try {
      await BookService.refundBooking(booking._id);
      setSaving(false);
      updateShouldRefundsCount();
      setOpenRefundDialog(false);
      setRefreshData(!refreshData);
    } catch (err) {
      console.error(err);
      setSaving(false);
      setOpenRefundDialog(false);
    }
  };

  const updateShouldRefundsCount = async () => {
    try {
      const res = await BookService.getShouldRefundsCount();
      if (res && res.data && res.data.status === "OK") {
        setState((state) => ({ ...state, shouldRefunsCount: res.data.count }));
      }
    } catch (ex) {
      console.error(ex);
    }
  };

  const downloadRegForm = (id) => {
    PDFService.downloadGPRegForm(id)
      .then((res) => {
        const file = new Blob([res.data], { type: "application/pdf" });

        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, "_blank");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const downloadInvoice = (id) => {
    InvoiceService.downloadInvoice(id)
      .then((res) => {
        const file = new Blob([res.data], { type: "application/pdf" });

        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, "_blank");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sendRegForm = (id) => {
    setSaving(true);
    setEmailSent(false);
    BookService.sendRegFormEmail(id)
      .then((res) => {
        setSaving(false);
        if (res.data.status === "OK") {
          setEmailSent(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setSaving(false);
      });
  };

  const sendInvoiceEmail = (id, _email) => {
    setSaving(true);
    setEmailSentInvoice(false);
    InvoiceService.emailInvoice(id, _email)
      .then((res) => {
        setSaving(false);
        if (res.data.status === "OK") {
          setEmailSentInvoice(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setSaving(false);
      });
  };

  const onClose = () => {
    setEmailSent(false);
    setEmailSentInvoice(false);
    setInvoice(null);
    props.onClose();
  };

  const [openQDialg, setOpenQDialog] = React.useState(false)
  const handleQDialgClose = () =>
  {
    setOpenQDialog(false)
  }

  const fixQuestion = (str) =>
  {
    let result = str.replace('*', '')
    if (!result.trim().endsWith('?'))
    {
      result += '?'
    }
    return result
  }

  return (
    <React.Fragment>
      {booking && (
        <React.Fragment>
          <Dialog
            maxWidth="xs"
            open={props.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onClose}
            PaperComponent={PaperComponent}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle
              id="alert-dialog-slide-title"
              className={classes.dialogTitle}
              style={{position:"relative"}}
            >
              {booking.questions && (
                 <div style={{position:"absolute", right:"10px", top:"12px", backgroundColor:"#069c00", fontSize:"0.85rem", padding:"8px", borderRadius:"10px"}}>
                   Self-Test
                 </div>
              )}


              <Grid
                container
                direction="row"
                justify="center"
                spacing={2}
                alignItems="center"
              >
                <Grid item>
                  <div
                    style={
                      booking.deleted
                        ? {
                            paddingBottom: "5px",
                            textDecoration: "line-through",
                          }
                        : {}
                    }
                  >
                    {`${booking.fullname}`}
                  </div>
                </Grid>

                {booking.deleted && (
                  <Grid item>
                    <Tooltip title="This record has been deleted.">
                      <DeleteIcon
                        style={{
                          padding: 0,
                          margin: 0,
                          color: "#fff",
                          fontSize: 25,
                        }}
                      />
                    </Tooltip>
                  </Grid>
                )}
              </Grid>
            </DialogTitle>
            <DialogContent>
              <div
                style={{
                  // height: "550px",
                  paddingTop: "0px",
                }}
              >
                <Grid item xs={12} md={12} key={`panel0`}>
                  <div className={classes.infoDetails}>
                    <ul className={classes.ul}>
                      <li className={classes.li} style={{ marginTop: "20px" }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <span className={classes.infoTitle}>
                              BOOKED DATE :
                            </span>

                            <span
                              hidden={
                                editMode.edit &&
                                editMode.person._id === booking._id
                              }
                              className={classes.infoData}
                            >
                              {FormatDateFromString(booking.bookingDate)}
                            </span>
                            <span
                              hidden={
                                !(
                                  editMode.edit &&
                                  editMode.person._id === booking._id
                                )
                              }
                              className={classes.infoData}
                            >
                              <TextField
                                fullWidth
                                error={validationError.bookingDateError}
                                className={classes.TextBox}
                                value={bookingDate}
                                onChange={bookingDateChanged}
                                inputProps={{
                                  style: {
                                    padding: 0,
                                  },
                                }}
                              ></TextField>
                            </span>
                          </Grid>
                          <Grid item xs={12}>
                            <span className={classes.infoTitle}>
                              BOOKED TIME :
                            </span>
                            <span
                              hidden={
                                editMode.edit &&
                                editMode.person._id === booking._id
                              }
                              className={classes.infoData}
                            >
                              {booking.bookingTime}
                            </span>
                            <span
                              hidden={
                                !(
                                  editMode.edit &&
                                  editMode.person._id === booking._id
                                )
                              }
                              className={classes.infoData}
                            >
                              <TextField
                                fullWidth
                                error={validationError.bookingTimeError}
                                className={classes.TextBox}
                                value={bookingTime}
                                onChange={bookingTimeChanged}
                                inputProps={{
                                  style: {
                                    padding: 0,
                                  },
                                }}
                              ></TextField>
                            </span>
                          </Grid>
                        </Grid>
                      </li>

                      <Divider />

                      <li className={classes.li} style={{ marginTop: "20px" }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <span className={classes.infoTitle}>
                              FULLNAME :{" "}
                            </span>
                            <span
                              hidden={
                                editMode.edit &&
                                editMode.person._id === booking._id
                              }
                              className={classes.infoData}
                            >
                              {booking.fullname}
                            </span>
                            <span
                              hidden={
                                !(
                                  editMode.edit &&
                                  editMode.person._id === booking._id
                                )
                              }
                              className={classes.infoData}
                            >
                              <TextField
                                fullWidth
                                className={classes.TextBox}
                                value={fullname}
                                onChange={fullnameChanged}
                                inputProps={{
                                  style: {
                                    padding: 0,
                                  },
                                }}
                              ></TextField>
                            </span>
                          </Grid>
                          <Grid item xs={12}>
                            <span className={classes.infoTitle}>EMAIL : </span>
                            <span
                              hidden={
                                editMode.edit &&
                                editMode.person._id === booking._id
                              }
                              className={classes.infoData}
                            >
                              {booking.email}
                            </span>
                            <span
                              hidden={
                                !(
                                  editMode.edit &&
                                  editMode.person._id === booking._id
                                )
                              }
                              className={classes.infoData}
                            >
                              <TextField
                                fullWidth
                                className={classes.TextBox}
                                value={email}
                                onChange={emailChanged}
                                inputProps={{
                                  style: {
                                    padding: 0,
                                  },
                                }}
                              ></TextField>
                            </span>
                          </Grid>
                          <Grid item xs={12}>
                            <span className={classes.infoTitle}>TEL : </span>
                            <span
                              hidden={
                                editMode.edit &&
                                editMode.person._id === booking._id
                              }
                              className={classes.infoData}
                            >
                              {booking.phone?.toUpperCase()}
                            </span>
                            <span
                              hidden={
                                !(
                                  editMode.edit &&
                                  editMode.person._id === booking._id
                                )
                              }
                              className={classes.infoData}
                            >
                              <TextField
                                fullWidth
                                className={classes.TextBox}
                                value={tel}
                                onChange={telChanged}
                                inputProps={{
                                  style: {
                                    padding: 0,
                                  },
                                }}
                              ></TextField>
                            </span>
                          </Grid>
                        </Grid>
                      </li>

                      <Divider />

                      <li className={classes.li} style={{ marginTop: "20px" }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <span className={classes.infoTitle}>
                              Consultation :{" "}
                            </span>
                            <span
                              hidden={
                                editMode.edit &&
                                editMode.person._id === booking._id
                              }
                              className={classes.infoData}
                            >
                              {booking.faceToFaceConsultation && (
                                <span> Face to Face </span>
                              )}
                              {((booking.faceToFaceConsultation &&
                                booking.telephoneConsultation) ||
                                (!booking.faceToFaceConsultation &&
                                  !booking.telephoneConsultation)) && (
                                <span
                                  style={{
                                    paddingLeft: "5px",
                                    paddingRight: "5px",
                                  }}
                                >
                                  {" "}
                                  -{" "}
                                </span>
                              )}
                              {booking.telephoneConsultation && (
                                <span> Telephone </span>
                              )}
                            </span>
                            <span
                              hidden={
                                !(
                                  editMode.edit &&
                                  editMode.person._id === booking._id
                                )
                              }
                              className={classes.infoData}
                            >
                              <TextField
                                fullWidth
                                className={classes.TextBox}
                                value={fullname}
                                onChange={fullnameChanged}
                                inputProps={{
                                  style: {
                                    padding: 0,
                                  },
                                }}
                              ></TextField>
                            </span>
                          </Grid>
                        </Grid>
                      </li>

                      <Divider />

                      {booking.questions && (
                        <React.Fragment>
                          <div style={{display:"flex", justifyContent:"center"}}>
                          <Button fullWidth variant="contained" color="primary" style={{color:"#fff",margin:"10px"}} onClick={() => setOpenQDialog(true)}>
                             Show questionnaire
                          </Button>
                          </div>
                          <Divider />
                        </React.Fragment>
                      )}

                   

                      
                      <div style={{marginTop:"20px"}}>

                      </div>

                      {/* Restore Functionality ******************************************* */}
                      <li
                        hidden={
                          !(
                            restoreMode.restore &&
                            restoreMode.person._id === booking._id
                          )
                        }
                      >
                        <div
                          style={{
                            fontWeight: "500",
                            paddingBottom: "10px",
                            paddingLeft: "5px",
                            fontSize: "16px",
                            color: "#333",
                          }}
                        >
                          Are you sure you want to restore this record?
                        </div>
                      </li>

                      <li
                        hidden={
                          !booking.deleted ||
                          (restoreMode.restore &&
                            restoreMode.person._id === booking._id)
                        }
                      >
                        <Button
                          type="button"
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            handleRestoreModeChanged(true, booking);
                          }}
                          className={classes.RestoreButton}
                        >
                          Restore This Record
                        </Button>
                      </li>

                      <li
                        hidden={
                          !(
                            restoreMode.restore &&
                            restoreMode.person._id === booking._id
                          )
                        }
                      >
                        <Button
                          type="button"
                          fullWidth
                          variant="contained"
                          color="primary"
                          disabled={restoring}
                          onClick={() => {
                            handleRestoreModeChanged(false, booking);
                          }}
                          className={classes.SaveButton}
                        >
                          YES, Restore this!
                        </Button>
                      </li>

                      <li
                        hidden={
                          !(
                            restoreMode.restore &&
                            restoreMode.person._id === booking._id
                          )
                        }
                      >
                        <Button
                          type="button"
                          fullWidth
                          variant="contained"
                          color="default"
                          disabled={restoring}
                          onClick={() => {
                            handleRestoreModeChanged(false, null);
                          }}
                          className={classes.CancelButton}
                        >
                          Cancel
                        </Button>
                      </li>

                      {/*  ******************************************************************* */}

                      {/* Delete Functionality ******************************************* */}

                      <li
                        hidden={
                          !(
                            deleteMode.delete &&
                            deleteMode.person._id === booking._id
                          )
                        }
                      >
                        <div
                          style={{
                            fontWeight: "600",
                            paddingBottom: "10px",
                            paddingLeft: "5px",
                            fontSize: "16px",
                          }}
                        >
                          Are you sure you want to archive this record?
                        </div>
                      </li>

                      <li
                        hidden={
                          props.deleteButtonDisabled ||
                          booking.deleted ||
                          editMode.edit ||
                          (deleteMode.delete &&
                            deleteMode.person._id === booking._id)
                        }
                      >
                        {booking.OTCCharges > 0 && (
                          <Tooltip title={"Paid Records Cannot be Deleted!"}>
                            <div>
                              <Button
                                disabled={booking.OTCCharges > 0}
                                type="button"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  handleDeleteModeChanged(true, booking);
                                }}
                                className={classes.DeleteButton}
                              >
                                Archive This Record
                              </Button>
                            </div>
                          </Tooltip>
                        )}
                        {
                          <Button
                            disabled={booking.OTCCharges > 0}
                            type="button"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              handleDeleteModeChanged(true, booking);
                            }}
                            className={classes.DeleteButton}
                          >
                            Archive This Record
                          </Button>
                        }
                      </li>

                      <li
                        hidden={
                          !(
                            deleteMode.delete &&
                            deleteMode.person._id === booking._id
                          )
                        }
                      >
                        <Button
                          type="button"
                          fullWidth
                          variant="contained"
                          color="primary"
                          disabled={deleting}
                          onClick={() => {
                            handleDeleteModeChanged(false, booking);
                          }}
                          className={classes.SaveButton}
                        >
                          YES, Archive this!
                        </Button>
                      </li>

                      <li
                        hidden={
                          !(
                            deleteMode.delete &&
                            deleteMode.person._id === booking._id
                          )
                        }
                      >
                        <Button
                          type="button"
                          fullWidth
                          variant="contained"
                          color="default"
                          disabled={deleting}
                          onClick={() => {
                            handleDeleteModeChanged(false, null);
                          }}
                          className={classes.CancelButton}
                        >
                          Cancel
                        </Button>
                      </li>

                      {/* ****************************************************************************************** */}
                    </ul>
                  </div>
                </Grid>
              </div>
              <Backdrop
                className={classes.backdrop}
                open={saving || deleting || restoring}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            </DialogContent>
          </Dialog>

          <Dialog
            open={openQDialg}
            onClose={handleQDialgClose}
            maxWidth="sm"
          >
            <DialogContent>
                      {booking.questions && JSON.parse(booking.questions).map(item => (
                        <div >
                          <div className={classes.question}>
                            {fixQuestion(item.question)}
                          </div>
                          <div className={classes.answer}>
                            {item.answer}
                          </div>
                        </div>
                      ))}
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setOpenQDialog(false)}>
                Close
              </Button>
            </DialogActions>

          </Dialog>

        </React.Fragment>
      )}
    </React.Fragment>
  );
}
