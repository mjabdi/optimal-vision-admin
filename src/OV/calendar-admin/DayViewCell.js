import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import dateformat from "dateformat";
import BookService from "../services/BookService";

import CircularProgress from "@material-ui/core/CircularProgress";
import GlobalState from "../../GlobalState";
import BookingDialog from "../BookingDialog";
import NewBookingDialog from "../NewBookingDialog";
import { CalendarColors } from "./colors";
import clsx from "clsx";

import NewOVDialog from "../NewOVBookingDialog";
import EditOVBookingDialog from "../EditOVBookingDialog";

const useStyles = makeStyles((theme) => ({
  Container: {
    width: "100%",
    height: "50px",
    position: "relative",
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "flex-start",
    justifyItems: "flex-start",
    paddingLeft: "10px",
  },

  ContainerPast: {
    width: "100%",
    paddingTop: "50px",
    position: "relative",
    backgroundColor: "#fafafa",
  },

  DayLabel: {
    position: "absolute",
    top: "5px",
    right: "5px",
    color: "#555",
    fontSize: "1rem",
  },

  DayLabelDisabled: {
    position: "absolute",
    top: "5px",
    right: "5px",
    color: "#ddd",
    fontSize: "1rem",
  },

  LoadingProgress: {
    position: "absolute",
    top: "10%",
    left: "40%",
  },

  BookingCountGauge: {
    position: "absolute",
    bottom: "5%",
    left: "8%",
    width: "85%",
    height: "8%",
  },

  bookingBox: {
    display: "flex",
    marginRight: "10px",
    marginTop: "5px",
    padding: "7px",
    maxWidth: "150px",
    overflowX: "hidden",
    // border: "1px solid #eee",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    backgroundColor: "#ebedf7",
    color: "#3f51b5",
    boxShadow: "2px 4px #fafafa",

    "&:hover": {
      background: "#3f51b5",
      color: "#ebedf7",
    },
  },

  bookingBoxNew: {
    display: "flex",
    marginRight: "10px",
    marginTop: "5px",
    padding: "6px 10px",
    maxWidth: "150px",
    overflowX: "hidden",
    border: "1px solid #ddd",
    color: "#ccc",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    backgroundColor: "#fff",

    boxShadow: "2px 4px #fafafa",
    transition: "all 0.5s ease",
    borderRadius: "4px",

    "&:hover": {
      background: "#fff",
      color: theme.palette.secondary.main,
      borderColor: theme.palette.secondary.main,
    },
  },

  bookingBoxVC: {
    display: "flex",
    marginRight: "10px",
    marginTop: "5px",
    padding: "7px",
    maxWidth: "200px",
    overflowX: "hidden",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    backgroundColor: CalendarColors.VC_COLOR,
    color: "#eee",
    boxShadow: "2px 4px #fafafa",

    "&:hover": {
      // background: "#0059b3",
      color: "#fafafa",
    },
  },
  bookingBoxF2F: {
    display: "flex",
    marginRight: "10px",
    marginTop: "5px",
    padding: "7px",
    maxWidth: "200px",
    overflowX: "hidden",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    backgroundColor: CalendarColors.F2F_COLOR,
    color: "#eee",
    boxShadow: "2px 4px #fafafa",

    "&:hover": {
      // background: "#0059b3",
      color: "#fafafa",
    },
  },
  bookingBoxLaser: {
    display: "flex",
    marginRight: "10px",
    marginTop: "5px",
    padding: "7px",
    maxWidth: "200px",
    overflowX: "hidden",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    backgroundColor: CalendarColors.LASER_COLOR,
    color: "#eee",
    boxShadow: "2px 4px #fafafa",

    "&:hover": {
      // background: "#0059b3",
      color: "#fafafa",
    },
  },

  bookingBoxCataract: {
    display: "flex",
    marginRight: "10px",
    marginTop: "5px",
    padding: "7px",
    maxWidth: "200px",
    overflowX: "hidden",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    backgroundColor: CalendarColors.CATARACT_COLOR,
    color: "#eee",
    boxShadow: "2px 4px #fafafa",

    "&:hover": {
      // background: "#0059b3",
      color: "#fafafa",
    },
  },

  bookingBoxPostOP: {
    display: "flex",
    marginRight: "10px",
    marginTop: "5px",
    padding: "7px",
    maxWidth: "200px",
    overflowX: "hidden",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    backgroundColor: CalendarColors.POSTOP_COLOR,
    color: "#eee",
    boxShadow: "2px 4px #fafafa",

    "&:hover": {
      // background: "#0059b3",
      color: "#fafafa",
    },
  },

  bookingBoxOptometry: {
    display: "flex",
    marginRight: "10px",
    marginTop: "5px",
    padding: "7px",
    maxWidth: "200px",
    overflowX: "hidden",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    backgroundColor: CalendarColors.OPOTOMETRY_COLOR,
    color: "#eee",
    boxShadow: "2px 4px #fafafa",

    "&:hover": {
      // background: "#0059b3",
      color: "#fafafa",
    },
  },



  bookingBoxHidden: {
    display: "none",
    marginRight: "10px",
    marginTop: "5px",
    padding: "7px",
    maxWidth: "150px",
    overflowX: "hidden",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    backgroundColor: "#fff",
    color: "#fff",
    boxShadow: "2px 4px #fafafa",

    "&:hover": {
      // background: "#0059b3",
      color: "#fafafa",
    },
  },







  bookingBoxPositive: {
    display: "flex",
    marginRight: "10px",
    marginTop: "5px",
    padding: "7px",
    maxWidth: "150px",
    overflowX: "hidden",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    backgroundColor: "#d40b0b",
    color: "#fff2f2",
    boxShadow: "2px 4px #fafafa",

    "&:hover": {
      background: "#bf0000",
      color: "#fff",
    },
  },

  bookingBoxReportSent: {
    display: "flex",
    marginRight: "10px",
    marginTop: "5px",
    padding: "7px",
    maxWidth: "150px",
    overflowX: "hidden",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    backgroundColor: "#009900",
    color: "#eee",
    boxShadow: "2px 4px #fafafa",

    "&:hover": {
      background: "#006e00",
      color: "#fafafa",
    },
  },

  BookingBorderPCR: {
    border: "4px solid",
    borderColor: CalendarColors.PCR_COLOR,
  },

  BookingBorderGynae: {
    border: "4px solid",
    borderColor: CalendarColors.GYNAE_COLOR,
  },

  BookingBorderGP: {
    border: "4px solid",
    borderColor: CalendarColors.GP_COLOR,
  },

  BookingBorderSTD: {
    border: "4px solid",
    borderColor: CalendarColors.STD_COLOR,
  },
  BookingBorderBlood: {
    border: "4px solid",
    borderColor: CalendarColors.BLOOD_COLOR,
  },

}));

