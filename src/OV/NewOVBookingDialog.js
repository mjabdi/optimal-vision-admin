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

import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import PatientService from "./services/PatientService";

import {matchSorter} from 'match-sorter'
import PatientDialog from "./PatientDialog";


const filter = createFilterOptions();

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

export default function NewOVBookingDialog(props) {
    const classes = useStyles();

    const [state, setState] = React.useContext(GlobalState);
    const [saving, setSaving] = useState(false);

    const [fullname, setFullname] = React.useState("");
    const [fullnameError, setFullnameError] = React.useState(false);

    const [patientRecord, setPatientRecord] = React.useState(null)
    const [patientList, setPatientList] = React.useState([])


    const [phone, setPhone] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [notes, setNotes] = React.useState("");

    const [patientID, setPatientID] = React.useState("");
    const [prescriptionLeft, setPrescriptionLeft] = React.useState("");
    const [prescriptionRight, setPrescriptionRight] = React.useState("");


    const [birthDate, setBirthDate] = React.useState("");
    const [birthDateError, setBirthDateError] = React.useState(false);


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

    const patientIDChanged = (event) => {
        setPatientID(event.target.value);
    };

    const prescriptionLeftChanged = (event) => {
        setPrescriptionLeft(event.target.value);
    };

    const prescriptionRightChanged = (event) => {
        setPrescriptionRight(event.target.value);
    };

    useEffect(() => {
        if (props.open)
        {
            loadPatiens()
        }

    }, [props.open, state.patientDialogDataChanged])

    const loadPatiens = async() =>
    {
        try{
            const res = await PatientService.getAllPatients()
            setPatientList(res.data)
        }catch(err)
        {
            console.error(err)
        }
    }

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
        setPatientRecord(null)

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

    const saveClicked = async () => {
        if (!validateBooking()) {
            return;
        }

        setSaving(true);

        try {
            await BookService.addNewBooking({
                bookingDate: props.date,
                bookingTime: props.time,
                fullname: fullname,
                phone: phone,
                email: email,
                birthDate: birthDate,
                notes: notes,
                clinic: props.clinic,
                patientID: patientID,
                prescriptionLeft: prescriptionLeft,
                prescriptionRight: prescriptionRight
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

    const filterOptions = (options, { inputValue }) => {

        if (inputValue && inputValue.length >= 1)
        {
        //   setNoOptionsText("")
          return matchSorter(options, inputValue, {keys: ['fullname']});
        }
        else
        {
        //   setNoOptionsText("Please enter at least 3 characters")
          return matchSorter(options, '$$$$', {keys: ['fullname']});
        }
      }

      const [patientDialogOpen, setPatientDialogOpen] = React.useState(false)
      const handleClosePatientDialog = () =>
      {
          setPatientDialogOpen(false)
          setNewName('')
          setNewSurname('')
      }

      const [newName, setNewName] = React.useState('')
      const [newSurname, setNewSurname] = React.useState('')

      useEffect ( () => {
          if (patientRecord)
          {
              setFullname(patientRecord.fullname || '')
              setPatientID(patientRecord.patientID || '')
              setEmail(patientRecord.email || '')
              setPhone(patientRecord.mobileTel || patientRecord.homeTel || '')
              setBirthDate(patientRecord.birthDate || null)
          }else
          {
            setFullname('')
            setPatientID('')
            setEmail('')
            setPhone('')
            setBirthDate(null)
        }

      }, [patientRecord])
    

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

                            <div style={{ position: "absolute", left: "0px", top: "0px", width: "100%", backgroundColor: getColorFromClinic(props.clinic), color: "#fff", padding: "15px 5px", textAlign: "center", fontSize: "1.5rem" }}>
                                <Grid container direction="row"
                                    justify="center"
                                    alignItems="center"
                                    spacing={1}
                                >
                                    <Grid item>
                                        <AddIcon style={{ fontSize: "2.5rem" }} />
                                    </Grid>
                                    <Grid item style={{ marginTop: "-12px" }}>
                                        {props.clinic}

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
                                        >
                                            <Grid item>
                                                <DateRangeIcon className={classes.CalendarIcon} />
                                            </Grid>
                                            <Grid item>
                                                <span className={classes.DateTimeLabel}>
                                                    {props.date} , {props.time}
                                                </span>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        {/* <TextField
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
                                        /> */}

                                        <Autocomplete
                                            fullWidth
                                            autoComplete="none"
                                            value={patientRecord}
                                            onChange={(event, newValue) => {
                                                if (typeof newValue === 'string') {
                                                    // timeout to avoid instant validation of the dialog's form.
                                                    setTimeout(() => {
                                                        const _nameArray = newValue.split(" ")
                                                        console.log(_nameArray)
                                                        if (_nameArray.length >= 1)
                                                        {
                                                            setNewName(_nameArray[0])
                                                        }
                                                        if (_nameArray.length >=2 )
                                                        {
                                                            setNewSurname(_nameArray[1])
                                                        }
                                                        setPatientDialogOpen(true)
                                                        // toggleOpen(true);
                                                        // setDialogValue({
                                                        //     title: newValue,
                                                        //     year: '',
                                                        // });
                                                    });
                                                } else if (newValue && newValue.inputValue) {
                                                    const _nameArray = newValue.inputValue.split(" ")
                                                    console.log(_nameArray)

                                                    if (_nameArray.length >= 1)
                                                    {
                                                        setNewName(_nameArray[0])
                                                    }
                                                    if (_nameArray.length >= 2 )
                                                    {
                                                        setNewSurname(_nameArray[1])
                                                    }

                                                    setPatientDialogOpen(true)
                                                    // toggleOpen(true);
                                                    // setDialogValue({
                                                    //     title: newValue.inputValue,
                                                    //     year: '',
                                                    // });
                                                } else {
                                                    setPatientRecord(newValue);
                                                }
                                            }}
                                            filterOptions={(options, params) => {
                                                // const filtered = filter(options, params);
                                                const filtered = filterOptions(options,params)

                                                if (params.inputValue !== '') {
                                                    filtered.push({
                                                        inputValue: params.inputValue,
                                                        fullname: `Add "${params.inputValue}"`,
                                                    });
                                                }

                                                return filtered;
                                            }}
                                            id="fullname"
                                            options={patientList}
                                            getOptionLabel={(option) => {
                                                // e.g value selected with enter, right from the input
                                                if (typeof option === 'string') {
                                                    return option;
                                                }
                                                if (option.inputValue) {
                                                    return option.inputValue;
                                                }
                                                return option.fullname;
                                            }}
                                            selectOnFocus
                                            clearOnBlur
                                            handleHomeEndKeys
                                            renderOption={(option) => option.fullname}
                                            // style={{ width: 300 }}
                                            freeSolo
                                            renderInput={(params) => (
                                                <TextField {...params} onBlur={(event) => {setPatientRecord({...patientRecord, fullname:event.target.value})}} autoComplete="none" autoFocus error={fullnameError} fullWidth label="Full Name" required />
                                            )}
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
                                spacing={1}
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
                                        color="secondary"
                                        // style={{ width: "100px" }}
                                        disabled={saving}
                                    >
                                        Book Appointment
                      </Button>
                                </Grid>
                            </Grid>

                        </DialogActions>


                        <PatientDialog
                            patient={null}
                            open={patientDialogOpen}
                            handleClose={handleClosePatientDialog}
                            title={"Add New Patient"}
                            saveButtonText={"Save"}
                            name={newName}
                            surname={newSurname}
                        />


                    </Dialog>
                </React.Fragment>
            )}
        </React.Fragment>
    );
}
