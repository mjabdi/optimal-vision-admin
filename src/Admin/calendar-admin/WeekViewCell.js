import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import dateformat from 'dateformat';
import BookService from '../services/BookService';

import CircularProgress from '@material-ui/core/CircularProgress';
import GlobalState from '../../GlobalState';

import axios from 'axios'

import { Grid } from '@material-ui/core';
import { CalendarColors } from './colors';

const MAX_BOOKING_COUNT_PCR = 10;
const MAX_BOOKING_COUNT_GP = 1;
const MAX_BOOKING_COUNT_STD = 1;
const MAX_BOOKING_COUNT_GYNAE = 1;

const useStyles = makeStyles((theme) => ({

    Container: {
        width: "100%",
        paddingTop: "40%",
        position: "relative",
        backgroundColor: "#fff",
        cursor: "pointer"
    },

    ContainerPast: {
        width: "100%",
        paddingTop: "40%",
        position: "relative",
        backgroundColor: "#fafafa",
        cursor: "pointer"
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

    BookingCountLabel: {
        position: "absolute",
        top: "25%",
        left: "38%",
        color: "#3f51b5",
        backgroundColor: "#ebedf7",
        fontSize: "14px",
        fontWeight: "600",
        padding: "5px",
        borderRadius: "50%",
        minWidth: "30px",
        cursor : "pointer",
        textAlign: "center"
    },

    BookingCountLabelBusy: {
        position: "absolute",
        top: "25%",
        left: "38%",
        color: "#b00000",
        backgroundColor: "#fce6e6",
        fontSize: "14px",
        fontWeight: "600",
        padding: "5px",
        borderRadius: "50%",
        minWidth: "30px",
        cursor : "pointer",
        textAlign: "center"
    },

    LoadingProgress: {
        position: "absolute",
        top: "40%",
        left: "40%",
      },

      BookingCountGauge: {
        position: "absolute",
        bottom: "5%",
        left: "8%",
        width : "85%",
        height: "8%"
    },

    PCRGauge: {
        position: "absolute",
        bottom: "15px",
        left: "0",
        width: "20px",
        height: "90%",
      },
    
      GynaeGauge: {
        position: "absolute",
        bottom: "15px",
        left: "21px",
        width: "20px",
        height: "90%",
      },
    
      GPGauge: {
        position: "absolute",
        bottom: "15px",
        left: "42px",
        width: "20px",
        height: "90%",
      },
    
      STDGauge: {
        position: "absolute",
        bottom: "15px",
        left: "63px",
        width: "20px",
        height: "90%",
      },
    

    DayLabelContainer:{
        position: "absolute",
        top: "15%",
        left:"5px",
        width:"100%",
        height:"100%"   
    },

  }));

const MAX_BOOKING_COUNT = 1;  

const WeekViewCell = ({key, date, time, dayClicked}) => {
    const classes = useStyles();

    const [state, setState] = React.useContext(GlobalState);
    const [bookingsCount, setBookingsCount] = React.useState(null);
    const [isPast, setIsPast] = React.useState(false);

    const [cellDate, setCellDate] = React.useState(new Date());

    useEffect( () => {
        const todayStr = dateformat(new Date(), 'yyyy-mm-dd');
        setIsPast(date < todayStr);

        setCellDate(new Date(date));

    }, [date]);

    useEffect ( () => {
      
      
      
        if (!date || date.length <= 0 || !time || time.length <= 0)
        {
            return;
        }
        
        // if (isPast)
        // {
        //     setBookingsCount(-2);
        //     return;
        // }

        setBookingsCount(null);

       

        var res = state.AdminCalendarCache?.find(record => record.method === 'getBookingsCountByDateStrandTime' && record.query === `${date}${time}`)?.res;
        if (res)
        {
            if (res.data.count)
            {
                setBookingsCount(res.data.count);
            }  
            return;
        }

        let source = axios.CancelToken.source();
        BookService.getAllBookingsCountByDateStrandTime(date, time, source).then( res => {
            if (res.data.count)
            {
                setBookingsCount(res.data.count);
                setState(state => ({...state, AdminCalendarCache : [...state.AdminCalendarCache, {method: 'getBookingsCountByDateStrandTime' , query : `${date}${time}`, res: res}]}));
            }  
        }).catch( err => 
            {
                //do nothing
            });
     
        return () => {
           if (source)
              source.cancel('Cancelling in cleanup');
        }
     
    }, [date, time]);


    const minHeight = 1;
    const getPCRClinicBar = (count) => {
      let width = (count / MAX_BOOKING_COUNT_PCR) * 100 + 5;
      if (width > 100) width = 100;
  
      if (width < 30) width = 30;
  
      if (count === 0) {
        width = minHeight;
      }
  
      const percent = 100 - width;
  
      return (
        <div className={classes.PCRGauge}>
          <div
            style={{
              padding: "0",
              margin: "0",
              width: "100%",
              height: "100%",
              backgroundColor: CalendarColors.PCR_COLOR,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: "0px",
                color: "#fff",
                fontWeight: "500",
                fontSize:"0.8rem",
                textAlign: "center",
                width: "100%",
              }}
            >
              {count > 0 && count}
            </div>
  
            <div
              style={{
                padding: "0",
                margin: "0",
                width: "100%",
                height: `${percent}%`,
                backgroundColor: "#fafafa",
              }}
            ></div>
          </div>
        </div>
      );
    };
  
    const getGynaeClinicBar = (count) => {
      let width = (count / MAX_BOOKING_COUNT_GYNAE) * 100 + 5;
      if (width > 100) width = 100;
  
      if (width < 30) width = 30;
  
      if (count === 0) {
        width = minHeight;
      }
  
      const percent = 100 - width;
  
      return (
        <div className={classes.GynaeGauge}>
          <div
            style={{
              padding: "0",
              margin: "0",
              width: "100%",
              height: "100%",
              backgroundColor: CalendarColors.GYNAE_COLOR,
              position: "relative",
            }}
          >
            <div
               style={{
                  position: "absolute",
                  bottom: "0px",
                  color: "#fff",
                  fontWeight: "500",
                  fontSize:"0.8rem",
                  textAlign: "center",
                  width: "100%",
                }}
            >
              {count > 0 && count}
            </div>
  
            <div
              style={{
                padding: "0",
                margin: "0",
                width: "100%",
                height: `${percent}%`,
                backgroundColor: "#fafafa",
              }}
            ></div>
          </div>
        </div>
      );
    };
  
    const getGPClinicBar = (count) => {
      let width = (count / MAX_BOOKING_COUNT_GP) * 100 + 5;
      if (width > 100) width = 100;
  
      if (width < 30) width = 30;
  
      if (count === 0) {
        width = minHeight;
      }
  
      const percent = 100 - width;
  
      return (
        <div className={classes.GPGauge}>
          <div
            style={{
              padding: "0",
              margin: "0",
              width: "100%",
              height: "100%",
              backgroundColor: CalendarColors.GP_COLOR,
              position: "relative",
            }}
          >
            <div
               style={{
                  position: "absolute",
                  bottom: "0px",
                  color: "#fff",
                  fontWeight: "500",
                  fontSize:"0.8rem",
                  textAlign: "center",
                  width: "100%",
                }}
            >
              {count > 0 && count}
            </div>
  
            <div
              style={{
                padding: "0",
                margin: "0",
                width: "100%",
                height: `${percent}%`,
                backgroundColor: "#fafafa",
              }}
            ></div>
          </div>
        </div>
      );
    };
  
    const getSTDClinicBar = (count) => {
      let width = (count / MAX_BOOKING_COUNT_STD) * 100 + 5;
      if (width > 100) width = 100;
  
      if (width < 30) width = 30;
  
      if (count === 0) {
        width = minHeight;
      }
  
      const percent = 100 - width;
  
      return (
        <div className={classes.STDGauge}>
          <div
            style={{
              padding: "0",
              margin: "0",
              width: "100%",
              height: "100%",
              backgroundColor: CalendarColors.STD_COLOR,
              position: "relative",
            }}
          >
            <div
               style={{
                  position: "absolute",
                  bottom: "0px",
                  color: "#fff",
                  fontWeight: "500",
                  fontSize:"0.8rem",
                  textAlign: "center",
                  width: "100%",
                }}
            >
              {count > 0 && count}
            </div>
  
            <div
              style={{
                padding: "0",
                margin: "0",
                width: "100%",
                height: `${percent}%`,
                backgroundColor: "#fafafa",
              }}
            ></div>
          </div>
        </div>
      );
    };
  
  
    const getBookingsCountLabel = (_bookingsCount) => {
      if (!_bookingsCount) {
        return (
          <div className={classes.LoadingProgress}>
            <CircularProgress disableShrink />
          </div>
        );
      } else if (_bookingsCount !== -2) {
        return (
          <div className={classes.DayLabelContainer}>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="flex-end"
              style={{ width: "100%", height: "100%" }}
            >
              {_bookingsCount.map((item) => (
                <Grid item>{getClinicBar(item.clinic, item.count)}</Grid>
              ))}
            </Grid>
          </div>
        );
      }
    };

    const getClinicBar = (clinic, count) => {
        return (
          <React.Fragment>
            {clinic === "pcr" &&
              state.selectedClinics.findIndex((e) => e === "PCR") >= 0 &&
              getPCRClinicBar(count)}
            {clinic === "gynae" &&
              state.selectedClinics.findIndex((e) => e === "GYNAE") >= 0 &&
              getGynaeClinicBar(count)}
            {clinic === "gp" &&
              state.selectedClinics.findIndex((e) => e === "GP") >= 0 &&
              getGPClinicBar(count)}
            {clinic === "std" &&
              state.selectedClinics.findIndex((e) => e === "STD") >= 0 &&
              getSTDClinicBar(count)}
          </React.Fragment>
        );
      };
  
  
    const getBookingsCountGauge = (_bookingsCount) =>
    {
        if (_bookingsCount > 0 )
        {
            let percent = (_bookingsCount / MAX_BOOKING_COUNT) * 100;
            if (percent > 100)
            {
                percent = 100;
            }

            // percent = 100 - percent;

            return (

                <div className={classes.BookingCountGauge}>
                  <div style={{padding:"0", margin:"0", width:"100%", height:"100%", backgroundColor: "#f5f5f5"}} >
                        <div  style={{padding:"0", margin:"0", height:"100%", width:`${percent}%`, backgroundColor: "#3f51b5"}} >

                        </div>
                  </div>
                </div>
            );
        }
    }




    return (
        <React.Fragment>

            <div className={isPast ? classes.ContainerPast : classes.Container} onClick={(event => dayClicked(event,cellDate))} >

              {getBookingsCountLabel(bookingsCount)}

              {/* {getBookingsCountGauge(bookingsCount)} */}

            </div>

        </React.Fragment>


    );
}

WeekViewCell.propTypes = {
    key: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    dayClicked: PropTypes.func
  };

 
  
export default WeekViewCell;