const DayViewCell = ({ key, date, time }) => {
  const classes = useStyles();

  const [state, setState] = React.useContext(GlobalState);
  const [bookings, setBookings] = React.useState(null);
  const [filteredBookings, setFilteredBookings] = React.useState(null);
  const [selectedBooking, setSelectedBooking] = React.useState(null);

  const [refresh, setRefresh] = React.useState(true);

  const [isPast, setIsPast] = React.useState(false);

  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDialogAddNew, setOpenDialogAddNew] = React.useState(false);

  const [openDialogOV, setOpenDialogOV] = React.useState(false);

  const [clinic, setClinic] = React.useState('');


  const handleCloseDialogOV = () => {
    setOpenDialogOV(false);
    setOpenDialogAddNew(false)
  };

  useEffect(() => {
    const todayStr = dateformat(new Date(), "yyyy-mm-dd");
    setIsPast(date < todayStr);
  }, [date]);

  useEffect(() => {
    if (bookings) {
      if (state.dayViewCalFilter && state.dayViewCalFilter.trim().length > 0) {
        const search = state.dayViewCalFilter.trim().toUpperCase();
        setFilteredBookings(
          bookings.filter(
            (booking) =>
              booking.fullname?.toLowerCase().indexOf(search.toLowerCase()) >= 0 
          )
        );
      } else {
        setFilteredBookings([...bookings]);
      }
    }
  }, [state.dayViewCalFilter, bookings]);

  useEffect(() => {
    const fetchData = async () => {
      if (!date || date.length <= 0 || !time || time.length <= 0) {
        return;
      }

      // if (isPast)
      // {
      //     setBookings([]);
      //     return;
      // }

      setBookings(null);

      var res = state.AdminCalendarCache?.find(
        (record) =>
          record.method === "getBookingsByDateStrandTime" &&
          record.query === `${date}${time}`
      )?.res;
      if (!res || openDialog || openDialogAddNew || true) {
        res = await BookService.getAllBookingsByDateStrandTime(date, time);
        setState((state) => ({
          ...state,
          AdminCalendarCache: [
            ...state.AdminCalendarCache,
            {
              method: "getBookingsByDateStrandTime",
              query: `${date}${time}`,
              res: res,
            },
          ],
        }));
      }

      if (res.data.status === "OK") {
        setBookings(res.data.bookings);
      }
    };

    if (openDialog || openDialogAddNew) {
      setState((state) => ({
        ...state,
        AdminCalendarCache: state.AdminCalendarCache.filter(
          (record) =>
            !(
              record.method === "getBookingsByDateStrandTime" &&
              record.query === `${date}${time}`
            )
        ),
      }));
      setState((state) => ({
        ...state,
        AdminCalendarCache: state.AdminCalendarCache.filter(
          (record) =>
            !(
              record.method === "getBookingsCountByDateStrandTime" &&
              record.query === `${date}${time}`
            )
        ),
      }));
      setState((state) => ({
        ...state,
        AdminCalendarCache: state.AdminCalendarCache.filter(
          (record) =>
            !(
              record.method === "getBookingsCountByDateStr" &&
              record.query === date
            )
        ),
      }));
    }

    fetchData();
  }, [date, time, state.bookingDialogDataChanged]);

  const bookingCliked = (event, booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  const getBookingClass = (clinic) => {
    switch (clinic) {
      case "Virtual Consultation":
        return classes.bookingBoxVC;
      case "F2F Clinic":
        return classes.bookingBoxF2F;
      case "Laser Theatre":
        return classes.bookingBoxLaser;
      case "Lens Theatre":
        return classes.bookingBoxCataract;
        case "Post OP":
          return classes.bookingBoxPostOP;
          case "Optometry":
            return classes.bookingBoxOptometry;
      
  
      default:
        return classes.bookingBoxHidden;
    }
  };

  const addNewBookingClicked = () => {
    setOpenDialogAddNew(true);
  };

  const getBookingBorderClass = (clinic) => {
    switch (clinic) {
      case "pcr":
        return classes.BookingBorderPCR;
      case "gynae":
        return classes.BookingBorderGynae;
      case "gp":
        return classes.BookingBorderGP;
      case "std":
        return classes.BookingBorderSTD;
        case "blood":
          return classes.BookingBorderBlood;
    
      default:
        return null;
    }
  };

  const getBookingsBox = (_bookings) => {
    if (_bookings === null) {
      return (
        <div className={classes.LoadingProgress}>
          <CircularProgress disableShrink />
        </div>
      );
    } else if (_bookings.length >= 0) {
      return (
        <React.Fragment>
          {_bookings.map(
            (booking) =>
              state.selectedClinics.findIndex(
                (e) => e === booking.clinic
              ) >= 0 && (
                <div
                  style={booking.tr ? { borderTop: "5px solid #d00fd6" } : {}}
                  className={clsx(
                    getBookingClass(booking.clinic),
                    // getBookingBorderClass(booking.clinic)
                  )}
                  onClick={(event) => bookingCliked(event, booking)}
                >
                  {`${
                    booking.fullname
                  }`.substring(0, 30)}
                </div>
              )
          )}

          <div className={classes.bookingBoxNew} onClick={addNewBookingClicked}>
            {" "}
            + Add New Booking
          </div>
        </React.Fragment>
      );
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseDialogAddNew = () => {
    setOpenDialogAddNew(false);
  };

  const handleClinicClicked = (clinic) => {

    setClinic(clinic)
    setOpenDialogOV(true)

  };

  return (
    <React.Fragment>
      <div className={classes.Container}>
        {getBookingsBox(filteredBookings)}
      </div>

      <EditOVBookingDialog
        booking={selectedBooking}
        open={openDialog}
        date={date}
        time={time}
        clinic={selectedBooking?.clinic}
        handleClose={handleCloseDialog}
      />

      <NewBookingDialog
        date={date}
        time={time}
        open={openDialogAddNew}
        handleClose={handleCloseDialogAddNew}
        clinicClicked={handleClinicClicked}
      />

      <NewOVDialog
        date={date}
        time={time}
        open={openDialogOV}
        clinic={clinic}
        handleClose={handleCloseDialogOV}
      />

    </React.Fragment>
  );
};

DayViewCell.propTypes = {
  key: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
};

export default DayViewCell;
