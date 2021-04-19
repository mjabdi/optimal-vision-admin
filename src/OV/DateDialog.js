import React, { useEffect, useRef, useState } from "react";
import BookService from "./services/BookService";
import Typography from "@material-ui/core/Typography";
import {
    Backdrop,
    Button,
    Checkbox,
    CircularProgress,
    DialogActions,
    Divider,
    FormControlLabel,
    Grid,
    InputAdornment,
    InputLabel,
    Link,
    makeStyles,
    MenuItem,
    Select,
    TextField,
    Tooltip,
} from "@material-ui/core";
import GlobalState from "./../GlobalState";
import { withStyles } from "@material-ui/core/styles";

import CreditCardIcon from "@material-ui/icons/CreditCard";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";

import DialogTitle from "@material-ui/core/DialogTitle";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";

import Alert from "@material-ui/lab/Alert";

import PropTypes from "prop-types";
import LinearProgress from "@material-ui/core/LinearProgress";
import Box from "@material-ui/core/Box";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { corporates } from "./Corporates";
import NumberFormat from "react-number-format";

import AccessAlarmsIcon from '@material-ui/icons/AccessAlarms';
import DateField from "./DateField";



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
        paddingRight: "10px",
        paddingLeft: "10px",
    },

    PatientAttendedLabel: {
        backgroundColor: "#0066aa",
        color: "#fff",
        paddingRight: "15px",
        paddingLeft: "10px",
    },

    SampleTakenLabel: {
        backgroundColor: "#0066cc",
        color: "#fff",
        paddingRight: "40px",
        paddingLeft: "10px",
    },

    ReportSentLabel: {
        backgroundColor: "#009900",
        color: "#fff",
        paddingRight: "90px",
        paddingLeft: "10px",
    },

    ReportCertSentLabel: {
        backgroundColor: "#009900",
        color: "#fff",
        paddingRight: "68px",
        paddingLeft: "10px",
    },

    archiveButton: {},

    smartMatchButton: {
        backgroundColor: "#2f942e",
        "&:hover": {
            background: "green",
            color: "#fff",
        },
        textDecoration: "none !important",
        marginRight: "10px",
        // padding: "10px"
    },

    infoTitle: {
        fontWeight: "400",
    },

    infoData: {
        paddingLeft: "10px",
        fontWeight: "800",
    },

    matchButton: {
        marginTop: "30px",
        marginBottom: "20px",
        backgroundColor: "#2f942e",
        "&:hover": {
            background: "green",
            color: "#fff",
        },
        textDecoration: "none !important",
        padding: "10px",
        paddingLeft: "50px",
        paddingRight: "50px",
    },

    resendButton: {
        marginTop: "5px",
        marginBottom: "5px",
        backgroundColor: "#2f942e",
        "&:hover": {
            background: "green",
            color: "#fff",
        },
        textDecoration: "none !important",
        padding: "10px",
        paddingLeft: "50px",
        paddingRight: "50px",
    },

    resendFilesButton: {
        marginTop: "5px",
        marginBottom: "5px",
        backgroundColor: "#3792ad",
        "&:hover": {
            background: "#2f798f",
            color: "#fff",
        },
        textDecoration: "none !important",
        padding: "10px",
        paddingLeft: "50px",
        paddingRight: "50px",
    },

    cancelButton: {
        marginBottom: "10px",
        textDecoration: "none !important",
        padding: "10px",
        paddingLeft: "90px",
        paddingRight: "90px",
    },

    backdrop: {
        zIndex: theme.zIndex.drawer + 5,
        color: "#fff",
    },

    timeControl: {
        marginTop: "20px",
    }
}));


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

