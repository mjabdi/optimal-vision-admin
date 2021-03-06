import React, { useEffect, useRef, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import BookService from "./services/BookService";
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Icon,
  InputLabel,
  LinearProgress,
  Link,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  SvgIcon,
  Switch,
  TextField,
  Tooltip,
} from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import { IconButton } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import GlobalState from "./../GlobalState";
import { getMenuIndex } from "./../MenuList";
import {
  FormatDateFromString,
  FormatDateFromStringShortYear,
} from "./DateFormatter";

import SearchIcon from "@material-ui/icons/Search";
import BookingDialog from "./BookingDialog";

import NewReleasesIcon from "@material-ui/icons/NewReleases";
import HistoryIcon from "@material-ui/icons/History";
import TimelineIcon from "@material-ui/icons/Timeline";
import DescriptionIcon from "@material-ui/icons/Description";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import LiveTvIcon from "@material-ui/icons/LiveTv";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteIcon from "@material-ui/icons/Delete";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import Draggable from "react-draggable";

import * as dateformat from "dateformat";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import BusinessIcon from "@material-ui/icons/Business";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import LocalAtmIcon from "@material-ui/icons/LocalAtm";

import ReactHTMLTableToExcel from "react-html-table-to-excel";
import PriceCalculator from "./PriceCalculator";
import { corporates } from "./Corporates";

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
    width: "70px",
    textAlign: "center",
  },

  PatientAttendedLabel: {
    backgroundColor: "#0066aa",
    color: "#fff",
    width: "70px",
    textAlign: "center",
  },

  SampleTakenLabel: {
    backgroundColor: "#0066cc",
    color: "#fff",
    width: "70px",
    textAlign: "center",
  },

  ReportSentLabel: {
    backgroundColor: "#009900",
    color: "#fff",
    width: "70px",
    textAlign: "center",
  },

  ReportCertSentLabel: {
    backgroundColor: "#009900",
    color: "#fff",
    width: "70px",
    textAlign: "center",
  },

  PositiveLabel: {
    backgroundColor: "red",
    color: "#fff",
    width: "70px",
    textAlign: "center",
  },

  HideNowRows: {
    position: "absolute",
    top: "40%",
    left: "40%",
    width: "600px",
    height: "300px",
    backgroundColor: "#fafafa",
    color: "#111",
    zIndex: "1000",
    display: "flex",
    alignItems: "center",
    justifyItems: "center",
  },

  ExportToExcelButton: {
    // marginBottom : "20px",
    color: "#2f942e",
    borderColor: "#2f942e",
    "&:hover": {
      background: "#fafffa",
      borderColor: "#2f942e",
    },
    textDecoration: "none !important",
  },

  ExportToExcelButtonInline: {
    // marginBottom : "20px",
    color: "#2f942e",
    borderColor: "#2f942e",
    "&:hover": {
      background: "#fafffa",
      borderColor: "#2f942e",
    },
    textDecoration: "none !important",
    cursor: "pointer",
    padding: "10px",
  },

  table: {
    width: "100%",
    border: "1px solid #ddd",
    borderCollapse: "collapse",
  },

  th: {
    border: "1px solid #ddd",
    borderCollapse: "collapse",
    verticalAlign: "middle",
    fontcolor: "#555",
    fontWeight: "400",
    fontSize: "15px",
    paddingTop: "5px",
    paddingBottom: "5px",
    width: "14%",
    paddingLeft: "5px",
  },

  td: {
    border: "1px solid #ddd",
    borderCollapse: "collapse",
    verticalAlign: "middle",
    paddingLeft: "5px",
  },

  topSelect: {
    margin: theme.spacing(1),
    minWidth: 80,
  },

  notifyIcon: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    backgroundColor: "rgb(220, 0, 78)",
    marginLeft: "10px",
  },

  clinicTitle: {
    fontWeight: "600",
    textAlign: "center",
    color: theme.palette.primary.main,
    padding: "2px 10px",
  },

  PCRLabel: {
    color: "#4faef7",
    fontWeight: "600",
    fontSize: "0.95rem",
  },

  GynaeLabel: {
    color: "#e83caf",
    fontWeight: "600",
    fontSize: "0.95rem",
  },

  GPLabel: {
    color: "#ff4f14",
    fontWeight: "600",
    fontSize: "0.95rem",
  },

  STDLabel: {
    color: "#d6733a",
    fontWeight: "600",
    fontSize: "0.95rem",
  },
}));

