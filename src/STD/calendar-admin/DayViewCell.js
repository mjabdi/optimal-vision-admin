import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import dateformat from 'dateformat';
import BookService from '../services/BookService';

import CircularProgress from '@material-ui/core/CircularProgress';
import GlobalState from '../../GlobalState';
import BookingDialog from '../BookingDialog';
import NewBookingDialog from '../NewBookingDialog';

const useStyles = makeStyles((theme) => ({

    Container: {
        width: "100%",
        height : "50px",
        position: "relative",
        backgroundColor: "#fff",
        display: "flex",
        alignItems : "flex-start",
        justifyItems: "flex-start",
        paddingLeft : "10px"

    },

    ContainerPast: {
        width: "100%",
        paddingTop: "50px",
        position: "relative",
        backgroundColor: "#fafafa"
    },
    
    DayLabel: {
        position: "absolute",
        top: "5px",
        right: "5px",
        color: "#555",
        fontSize: "1rem"
    },

    DayLabelDisabled: {
        position: "absolute",
        top: "5px",
        right: "5px",
        color: "#ddd",
        fontSize: "1rem"
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
        width : "85%",
        height: "8%"
    },

    bookingBoxNew: {
        display: "flex",
        marginRight: "10px",
        marginTop: "5px",
        padding: "10px",
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
          borderColor:  theme.palette.secondary.main,
        },
      },

    bookingBox: {
        display: "flex",
        marginRight: "10px",
        marginTop: "5px",
        padding: "10px",
        maxWidth : "150px",
        overflowX: "hidden",
        border : "1px solid #eee",
        fontSize: "12px",
        fontWeight : "500",
        cursor: "pointer",
        backgroundColor: "#ebedf7",
        color: "#3f51b5",
        boxShadow: "2px 4px #fafafa",

        "&:hover": {
            background: "#3f51b5",
            color: "#ebedf7"
          },
    },

    bookingBoxSampleTaken: {
        display: "flex",
        marginRight: "10px",
        marginTop: "5px",
        padding: "10px",
        maxWidth : "150px",
        overflowX: "hidden",
        border : "1px solid #eee",
        fontSize: "12px",
        fontWeight : "500",
        cursor: "pointer",
        backgroundColor: "#0066cc",
        color: "#eee",
        boxShadow: "2px 4px #fafafa",

        "&:hover": {
            background: "#0059b3",
            color: "#fafafa"
          },
    },

    bookingBoxPositive: {
        display: "flex",
        marginRight: "10px",
        marginTop: "5px",
        padding: "10px",
        maxWidth : "150px",
        overflowX: "hidden",
        border : "1px solid #eee",
        fontSize: "12px",
        fontWeight : "500",
        cursor: "pointer",
        backgroundColor: "#d40b0b",
        color: "#fff2f2",
        boxShadow: "2px 4px #fafafa",

        "&:hover": {
            background: "#bf0000",
            color: "#fff"
          },
    },

    bookingBoxReportSent: {
        display: "flex",
        marginRight: "10px",
        marginTop: "5px",
        padding: "10px",
        maxWidth : "150px",
        overflowX: "hidden",
        border : "1px solid #eee",
        fontSize: "12px",
        fontWeight : "500",
        cursor: "pointer",
        backgroundColor: "#009900",
        color: "#eee",
        boxShadow: "2px 4px #fafafa",

        "&:hover": {
            background: "#006e00",
            color: "#fafafa"
          },
    },

  

  }));