const times = [
    '08:00 AM',
    '08:15 AM',
    '08:30 AM', 
    '08:45 AM',
    '09:00 AM',
    '09:15 AM', 
    '09:30 AM',
    '09:45 AM',
    '10:00 AM',
    '10:15 AM',
    '10:30 AM',
    '10:45 AM',
    '11:00 AM',
    '11:15 AM',
    '11:30 AM',
    '11:45 AM',
    '12:00 PM',
    '12:15 PM',
    '12:30 PM',
    '12:45 PM',
    '01:00 PM',
    '01:15 PM',
    '01:30 PM',
    '01:45 PM',
    '02:00 PM',
    '02:15 PM',
    '02:30 PM',
    '02:45 PM',
    '03:00 PM',
    '03:15 PM',
    '03:30 PM',
    '03:45 PM',
    '04:00 PM',
    '04:15 PM',
    '04:30 PM',
    '04:45 PM',
    '05:00 PM',
    '05:15 PM',
    '05:30 PM',
    '05:45 PM',
    '06:00 PM',
    '06:15 PM',
    '06:30 PM',
    '06:45 PM',
    '07:00 PM',
    '07:15 PM',
    '07:30 PM',
    '07:45 PM'
];

export default function DateDialog(props) {
    const classes = useStyles();

    const [state, setState] = React.useContext(GlobalState);

    const [date, setDate] = React.useState("")
    const [time, setTime] = React.useState("")

    const [dateError, setDateError] = React.useState(false)


    const dateChanged = (value) => {
        setDate(value)
        setDateError(false)
    }

    const timeChanged = (event) => {
        setTime(event.target.value)
    }

    useEffect(() => {
        setDate(props.date)
        setTime(props.time)

    }, [props.date, props.time, props.open])



    const handleClose = () => {

        setDateError(false)
        props.handleClose();
    };

    const okClicked = () => {
        if (!date || date.length < 10) {
            setDateError(true)
            return
        }

        props.handleOK(date, time)
    }


    return (
        <React.Fragment>
            <React.Fragment>
                <Dialog
                    maxWidth="sm"
                    open={props.open}
                    onClose={handleClose}
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
                                <AccessAlarmsIcon
                                    style={{ color: "#03b5f2", fontSize: "3rem" }}
                                />
                            </Grid>

                            <Grid item>
                                <div
                                    style={{
                                        color: "#03b5f2",
                                        paddingBottom: "10px",
                                        fontWeight: "800",
                                    }}
                                >
                                    {" "}
                    Change Date and Time{" "}
                                </div>
                            </Grid>
                        </Grid>

                        <Divider />
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={1}>

                            <Grid item xs={8}>
                                <DateField
                                    error={dateError}
                                    title="Appointment Date"
                                    value={date}
                                    dateChanged={dateChanged}
                                >

                                </DateField>
                            </Grid>

                            <Grid item xs={4}>
                                <div style={{ position: "relative", border: `1px solid ${'#ddd'}`, borderRadius: "10px", padding: "20px", paddingBottom: "20px", marginTop: "20px" }}>

                                    <div style={{ position: "absolute", top: "-15px", left: "15px", backgroundColor: "#fff", color: `${'#555'}`, padding: "5px", paddingLeft: "10px", paddingRight: "10px" }}>
                                        Appointment Time
                                    </div>



                                    <Grid
                                        container
                                        direction="row"
                                        justify="flex-start"
                                        alignItems="flex-start"
                                        spacing={2}
                                    >


                                        <Grid item xs={12}>
                                            <FormControl fullWidth>
                                                <InputLabel id="time-label">Time</InputLabel>
                                                <Select

                                                    labelId="time-label"
                                                    id="time-select"
                                                    value={time}
                                                    onChange={timeChanged}
                                                >
                                                    {times.map(item => (

                                                        <MenuItem value={item}>{item}</MenuItem>

                                                    ))}
                                                </Select>
                                            </FormControl>


                                        </Grid>


                                    </Grid>

                                </div>


                                {/* <FormControl className={classes.timeControl}>
                                    <InputLabel id="demo-simple-select-label"> Time</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={time}
                                        onChange={timeChanged}
                                    >
                                        {times.map(item => (

                                            <MenuItem value={item}>{item}</MenuItem>

                                        ))}
                                    </Select>
                                </FormControl> */}

                            </Grid>


                        </Grid>

                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose}>
                            cancel
                    </Button>
                        <Button color="primary" onClick={okClicked} variant="contained" style={{ width: "100px" }}>
                            OK
                    </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </React.Fragment>
    );
}
