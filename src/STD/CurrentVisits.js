import React, { useEffect } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";
import { Grid, LinearProgress, Tooltip } from "@material-ui/core";
import * as dateformat from "dateformat";
import BookService from "./services/BookService";
import BookingDialog from "./BookingDialog";

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },

  bookingBox: {
    display: "flex",
    margin: "5px",
    padding: "5px",
    maxWidth: "90px",
    minHeight: "30px",
    border: "1px solid #eee",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    backgroundColor: "#ebedf7",
    color: "#3f51b5",
    boxShadow: "2px 4px #fafafa",
    borderRadius: "5px",
    textAlign: "center",
    alignItems: "center",
    justifyItems: "center",
    align: "center",

    "&:hover": {
      background: "#3f51b5",
      color: "#ebedf7",
    },
  },
});

const isWeekend = (date) =>
{
    return (date.getDay() === 0 || date.getDay() === 6) /// Weekend
}

const getCurrentTimeSlot = (now) =>
{
    var min = now.getMinutes();
    var hour = now.getHours();
    var pm = (hour >= 12);
    if (hour > 12)
    {
      hour = hour - 12;
    }

    if (min >= 0 && min < 15)
    {
      min = 0;
    }else if (min >= 15 && min < 30)
    {
      min = 15;
    }else if (min >= 30 && min < 45)
    {
      min = 30;
    }else if (min >= 45)
    {
      min = 45;
    }

    const minStr = min < 10 ? `0${min}` : `${min}`;
    const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
    const pmStr = pm ? 'PM' : 'AM';

    const timeStr = `${hourStr}:${minStr} ${pmStr}`;

    if (isWeekend(now))
    {
      if (now.getHours() < 10 || now.getHours() >= 14)
      {
        return null;
      }
      else
      {
        return timeStr;
      }
    }
    else
    {
      if (now.getHours() < 9 || now.getHours() >= 18)
      {
        return null;
      }
      else
      {
        return timeStr;
      }

    }
}

const getCurrentTimeSlotLabel = (timeStr) =>
{
  if (!timeStr)
  {
    return 'Closed';
  }

  var hour = parseInt(timeStr.substr(0,2));
  var minute = parseInt(timeStr.substr(3,2)); 
  var pm = timeStr.indexOf('PM') > 0;
  if (minute !== 45)
  {
    minute += 15;
  }
  else{
    minute = 0;
    hour += 1;
    if (hour >= 12)
    {
      pm = true;
    }
    if (hour > 12)
    {
      hour = hour - 12;
    }
  }

  const minStr = minute < 10 ? `0${minute}` : `${minute}`;
  const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
  const pmStr = pm ? 'PM' : 'AM';

  const endTimeStr = `${hourStr}:${minStr} ${pmStr}`;

  return `${timeStr} - ${endTimeStr}`;

}

export default function CurrentVisits() {
  const classes = useStyles();

  const [current, setCurrent] = React.useState(new Date());
  const [bookings, setBookings] = React.useState([]);

  const [selectedBooking, setSelectedBooking] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(new Date());
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const currentTimeSlot = getCurrentTimeSlot(current);
    if (!currentTimeSlot) return;
    const todayStr = dateformat(current, "yyyy-mm-dd");
    setLoading(true);
    BookService.getBookingsByDateStrandTime(todayStr, currentTimeSlot)
      .then((res) => {
        setLoading(false);
        if (res.data.status === "OK") {
          setBookings([...res.data.bookings]);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, [current]);

  const getBookingsBox = (_bookings) => {
    if (_bookings && _bookings.length > 0) {
      return (
        <div className={classes.root}>
          <Grid
            container
            justify="flex-start"
            alignItems="flex-start"
            spacing={0}
          >
            {_bookings.map((booking) => (
              <Grid item>
                <div
                  className={classes.bookingBox}
                  onClick={(event) => bookingCliked(event, booking)}
                >
                  <span style={{ textAlign: "center" }}>
                    {" "}
                    {`${booking.surnameCapital}`.substring(0, 10)}{" "}
                  </span>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      );
    }
  };

  const bookingCliked = (event, booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <React.Fragment>
      {loading && (
        <div style={{ width: "100%", paddingTop: "3px" }}>
          <LinearProgress color="primary" />
        </div>
      )}

      <Title>Current Visits</Title>
      <Typography component="p" variant="h6">
        {getCurrentTimeSlotLabel(getCurrentTimeSlot(current))}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        on {dateformat(current, "dd mmmm, yyyy")}
      </Typography>

      {getBookingsBox(bookings)}

      <BookingDialog
        booking={selectedBooking}
        open={openDialog}
        onClose={handleCloseDialog}
      />
    </React.Fragment>
  );
}