const DayViewCell = ({key, date, time}) => {
    const classes = useStyles();

    const [state, setState] = React.useContext(GlobalState);
    const [bookings, setBookings] = React.useState(null);
    const [filteredBookings, setFilteredBookings] = React.useState(null);
    const [selectedBooking, setSelectedBooking] = React.useState(null);

    const [refresh, setRefresh] = React.useState(true); 

    const [isPast, setIsPast] = React.useState(false);

    const [openDialog, setOpenDialog] = React.useState(false);

    const [openDialogAddNew, setOpenDialogAddNew] = React.useState(false);



    useEffect( () => {
        const todayStr = dateformat(new Date(), 'yyyy-mm-dd');
        setIsPast(date < todayStr);

    }, [date]);

    useEffect( () => 
    {
        if (bookings) {


            if (state.dayViewCalFilter && state.dayViewCalFilter.trim().length > 0)
            {
                const search = state.dayViewCalFilter.trim().toUpperCase();
                setFilteredBookings( bookings.filter(booking => booking.fullname.toLowerCase().indexOf(search.toLowerCase()) >= 0
                                                          
                    
                    ));
            }
            else
            {
                setFilteredBookings([...bookings]);
            }
        }

    }, [state.dayViewCalFilter, bookings]);
 


    useEffect ( () => {
       
        const fetchData = async () =>
        {
            if (!date || date.length <= 0 || !time || time.length <= 0)
            {
                return;
            }
         
            // if (isPast)
            // {
            //     setBookings([]);
            //     return;
            // }
    
            setBookings(null);
    
            var res = state.AdminCalendarCache?.find(record => record.method === 'getBookingsByDateStrandTime' && record.query === `${date}${time}`)?.res;
            if (!res || openDialog || openDialogAddNew)
            {
                res = await BookService.getAllBookingsByDateStrandTime(date, time);
                setState(state => ({...state, AdminCalendarCache : [...state.AdminCalendarCache, {method: 'getBookingsByDateStrandTime' , query : `${date}${time}`, res: res}]}));
            }
          
          
            if (res.data.status === 'OK')
            {
                setBookings(res.data.bookings);
            }   
        }

        if (openDialog || openDialogAddNew)
        {
            setState(state => ({...state, AdminCalendarCache : state.AdminCalendarCache.filter(record => !(record.method === 'getBookingsByDateStrandTime' && record.query ===  `${date}${time}`))}));
            setState(state => ({...state, AdminCalendarCache : state.AdminCalendarCache.filter(record => !(record.method === 'getBookingsCountByDateStrandTime' && record.query ===  `${date}${time}`))}));
            setState(state => ({...state, AdminCalendarCache : state.AdminCalendarCache.filter(record => !(record.method === 'getBookingsCountByDateStr' && record.query ===  date))}));
        }

         fetchData();
     
    }, [date, time, state.bookingDialogDataChanged]);

    const bookingCliked = (event, booking) =>
    {
        setSelectedBooking(booking);
        setOpenDialog(true);
    }

    

    const getBookingClass = (status) =>
    {
        switch (status) {

            case 'patient_attended':
                return classes.bookingBoxSampleTaken;
            default : 
                return classes.bookingBox;
        }
    }

    const addNewBookingClicked = () =>
    {
        setOpenDialogAddNew(true)
    }

    const getBookingsBox = (_bookings) =>
    {
        if (_bookings === null) 
        {
            return (
                <div className={classes.LoadingProgress}>
                      <CircularProgress disableShrink  />
                </div>
            );  
        }
        else if (_bookings.length >= 0)
        {
           return (
            <React.Fragment>
            {_bookings.map((booking) => (
              <div
                style={booking.tr ? { borderTop: "5px solid #d00fd6" } : {}}
                className={getBookingClass(booking.status)}
                onClick={(event) => bookingCliked(event, booking)}
              >
                {`${booking.fullname}`.substring(0, 15)}
              </div>
            ))}
  
            <div className={classes.bookingBoxNew} onClick={addNewBookingClicked}> + Add New Booking</div>
          </React.Fragment>
           );
        }
    }


    const handleCloseDialog = () =>
    {
        setOpenDialog(false);
    }

    const handleCloseDialogAddNew = () => {
        setOpenDialogAddNew(false);
      };

    return (
        <React.Fragment>

            <div className={classes.Container}>

              {getBookingsBox(filteredBookings)}

            </div>

            <BookingDialog
                booking={selectedBooking}
                open={openDialog}
                onClose={handleCloseDialog}
            />

        <NewBookingDialog
        date={date}
        time={time}
        open={openDialogAddNew}
        handleClose={handleCloseDialogAddNew}
        />

        </React.Fragment>


    );
}

DayViewCell.propTypes = {
    key: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
  };

 
  
export default DayViewCell;