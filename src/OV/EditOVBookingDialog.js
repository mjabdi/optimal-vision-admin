import React, { useEffect, useRef, useState } from "react";
import BookService from "./services/BookService";
import Typography from "@material-ui/core/Typography";
import {
    Backdrop,
    Button,
    Checkbox,
    CircularProgress,
    DialogActions,
    DialogContentText,
    Divider,
    FormControlLabel,
    Grid,
    InputAdornment,
    InputLabel,
    Link,
    makeStyles,
    MenuItem,
    Select,
    Switch,
    TextField,
    Tooltip,
} from "@material-ui/core";
import GlobalState from "../GlobalState";
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

import AddIcon from "@material-ui/icons/Add";
import { validate } from "email-validator";
import DateRangeIcon from "@material-ui/icons/DateRange";
import { CalendarColors } from "./calendar-admin/colors";
import DateField from "./DateField";

import EditIcon from '@material-ui/icons/Edit';
import DateDialog from "./DateDialog";
import ChooseClinicDialog from "./ChooseClinicDialog"

var interval;

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

    CalendarIcon: {
        color: theme.palette.primary.main,
    },

    DateTimeLabel: {
        fontWeight: "600",
        fontSize: "1.2rem",
        color: theme.palette.primary.main,
    },

    backdrop: {
        zIndex: theme.zIndex.drawer + 5,
        color: "#fff",
    },

    PriceLabelPaid: {
        color: theme.palette.primary.main,
        fontWeight: "600"
    },

    PriceLabelNotPaid: {
        color: theme.palette.secondary.main,
        fontWeight: "600"
    },


}));

const Packages = [
    { packageName: "Consultation with Consultant Gynaecologist" },
    { packageName: `Coil Fitting/Coil Removal` },
    { packageName: `Well Woman Check` },
    { packageName: `Sexual Health Screening` },
    { packageName: `Pre-pregnancy/Fertility check` },
    { packageName: `Gynaecological Ultrasound` },
    { packageName: `HPV Vaccination` },
    { packageName: `Cervical / Pap Smear` },
    { packageName: `HPV Treatment / Wart Cryo-Therapy` },
];

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            isNumericString
            prefix=""
        />
    );
}

NumberFormatCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 10,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: "#cedbce", //theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
        backgroundColor: "#2f942e",
    },
}))(LinearProgress);
function LinearProgressWithLabel(props) {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <BorderLinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography
                    style={{ fontWeight: "800", color: "#5e855e" }}
                    variant="body2"
                    color="textSecondary"
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
};

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