const getTableTitle = (str) => {
  if (str === "today") {
    return `Today's Bookings`;
  } else if (str === "old") {
    return `Old Bookings`;
  } else if (str === "future") {
    return `Future Bookings`;
  } else if (str === "recent") {
    return `Recent Bookings`;
  } else if (str === "live") {
    return `Live Bookings`;
  } else if (str === "completed") {
    return `Completed Bookings`;
  } else if (str === "positive") {
    return `Positive Results`;
  } else if (str === "deleted") {
    return `Deleted Records`;
  } else if (str === "late") {
    return `40 Hours Late`;
  } else {
    return `All Bookings`;
  }
};

const getTableIcon = (str) => {
  if (str === "today") {
    return <NewReleasesIcon style={{ fontSize: "2.2rem" }} />;
  } else if (str === "old") {
    return <HistoryIcon style={{ fontSize: "2.2rem" }} />;
  } else if (str === "future") {
    return <TimelineIcon style={{ fontSize: "2.2rem" }} />;
  } else if (str === "recent") {
    return <AutorenewIcon style={{ fontSize: "2.2rem" }} />;
  } else if (str === "live") {
    return <LiveTvIcon style={{ fontSize: "2.2rem" }} />;
  } else if (str === "completed") {
    return <PlaylistAddCheckIcon style={{ fontSize: "2.2rem" }} />;
  } else if (str === "positive") {
    return <AddCircleOutlineIcon style={{ fontSize: "2.2rem" }} />;
  } else if (str === "deleted") {
    return <DeleteIcon style={{ fontSize: "2.2rem" }} />;
  } else if (str === "late") {
    return <HourglassEmptyIcon style={{ fontSize: "2.2rem" }} />;
  } else {
    return <DescriptionIcon style={{ fontSize: "2.2rem" }} />;
  }
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

export default function BookingTable(props) {
  const classes = useStyles();

  const getClassforClinic = (clinic) => {
    switch (clinic) {
      case "pcr":
        return classes.PCRLabel;
      case "gp":
        return classes.GPLabel;
      case "gynae":
        return classes.GynaeLabel;
      case "std":
        return classes.STDLabel;

      default:
        return classes.clinicTitle;
    }
  };

  const [topCount, setTopCount] = React.useState(25);
  const topCountChanged = (event) => {
    setTopCount(event.target.value);
    loadData(event.target.value);
  };

  const [openDialogExcel, setOpenDialogExcel] = useState(false);
  const handleCloseDialogExcel = () => {
    setCorporate(corporates[0]);
    setJustCorporate(false);
    setOpenDialogExcel(false);
  };

  const [fromDate, setFromDate] = React.useState(
    new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
  );
  const handleFromDateChange = (date) => {
    setFromDate(date);
    setFromDateStr(dateformat(date, "yyyy-mm-dd"));
  };

  const [untilDate, setUntilDate] = React.useState(
    new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
  );
  const handleUntilDateChange = (date) => {
    setUntilDate(date);
    seUntilDateStr(dateformat(date, "yyyy-mm-dd"));
  };

  const [fromDateStr, setFromDateStr] = useState(
    dateformat(
      new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      "yyyy-mm-dd"
    )
  );
  const [untilDateStr, seUntilDateStr] = useState(
    dateformat(
      new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
      "yyyy-mm-dd"
    )
  );

  const [justCorporate, setJustCorporate] = useState(false);

  const [chkDate, setChkDate] = useState(true);
  const [chkForename, setChkForename] = useState(true);
  const [chkSurname, setChkSurname] = useState(true);
  const [chkDOB, setChkDOB] = useState(true);
  const [chkEmail, setChkEmail] = useState(true);
  const [chkTel, setChkTel] = useState(true);
  const [chkCertificate, setChkCertidicate] = useState(true);
  const [chkAntiBodyTest, setChkAntiBodyTest] = useState(true);
  const [chkextRef, setChkExtRef] = useState(true);
  const [chkPrice, setChkPrice] = useState(true);

  const justCorporateChanged = (event) => {
    setJustCorporate(event.target.checked);
  };

  const chkDateChanged = (event) => {
    setChkDate(event.target.checked);
  };

  const chkForenameChanged = (event) => {
    setChkForename(event.target.checked);
  };

  const chkSurnameChanged = (event) => {
    setChkSurname(event.target.checked);
  };

  const chkDOBChanged = (event) => {
    setChkDOB(event.target.checked);
  };

  const chkEmailChanged = (event) => {
    setChkEmail(event.target.checked);
  };

  const chkTelChanged = (event) => {
    setChkTel(event.target.checked);
  };

  const chkCertificateChanged = (event) => {
    setChkCertidicate(event.target.checked);
  };

  const chkAntiBodyTestChanged = (event) => {
    setChkAntiBodyTest(event.target.checked);
  };

  const chkextRefChanged = (event) => {
    setChkExtRef(event.target.checked);
  };

  const chkPriceChanged = (event) => {
    setChkPrice(event.target.checked);
  };

  var columns = [];

  if (props.date === "recent") {
    columns = [
      // { field: 'id', headerName: '#', width: 70 },

      {
        field: "_id",
        headerName: " ",
        width: 70,
        renderCell: (params) => {
          return (
            <React.Fragment>
              <Button
                color="primary"
                onClick={(event) => openDetailsDialog(event, params.value)}
              >
                <SearchIcon />
              </Button>
            </React.Fragment>
          );
        },
      },

      {
        field: "clinic",
        headerName: "Clinic",
        align: "center",
        width: 90,
        renderCell: (params) => {
          return (
            <span className={getClassforClinic(params.value)}>
              {params.value ? params.value.toUpperCase() : "N/A"}
            </span>
          );
        },
      },

      {
        field: "paid",
        headerName: "Paid",
        align: "center",
        width: 90,
        renderCell: (params) => {
          if (!params.value) {
            return (
              <React.Fragment>
                <CloseIcon className={classes.closeIcon} />
              </React.Fragment>
            );
          } else {
            if (params.getValue("paidBy") === "credit card") {
              return <CreditCardIcon className={classes.checkIcon} />;
            } else if (params.getValue("paidBy") === "cash") {
              return <LocalAtmIcon className={classes.checkIcon} />;
            } else if (params.getValue("paidBy") === "corporate") {
              return <BusinessIcon className={classes.checkIcon} />;
            } else {
              return "";
            }
          }
        },
      },

      {
        field: "timeStamp",
        headerName: "TimeStamp",
        width: 200,
        valueFormatter: (params) => {
          return formatTimeStamp(params.value);
        },
      },

      {
        field: "bookingDate",
        headerName: "B Date",
        width: 110,
        valueFormatter: (params) => {
          return FormatDateFromString(params.value);
        },
      },
      {
        field: "bookingTimeNormalized",
        headerName: "B Time",
        width: 105,
        valueGetter: (params) => {
          return params.getValue("bookingTime");
        },
      },
      {
        field: "status",
        headerName: "Status",
        width: 100,
        renderCell: (params) => {
          if (params.value === "booked") {
            return <span className={classes.BookedLabel}> BM </span>;
          } else if (params.value === "patient_attended") {
            return <span className={classes.PatientAttendedLabel}> PA </span>;
          } else if (params.value === "sample_taken") {
            return <span className={classes.SampleTakenLabel}> ST </span>;
          } else if (params.value === "report_sent") {
            return <span className={classes.ReportSentLabel}> RS </span>;
          } else if (params.value === "report_cert_sent") {
            return <span className={classes.ReportCertSentLabel}> RCS </span>;
          } else if (params.value === "positive") {
            return <span className={classes.PositiveLabel}> POS </span>;
          } else {
            return "Unknown";
          }
        },
      },
      {
        field: "bookingRef",
        headerName: "Ref No.",
        width: 120,
        renderCell: (params) => {
          return (
            <Tooltip title="Go Find By Ref" placement="right">
              <Link
                className={classes.RefLink}
                //  onClick={
                //   () => {
                //     console.log(params.value);

                //     setState(state => ({...state, currentMenuIndex: getMenuIndex(`pcr` , `findByRef`)}));
                //     setState(state => ({...state, ref : params.value}));
                //     setState(state => ({...state, refError : false}));
                //     setState(state => ({...state, foundRecords : []}));
                //     setState(state => ({...state, findRecords : !state.findRecords}));
                //   }
                // }
              >
                {params.value}
              </Link>
            </Tooltip>
          );
        },
      },
      { field: "fullname", headerName: "Fullname", width: 250,   valueGetter: (params) => {
        if (!params.value || params.value.length === 0)
        {
          return `${params.getValue('forename')} ${params.getValue('surname')}`

        }else
        {
          return params.value
        }
       
      } },
      { field: "email", headerName: "Email", width: 200 },
      { field: "phone", headerName: "Tel", width: 150 },
      { field: "notes", headerName: "Notes", width: 500 },
    ];
  } else {
    columns = [
      // { field: 'id', headerName: '#', width: 70 },

      {
        field: "_id",
        headerName: " ",
        width: 70,
        renderCell: (params) => {
          return (
            <React.Fragment>
              <Button
                color="primary"
                onClick={(event) => openDetailsDialog(event, params.value)}
              >
                <SearchIcon />
              </Button>
            </React.Fragment>
          );
        },
      },

      {
        field: "clinic",
        headerName: "Clinic",
        align: "center",
        width: 90,
        renderCell: (params) => {
          return (
            <span className={getClassforClinic(params.value)}>
              {params.value ? params.value.toUpperCase() : "N/A"}
            </span>
          );
        },
      },

      {
        field: "paid",
        headerName: "Paid",
        align: "center",
        width: 90,
        renderCell: (params) => {
          if (!params.value) {
            return (
              <React.Fragment>
                <CloseIcon className={classes.closeIcon} />
                {parseInt(params.getValue("deposit")) > 0 &&
                  props.date === "deleted" && (
                    <span className={classes.notifyIcon}>&nbsp;</span>
                  )}
              </React.Fragment>
            );
          } else {
            if (params.getValue("paidBy") === "credit card") {
              return <CreditCardIcon className={classes.checkIcon} />;
            } else if (params.getValue("paidBy") === "cash") {
              return <LocalAtmIcon className={classes.checkIcon} />;
            } else if (params.getValue("paidBy") === "corporate") {
              return <BusinessIcon className={classes.checkIcon} />;
            } else {
              return "";
            }
          }
        },
      },
      {
        field: "bookingDate",
        headerName: "B Date",
        width: 110,
        valueFormatter: (params) => {
          return FormatDateFromString(params.value);
        },
      },
      {
        field: "bookingTimeNormalized",
        headerName: "B Time",
        width: 105,
        valueGetter: (params) => {
          return params.getValue("bookingTime");
        },
      },
      {
        field: "status",
        headerName: "Status",
        width: 100,
        renderCell: (params) => {
          if (params.value === "booked") {
            return <span className={classes.BookedLabel}> BM </span>;
          } else if (params.value === "patient_attended") {
            return <span className={classes.PatientAttendedLabel}> PA </span>;
          } else if (params.value === "sample_taken") {
            return <span className={classes.SampleTakenLabel}> ST </span>;
          } else if (params.value === "report_sent") {
            return <span className={classes.ReportSentLabel}> RS </span>;
          } else if (params.value === "report_cert_sent") {
            return <span className={classes.ReportCertSentLabel}> RCS </span>;
          } else if (params.value === "positive") {
            return <span className={classes.PositiveLabel}> POS </span>;
          } else {
            return "Unknown";
          }
        },
      },
      {
        field: "bookingRef",
        headerName: "Ref No.",
        width: 120,
        renderCell: (params) => {
          return (
            <Tooltip title="Go Find By Ref" placement="right">
              <Link
                className={classes.RefLink}
                //  onClick={
                //   () => {
                //     console.log(params.value);

                //     setState(state => ({...state, currentMenuIndex: getMenuIndex(`pcr` , `findByRef`)}));
                //     setState(state => ({...state, ref : params.value}));
                //     setState(state => ({...state, refError : false}));
                //     setState(state => ({...state, foundRecords : []}));
                //     setState(state => ({...state, findRecords : !state.findRecords}));
                //   }
                // }
              >
                {params.value}
              </Link>
            </Tooltip>
          );
        },
      },
      { field: "fullname", headerName: "Fullname", width: 250,   valueGetter: (params) => {
        if (!params.value || params.value.length === 0)
        {
          return `${params.getValue('forename')} ${params.getValue('surname')}`

        }else
        {
          return params.value
        }
       
      } },
      { field: "email", headerName: "Email", width: 200 },
      { field: "phone", headerName: "Tel", width: 150 },
      { field: "notes", headerName: "Notes", width: 500 },
    ];
  }

  const [state, setState] = React.useContext(GlobalState);

  const [data, setData] = React.useState({
    bookings: [],
    cachedBookings: [],
    isFetching: true,
  });

  const [selectedRow, setSelectedRow] = React.useState(null);

  const [selectedBooking, setSelectedBooking] = React.useState(null);
  const [seeDetailsDialogOpen, setSeeDetailsDialogOpen] = React.useState(false);

  const [corporate, setCorporate] = useState(corporates[0]);
  const corporateChanged = (event) => {
    setCorporate(event.target.value);
  };

  const [filter, setFilter] = React.useState("");

  const lastPromise = useRef();

  const formatTimeStamp = (timeStamp) => {
    const todayStr = dateformat(new Date(), "yyyy-mm-dd");
    const timeStampStr = dateformat(timeStamp, "yyyy-mm-dd");
    if (todayStr === timeStampStr) {
      return dateformat(timeStamp, "'Today', h:MM:ss TT");
    } else {
      return dateformat(timeStamp, "mmm dS, h:MM:ss TT");
    }
  };

  const loadData = (top) => {
    var api = BookService.getAllBookings;
    if (props.date === "today") {
      api = BookService.getTodayBookings;
    } else if (props.date === "old") {
      api = BookService.getOldBookings;
    } else if (props.date === "future") {
      api = BookService.getFutureBookings;
    } else if (props.date === "recent") {
      api = BookService.getRecentBookingsAll;
    } else if (props.date === "deleted") {
      api = BookService.getDeletedBookings;
    }

    setData({ bookings: [], cachedBookings: [], isFetching: true });

    // console.log(props)

    const currentPromise = api(top)
      .then((res) => {
        // console.log(res)
        for (var i = 0; i < res.data.length; i++) {
          res.data[i] = { ...res.data[i], id: i + 1 };
        }
        setData({
          bookings: [...res.data],
          cachedBookings: [...res.data],
          isFetching: false,
        });
        // return res.data;
      })
      .catch((err) => {
        console.error(err);
      });

    // lastPromise.current = currentPromise;

    // currentPromise.then(
    //   result => {
    //     if (currentPromise === lastPromise.current) {
    //       setData({bookings: [...result], cachedBookings: [...result], isFetching: false});
    //       setPage(1);
    //     }
    //   },
    //   e => {
    //     if (currentPromise === lastPromise.current) {
    //         console.error(e);
    //         setData({bookings: data.bookings, cachedBookings: data.cachedBookings, isFetching: false});
    //     }
    //   });
  };

  useEffect(() => {
    setTopCount(25);
    loadData(25);
  }, [props.date]);

  useEffect(() => {
    if (filter && filter.trim().length > 0) {
      var filteredData = data.cachedBookings.filter(
        (element) =>
          element.fullname?.toLowerCase().indexOf(filter.toLowerCase()) >= 0 ||
          element.forename?.toLowerCase().indexOf(filter.toLowerCase()) >= 0 ||
          element.surname?.toLowerCase().indexOf(filter.toLowerCase()) >= 0 
      );

      setData({
        bookings: [...filteredData],
        cachedBookings: data.cachedBookings,
        isFetching: false,
      });
    } else {
      setData({
        bookings: [...data.cachedBookings],
        cachedBookings: data.cachedBookings,
        isFetching: false,
      });
    }
  }, [filter]);

  // useEffect(() => {
  //   loadData(topCount);
  // }, [state.bookingDialogDataChanged]);

  const handleCloseSeeDetaisDialog = () => {
    setSelectedBooking(null);
    setSeeDetailsDialogOpen(false);
  };

  const openDetailsDialog = (event, id) => {
    const booking = data.bookings.find((element) => element._id === id);
    setSelectedBooking(booking);
    setSeeDetailsDialogOpen(true);
  };

  const refreshClicked = (event) => {
    setFilter("");
    loadData(topCount);
  };

  const filterChanged = (event) => {
    setFilter(event.target.value);
  };

  const handleSelectionChanged = (newSelection) => {
    if (newSelection.length > 0) {
      setSelectedRow(newSelection.rows[0]);
    }
  };

  const [page, setPage] = React.useState(1);

  const handleExcelButtonClicked = (event) => {
    setOpenDialogExcel(true);
  };

  const isTopSelectHidden = (date) => {
    return (
      date === "live" ||
      date === "positive" ||
      date === "late" ||
      date === "today"
    );
  };

  return (
    <React.Fragment>
      {data.isFetching && (
        <div style={{ width: "100%", paddingTop: "3px" }}>
          <LinearProgress color="primary" />
        </div>
      )}
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="flex-end"
      >
        <Grid item md={4}>
          <div style={{ textAlign: "left", paddingLeft: "10px" }}>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
              <Grid item>
                <span style={{ paddingRight: "15px", color: "#555" }}>
                  {" "}
                  {getTableIcon(props.date)}{" "}
                </span>
              </Grid>
              <Grid item>
                <span
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "600",
                    color: "#444",
                  }}
                >
                  {" "}
                  {getTableTitle(props.date)}{" "}
                </span>
              </Grid>
              <Grid item>
                <Tooltip title="Refresh" placement="right">
                  <IconButton
                    color="primary"
                    className={classes.refreshButton}
                    onClick={refreshClicked}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </div>
        </Grid>

        <Grid item md={3}>
          {props.date === "completed" && state.showCreateExcel && (
            <div style={{ paddingBottom: "5px" }}>
              <Button
                className={classes.ExportToExcelButton}
                variant="outlined"
                color="default"
                onClick={handleExcelButtonClicked}
                startIcon={
                  <FontAwesomeIcon
                    style={{ color: "#009900" }}
                    icon={faFileExcel}
                  />
                }
              >
                export to excel
              </Button>
            </div>
          )}
        </Grid>

        {data.isFetching && <div className={classes.HideNowRows}></div>}

        <Grid item md={3}>
          <TextField
            variant="standard"
            value={filter}
            onChange={filterChanged}
            margin="normal"
            size="small"
            id="filter"
            label="Filter"
            name="filter"
            autoComplete="off"
          />
        </Grid>

        <Grid item hidden={isTopSelectHidden(props.date)}>
          <FormControl className={classes.topSelect}>
            <InputLabel id="top-select-label">Limit</InputLabel>
            <Select
              labelId="top-select-label"
              id="top-simple-select"
              value={topCount}
              onChange={topCountChanged}
            >
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={500}>500</MenuItem>
              <MenuItem value={1000}>1000</MenuItem>
              <MenuItem value={10000}>ALL</MenuItem>
            </Select>
          </FormControl>

          {/* <Button onClick={() => loadData(true)}> Show all records </Button> */}
        </Grid>
      </Grid>

      <div style={{ height: 700, width: "100%" }}>
        <DataGrid
          rows={data.bookings}
          columns={columns}
          autoPageSize
          page={page}
          onPageChange={(params) => {
            setPage(params.page);
          }}
          onSelectionChange={handleSelectionChanged}
        />
      </div>

      <BookingDialog
        booking={selectedBooking}
        open={seeDetailsDialogOpen}
        onClose={handleCloseSeeDetaisDialog}
      />

      {data.bookings && data.bookings.length > 0 && (
        <Dialog
          maxWidth="lg"
          open={openDialogExcel}
          onClose={handleCloseDialogExcel}
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
                <FontAwesomeIcon
                  style={{ color: "#2f942e", fontSize: "2rem" }}
                  icon={faFileExcel}
                />
              </Grid>

              <Grid item>
                <div
                  style={{
                    color: "#2f942e",
                    paddingBottom: "5px",
                    fontWeight: "800",
                  }}
                >
                  {" "}
                  Export to EXCEL{" "}
                </div>
              </Grid>
            </Grid>

            <Divider />
          </DialogTitle>
          <DialogContent>
            <div
              style={{
                minHeight: "600px",
                maxHeight: "600px",
                minWidth: "1200px",
                maxWidth: "1200px",
              }}
            >
              <div>
                <Grid row container justify="center" spacing={3}>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={justCorporate}
                          onChange={justCorporateChanged}
                          name="justCorporate"
                        />
                      }
                      label="Just Corporate Records"
                    />
                  </Grid>

                  {justCorporate && (
                    <Grid item>
                      <FormControl
                        style={{ marginTop: "0px" }}
                        className={classes.formControl}
                      >
                        <Select
                          labelId="select-corporate"
                          id="select-corporate-id"
                          value={corporate}
                          onChange={corporateChanged}
                        >
                          {corporates.map((element) => (
                            <MenuItem value={element}>{`${element}`}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
                </Grid>

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid row container justify="center" spacing={3}>
                    <Grid item>
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="date-picker-from"
                        label="From"
                        value={fromDate}
                        onChange={handleFromDateChange}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                    </Grid>

                    <Grid item>
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="date-picker-until"
                        label="Until"
                        value={untilDate}
                        onChange={handleUntilDateChange}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                    </Grid>

                    <Grid item>
                      <div style={{ paddingTop: "30px", marginLeft: "20px" }}>
                        <ReactHTMLTableToExcel
                          id="test-table-xls-button"
                          className={classes.ExportToExcelButtonInline}
                          table="table-to-xls"
                          filename={`PCR.Report.${fromDateStr}.${untilDateStr}`}
                          sheet="PCR-Report"
                          buttonText="Download as XLS"
                        />
                      </div>
                    </Grid>
                  </Grid>
                </MuiPickersUtilsProvider>
              </div>

              <div>
                <Grid container spacing={3}>
                  <Grid item xs>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={chkDate}
                          onChange={chkDateChanged}
                          name="chkDate"
                        />
                      }
                      label="Date"
                    />
                  </Grid>
                  <Grid item xs>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={chkForename}
                          onChange={chkForenameChanged}
                          name="chkForename"
                        />
                      }
                      label="Forename"
                    />
                  </Grid>
                  <Grid item xs>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={chkSurname}
                          onChange={chkSurnameChanged}
                          name="chkSurname"
                        />
                      }
                      label="Surname"
                    />
                  </Grid>
                  <Grid item xs>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={chkDOB}
                          onChange={chkDOBChanged}
                          name="chkDOB"
                        />
                      }
                      label="D.O.B"
                    />
                  </Grid>
                  <Grid item xs>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={chkEmail}
                          onChange={chkEmailChanged}
                          name="chkEmail"
                        />
                      }
                      label="Email"
                    />
                  </Grid>
                  <Grid item xs>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={chkTel}
                          onChange={chkTelChanged}
                          name="chkTel"
                        />
                      }
                      label="Tel"
                    />
                  </Grid>
                  <Grid item xs>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={chkCertificate}
                          onChange={chkCertificateChanged}
                          name="chkCertificate"
                        />
                      }
                      label="Certificate"
                    />
                  </Grid>
                  <Grid item xs>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={chkAntiBodyTest}
                          onChange={chkAntiBodyTestChanged}
                          name="chkAntiBodyTest"
                        />
                      }
                      label="AntiBodyTest"
                    />
                  </Grid>
                  <Grid item xs>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={chkextRef}
                          onChange={chkextRefChanged}
                          name="chkextRef"
                        />
                      }
                      label="Lab No."
                    />
                  </Grid>
                  <Grid item xs>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={chkPrice}
                          onChange={chkPriceChanged}
                          name="chkPrice"
                        />
                      }
                      label="Price"
                    />
                  </Grid>
                </Grid>
              </div>

              <div style={{ width: "100%", paddingTop: "20px" }}>
                <table className={classes.table} id="table-to-xls">
                  <tr>
                    {chkDate && <th className={classes.th}>Date</th>}
                    {chkForename && <th className={classes.th}>Forename</th>}
                    {chkSurname && <th className={classes.th}>Surename</th>}
                    {chkDOB && <th className={classes.th}>D.O.B</th>}
                    {chkEmail && <th className={classes.th}>Email</th>}
                    {chkTel && <th className={classes.th}>Tel</th>}
                    {chkCertificate && (
                      <th className={classes.th}>Certificate</th>
                    )}
                    {chkAntiBodyTest && (
                      <th className={classes.th}>AntiBodyTest</th>
                    )}
                    {chkextRef && <th className={classes.th}>Lab No.</th>}
                    {chkPrice && <th className={classes.th}>Price (£) </th>}
                  </tr>

                  {data.bookings
                    .filter((booking) => {
                      if (!justCorporate) {
                        return (
                          booking.bookingDate >= fromDateStr &&
                          booking.bookingDate <= untilDateStr
                        );
                      } else {
                        return (
                          booking.bookingDate >= fromDateStr &&
                          booking.bookingDate <= untilDateStr &&
                          booking.paid &&
                          booking.paidBy === "corporate" &&
                          booking.corporate === corporate
                        );
                      }
                    })

                    .map((booking) => (
                      <tr>
                        {chkDate && (
                          <td className={classes.td}>
                            {FormatDateFromString(booking.bookingDate)}
                          </td>
                        )}
                        {chkForename && (
                          <td className={classes.td}>
                            {booking.forenameCapital}
                          </td>
                        )}
                        {chkSurname && (
                          <td className={classes.td}>
                            {booking.surnameCapital}
                          </td>
                        )}
                        {chkDOB && (
                          <th className={classes.th}>
                            {/* {FormatDateFromString(booking.birthDate)} */}
                          </th>
                        )}
                        {chkEmail && (
                          <td className={classes.td}>{booking.email}</td>
                        )}
                        {chkTel && (
                          <td className={classes.td}>{booking.phone}</td>
                        )}
                        {chkCertificate && (
                          <td className={classes.td}>
                            {booking.certificate ? "YES" : "NO"}
                          </td>
                        )}
                        {chkAntiBodyTest && (
                          <td className={classes.td}>
                            {booking.antiBodyTest ? "YES" : "NO"}
                          </td>
                        )}
                        {chkextRef && (
                          <td className={classes.td}>{booking.extRef}</td>
                        )}
                        {chkPrice && (
                          <td className={classes.td}>
                            {PriceCalculator.calculatePrice(booking)}
                          </td>
                        )}
                      </tr>
                    ))}
                </table>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </React.Fragment>
  );
}
