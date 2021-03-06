import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import WeekViewCell from './WeekViewCell';
import dateformat from 'dateformat';

const rows = [
    '10:00 AM',
    '10:30 AM', 
    '11:00 AM', 
    '11:30 AM', 
    '12:00 PM',
    '12:30 PM',
    '01:00 PM',
    '01:30 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
    '05:00 PM',
    '05:30 PM',
];



const useStyles = makeStyles((theme) => ({

    table: {
        width: "100%",
        border: "1px solid #ddd",
        borderCollapse: "collapse",
        overflowY: "auto"
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
        width: "12%", 
    },

    td: {
        border: "1px solid #ddd",
        borderCollapse: "collapse",
        verticalAlign: "middle",
        height : "50px",
        width: "12%", 
    }

  }));

const WeekView = ({dates, dayClicked}) => {
    const classes = useStyles();

    return (
        <React.Fragment>

        <div style={{overflowY: "scroll" , height: "60px"}}>
            <table className={classes.table}>
                <thead>
                    <tr>
                        <th style={{width: "7%"}}>
                        
                        </th>
                            {dates.map(date => (
                                <th className={classes.th}>
                                    <div style={{paddingBottom: "5px", color: "#aaa"}}>
                                         {dateformat(date, 'ddd')}
                                    </div>
                                    <div>
                                        <span style={{color: "#aaa"}}>
                                            {dateformat(date, 'mmm ')}
                                        </span> 
                                        <span  style={(dateformat(new Date(),'yyyy-mm-dd') === dateformat(date, 'yyyy-mm-dd')) ? { backgroundColor: "#1a73e8", color: "#fff", borderRadius: "50%",  padding: "5px",} : {color: "#333", fontWeight:"500"}}>
                                             {dateformat(date, ' d')}
                                        </span>
                                       
                                    </div>
                                </th>
                        ))}
                    </tr>
                </thead>
             </table>

        </div>

            <div style={{overflowY: "scroll" , height: "70vh"}}>
                <table className={classes.table}>   
                    <tbody>
                        {rows.map(row => (
                            <tr>
                                <td style={{width: "7%"}}>
                                    {row}
                                </td>
                                {dates.map(day => (
                                    <td className={classes.td}>
                                        <WeekViewCell 
                                                dayClicked = {dayClicked}
                                                key={`${dateformat(day,'yyyy-mm-dd')}-${row.replace(':','-')}`} 
                                                date={dateformat(day,'yyyy-mm-dd')} 
                                                time={row}/>
                                    </td>
                                ))}
                            </tr>
                        ))}            
                    </tbody>
                </table>
            </div>                    
      
        </React.Fragment>


    );
}

WeekView.propTypes = {
    dates: PropTypes.arrayOf(PropTypes.any).isRequired,
    dayClicked: PropTypes.func
  };


export default WeekView;