import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MonthView from './MonthView';
import { Button, Grid, IconButton, InputAdornment, TextField, Tooltip } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import WeekView from './WeekView';
import dateformat from 'dateformat';
import DayView from './DayView';
import GlobalState from '../../GlobalState';

import CloseIcon from '@material-ui/icons/Close';



const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const useStyles = makeStyles((theme) => ({

    title: {
        textAlign: "center",
        fontSize: "24px",
        fontColor: "#333"
    },

  }));

export default function CalendarView() {
    const classes = useStyles();

    const [state, setState] = React.useContext(GlobalState);

    const [month, setMonth] = React.useState(new Date().getMonth() + 1);
    const [year, setYear] = React.useState(new Date().getFullYear());

    const [day, setDay] = React.useState(new Date());

    const [firstDayofWeek, setFirstDayofWeek] = React.useState(new Date());

    const [weekDates, setWeekDates] = React.useState([]);

    const [mode, setMode] = React.useState('month');
    const [selectedTab, setSeletedTab] = React.useState('month');

    const [filter,setFilter] = React.useState('');

    const filterChanged = (event) =>{
        setFilter(event.target.value);
        setState(state => ({...state, dayViewCalFilter : event.target.value?.trim()?.toUpperCase()}))
      }

      const removeFilter = () =>
      {
        setFilter('');
        setState(state => ({...state, dayViewCalFilter : ''}));
      }


    useEffect( () => {
        const today = new Date();
        const dayofWeek = today.getDay();
        const firstdayofweek = new Date(today.getTime() - ( dayofWeek * 86400000));
        setFirstDayofWeek(firstdayofweek);
        setState(state => ({...state, AdminCalendarCache : []}));

        return () =>
        {
            setState(state => ({...state, AdminCalendarCache : []}));
            removeFilter();
        }
       
    }, []);


    useEffect( () => {
        const dates = [];
        for (var i = 0; i < 7 ; i++)
        {
            dates.push(new Date(firstDayofWeek.getTime() + ( i * 86400000)));
        }
        setWeekDates(dates);

    }, [firstDayofWeek]);

    const handlePrevButton = (event) =>
    {
       if (mode === 'month')
       {
            if (month === 1)
            {
                setYear(year - 1);
            } 

            const newMonth = month === 1 ? 12 : month - 1;
            setMonth(newMonth);

            const newDay = new Date(year, newMonth - 1 , 1, 0 ,0 ,0 ,0);
            setDay(newDay);

            const dayofWeek = newDay.getDay();
            setFirstDayofWeek(new Date(newDay.getTime() - ( dayofWeek * 86400000)));

       } 
       else if (mode === 'week')
       {
           const newFirstDayofWeek = new Date(firstDayofWeek.getTime() - ( 7 * 86400000));
           setFirstDayofWeek(newFirstDayofWeek);

           setDay(newFirstDayofWeek);
           setMonth(newFirstDayofWeek.getMonth() + 1);
           setYear(newFirstDayofWeek.getFullYear());

       }
       else if (mode === 'day')
       {
           const newDay = new Date(day.getTime() - ( 1 * 86400000));
           setDay(newDay);

           const dayofWeek = newDay.getDay();
           setFirstDayofWeek(new Date(newDay.getTime() - ( dayofWeek * 86400000)));

           setMonth(newDay.getMonth() + 1);
           setYear(newDay.getFullYear());
       }
    }

    const handleNextButton = (event) =>
    {
        if (mode === 'month')
        {
            if (month === 12)
            {
                setYear(year + 1);
            } 
       
            const newMonth = month === 12 ? 1 : month + 1;
            setMonth(newMonth);

            const newDay = new Date(year, newMonth - 1 , 1, 0 ,0 ,0 ,0);
            setDay(newDay);

            const dayofWeek = newDay.getDay();
            setFirstDayofWeek(new Date(newDay.getTime() - ( dayofWeek * 86400000)));
        }
        else if (mode === 'week')
        {
            const newFirstDayofWeek = new Date(firstDayofWeek.getTime() + ( 7 * 86400000));
            setFirstDayofWeek(newFirstDayofWeek);

            setDay(newFirstDayofWeek);
            setMonth(newFirstDayofWeek.getMonth() + 1);
            setYear(newFirstDayofWeek.getFullYear());

        }
        else if (mode === 'day')
        {
            const newDay = new Date(day.getTime() + ( 1 * 86400000));
            setDay(newDay);

            const dayofWeek = newDay.getDay();
            setFirstDayofWeek(new Date(newDay.getTime() - ( dayofWeek * 86400000)));
 
            setMonth(newDay.getMonth() + 1);
            setYear(newDay.getFullYear());
        }
    }

    const goToday = (event) => {
        const newDay = new Date();
        const dayofWeek = newDay.getDay();
        setFirstDayofWeek(new Date(newDay.getTime() - ( dayofWeek * 86400000)));
        setDay(newDay);
        setMonth(newDay.getMonth() + 1);
        setYear(newDay.getFullYear());
    }

    const dayClicked = (event, date) =>
    {
        const newDay = new Date(date);
        const dayofWeek = newDay.getDay();
        setFirstDayofWeek(new Date(newDay.getTime() - ( dayofWeek * 86400000)));
        setDay(newDay);
        setMonth(newDay.getMonth() + 1);
        setYear(newDay.getFullYear());
        setSeletedTab('day');
        setMode('day');
    }

    const getContentFromMode = (_mode) => {
        if (_mode === 'month')
        {
            return (
                <MonthView dayClicked={dayClicked} month={month} year={year}/>    
            );
        }    
        else if (_mode === 'week')
        {
            return (
                    <WeekView dayClicked={dayClicked} dates={weekDates}/>
            );
            
        }
        else if (_mode === 'day')
        {
            return (
                <DayView date={day}/>
            );
        }
    }

    const getCalendarTitleFromMode = (_mode) => {
        if (_mode === 'month')
        {
            return (
                <span className={classes.title}> {`${monthNames[month - 1]} ${year}`} </span>   
            );
        }    
        else if (_mode === 'week')
        {
            const endOfWeek = new Date(firstDayofWeek.getTime() + ( 6 * 86400000));
            let endofWeekStr = '';
            if (endOfWeek.getMonth() === firstDayofWeek.getMonth())
            {
                endofWeekStr = dateformat(endOfWeek,'d');
            }else
            {
                endofWeekStr = dateformat(endOfWeek,'mmm d');
            }

            return (
                <span className={classes.title}> {`${dateformat(firstDayofWeek,'mmm d')} - ${endofWeekStr}, ${year}`} </span>
            );
            
        }
        else if (_mode === 'day')
        {
            return (
                <span className={classes.title}> {`${dateformat(day,'mmmm d, yyyy')}`} </span>
            );
        }
    }


    const handleTabChanged = (event, value) => {
        if (value && value.length)
        {
          setSeletedTab(value);
          setMode(value);
        }
    };

    const getPrevButtonTitle = (_mode) =>
    {
        return `Previuos ${mode}`;
    }

    const getNextButtonTitle = (_mode) =>
    {
        return `Next ${mode}`;
    }

    return (
        <React.Fragment>

          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            style= {{marginBottom: "10px", marginTop: "0px"}}
            >  

            <Grid item md={3}>
                <div  style={{display:"flex", alignItems: "flex-start", justifyContent: "flex-start" , paddingLeft: "10px"}}>
                    <Tooltip title={getPrevButtonTitle(mode)} placement="bottom-start">
                        <IconButton 
                                color="default" 
                                aria-label="prev"
                                onClick = {handlePrevButton}
                                >
                            <NavigateBeforeIcon style={{fontSize: '2rem'}}/>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={getNextButtonTitle(mode)} placement="bottom-end">
                        <IconButton 
                                color="default" 
                                aria-label="next"
                                onClick = {handleNextButton}
                                >
                            <NavigateNextIcon style={{fontSize: '2rem'}}/>
                        </IconButton>
                    </Tooltip>

                    <Button style={{marginTop: "11px", marginLeft: "10px"}} onClick={goToday} variant="outlined"> Today </Button>
                </div>

            </Grid>

            <Grid item md={6}>

                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="flex-end"
                        spacing = {3}
                        >
                            <Grid item>
                                    {getCalendarTitleFromMode(mode)}
                            </Grid>
                            {mode === 'day' && (
                                        <Grid item>
                                                <TextField
                                                    variant="standard"
                                                    style={{marginBottom : "5px"}}
                                                    value={filter}
                                                    onChange={filterChanged}
                                                    margin="normal"
                                                    size="small"
                                                    id="filter"
                                                    label="Filter"
                                                    name="filter"
                                                    autoComplete="off"
                                                    InputProps={{
                                                        endAdornment : 
                                                            <InputAdornment position="end">
                                                                <Tooltip title="Clear">
                                                                            <IconButton
                                                                            aria-label="remove filter"
                                                                            onClick={() => removeFilter()}
                                                                            onMouseDown={() => removeFilter()}
                                                                        >
                                                                            <CloseIcon/>
                                                                        </IconButton>
                                                                </Tooltip>
                                                            
                                                            </InputAdornment>
                                                          
                                                    }}
                                                   
                                                />
                                        </Grid>
                            )}
                           
                    </Grid>
                
            </Grid>

            <Grid item md={3}>
                <div  style={{display:"flex", alignItems: "flex-end", justifyContent: "flex-end", paddingRight: "10px" }}>
                    <ToggleButtonGroup
                        value={selectedTab}
                        exclusive
                        onChange={handleTabChanged}
                        aria-label="select view mode"
                    >
                        <ToggleButton style={selectedTab === 'month' ? {width: "80px", color: "#3f51b5", backgroundColor: "#ebedf7" } : {width: "80px"}} value="month" aria-label="month view">
                                month
                        </ToggleButton>
                        <ToggleButton style={selectedTab === 'week' ? {width: "80px", color: "#3f51b5", backgroundColor: "#ebedf7"} : {width: "80px"}}  value="week" aria-label="week view">
                                week
                        </ToggleButton>
                        <ToggleButton style={selectedTab === 'day' ? {width: "80px", color: "#3f51b5", backgroundColor: "#ebedf7"} : {width: "80px"}} value="day" aria-label="day view">
                                day
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </Grid>

           </Grid> 

             {getContentFromMode(mode)}

        </React.Fragment>


    );

}