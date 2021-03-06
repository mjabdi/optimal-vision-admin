import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GlobalState from "./../GlobalState";
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
import ResendEmailsDialog from "./ResendEmailsDialog";
import PayDialog from "./PayDialog";

import PrintIcon from "@material-ui/icons/Print";
import UndoIcon from "@material-ui/icons/Undo";

import HistoryIcon from "@material-ui/icons/History";

import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import TimeStampDialog from "./TimeStampDialog";
import { CalendarColors } from "../Admin/calendar-admin/colors";
import InvoiceService from "../services/InvoiceService";

import SendIcon from "@material-ui/icons/Send";
import InvoiceDialog from "../InvoiceDialog";



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
  },

  infoData: {
    fontWeight: "400",
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
    paddingRight: "10px",
    paddingLeft: "5px",
    paddingBottom: "3px",
    paddingTop: "3px",
    fontWeight: "800",
    borderLeft: "5px solid",
    borderColor: "#606060",
  },

  PatientAttendedLabel: {
    color: "#0066aa",
    paddingRight: "10px",
    paddingLeft: "5px",
    paddingBottom: "3px",
    paddingTop: "3px",
    fontWeight: "800",
    borderLeft: "5px solid",
    borderColor: "#0066aa",
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
    backgroundColor: "#d90015",
    "&:hover": {
      background: "#b80012",
      color: "#fff",
    },

    padding: "10px",
  },

  SaveButton: {
    marginBottom: "10px",
    padding: "10px",

    backgroundColor: "#d1175e",
    "&:hover": {
      background: "#bd0d50",
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
    marginBottom:"-8px"
  },

  checkIconSmall: {
    color: "green",
    paddingTop: "5px",
  },

  closeIcon: {
    color: "red",
    marginBottom:"-8px"
  },

  centeredLabel: {
    display: "flex",
    alignItems: "center",
  },

  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },

  invoiceNumber: {
    display: "inline-block",
    fontWeight: "500",
    width: "80px",
    fontSize: "1rem",
    color: theme.palette.primary.main,
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

  const getDefaultCodes = (_booking) =>
  {
    const defaultCodes = []
    if (!_booking)
      return

    if (_booking.tr)
    {
      defaultCodes.push({code: "PCRTR", description: "PCR TEST TO RELEASE", price: 250 })
    }else{
      defaultCodes.push({code: "PCR", description: "PCR SWAB TEST", price: 199 })
      if (_booking.antiBodyTest)
      {
        defaultCodes.push({code: "PCRA", description: "PCR ANTIBODY TEST", price: 99 })
        defaultCodes.push({code: "PHLE", description: "PHLEBOTOMY", price: 50 })
      }
      if (_booking.certificate)
      {
        defaultCodes.push({code: "PCRCERT", description: "PCR FIT TO FLY CERTIFICATE", price: 50 })
      }
    }
    return defaultCodes
  }

  const [state, setState] = React.useContext(GlobalState);

  const [copied, setCopied] = useState(false);

  const [openResendDialog, setOpenResendDialog] = React.useState(false);
  const [openPayDialog, setOpenPayDialog] = React.useState(false);
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

  const [gender, setGender] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [forename, setForename] = React.useState("");
  const [surname, setSurnme] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [dob, setDOB] = React.useState("");
  const [tel, setTel] = React.useState("");
  const [postCode, setPostCode] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [passport, setPassport] = React.useState("");
  const [passport2, setPassport2] = React.useState("");
  const [certificate, setCertificate] = React.useState(false);
  const [antiBodyTest, setAntiBodyTest] = React.useState(false);

  const [refreshData, setRefreshData] = React.useState(false);

  const [booking, setBooking] = React.useState(null);

  const [recordChanged, setRecordChanged] = React.useState(false);

  const [fieldChanged, setFieldChanged] = React.useState(false);

  const [openUndoPayDialog, setOpenUndoPayDialog] = React.useState(false);

  const [openTimeStampDialog, setOpenTimeStampDialog] = React.useState(false);

  const handleCloseTimeStampDialog = () => {
    setOpenTimeStampDialog(false);
    setSelectedBooking(null);
  };

  const handleCloseUndoPayDialog = () => {
    setOpenUndoPayDialog(false);
  };

  const handleCloseResendDialog = () => {
    setOpenResendDialog(false);
    setSelectedBooking(null);
  };

  const handleClosePayDialog = () => {
    setOpenPayDialog(false);
    setSelectedBooking(null);
  };

  useEffect(() => {
    if (booking) {
      const isChanged =
        bookingDate !== FormatDateFromString(booking.bookingDate) ||
        bookingTime !== booking.bookingTime ||
        gender !== booking.gender ||
        forename !== booking.forenameCapital ||
        surname !== booking.surnameCapital ||
        title !== booking.title ||
        email !== booking.email ||
        dob !== FormatDateFromString(booking.birthDate) ||
        tel !== booking.phone ||
        postCode !== booking.postCode ||
        address !== booking.address ||
        passport !== booking.passportNumber ||
        passport2 !== booking.passportNumber2 ||
        certificate !== booking.certificate ||
        antiBodyTest !== booking.antiBodyTest;

      setRecordChanged(isChanged);
    }
  }, [fieldChanged]);

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

  const genderChanged = (event) => {
    setGender(event.target.value);
    setFieldChanged(!fieldChanged);
  };

  const titleChanged = (event) => {
    setTitle(event.target.value);
    setFieldChanged(!fieldChanged);
  };

  const forenameChanged = (event) => {
    setForename(event.target.value);
    setFieldChanged(!fieldChanged);
  };

  const surnameChanged = (event) => {
    setSurnme(event.target.value);
    setFieldChanged(!fieldChanged);
  };

  const emailChanged = (event) => {
    setEmail(event.target.value);
    setFieldChanged(!fieldChanged);
  };

  const dobChanged = (event) => {
    setDOB(event.target.value);
    setValidationError({ ...validationError, dobError: false });
    setFieldChanged(!fieldChanged);
  };

  const telChanged = (event) => {
    setTel(event.target.value);
    setFieldChanged(!fieldChanged);
  };

  const postCodeChanged = (event) => {
    setPostCode(event.target.value);
    setFieldChanged(!fieldChanged);
  };

  const addressChanged = (event) => {
    setAddress(event.target.value);
    setFieldChanged(!fieldChanged);
  };

  const passportChanged = (event) => {
    setPassport(event.target.value);
    setFieldChanged(!fieldChanged);
  };

  const passport2Changed = (event) => {
    setPassport2(event.target.value);
    setFieldChanged(!fieldChanged);
  };

  const certificateChanged = (event) => {
    setCertificate(event.target.checked);
    setFieldChanged(!fieldChanged);
  };

  const antiBodyTestChanged = (event) => {
    setAntiBodyTest(event.target.checked);
    setFieldChanged(!fieldChanged);
  };

  const getStatusLabel = (status) => {
    if (status === "booked") {
      return <span className={classes.BookedLabel}> Booking Made </span>;
    } else if (status === "patient_attended") {
      return (
        <span className={classes.PatientAttendedLabel}> Patient Attended </span>
      );
    } else if (status === "sample_taken") {
      return <span className={classes.SampleTakenLabel}> Sample Taken </span>;
    } else if (status === "report_sent") {
      return <span className={classes.ReportSentLabel}> Report Sent </span>;
    } else if (status === "report_cert_sent") {
      return (
        <span className={classes.ReportCertSentLabel}>
          {" "}
          {`Report & Certificate Sent`}{" "}
        </span>
      );
    } else if (status === "positive") {
      return <span className={classes.PositiveLabel}> {`POSITIVE`} </span>;
    } else {
      return "Unknown";
    }
  };

  const downloadForm1 = (id) => {
    PDFService.downloadCovidForm1(id)
      .then((res) => {
        const file = new Blob([res.data], { type: "application/pdf" });

        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, "_blank");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const downloadForm2 = (id) => {
    PDFService.downloadCovidForm2(id)
      .then((res) => {
        const file = new Blob([res.data], { type: "application/pdf" });

        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, "_blank");

        setRefreshData(!refreshData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const downloadLabResults = (id) => {
    PDFService.downloadPdfResult(id)
      .then((res) => {
        const file = new Blob([res.data], { type: "application/pdf" });

        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, "_blank");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const downloadCertificate = (id) => {
    PDFService.downloadPdfCert(id)
      .then((res) => {
        const file = new Blob([res.data], { type: "application/pdf" });

        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, "_blank");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEditModeChanged = (edit, person) => {
    if (edit) {
      setForename(person.forenameCapital);
      setSurnme(person.surnameCapital);
      setBookingDate(FormatDateFromString(person.bookingDate));
      setBookingTime(person.bookingTime.toUpperCase());
      setGender(person.gender.toUpperCase());
      setTitle(person.title.toUpperCase());
      setEmail(person.email.toUpperCase());
      setDOB(FormatDateFromString(person.birthDate));
      setTel(person.phone.toUpperCase());
      setPostCode(person.postCode.toUpperCase());
      setAddress(person.address.toUpperCase());
      if (person.notes) {
        setNotes(person.notes.toUpperCase());
      }else
      {
        setNotes('')
      }

      if (person.passportNumber) {
        setPassport(person.passportNumber.toUpperCase());
      }else
      {
        setPassport('')
      }

      if (person.passportNumber2) {
        setPassport2(person.passportNumber2.toUpperCase());
      }else
      {
        setPassport2('')
      }

      setCertificate(person.certificate);
      setAntiBodyTest(person.antiBodyTest);

      setEditMode({ edit: edit, person: person });
    } else if (!edit && !person) {
      setEditMode({ edit: edit, person: person });
      setRecordChanged(false);
    } else if (!edit && person) {
      const booking = {};
      const bookingId = person._id;
      booking.certificate = certificate;
      booking.antiBodyTest = antiBodyTest;
      booking.gender = gender;
      booking.title = title;
      booking.birthDate = RevertFormatDateFromString(dob);
      booking.email = email;
      booking.phone = tel;
      booking.postCode = postCode;
      booking.address = address;
      booking.passportNumber = passport;
      booking.passportNumber2 = passport2;
      booking.forename = forename;
      booking.surname = surname;
      booking.notes = notes;
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

    if (!validateDate(booking.birthDate)) {
      error = true;
      setValidationError({ ...validationError, dobError: true });
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

  const resendEmails = (event, id) => {
    setSelectedBooking(booking);
    setOpenResendDialog(true);
  };

  const Pay = (event, id) => {
    setSelectedBooking(booking);
    setOpenPayDialog(true);
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

  ///*** Invoice  ******************/

  const [invoice, setInvoice] = React.useState(null);
  const [invoiceLoaded, setInvoiceLoaded] = React.useState(false);
  const [openInvoiceDialog, setOpenInvoiceDialog] = React.useState(false);
  const [emailSentInvoice, setEmailSentInvoice] = React.useState(false);

  const fetchInvoice = async () => {
    try {
      setInvoiceLoaded(false);
      const res = await InvoiceService.getInvoiceByBookingId(props.booking._id);
      setInvoice(res.data.invoice);
      setInvoiceLoaded(true);
    } catch (err) {
      setInvoiceLoaded(true);
      console.error(err);
    }
  };

  React.useEffect(() => {
    if (props.booking) {
      fetchInvoice();
    }
  }, [props.booking, props.open]);

  const handleCloseInvoiceDialog = (refresh) => {
    setOpenInvoiceDialog(false);
    setSelectedBooking(null);
    fetchInvoice();
  };

  const OpenInvoiceDialog = () => {
    setSelectedBooking(booking);
    setInvoice(invoice);
    setOpenInvoiceDialog(true);
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

  //***************************** */

  return (
    <React.Fragment>
      {booking && (
        <React.Fragment>
          <Dialog
            maxWidth="md"
            open={props.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={props.onClose}
            PaperComponent={PaperComponent}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle
              id="alert-dialog-slide-title"
              style={
                booking.tr ? { backgroundColor: "#7e0082", color: "#fff" } : {}
              }
            >
              <div style={{ position: "absolute", top: "25x", left: "25px" }}>
                <Tooltip title="COPY EDIT LINK TO CLIPBOARD">
                  <IconButton
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `https://londonmedicalclinic.co.uk/medicalexpressclinic/user/edit/pcr/${booking._id}`
                      );
                      setCopied(true);
                      setTimeout(() => {
                        setCopied(false);
                      }, 1500);
                    }}
                    aria-label="delete"
                    className={classes.margin}
                    size="small"
                  >
                    <FileCopyOutlinedIcon
                      style={booking.tr ? { color: "#ddd" } : {}}
                      fontSize="14px"
                    />
                  </IconButton>
                </Tooltip>

                <span
                  hidden={!copied}
                  style={{ fontSize: "12px", transition: "all 1s ease-in" }}
                >
                  {" "}
                  Copied{" "}
                </span>
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "25x",
                  right: "60px",
                  backgroundColor: CalendarColors.PCR_COLOR,
                  color: "#fff",
                  padding: "0px 5px",
                  borderRadius: "10px",
                }}
              >
                PCR
              </div>

              {booking.tr && (
                <div style={{ position: "absolute", right: "15px" }}>TR</div>
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
                    {`${booking.forenameCapital} ${booking.surnameCapital}`}
                  </div>
                </Grid>

                {booking.deleted && (
                  <Grid item>
                    <Tooltip title="This record has been deleted.">
                      <DeleteIcon
                        style={
                          booking.tr
                            ? {
                                padding: 0,
                                margin: 0,
                                color: "#fff",
                                fontSize: 25,
                              }
                            : {
                                padding: 0,
                                margin: 0,
                                color: "#333",
                                fontSize: 25,
                              }
                        }
                      />
                    </Tooltip>
                  </Grid>
                )}
              </Grid>
            </DialogTitle>
            <DialogContent>
              <div
                style={{
                  paddingTop: "20px",
                }}
              >
                <Grid item xs={12} md={12} key={`panel0`}>
                  <div className={classes.infoDetails}>
                    <ul className={classes.ul}>
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
                            paddingBottom: "5px",
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

                      {/* Edit Functionality ******************************************* */}

                      <li
                        hidden={
                          booking.deleted ||
                          deleteMode.delete ||
                          (editMode.edit && editMode.person._id === booking._id)
                        }
                      >
                        <Button
                          type="button"
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            handleEditModeChanged(true, booking);
                          }}
                          className={classes.EditButton}
                        >
                          Edit Booking Info
                        </Button>
                      </li>

                      <li
                        hidden={
                          !(
                            editMode.edit && editMode.person._id === booking._id
                          )
                        }
                      >
                        <Button
                          type="button"
                          fullWidth
                          variant="contained"
                          color="primary"
                          disabled={saving || !recordChanged}
                          onClick={() => {
                            handleEditModeChanged(false, booking);
                          }}
                          className={classes.SaveButton}
                        >
                          Save Changes
                        </Button>
                      </li>

                      <li
                        hidden={
                          !(
                            editMode.edit && editMode.person._id === booking._id
                          )
                        }
                      >
                        <Button
                          type="button"
                          fullWidth
                          variant="contained"
                          color="default"
                          disabled={saving}
                          onClick={() => {
                            handleEditModeChanged(false, null);
                          }}
                          className={classes.CancelButton}
                        >
                          Cancel
                        </Button>
                      </li>

                      {/* ****************************************************************************************** */}

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
                            paddingBottom: "5px",
                            paddingLeft: "5px",
                            fontSize: "16px",
                          }}
                        >
                          Are you sure you want to delete this record?
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
                        <Button
                          type="button"
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            handleDeleteModeChanged(true, booking);
                          }}
                          className={classes.DeleteButton}
                        >
                          Delete This Record
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
                          color="primary"
                          disabled={deleting}
                          onClick={() => {
                            handleDeleteModeChanged(false, booking);
                          }}
                          className={classes.SaveButton}
                        >
                          YES, Delete this!
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

                      <li className={classes.li}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <span className={classes.infoTitle}>
                              BOOKED DATE
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

                          <Grid item xs={6}>
                            <span className={classes.infoTitle}>
                              BOOKED TIME
                            </span>
                            <span
                              hidden={
                                editMode.edit &&
                                editMode.person._id === booking._id
                              }
                              className={classes.infoData}
                            >
                              {booking.bookingTime.toUpperCase()}
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

                      <li className={classes.li}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <span className={classes.infoTitle}>GENDER</span>
                            <span
                              hidden={
                                editMode.edit &&
                                editMode.person._id === booking._id
                              }
                              className={classes.infoData}
                            >
                              {booking.gender?.toUpperCase()}
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
                                value={gender}
                                onChange={genderChanged}
                                inputProps={{
                                  style: {
                                    padding: 0,
                                  },
                                }}
                              ></TextField>
                            </span>
                          </Grid>
                          <Grid item xs={6}>
                            <span className={classes.infoTitle}>TITLE</span>
                            <span
                              hidden={
                                editMode.edit &&
                                editMode.person._id === booking._id
                              }
                              className={classes.infoData}
                            >
                              {booking.title?.toUpperCase()}
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
                                value={title}
                                onChange={titleChanged}
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

                      <li className={classes.li}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <span className={classes.infoTitle}>FORENAME</span>
                            <span
                              hidden={
                                editMode.edit &&
                                editMode.person._id === booking._id
                              }
                              className={classes.infoData}
                            >
                              {booking.forenameCapital}
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
                                value={forename}
                                onChange={forenameChanged}
                                inputProps={{
                                  style: {
                                    padding: 0,
                                  },
                                }}
                              ></TextField>
                            </span>
                          </Grid>
                          <Grid item xs={6}>
                            <span className={classes.infoTitle}>SURNAME</span>
                            <span
                              hidden={
                                editMode.edit &&
                                editMode.person._id === booking._id
                              }
                              className={classes.infoData}
                            >
                              {booking.surnameCapital}
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
                                value={surname}
                                onChange={surnameChanged}
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

                      <li className={classes.li}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <span className={classes.infoTitle}>EMAIL</span>
                            <span
                              hidden={
                                editMode.edit &&
                                editMode.person._id === booking._id
                              }
                              className={classes.infoData}
                            >
                              {booking.email?.toUpperCase()}
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
                          <Grid item xs={6}>
                            <span className={classes.infoTitle}>D.O.B</span>
                            <span
                              hidden={
                                editMode.edit &&
                                editMode.person._id === booking._id
                              }
                              className={classes.infoData}
                            >
                              {FormatDateFromString(booking.birthDate)}
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
                                error={validationError.dobError}
                                className={classes.TextBox}
                                value={dob}
                                onChange={dobChanged}
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
                      <li className={classes.li}></li>
                      <li className={classes.li}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <span className={classes.infoTitle}>TEL</span>
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
                          <Grid item xs={6}>
                            <span className={classes.infoTitle}>POST CODE</span>
                            <span
                              hidden={
                                editMode.edit &&
                                editMode.person._id === booking._id
                              }
                              className={classes.infoData}
                            >
                              {booking.postCode?.toUpperCase()}
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
                                value={postCode}
                                onChange={postCodeChanged}
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
                      <li className={classes.li}>
                        <span className={classes.infoTitle}>ADDRESS</span>
                        <span
                          hidden={
                            editMode.edit && editMode.person._id === booking._id
                          }
                          className={classes.infoData}
                        >
                          {booking.address?.toUpperCase()}
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
                            value={address}
                            onChange={addressChanged}
                            inputProps={{
                              style: {
                                padding: 0,
                              },
                            }}
                          ></TextField>
                        </span>
                      </li>

                      {booking.selfIsolate && (
                        <React.Fragment>
                          <li className={classes.li}>
                            <span className={classes.infoTitle}>
                              Self-Isolate Post Code
                            </span>{" "}
                            <span className={classes.infoData}>
                              {booking.postCodeSI}
                            </span>
                          </li>
                          <li className={classes.li}>
                            <span className={classes.infoTitle}>
                              Self-Isolate Address
                            </span>{" "}
                            <span className={classes.infoData}>
                              {booking.addressSI}
                            </span>
                          </li>
                        </React.Fragment>
                      )}

                      <li className={classes.li}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <span className={classes.infoTitle}>
                              PASSPORT NO.
                            </span>
                            <span
                              hidden={
                                editMode.edit &&
                                editMode.person._id === booking._id
                              }
                              className={classes.infoData}
                            >
                              {booking.passportNumber?.toUpperCase()}
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
                                value={passport}
                                onChange={passportChanged}
                                inputProps={{
                                  style: {
                                    padding: 0,
                                  },
                                }}
                              ></TextField>
                            </span>
                          </Grid>

                          {!booking.tr && (
                            <Grid item xs={6}>
                              <span className={classes.infoTitle}>
                                SECOND PASSPORT NO.
                              </span>
                              <span
                                hidden={
                                  editMode.edit &&
                                  editMode.person._id === booking._id
                                }
                                className={classes.infoData}
                              >
                                {booking.passportNumber2?.toUpperCase()}
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
                                  value={passport2}
                                  onChange={passport2Changed}
                                  inputProps={{
                                    style: {
                                      padding: 0,
                                    },
                                  }}
                                ></TextField>
                              </span>
                            </Grid>
                          )}
                        </Grid>
                      </li>

                      <li hidden={!booking.tr} className={classes.li}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <span className={classes.infoTitle}>
                              NHS Number
                            </span>{" "}
                            <span className={classes.infoData}>
                              {booking.NHSNumber ?? "-"}
                            </span>
                          </Grid>
                          <Grid item xs={6}>
                            <span className={classes.infoTitle}>Ethnicity</span>{" "}
                            <span className={classes.infoData}>
                              {booking.ethnicity}
                            </span>
                          </Grid>
                        </Grid>
                      </li>

                      <li hidden={!booking.tr} className={classes.li}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <span className={classes.infoTitle}>
                              Arrival Date
                            </span>{" "}
                            <span className={classes.infoData}>
                              {booking.arrivalDate}
                            </span>
                          </Grid>
                          <Grid item xs={6}>
                            <span className={classes.infoTitle}>
                              Flight Number
                            </span>{" "}
                            <span className={classes.infoData}>
                              {booking.flightNumber}
                            </span>
                          </Grid>
                        </Grid>
                      </li>
                      <li hidden={!booking.tr} className={classes.li}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <span className={classes.infoTitle}>
                              Last Departed Date
                            </span>{" "}
                            <span className={classes.infoData}>
                              {booking.lastDepartedDate}
                            </span>
                          </Grid>
                          <Grid item xs={6}>
                            <span className={classes.infoTitle}>
                              Travelling From
                            </span>{" "}
                            <span className={classes.infoData}>
                              {booking.travellingFrom}
                            </span>
                          </Grid>
                        </Grid>
                      </li>

                      <li hidden={booking.tr} className={classes.li}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <span className={classes.infoTitle}>
                              REQUEST FOR CERTIFICATE
                            </span>
                            <span
                              hidden={
                                editMode.edit &&
                                editMode.person._id === booking._id
                              }
                              className={classes.infoData}
                            >
                              {booking.certificate ? (
                                <CheckIcon className={classes.checkIcon} />
                              ) : (
                                <CloseIcon className={classes.closeIcon} />
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
                              <FormControlLabel
                                className={classes.formControl}
                                control={
                                  <Checkbox
                                    className={classes.formControl}
                                    color="secondary"
                                    name="certificate"
                                    checked={certificate}
                                    onChange={certificateChanged}
                                  />
                                }
                                label=""
                              />
                            </span>
                          </Grid>
                          <Grid item xs={6}>
                            <span className={classes.infoTitle}>
                              REQUEST FOR ANTIBODY TEST
                            </span>
                            <span
                              hidden={
                                editMode.edit &&
                                editMode.person._id === booking._id
                              }
                              className={classes.infoData}
                            >
                              {booking.antiBodyTest ? (
                                <CheckIcon className={classes.checkIcon} />
                              ) : (
                                <CloseIcon className={classes.closeIcon} />
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
                              <FormControlLabel
                                className={classes.formControl}
                                control={
                                  <Checkbox
                                    className={classes.formControl}
                                    color="secondary"
                                    name="certificate"
                                    checked={antiBodyTest}
                                    onChange={antiBodyTestChanged}
                                  />
                                }
                                label=""
                              />
                            </span>
                          </Grid>
                        </Grid>
                      </li>
                      <li className={classes.li} style={{paddingTop:"10px"}}>
                        <span className={classes.infoTitle}>STATUS</span>{" "}
                        {getStatusLabel(booking.status)}
                        {booking.status === "sample_taken" &&
                          !(
                            editMode.edit && editMode.person._id === booking._id
                          ) && (
                            <Button
                              variant="outlined"
                              color="primary"
                              disabled={saving}
                              onClick={(event) =>
                                changeBackToBookingMade(event, booking._id)
                              }
                            >
                              Change Back To Booking Made
                            </Button>
                          )}
                        {(booking.status === "report_sent" ||
                          booking.status === "report_cert_sent" ||
                          booking.status === "positive") &&
                          !(
                            editMode.edit && editMode.person._id === booking._id
                          ) && (
                            <Button
                              variant="outlined"
                              color="primary"
                              className={classes.ResendEmailsButton}
                              onClick={(event) =>
                                resendEmails(event, booking._id)
                              }
                            >
                              Resend emails
                            </Button>
                          )}
                      </li>

                      <li hidden={booking.deleted}>
                        <Button
                          startIcon={<PrintIcon />}
                          type="button"
                          fullWidth
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            downloadForm1(booking._id);
                          }}
                          // onTouchTap = {() => {downloadForm1(person._id)}}
                          className={classes.DownloadForm}
                        >
                          Download Registration Form
                        </Button>
                      </li>

                      <li hidden={booking.deleted}>
                        <Button
                          startIcon={<PrintIcon />}
                          type="button"
                          fullWidth
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            downloadForm2(booking._id);
                          }}
                          // onTouchTap = {() => {downloadForm2(person._id)}}
                          className={classes.DownloadForm}
                        >
                          Download Lab Form
                        </Button>
                      </li>

                      <li
                        hidden={
                          booking.deleted ||
                          (booking.status !== "report_sent" &&
                            booking.status !== "report_cert_sent" &&
                            booking.status !== "positive")
                        }
                      >
                        <Button
                          startIcon={<PrintIcon />}
                          type="button"
                          fullWidth
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            downloadLabResults(booking._id);
                          }}
                          // onTouchTap = {() => {downloadForm1(person._id)}}
                          className={classes.DownloadForm}
                        >
                          Download Lab Results
                        </Button>
                      </li>

                      <li
                        hidden={
                          booking.deleted ||
                          (booking.status !== "report_cert_sent" &&
                            booking.status !== "positive")
                        }
                      >
                        <Button
                          startIcon={<PrintIcon />}
                          type="button"
                          fullWidth
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            downloadCertificate(booking._id);
                          }}
                          // onTouchTap = {() => {downloadForm1(person._id)}}
                          className={classes.DownloadForm}
                        >
                          Download Certificate
                        </Button>
                      </li>

                      <li>
                        <Button
                          startIcon={<HistoryIcon />}
                          type="button"
                          fullWidth
                          variant="outlined"
                          color="secondary"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setOpenTimeStampDialog(true);
                          }}
                          // onTouchTap = {() => {downloadForm1(person._id)}}
                          className={classes.DownloadForm}
                        >
                          Show Audit Trail
                        </Button>
                      </li>

                      <Divider />

                      <li className={classes.li} style={{ marginTop: "20px" }}>
                        <span className={classes.infoTitle}>INVOICE # : </span>{" "}
                        <span style={{ paddingLeft: "0px" }}>
                          {!invoiceLoaded && (
                            <span className={classes.invoiceNumber}> ... </span>
                          )}
                          {invoiceLoaded && invoice && (
                            <span className={classes.invoiceNumber}>
                              {" "}
                              {invoice.invoiceNumber}{" "}
                            </span>
                          )}
                          {invoiceLoaded && !invoice && (
                            <span
                              className={classes.invoiceNumber}
                              style={{ color: "red", fontSize: "0.9rem" }}
                            >
                              {" "}
                              N/A{" "}
                            </span>
                          )}
                        </span>
                        {!(
                          editMode.edit && editMode.person._id === booking._id
                        ) &&
                          !booking.deleted && (
                            <React.Fragment>
                              {invoiceLoaded && !invoice && (
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  className={classes.PayButton}
                                  onClick={() => OpenInvoiceDialog()}
                                >
                                  Issue Invoice
                                </Button>
                              )}

                              {invoiceLoaded && invoice && (
                                <React.Fragment>
                                  <Button
                                    variant="outlined"
                                    startIcon={<PrintIcon />}
                                    color="primary"
                                    className={classes.printInvoiceButton}
                                    onClick={() => downloadInvoice(invoice._id)}
                                  >
                                    Download Invoice
                                  </Button>

                                  <Button
                                    variant="outlined"
                                    color="secondary"
                                    className={classes.editInvoiceButton}
                                    onClick={() => OpenInvoiceDialog()}
                                  >
                                    Edit Invoice
                                  </Button>

                                  <Button
                                    disabled={
                                      !booking.email || booking.email.length < 3
                                    }
                                    startIcon={<SendIcon />}
                                    type="button"
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => {
                                      sendInvoiceEmail(
                                        invoice._id,
                                        booking.email
                                      );
                                    }}
                                    style={{
                                      position: "relative",
                                      marginLeft: "10px",
                                      paddingRight: "130px",
                                      fontSize: "0.8rem",
                                    }}
                                  >
                                    Send Invoice By Email
                                    {emailSentInvoice && (
                                      <div
                                        style={{
                                          position: "absolute",
                                          right: "10px",
                                          top: "5px",
                                          color: "#05ad19",
                                        }}
                                      >
                                        Email Sent
                                      </div>
                                    )}
                                  </Button>
                                </React.Fragment>
                              )}
                            </React.Fragment>
                          )}
                      </li>

                      <li className={classes.li}>
                        <span className={classes.infoTitle}>TOTAL CHARGES</span>{" "}
                        <span
                          className={
                            calculatePrice(booking) <= 199
                              ? classes.infoDataCharges
                              : classes.infoDataChargesHigher
                          }
                        >{`£${calculatePrice(booking)}`}</span>
                        {!(
                          editMode.edit && editMode.person._id === booking._id
                        ) &&
                          !booking.paid &&
                          !booking.deleted && (
                            <Button
                              variant="outlined"
                              color="secondary"
                              className={classes.PayButton}
                              onClick={(event) => Pay(event, booking._id)}
                            >
                              Pay
                            </Button>
                          )}
                        {!(
                          editMode.edit && editMode.person._id === booking._id
                        ) &&
                          booking.paid && (
                            <React.Fragment>
                              <span className={classes.PayLabel}>
                                {" "}
                                <CheckIcon
                                  className={classes.checkIconSmall}
                                />{" "}
                                Paid by {booking.paidBy}
                                {booking.paidBy === "corporate"
                                  ? ` "${booking.corporate}" `
                                  : ""}
                              </span>

                              <Tooltip title="Undo Payment">
                                <IconButton
                                  onClick={() => setOpenUndoPayDialog(true)}
                                >
                                  <UndoIcon style={{ color: "red" }} />
                                </IconButton>
                              </Tooltip>
                            </React.Fragment>
                          )}
                      </li>
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

            <ResendEmailsDialog
              booking={selectedBooking}
              open={openResendDialog}
              handleClose={handleCloseResendDialog}
            />
            <PayDialog
              booking={selectedBooking}
              open={openPayDialog}
              handleClose={handleClosePayDialog}
            />

            <InvoiceDialog
              booking={selectedBooking}
              invoice={invoice}
              open={openInvoiceDialog}
              defaultCodes={getDefaultCodes(props.booking)}
              handleClose={handleCloseInvoiceDialog}
            />

            <TimeStampDialog
              booking={selectedBooking}
              open={openTimeStampDialog}
              handleClose={handleCloseTimeStampDialog}
            />
          </Dialog>

          <Dialog
            open={openUndoPayDialog}
            onClose={handleCloseUndoPayDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle style={{ color: "#999" }} id="alert-dialog-title">
              {"Undo Payment"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText
                style={{ color: "#333", fontWeight: "400" }}
                id="alert-dialog-description"
              >
                Are you sure you want to undo payment for this booking?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseUndoPayDialog} color="default">
                Back
              </Button>
              <Button onClick={undoPaymentClicked} color="secondary" autoFocus>
                Yes, Undo Payment
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
