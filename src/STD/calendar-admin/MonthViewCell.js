import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import dateformat from 'dateformat';
import BookService from '../services/BookService';

import CircularProgress from '@material-ui/core/CircularProgress';

import GlobalState from '../../GlobalState';


const useStyles = makeStyles((theme) => ({

    Container: {
        width: "100%",
        paddingTop: "70%",
        position: "relative",
        backgroundColor: "#fff",
        cursor: "pointer"
    },

    ContainerPast: {
        width: "100%",
        paddingTop: "70%",
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

    DayLabelToday: {
        position: "absolute",
        top: "5px",
        right: "5px",
        backgroundColor: "#1a73e8",
        color: "#fff",
        fontSize: "1rem",
        borderRadius: "50%",
        padding: "5px",
        lineHight: "35px",
        minWidth: "35px"
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
        top: "35%",
        left: "40%",
        color: "#3f51b5",
        backgroundColor: "#ebedf7",
        fontSize: "16px",
        fontWeight: "600",
        padding: "10px",
        borderRadius: "50%",
        minWidth: "40px",
        lineHight: "40px",
        cursor: "pointer",
        textAlign: "center"
    },

    BookingCountLabelBusy: {
        position: "absolute",
        top: "35%",
        left: "40%",
        color: "#b00000",
        backgroundColor: "#fce6e6",
        fontSize: "16px",
        fontWeight: "600",
        padding: "10px",
        borderRadius: "50%",
        minWidth: "40px",
        cursor: "pointer",
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
        width : "8%",
        height: "85%"
    },

  }));

const MAX_BOOKING_COUNT = 10;  

const MonthViewCell = ({key, cellIndex, month, daysInMonth, dayClicked}) => {
    const classes = useStyles();

    const [state, setState] = React.useContext(GlobalState);

    const [dateStr, setDateStr] = React.useState('');

    const [cellDate, setCellDate] = React.useState(new Date());

    const [bookingsCount, setBookingsCount] = React.useState(-1);

    const [disableDay, setDisableDay] = React.useState(false);

    const [isPast, setIsPast] = React.useState(false);

    useEffect( () => {

        if (cellIndex <= daysInMonth.length)
        {
            const date = daysInMonth[cellIndex - 1];
            const dateStr = dateformat(date, 'yyyy-mm-dd');
            setDateStr(dateStr);
            setCellDate(date);
            setDisableDay(date.getMonth() !== month - 1);
            const todayStr = dateformat(new Date(), 'yyyy-mm-dd');
            setIsPast(dateStr < todayStr);
        }
        else
        {
            const day = cellIndex - daysInMonth.length;
            const date = new Date((daysInMonth[daysInMonth.length - 1].getTime() + ( day * 86400000)));
            const dateStr = dateformat(date, 'yyyy-mm-dd');
            setDateStr(dateStr);
            setCellDate(date);
            setDisableDay(true);
            const todayStr = dateformat(new Date(), 'yyyy-mm-dd');
            setIsPast(dateStr < todayStr);
        }

    }, [cellIndex, month, daysInMonth]);

    useEffect ( () => {

        const fecthData = async () =>
        {
            if (!dateStr || dateStr.length <= 0)
            {
                return;
            }
        
            if (disableDay)
            {
                setBookingsCount(-2);
                return;
            }

            setBookingsCount(-1);

            var res = state.AdminCalendarCache?.find(record => record.method === 'getBookingsCountByDateStr' && record.query === dateStr)?.res;

            if (!res)
            {
                res = await BookService.getAllBookingsCountByDateStr(dateStr);
                setState(state => ({...state, AdminCalendarCache : [...state.AdminCalendarCache, {method: 'getBookingsCountByDateStr' , query : dateStr, res: res}]}));
            }
        
            if (res.data.count >= 0)
            {
                setBookingsCount(res.data.count);
            }

        }

      fecthData();

    }, [dateStr]);

    const getDayLabel = (_cellIndex , _month , _daysInMonth) =>
    {
        var date = null;
        var disabled = false;
        var day = -1;

    

        if (_cellIndex <= _daysInMonth.length)
        {
            date = _daysInMonth[_cellIndex - 1];
            day = date.getDate();
            if (date.getMonth() !== _month - 1)
            {
                disabled = true;
            }
        }
        else
        {
            const _day = _cellIndex - _daysInMonth.length;
            const date = new Date((_daysInMonth[_daysInMonth.length - 1].getTime() + ( _day * 86400000)));
            day = date.getDate();
            disabled = true;
        }

        const isToday = dateformat(new Date(),'yyyy-mm-dd') === dateformat(date, 'yyyy-mm-dd');

        return (
            <span className={(disabled) ? classes.DayLabelDisabled : isToday ? classes.DayLabelToday : classes.DayLabel}>
                 {day > 0 ? `${day}` : ''}
             </span>
        );
    }

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
        else if (_bookingsCount > 0 )
        {
            if (_bookingsCount >= MAX_BOOKING_COUNT / 2)
            {
                return (
                    <div onClick={(event => dayClicked(event,cellDate))} className={classes.BookingCountLabelBusy}>
                        {_bookingsCount < 10 ?  ` ${_bookingsCount}` : `${_bookingsCount}`}
                    </div>
                );
            }
            else
            {
                return (
                    <div onClick={(event => dayClicked(event,cellDate))} className={classes.BookingCountLabel}>
                          {_bookingsCount < 10 ?  ` ${_bookingsCount}` : `${_bookingsCount}`}
                    </div>
                );
            }
        }
    }

    const getBookingsCountGauge = (_bookingsCount) =>
    {
        if (_bookingsCount > 0)
        {
            let percent = (_bookingsCount / MAX_BOOKING_COUNT) * 100;
            if (percent > 100)
            {
                percent = 100;
            }

            percent = 100 - percent;

            return (

                <div className={classes.BookingCountGauge}>
                  <div style={{padding:"0", margin:"0", width:"100%", height:"100%", backgroundColor: "#3f51b5"}} >
                        <div  style={{padding:"0", margin:"0", width:"100%", height:`${percent}%`, backgroundColor: "#fafafa"}} >

                        </div>
                  </div>
                </div>
            );
        }
    }

    return (
        <React.Fragment>

            <div className={classes.Container} onClick={(event => dayClicked(event,cellDate))}>

              {getDayLabel(cellIndex, month, daysInMonth)}

              {getBookingsCountLabel(bookingsCount)}

              {getBookingsCountGauge(bookingsCount)}

            </div>

        </React.Fragment>


    );
}

MonthViewCell.propTypes = {
    key: PropTypes.string.isRequired,
    cellIndex: PropTypes.number.isRequired,
    month: PropTypes.number.isRequired,
    daysInMonth: PropTypes.arrayOf(PropTypes.date),
    dayClicked: PropTypes.func
  };

 
  
export default MonthViewCell;