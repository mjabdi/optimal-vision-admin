import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import MonthViewCell from './MonthViewCell';
import CalendarUtil from './calendar-util';

const dayLables = ['Sun', 'Mon', 'Tue', 'Wed' , 'Thu', 'Fri', 'Sat'];
const days = [1,2,3,4,5,6,7]; 
const rows = [1,2,3,4,5,6];

const useStyles = makeStyles((theme) => ({

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
        width: "14%"
    },

    td: {
        border: "1px solid #ddd",
        borderCollapse: "collapse",
        verticalAlign: "middle",
    }

  }));

const MonthView = ({month, year, dayClicked}) => {
    const classes = useStyles();

    const daysInMonth = CalendarUtil.getMonthRange(month,year);

    return (
        <React.Fragment>

            <table className={classes.table}>
                <thead>
                    <tr>
                        {dayLables.map(label => (
                            <th key={`th-${label}`} className={classes.th}>
                                {label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => (
                        <tr>
                            {days.map(day => (
                                <td className={classes.td}>
                                    <MonthViewCell 
                                        key={`${month}${year}${(row-1) * days.length + day}`} 
                                        cellIndex={(row-1) * days.length + day} 
                                        month={month} 
                                        daysInMonth={daysInMonth}
                                        dayClicked = {dayClicked}
                                        />
                                </td>
                            ))}
                        </tr>
                    ))}            
                </tbody>

            </table>

      
        </React.Fragment>


    );
}

MonthView.propTypes = {
    month: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
    dayClicked: PropTypes.func
  };


export default MonthView;