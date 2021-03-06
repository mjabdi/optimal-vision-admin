import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import dateformat from 'dateformat';
import BookService from '../services/BookService';

import CircularProgress from '@material-ui/core/CircularProgress';
import GlobalState from '../../GlobalState';

import axios from 'axios'

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

  }));

const MAX_BOOKING_COUNT = 1;  

const WeekViewCell = ({key, date, time, dayClicked}) => {
    const classes = useStyles();

    const [state, setState] = React.useContext(GlobalState);
    const [bookingsCount, setBookingsCount] = React.useState(-1);
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

        setBookingsCount(-1);

       

        var res = state.AdminCalendarCache?.find(record => record.method === 'getBookingsCountByDateStrandTime' && record.query === `${date}${time}`)?.res;
        if (res)
        {
            if (res.data.count >= 0)
            {
                setBookingsCount(res.data.count);
            }  
            return;
        }

        let source = axios.CancelToken.source();
        BookService.getAllBookingsCountByDateStrandTime(date, time, source).then( res => {
            if (res.data.count >= 0)
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


    const getBookingsCountLabel = (_bookingsCount) =>
    {
        if (_bookingsCount === -1)
        {
            return (
                <div className={classes.LoadingProgress}>
                      <CircularProgress disableShrink  />
                </div>
            );  
        }
        else if (_bookingsCount > 0)
        {
            if (_bookingsCount >= MAX_BOOKING_COUNT)
            {
                return (
                    <div onClick={(event => dayClicked(event,cellDate))} className={classes.BookingCountLabelBusy}>
                          {_bookingsCount < 10 ? ` ${_bookingsCount}` : `${_bookingsCount}` }
                    </div>
                );
            }
            else
            {
                return (
                    <div onClick={(event => dayClicked(event,cellDate))} className={classes.BookingCountLabel}>
                        {_bookingsCount < 10 ? ` ${_bookingsCount}` : `${_bookingsCount}` }
                    </div>
                );
            }
        }
    }

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

            <div className={isPast ? classes.ContainerPast : classes.Container} onClick={(event => dayClicked(event,cellDate))}>

              {getBookingsCountLabel(bookingsCount)}

              {getBookingsCountGauge(bookingsCount)}

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