export default function EditOVBookingDialog(props) {
    const classes = useStyles();

    const [state, setState] = React.useContext(GlobalState);
    const [saving, setSaving] = useState(false);

    const [openClinicDialog, setOpenClinicDialog] = React.useState(false)

    const [clinic, setClinic] = React.useState("")

    const [fullname, setFullname] = React.useState("");
    const [fullnameError, setFullnameError] = React.useState(false);

    const [phone, setPhone] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [notes, setNotes] = React.useState("");

    const [patientID, setPatientID] = React.useState("");
    const [prescriptionLeft, setPrescriptionLeft] = React.useState("");
    const [prescriptionRight, setPrescriptionRight] = React.useState("");


    const [birthDate, setBirthDate] = React.useState("");
    const [birthDateError, setBirthDateError] = React.useState(false);

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)

    const [openDateDialog, setOpenDateDialog] = React.useState(false)

    const [date, setDate] = React.useState("")
    const [time, setTime] = React.useState("")

    const patientIDChanged = (event) => {
        setPatientID(event.target.value);
    };

    const prescriptionLeftChanged = (event) => {
        setPrescriptionLeft(event.target.value);
    };

    const prescriptionRightChanged = (event) => {
        setPrescriptionRight(event.target.value);
    };


    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false)
    }

    const handleSaveDateDialog = (date, time) => {
        setDate(date)
        setTime(time)
        setOpenDateDialog(false)
    }

    const handleCloseDateDialog = () => {
        setOpenDateDialog(false)
    }


    React.useEffect(() => {
        if (props.booking && props.open) {
            setFullname(props.booking.fullname)
            setPhone(props.booking.phone)
            setEmail(props.booking.email)
            setBirthDate(props.booking.birthDate)
            setNotes(props.booking.notes)
            setDate(props.date)
            setTime(props.time)
            setPatientID(props.booking.patientID)
            setPrescriptionLeft(props.booking.prescriptionLeft)
            setPrescriptionRight(props.booking.prescriptionRight)

            setClinic(props.clinic)

        }

    }, [props.open, props.booking])


    const birthDateChanged = (dateStr) => {
        setBirthDate(dateStr);
    }




    const fullnameChanged = (event) => {
        setFullname(event.target.value);
        setFullnameError(false);
    };

    const phoneChanged = (event) => {
        setPhone(event.target.value);
    };

    const emailChanged = (event) => {
        setEmail(event.target.value);
    };


    const notesChanged = (event) => {
        setNotes(event.target.value);
    };

    const handleClose = () => {
        if (saving) return;

        setFullname("");
        setFullnameError(false);
        setBirthDateError(false)
        setPhone("");
        setEmail("");
        setNotes("");
        setBirthDate("")
        setPatientID("")
        setPrescriptionLeft("")
        setPrescriptionRight("")
        setClinic("")


        props.handleClose();
        setSaving(false);
    };

    const validateBooking = () => {
        let error = false;
        if (!fullname || fullname.trim().length < 1) {
            setFullnameError(true);
            error = true;
        }

        if (birthDate && birthDate.length >= 1 && birthDate.length < 10) {
            setBirthDateError(true);
            error = true;
        }

        return !error;
    };

    const deleteClicked = async () => {

        setOpenDeleteDialog(false)

        setSaving(true)
        try {
            await BookService.deleteBooking(props.booking._id)
            setSaving(false)
            setState((state) => ({
                ...state,
                bookingDialogDataChanged: !state.bookingDialogDataChanged
                    ? true
                    : false,
            }));
            handleClose();
        }
        catch (err) {
            console.error(err)
            setSaving(false)
        }
    }

    const saveClicked = async () => {
        if (!validateBooking()) {
            return;
        }

        setSaving(true);

        try {
            await BookService.updateBooking({
                bookingId: props.booking._id,
                bookingDate: date,
                bookingTime: time,
                fullname: fullname,
                phone: phone,
                email: email,
                birthDate: birthDate,
                notes: notes,
                clinic: clinic,
                patientID: patientID,
                prescriptionLeft: prescriptionLeft,
                prescriptionRight: prescriptionRight,
            });
            setSaving(false);
            setState((state) => ({
                ...state,
                bookingDialogDataChanged: !state.bookingDialogDataChanged
                    ? true
                    : false,
            }));
            handleClose();
        } catch (err) {
            console.error(err);
            setSaving(false);
        }
    };

    const saveAsClicked = async () => {
        if (!validateBooking()) {
            return;
        }

        setSaving(true);

        try {
            await BookService.addNewBooking({
                bookingDate: date,
                bookingTime: time,
                fullname: fullname,
                phone: phone,
                email: email,
                birthDate: birthDate,
                notes: notes,
                clinic: clinic,
                patientID: patientID,
                prescriptionLeft: prescriptionLeft,
                prescriptionRight: prescriptionRight,
            });
            setSaving(false);
            setState((state) => ({
                ...state,
                bookingDialogDataChanged: !state.bookingDialogDataChanged
                    ? true
                    : false,
            }));
            handleClose();
        } catch (err) {
            console.error(err);
            setSaving(false);
        }
    };


    const getColorFromClinic = (clinic) => {
        switch (clinic) {
            case "Virtual Consultation":
                return CalendarColors.VC_COLOR
            case "F2F Clinic":
                return CalendarColors.F2F_COLOR
            case "Laser Theatre":
                return CalendarColors.LASER_COLOR
            case "Lens Theatre":
                return CalendarColors.CATARACT_COLOR
            case "Post OP":
                return CalendarColors.POSTOP_COLOR
            case "Optometry":
                return CalendarColors.OPOTOMETRY_COLOR
    
    
            default:
                return "#777"

        }
    }

    const handleClinicClicked = (_clinic) =>
    {
        setClinic(_clinic)
        setOpenClinicDialog(false)
    }

    const handleCloseClinicDialog = () =>
    {
        setOpenClinicDialog(false)
    }
    
    const editClinicClicked = () =>
    {
        setOpenClinicDialog(true)
    }

    


    return (
        <React.Fragment>
            {props.date && props.time && (
                <React.Fragment>
                    <Dialog
                        maxWidth="md"
                        open={props.open}
                        onClose={handleClose}
                        PaperComponent={PaperComponent}
                        aria-labelledby="form-dialog-title"
                    >
                        <DialogTitle id="draggable-dialog-title">

                            <div style={{ position: "absolute", left: "0px", top: "0px", width: "100%", backgroundColor: getColorFromClinic(clinic), color: "#fff", padding: "15px 5px", textAlign: "center", fontSize: "1.5rem" }}>
                                <Grid container direction="row"
                                    justify="center"
                                    alignItems="center"
                                    spacing={1}
                                >
                                    <Grid item>
                                        <Tooltip title="Change Clinic">
                                            <EditIcon style={{ fontSize: "2rem", cursor:"pointer" }} onClick={editClinicClicked} />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item style={{ marginTop: "-10px" }}>
                                        {clinic}
                                    </Grid>
                                </Grid>
                            </div>


                        </DialogTitle>
                        <DialogContent>
                            <div
                                style={{
                                    paddingTop: "50px",
                                    paddingBottom: "20px"
                                }}
                            >
                                <Grid
                                    container
                                    direction="row"
                                    justify="stretch"
                                    spacing={2}
                                    alignItems="center"
                                >
                                    <Grid item xs={12} style={{ marginTop: "10px" }}>
                                        <Grid
                                            container
                                            direction="row"
                                            justify="center"
                                            alignItems="center"
                                            spacing={1}
                                            style={{ cursor: "pointer" }} onClick={() => setOpenDateDialog(true)}
                                        >
                                            <Grid item>
                                                <DateRangeIcon className={classes.CalendarIcon} />
                                            </Grid>
                                            <Grid item>
                                                <span className={classes.DateTimeLabel}>
                                                    {date} , {time}
                                                </span>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            error={fullnameError}
                                            label="Full Name"
                                            value={fullname}
                                            required
                                            onChange={fullnameChanged}
                                            name="fullname"
                                            id="fullname-id"
                                            autoComplete="none"
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Patient ID"
                                            value={patientID}
                                            onChange={patientIDChanged}
                                            name="patientid"
                                            id="patientid-id"
                                            autoComplete="none"
                                        />
                                    </Grid>


                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Telephone"
                                            value={phone}
                                            onChange={phoneChanged}
                                            name="phone"
                                            id="phone-id"
                                            autoComplete="none"
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            value={email}
                                            onChange={emailChanged}
                                            name="email"
                                            id="email-id"
                                            autoComplete="none"
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <DateField
                                            error={birthDateError}
                                            title="Date of Birth"
                                            value={birthDate}
                                            dateChanged={birthDateChanged}
                                        >

                                        </DateField>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Prescription (LEFT)"
                                            value={prescriptionLeft}
                                            onChange={prescriptionLeftChanged}
                                            name="pleft"
                                            id="pleft-id"
                                            autoComplete="none"
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Prescription (RIGHT)"
                                            value={prescriptionRight}
                                            onChange={prescriptionRightChanged}
                                            name="pright"
                                            id="pright-id"
                                            autoComplete="none"
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Notes"
                                            value={notes}
                                            onChange={notesChanged}
                                            name="notes"
                                            id="notes-id"
                                            autoComplete="none"
                                        />
                                    </Grid>

                                    <Grid item xs={12} style={{marginTop:"20px"}}>
                                    <Button
                                        onClick={() => setOpenDeleteDialog(true)}
                                        variant="contained"
                                        fullWidth
                                        color="primary"
                                        // style={{ width: "100px" }}
                                        style={{ backgroundColor: "#c70000", color: "#fff" }}
                                        disabled={saving}
                                    >
                                        Delete Appointment
                                      </Button>
                                </Grid>


                                </Grid>

                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: "20px",
                                        right: "20px",
                                    }}
                                >
                                </div>
                            </div>

                            <Backdrop className={classes.backdrop} open={saving}>
                                <CircularProgress color="inherit" />
                            </Backdrop>
                        </DialogContent>

                        <DialogActions>
                            <Grid
                                container
                                direction="row"
                                justify="flex-end"
                                alignItems="center"
                                spacing={2}
                            >

                                <Grid item>
                                    <Button
                                        onClick={handleClose}
                                        style={{ width: "100px" }}
                                        disabled={saving}
                                    >
                                        back
                                     </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        onClick={saveClicked}
                                        variant="contained"
                                        color="primary"
                                        // style={{ width: "100px" }}
                                        style={{ backgroundColor: "#ff7200", color: "#fff" }}
                                        disabled={saving}
                                    >
                                        Save Changes
                                      </Button>
                                </Grid>

                                <Grid item xs={12}>
                                    <div style={{width:"100%", display:"flex", justifyContent:"center"}}>
                                    <Button
                                        onClick={saveAsClicked}
                                        variant="contained"
                                        color="secondary"
                                        style={{ width: "400px" }}
                                        // style={{ backgroundColor: "#ff7200", color: "#fff" }}
                                        disabled={saving}
                                    >
                                        Save As a new booking
                                      </Button>

                                    </div>
                                </Grid>


                                {/* <div style={{position:"absolute", left:"10px", bottom:"5px"}}> */}
                                {/* </div> */}


                            </Grid>

                        </DialogActions>

                        <Dialog
                            open={openDeleteDialog}
                            onClose={handleCloseDeleteDialog}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle style={{ color: "#d10202", fontWeight: "600" }} id="alert-dialog-title">
                                {"Delete Appointment"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText
                                    style={{ color: "#000", fontWeight: "500" }}
                                    id="alert-dialog-description"
                                >
                                    Are you sure you want to delete this appointment?
                            </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDeleteDialog} color="default">
                                    Back
                                 </Button>
                                <Button onClick={deleteClicked} variant="contained" style={{ backgroundColor: "#d10202", color: "#fff" }}>
                                    Yes, Delete this appointment
                                 </Button>
                            </DialogActions>
                        </Dialog>

                    </Dialog>

                    <DateDialog
                        open={openDateDialog}
                        handleClose={handleCloseDateDialog}
                        handleOK={handleSaveDateDialog}
                        date={date}
                        time={time}>

                    </DateDialog>

                </React.Fragment>
            )}

            <ChooseClinicDialog
                    open={openClinicDialog}
                    handleClose={handleCloseClinicDialog}
                    clinicClicked={handleClinicClicked}
            />
            
            
        </React.Fragment>
    );
}
