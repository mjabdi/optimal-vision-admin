import React, { useEffect, useRef, useState } from "react";
import BookService from "./services/BookService";
import Typography from "@material-ui/core/Typography";
import {
    AppBar,
    Backdrop,
    Button,
    Checkbox,
    CircularProgress,
    DialogActions,
    DialogContentText,
    Divider,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    Link,
    makeStyles,
    MenuItem,
    Select,
    TextField,
    Toolbar,
    Tooltip,
} from "@material-ui/core";
import GlobalState from "./../GlobalState";
import { withStyles } from "@material-ui/core/styles";

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
import NumberFormat from "react-number-format";

import AccessAlarmsIcon from '@material-ui/icons/AccessAlarms';
import DateField from "./DateField";

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import PatientService from "./services/PatientService";
import dateFormat from "dateformat";

import SaveIcon from '@material-ui/icons/Save';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
            style={{ width: "100%" }}
        >
            {value === index && (
                <div style={{ padding: "20px", width: "100%" }}>
                    {children}
                </div>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },

    root: {
        paddingTop: "8px",
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 224,
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },

    backdrop: {
        zIndex: theme.zIndex.drawer + 5,
        color: "#fff",
    },

    titleCenter: {
        width: "100%",
        textAlign: "center",
        fontSize: "1.1rem",
        color: theme.palette.primary.main,
        fontWeight: "500",
        borderBottom: `2px dashed ${theme.palette.primary.main}`
    },

    eyeText: {
        width: "100%",
        textAlign: "left",
        fontSize: "1.1rem",
        color: theme.palette.primary.main,
        fontWeight: "500",
        paddingTop: "15px"
    }

}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function PatientDialog(props) {
    const classes = useStyles();

    const [state, setState] = React.useContext(GlobalState);

    const [patient, setPatient] = React.useState({ formData: {} })
    const [saving, setSaving] = React.useState(false);


    const [patientIDError, setPatientIDError] = React.useState(false)
    const [nameError, setNameError] = React.useState(false)
    const [surnameError, setSurnameError] = React.useState(false)
    const [birthDateError, setBirthDateError] = React.useState(false)

    const [patientRepeated, setPatientRepeated] = React.useState(false)


    const [value, setValue] = React.useState(0);

    const [history, setHistory] = React.useState([]);
    const [backupFormData, setBackUpFormData] = React.useState(null);

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false)
    }


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (props.open) {
            const _history = []

            if (props.patient) {
                setPatient({ ...props.patient, formData: props.patient.formData ? JSON.parse(props.patient.formData) : {} })
                setBackUpFormData(props.patient.formData ? JSON.parse(props.patient.formData) : {})
                if (props.patient.history) {
                    props.patient.history.forEach(record => {
                        _history.push(JSON.parse(record))
                    });
                    setSelectedVersion(0)
                }
            }
            else {
                setPatient({ formData: {},  name : props.name || '', surname: props.surname || ''})
            }

            setHistory(_history.reverse())

        }
    }, [props.patient, props.open])



    const handleClose = () => {
        props.handleClose();
        setValue(0)
        setPatient({ formData: {} })
        setPatientIDError(false)
        setNameError(false)
        setSurnameError(false)
        setPatientRepeated(false)
    };

    const saveClicked = async () => {

        if (!validatePatient()) {
            setValue(0)
            return
        }

        try {
            setPatientRepeated(false)
            setSaving(true)
            patient.formData = JSON.stringify(patient.formData)
            if (props.patient) {
                const res = await PatientService.updatePatient({ id: patient._id, patient: patient })
                setSaving(false)
                if (res.data.status === "OK") {
                    setState(state => ({ ...state, patientDialogDataChanged: !state.patientDialogDataChanged }))
                    handleClose();
                }
            } else {
                const res = await PatientService.registerNewPatient({ patient: patient })
                setSaving(false)
                if (res.data.status === "OK") {
                    setState(state => ({ ...state, patientDialogDataChanged: !state.patientDialogDataChanged }))
                    handleClose();
                } else if (res.data.status === "FAILED" && res.data.error === "Repeated Patient!") {
                    setPatientIDError(true)
                    setPatientRepeated(true)
                    setValue(0)

                }
            }
        }
        catch (err) {
            setSaving(false)
            console.error(err)
        }
    }

    const deleteClicked = async () => {

        setOpenDeleteDialog(false)

        setSaving(true)
        try {
            await PatientService.deletePatient(props.patient._id)
            setSaving(false)
            setState((state) => ({
                ...state,
                patientDialogDataChanged: !state.patientDialogDataChanged
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



    const validatePatient = () => {
        var error = false
        if (!patient.patientID || patient.patientID.trim().length === 0) {
            error = true
            setPatientIDError(true)
        }
        if (!patient.name || patient.name.trim().length === 0) {
            error = true
            setNameError(true)
        }

        if (!patient.surname || patient.surname.trim().length === 0) {
            error = true
            setSurnameError(true)
        }

        if (patient.birthDate && patient.birthDate.length !== 10) {
            setBirthDateError(true)
            error = true
        }

        return !error

    }

    const formatDate = (date) => {
        return dateFormat(date, "dd-mm-yyyy , HH:MM:ss")
    }

    const [selectedVersion, setSelectedVersion] = React.useState(0)

    const showHistoryComboBox = () => {
        return (
            <React.Fragment>
                <div style={{ marginTop: "-10px" }}>
                    <span style={{ color: "#fff", fontWeight: "500", fontSize: "1rem", marginRight: "10px" }}>
                        Version :
                    </span>
                    <Select
                        label="Version"
                        labelId="version-label"
                        id="version-label"
                        style={{ color: "#fff", padding: "0px 10px" }}
                        value={selectedVersion}
                        onChange={(event) => {
                            setSelectedVersion(event.target.value)
                            if (event.target.value === 0) {
                                setPatient({ ...patient, formData: backupFormData })
                            } else {
                                setPatient({ ...patient, formData: history[event.target.value - 1] })
                            }

                        }}

                    >
                        <MenuItem value={0}>{`${formatDate(patient.formData.timeStamp)} ( Current )`}</MenuItem>

                        {history.map((item, index) => (
                            <MenuItem value={index + 1}>{`${formatDate(item.timeStamp)} ( History )`}</MenuItem>
                        ))
                        }
                    </Select>

                </div>
            </React.Fragment>
        )
    }


    return (
        <React.Fragment>
            <React.Fragment>
                <Dialog fullScreen open={props.open} onClose={handleClose} TransitionComponent={Transition}>
                    <AppBar className={classes.appBar} style={(selectedVersion > 0 && history && history.length > 0) ? { backgroundColor: "#777" } : {}} color="secondary">
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                {props.title}
                            </Typography>


                            <Button startIcon={<SaveIcon />} variant="contained" color="primary" onClick={saveClicked} disabled={selectedVersion > 0 && history && history.length > 0}>
                                {props.saveButtonText}
                            </Button>
                        </Toolbar>

                        <Grid container direction="column" alignItems="center" justify="center">

                            {history && history.length > 0 && (
                                <Grid item>
                                    {showHistoryComboBox()}
                                </Grid>
                            )}
                        </Grid>

                    </AppBar>

                    <div className={classes.root}>
                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={value}
                            onChange={handleChange}
                            aria-label="Vertical tabs example"
                            indicatorColor="secondary"
                            textColor="secondary"
                            className={classes.tabs}
                        >
                            <Tab label="Personal Details" {...a11yProps(0)} />
                            <Tab label={`History & Symptoms`} {...a11yProps(1)} />
                            <Tab label="Dry Eyes" {...a11yProps(2)} />
                            <Tab label="Ocular Examination" {...a11yProps(3)} />
                            <Tab label="Diagnostics" {...a11yProps(4)} />
                            <Tab label="Uncorrected VA" {...a11yProps(5)} />
                            <Tab label="Refraction" {...a11yProps(6)} />
                            <Tab label="Auto Refraction" {...a11yProps(7)} />
                            <Tab label="Manifest Refraction" {...a11yProps(8)} />
                            <Tab label="Target Refraction" {...a11yProps(9)} />
                            <Tab label="Recommendation" {...a11yProps(10)} />
                        </Tabs>
                        <TabPanel value={value} index={0}>
                            <Grid container spacing={4}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        disabled={props.patient}
                                        name="patientid"
                                        id="patientid"
                                        label="Patient ID"
                                        fullWidth
                                        required
                                        helperText={patientRepeated ? 'This PatientID is already assigned to another patient' : ''}
                                        error={patientIDError}
                                        value={patient.patientID || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, patientID: event.target.value })
                                            setPatientIDError(false)
                                        }}
                                        autoComplete="none"
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        name="firstname"
                                        id="firstname"
                                        label="First Name"
                                        fullWidth
                                        required
                                        error={nameError}
                                        value={patient.name || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, name: event.target.value })
                                            setNameError(false)
                                        }}
                                        autoComplete="none"
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        name="surname"
                                        id="surname"
                                        label="Surname"
                                        fullWidth
                                        required
                                        error={surnameError}
                                        value={patient.surname || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, surname: event.target.value })
                                            setSurnameError(false)
                                        }}
                                        autoComplete="none"
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth variant="outlined" >
                                        <InputLabel id="gender-label">Gender</InputLabel>
                                        <Select
                                            label="Gender"
                                            labelId="gender-label"
                                            id="gender-label"
                                            fullWidth
                                            style={{ height: "90px" }}
                                            value={patient.gender || ''}
                                            onChange={(event) => {
                                                setPatient({ ...patient, gender: event.target.value })
                                            }}

                                        >
                                            <MenuItem value={"Male"}>Male</MenuItem>
                                            <MenuItem value={"Female"}>Female</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} style={{ marginTop: "-20px" }} >
                                    <DateField
                                        error={birthDateError}
                                        value={patient.birthDate || ''}
                                        title="DOB"
                                        dateChanged={(value) => {
                                            setPatient({ ...patient, birthDate: value })
                                            setBirthDateError(false)
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        name="postcode"
                                        id="postcode"
                                        label="Postcode"
                                        fullWidth
                                        autoComplete="none"
                                        value={patient.postCode || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, postCode: event.target.value })
                                        }}
                                        variant="outlined"

                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={8}>
                                    <TextField
                                        name="address"
                                        id="address"
                                        label="Address"
                                        fullWidth
                                        autoComplete="none"
                                        value={patient.address || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, address: event.target.value })
                                        }}

                                        variant="outlined"

                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        name="hometel"
                                        id="hometel"
                                        label="Home Tel"
                                        fullWidth
                                        autoComplete="none"
                                        value={patient.homeTel || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, homeTel: event.target.value })
                                        }}
                                        variant="outlined"


                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        name="mobiletel"
                                        id="mobiletel"
                                        label="Mobile Tel"
                                        fullWidth
                                        autoComplete="none"
                                        value={patient.mobileTel || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, mobileTel: event.target.value })
                                        }}

                                        variant="outlined"

                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        name="email"
                                        id="email"
                                        label="Email"
                                        fullWidth
                                        autoComplete="none"
                                        value={patient.email || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, email: event.target.value })
                                        }}
                                        variant="outlined"


                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="occupation"
                                        id="occupation"
                                        label="Occupation"
                                        fullWidth
                                        autoComplete="none"
                                        value={patient.formData.occupation || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, occupation: event.target.value } })
                                        }}

                                        variant="outlined"

                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="gpname"
                                        id="gpname"
                                        label={`GP Name & Address`}
                                        fullWidth
                                        autoComplete="none"
                                        value={patient.formData.gpname || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, gpname: event.target.value } })
                                        }}

                                        variant="outlined"

                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="kincontact"
                                        id="kincontact"
                                        label="Next of Kin Contact"
                                        fullWidth
                                        autoComplete="none"
                                        value={patient.formData.kincontact || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, kincontact: event.target.value } })
                                        }}
                                        variant="outlined"

                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="prevsighttest"
                                        id="prevsignttest"
                                        label="Previous Sight Test"
                                        fullWidth
                                        autoComplete="none"
                                        value={patient.formData.prevsighttest || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, prevsighttest: event.target.value } })
                                        }}
                                        variant="outlined"

                                    />
                                </Grid>

                                {props.patient && (
                                    <Grid item xs={12} style={{ marginTop: "20px" }}>
                                        <Button
                                            onClick={() => setOpenDeleteDialog(true)}
                                            variant="contained"
                                            fullWidth
                                            color="primary"
                                            // style={{ width: "100px" }}
                                            style={{ backgroundColor: "#c70000", color: "#fff" }}
                                            disabled={saving}
                                        >
                                            Delete This Patient
                                  </Button>
                                    </Grid>


                                )}
                            </Grid>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="cc"
                                        id="cc"
                                        label="C.C"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.cc || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, cc: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="prevmedicalhistory"
                                        id="prevmedicalhistory"
                                        label="Previous Medical History"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.prevmedicalhistory || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, prevmedicalhistory: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="prevocularhistory"
                                        id="prevocularhistory"
                                        label="Previous Ocular History"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.prevocularhistory || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, prevocularhistory: event.target.value } })
                                        }}


                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="familyhistory"
                                        id="familyhistory"
                                        label="Family History"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.familyhistory || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, familyhistory: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="medications"
                                        id="medications"
                                        label="Medications"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.medications || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, medications: event.target.value } })
                                        }}


                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="grafth"
                                        id="grafth"
                                        label="Graft H"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.grafth || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, grafth: event.target.value } })
                                        }}


                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="allergies"
                                        id="allregies"
                                        label="Allergies"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.allergies || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, allergies: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="contactlenswearer"
                                        id="contactlenswearer"
                                        label="Contact Lens Wearer"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        autoComplete="none"
                                        placeholder={` Yes/No \n Soft/RGP/EW`}
                                        value={patient.formData.contactlenswearer || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, contactlenswearer: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="hobbies"
                                        id="hobbies"
                                        label="Lifestyle / Hobbies"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.hobbies || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, hobbies: event.target.value } })
                                        }}


                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="vdu"
                                        id="vdu"
                                        label="VDU"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.vdu || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, vdu: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="driver"
                                        id="driver"
                                        label="Driver"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.driver || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, driver: event.target.value } })
                                        }}


                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="othernotes"
                                        id="othernotes"
                                        label="Other Notes"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.othernotes || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, othernotes: event.target.value } })
                                        }}

                                    />
                                </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <Grid container spacing={4}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="dryevehistory"
                                        id="dryevehistory"
                                        label="Dry Eye History"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.dryeyehistory || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, dryeyehistory: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="nightvisionglare"
                                        id="nightvisionglare"
                                        label="Night Vision / Glare"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.nightvisionglare || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, nightvisionglare: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="ocularirritation"
                                        id="ocularirritation"
                                        label="Ocular Irritation"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.ocularirritation || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, ocularirritation: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="wateryeyes"
                                        id="wateryeyes"
                                        label="Watery Eyes"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.wateryeyes || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, wateryeyes: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="speedquestionariedone"
                                        id="speedquestionariedone"
                                        label="SPEED Questionnaire Done"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.speedquestionariedone || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, speedquestionariedone: event.target.value } })
                                        }}

                                    />
                                </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={value} index={3}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <div className={classes.titleCenter || ''}>
                                        ANTERIOR SEGMENT
                                    </div>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="cornearight"
                                        id="cornearight"
                                        label="Cornea (Right Eye)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.cornearight || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, cornearight: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="cornealeft"
                                        id="cornealeft"
                                        label="Cornea (Left Eye)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.cornealeft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, cornealeft: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="lidslashesright"
                                        id="lidslashesright"
                                        label={`Lids & Lashes (Right Eye)`}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.lidslashesright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, lidslashesright: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="lidslashesleft"
                                        id="lidslashesleft"
                                        label={`Lids & Lashes (Left Eye)`}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.lidslashesleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, lidslashesleft: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="conjunctivaright"
                                        id="conjunctivaright"
                                        label={`Conjunctiva (Right Eye)`}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.conjunctivaright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, conjunctivaright: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="conjunctivaleft"
                                        id="conjunctivaleft"
                                        label={`Conjunctiva (Left Eye)`}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.conjunctivaleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, conjunctivaleft: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="pupilright"
                                        id="pupilright"
                                        label={`Pupil/PERRLA/RPAD/SIZE (Right Eye)`}
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.pupilright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, pupilright: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="pupilleft"
                                        id="pupilleft"
                                        label={`Pupil/PERRLA/RPAD/SIZE (Left Eye)`}
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.pupilleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, pupilleft: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="acright"
                                        id="acright"
                                        label={`A.C. (Right Eye)`}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.acright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, acright: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="acleft"
                                        id="acleft"
                                        label={`A.C. (Left Eye)`}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.acleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, acleft: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="lensright"
                                        id="lensright"
                                        label={`Lens (Right Eye)`}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.lensright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, lensright: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="lensleft"
                                        id="lensleft"
                                        label={`Lens (Left Eye)`}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.lensleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, lensleft: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="vitreousright"
                                        id="vitreousright"
                                        label={`Vitreous (Right Eye)`}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.vitreousright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, vitreousright: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="vitreousleft"
                                        id="vitreousleft"
                                        label={`Vitreous (Left Eye)`}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.vitreousleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, vitreousleft: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="ombright"
                                        id="ombright"
                                        label={`OMB (Right Eye)`}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.ombright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, ombright: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="ombleft"
                                        id="ombleft"
                                        label={`OMB (Left Eye)`}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.ombleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, ombleft: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="tbutright"
                                        id="tbutright"
                                        label={`TBUT (Right Eye)`}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.tbutright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, tbutright: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="ombleft"
                                        id="ombleft"
                                        label={`OMB (Left Eye)`}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.ombleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, ombleft: event.target.value } })
                                        }}

                                    />
                                </Grid>

                                <Grid item xs={12} style={{ margingTop: "10px" }}>
                                    <div className={classes.titleCenter}>
                                        POSTERIOR SEGMENT
                                    </div>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="discright"
                                        id="discright"
                                        label={`DISC (Right Eye)`}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.discright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, discright: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="discleft"
                                        id="discleft"
                                        label={`DISC (Left Eye)`}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.discleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, discleft: event.target.value } })
                                        }}

                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="cdright"
                                        id="cdright"
                                        label={`C:D (Right Eye)`}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.cdright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, cdright: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="cdleft"
                                        id="cdleft"
                                        label={`C:D (Left Eye)`}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.cdleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, cdleft: event.target.value } })
                                        }}

                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="bloodvesselsright"
                                        id="bloodvesselsright"
                                        label={`Blood Vessels (Right Eye)`}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.bloodvesselsright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, bloodvesselsright: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="bloodvesselsleft"
                                        id="bloodvesselsleft"
                                        label={`Blood Vessels (Left Eye)`}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.bloodvesselsleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, bloodvesselsleft: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="macularight"
                                        id="macularight"
                                        label={`Macula (Right Eye)`}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.macularight || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, macularight: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="maculaleft"
                                        id="maculaleft"
                                        label={`Macula (Left Eye)`}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.maculaleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, maculaleft: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="peripheryright"
                                        id="peripheryright"
                                        label={`Periphery (Right Eye)`}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.peripheryright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, peripheryright: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="peripheryleft"
                                        id="peripheryleft"
                                        label={`Periphery (Left Eye)`}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.peripheryleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, peripheryleft: event.target.value } })
                                        }}

                                    />
                                </Grid>
                            </Grid>

                        </TabPanel>
                        <TabPanel value={value} index={4}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="pupillowlightdiamright"
                                        id="pupillowlightdiamright"
                                        label="Pupil (low light diam) (Right Eye)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.pupillowlightdiamright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, pupillowlightdiamright: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="pupillowlightdiamleft"
                                        id="pupillowlightdiamleft"
                                        label="Pupil (low light diam) (Left Eye)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.pupillowlightdiamleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, pupillowlightdiamleft: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="pachmetryright"
                                        id="pachmetryright"
                                        label="Pachmetry (μm) (Right Eye)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.pachmetryright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, pachmetryright: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="pachmetryleft"
                                        id="pachmetryleft"
                                        label="Pachmetry (μm) (Left Eye)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.pachmetryleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, pachmetryleft: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="keratometryright"
                                        id="keratometryright"
                                        label="Keratometry (Right Eye)"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.keratometryright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, keratometryright: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="keratometryleft"
                                        id="keratometryleft"
                                        label="Keratometry (Left Eye)"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.keratometryleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, keratometryleft: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="acdepthright"
                                        id="acdepthright"
                                        label="AC Depth (Right Eye)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.acdepthright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, acdepthright: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="acdepthleft"
                                        id="acdepthleft"
                                        label="AC Depth (Left Eye)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.acdepthleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, acdepthleft: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="maculathicnessright"
                                        id="maculathicnessright"
                                        label="Macula Thickness (Right Eye)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.maculathicnessright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, maculathicnessright: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="maculathicnessleft"
                                        id="maculathicnessleft"
                                        label="Macula Thickness (Left Eye)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.maculathicnessleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, maculathicnessleft: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="octcommentright"
                                        id="octcommentright"
                                        label="OCT Comment (Right Eye)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.octcommentright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, octcommentright: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="octcommentleft"
                                        id="octcommentleft"
                                        label="OCT Comment (Left Eye)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.octcommentleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, octcommentleft: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="pentacamcommentright"
                                        id="pentacamcommentright"
                                        label="Pentacam Comment (Right Eye)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.pentacamcommentright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, pentacamcommentright: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="pentacamcommentleft"
                                        id="pentacamcommentleft"
                                        label="Pentacam Comment (Left Eye)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.pentacamcommentleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, pentacamcommentleft: event.target.value } })
                                        }}

                                    />
                                </Grid>
                            </Grid>

                        </TabPanel>
                        <TabPanel value={value} index={5}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        name="distancevaright"
                                        id="distancevaright"
                                        label="Distance (Right Eye)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.distancevaright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, distancevaright: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        name="distancevaleft"
                                        id="distancevaleft"
                                        label="Distance (Left Eye)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.distancevaleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, distancevaleft: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        name="distancevabinocular"
                                        id="distancevabinocular"
                                        label="Distance (Binocular)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.distancevabinocular || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, distancevabinocular: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        name="intermediatevaright"
                                        id="intermediatevaright"
                                        label="Intermediate (Right Eye)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.intermediatevaright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, intermediatevaright: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        name="intermediatevaleft"
                                        id="intermediatevaleft"
                                        label="Intermediate (Left Eye)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.intermediatevaleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, intermediatevaleft: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        name="intermediatevabinocular"
                                        id="intermediatevabinocular"
                                        label="Intermediate (Binocular)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.intermediatevabinocular || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, intermediatevabinocular: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        name="nearvaright"
                                        id="nearvaright"
                                        label="Near (Right Eye)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.nearvaright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, nearvaright: event.target.value } })
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        name="nearvaleft"
                                        id="nearvaleft"
                                        label="Near (Left Eye)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.nearvaleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, nearvaleft: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        name="nearvabinocular"
                                        id="nearvabinocular"
                                        label="Near (Binocular)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.nearvabinocular || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, nearvabinocular: event.target.value } })
                                        }}
                                    />
                                </Grid>



                            </Grid>

                        </TabPanel>
                        <TabPanel value={value} index={6}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <DateField
                                        // error={birthDateError}
                                        title="Current Prescription Date"
                                        value={patient.formData.refractioncurrentpresdate || ''}
                                        dateChanged={(value) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, refractioncurrentpresdate: value } })
                                            // setBirthDateError(false)
                                        }}
                                        todayButton={true}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}> <div className={classes.eyeText}>Right Eye : </div></Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="spherepresdateright"
                                        id="spherepresdateright"
                                        label="Sphere (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.spherepresdateright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, spherepresdateright: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="cylpresdateright"
                                        id="cylpresdateright"
                                        label="Cyl (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.cylpresdateright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, cylpresdateright: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="axispresdateright"
                                        id="axispresdateright"
                                        label="Axis (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.axispresdateright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, axispresdateright: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="addpresdateright"
                                        id="addpresdateright"
                                        label="Add (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.addpresdateright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, addpresdateright: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="vapresdateright"
                                        id="vapresdateright"
                                        label="VA (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.vapresdateright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, vapresdateright: event.target.value } })
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={2}> <div className={classes.eyeText}>Left Eye : </div></Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="spherepresdateleft"
                                        id="spherepresdateleft"
                                        label="Sphere (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.spherepresdateleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, spherepresdateleft: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="cylpresdateleft"
                                        id="cylpresdateleft"
                                        label="Cyl (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.cylpresdateleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, cylpresdateleft: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="axispresdateleft"
                                        id="axispresdateleft"
                                        label="Axis (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.axispresdateleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, axispresdateleft: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="addpresdateleft"
                                        id="addpresdateleft"
                                        label="Add (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.addpresdateleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, addpresdateleft: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="vapresdateleft"
                                        id="vapresdateleft"
                                        label="VA (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.vapresdateleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, vapresdateleft: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined" >
                                        <InputLabel id="spectype-label">Spec Type</InputLabel>
                                        <Select
                                            label="Spec Type"
                                            labelId="spectype-label"
                                            id="spectype-label"
                                            style={{ textAlign: "center" }}
                                            fullWidth
                                            value={patient.formData.refractionsepctype || ''}
                                            onChange={(event) => {
                                                setPatient({ ...patient, formData: { ...patient.formData, refractionsepctype: event.target.value } })
                                            }}

                                        >
                                            <MenuItem value={"Single Vision"}>Single Vision</MenuItem>
                                            <MenuItem value={"Bifocal"}>Bifocal</MenuItem>
                                            <MenuItem value={"Varifocal"}>Varifocal</MenuItem>
                                            <MenuItem value={"RR"}>RR</MenuItem>

                                        </Select>
                                    </FormControl>
                                </Grid>


                                <Grid item xs={12}>
                                    <DateField
                                        // error={birthDateError}
                                        title="Contact Lens Date"
                                        value={patient.formData.contactlensdate || ''}
                                        dateChanged={(value) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, contactlensdate: value } })
                                            // setBirthDateError(false)
                                        }}
                                        todayButton={true}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}> <div className={classes.eyeText}>Right Eye : </div></Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="spherepresdaterightlens"
                                        id="spherepresdaterightlens"
                                        label="Sphere (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.spherepresdaterightlens || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, spherepresdaterightlens: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="cylpresdaterightlens"
                                        id="cylpresdaterightlens"
                                        label="Cyl (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.cylpresdaterightlens || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, cylpresdaterightlens: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="axispresdaterightlens"
                                        id="axispresdaterightlens"
                                        label="Axis (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.axispresdaterightlens || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, axispresdaterightlens: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="addpresdaterightlens"
                                        id="addpresdaterightlens"
                                        label="Add (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.addpresdaterightlens || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, addpresdaterightlens: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="vapresdaterightlens"
                                        id="vapresdaterightlens"
                                        label="VA (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.vapresdaterightlens || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, vapresdaterightlens: event.target.value } })
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={2}> <div className={classes.eyeText}>Left Eye : </div></Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="spherepresdateleftlens"
                                        id="spherepresdateleftlens"
                                        label="Sphere (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.spherepresdateleftlens || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, spherepresdateleftlens: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="cylpresdateleftlens"
                                        id="cylpresdateleftlens"
                                        label="Cyl (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.cylpresdateleftlens || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, cylpresdateleftlens: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="axispresdateleftlens"
                                        id="axispresdateleftlens"
                                        label="Axis (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.axispresdateleftlens || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, axispresdateleftlens: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="addpresdateleftlens"
                                        id="addpresdateleftlens"
                                        label="Add (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.addpresdateleftlens || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, addpresdateleftlens: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="vapresdateleftlens"
                                        id="vapresdateleftlens"
                                        label="VA (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.vapresdateleftlens || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, vapresdateleftlens: event.target.value } })
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined" >
                                        <InputLabel id="cltype-label">CL Type</InputLabel>
                                        <Select
                                            label="CL Type"
                                            labelId="cltype-label"
                                            id="cltype-label"
                                            style={{ textAlign: "center" }}
                                            fullWidth
                                            value={patient.formData.refractioncltype || ''}
                                            onChange={(event) => {
                                                setPatient({ ...patient, formData: { ...patient.formData, refractioncltype: event.target.value } })
                                            }}

                                        >
                                            <MenuItem value={"Dailies Soft"}>Dailies Soft</MenuItem>
                                            <MenuItem value={"Monthlies"}>Monthlies</MenuItem>
                                            <MenuItem value={"RGP"}>RGP</MenuItem>

                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} style={{ marginBottom: "20px" }}></Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={value} index={7}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={2}> <div className={classes.eyeText}>Right Eye : </div></Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="sphereautorefright"
                                        id="sphereautorefright"
                                        label="Sphere (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.sphereautorefright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, sphereautorefright: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="cylautorefright"
                                        id="cylautorefright"
                                        label="Cyl (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.cylautorefright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, cylautorefright: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="axisautorefright"
                                        id="axisautorefright"
                                        label="Axis (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.axisautorefright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, axisautorefright: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="vaautorefright"
                                        id="vaautorefright"
                                        label="VA (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.vaautorefright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, vaautorefright: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}></Grid>


                                <Grid item xs={12} md={2}> <div className={classes.eyeText}>Left Eye : </div></Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="sphereautorefleft"
                                        id="sphereautorefleft"
                                        label="Sphere (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.sphereautorefleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, sphereautorefleft: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="cylautorefleft"
                                        id="cylautorefleft"
                                        label="Cyl (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.cylautorefleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, cylautorefleft: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="axisautorefleft"
                                        id="axisautorefleft"
                                        label="Axis (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.axisautorefleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, axisautorefleft: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="vaautorefleft"
                                        id="vaautorefleft"
                                        label="VA (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.vaautorefleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, vaautorefleft: event.target.value } })
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={value} index={8}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <div className={classes.titleCenter}>
                                        Manifest Refraction
                                    </div>
                                </Grid>

                                <Grid item xs={12} md={2}> <div className={classes.eyeText}>Right Eye : </div></Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="spheremanifestright"
                                        id="spheremanifestright"
                                        label="Sphere (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.spheremanifestright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, spheremanifestright: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="cylmanifestright"
                                        id="cylmanifestright"
                                        label="Cyl (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.cylmanifestright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, cylmanifestright: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="axismanifestright"
                                        id="axismanifestright"
                                        label="Axis (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.axismanifestright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, axismanifestright: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="addmanifestright"
                                        id="addmanifestright"
                                        label="Add (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.addmanifestright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, addmanifestright: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="vamanifestright"
                                        id="vamanifestright"
                                        label="VA (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.vamanifestright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, vamanifestright: event.target.value } })
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={2}> <div className={classes.eyeText}>Left Eye : </div></Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="spheremanifestleft"
                                        id="spheremanifestleft"
                                        label="Sphere (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.spheremanifestleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, spheremanifestleft: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="cylmanifestleft"
                                        id="cylmanifestleft"
                                        label="Cyl (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.cylmanifestleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, cylmanifestleft: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="axismanifestleft"
                                        id="axismanifestleft"
                                        label="Axis (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.axismanifestleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, axismanifestleft: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="addmanifestleft"
                                        id="addmanifestleft"
                                        label="Add (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.addmanifestleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, addmanifestleft: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="vamanifestleft"
                                        id="vamanifestleft"
                                        label="VA (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.vamanifestleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, vamanifestleft: event.target.value } })
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} style={{ marginTop: "50px" }}>
                                    <div className={classes.titleCenter}>
                                        Cycloplegic Refraction
                                    </div>
                                </Grid>


                                <Grid item xs={12} md={2}> <div className={classes.eyeText}>Right Eye : </div></Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="spherecycloright"
                                        id="spherecycloright"
                                        label="Sphere (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.spherecycloright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, spherecycloright: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="cylcycloright"
                                        id="cylcycloright"
                                        label="Cyl (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.cylcycloright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, cylcycloright: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="axiscycloright"
                                        id="axiscycloright"
                                        label="Axis (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.axiscycloright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, axiscycloright: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="addcycloright"
                                        id="addcycloright"
                                        label="Add (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.addcycloright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, addcycloright: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="vacycloright"
                                        id="vacycloright"
                                        label="VA (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.vacycloright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, vacycloright: event.target.value } })
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={2}> <div className={classes.eyeText}>Left Eye : </div></Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="spherecycloleft"
                                        id="spherecycloleft"
                                        label="Sphere (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.spherecycloleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, spherecycloleft: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="cylcycloleft"
                                        id="cylcycloleft"
                                        label="Cyl (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.cylcycloleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, cylcycloleft: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="axiscycloleft"
                                        id="axiscycloleft"
                                        label="Axis (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.axiscycloleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, axiscycloleft: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="addcycloleft"
                                        id="addcycloleft"
                                        label="Add (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.addcycloleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, addcycloleft: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="vacycloleft"
                                        id="vacycloleft"
                                        label="VA (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.vacycloleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, vacycloleft: event.target.value } })
                                        }}
                                    />
                                </Grid>


                            </Grid>
                        </TabPanel>
                        <TabPanel value={value} index={9}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={2}> <div className={classes.eyeText}>Right Eye : </div></Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="spheretargetrefright"
                                        id="spheretargetrefright"
                                        label="Sphere (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.spheretargetrefright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, spheretargetrefright: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="cyltargetrefright"
                                        id="cyltargetrefright"
                                        label="Cyl (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.cyltargetrefright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, cyltargetrefright: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="axistargetrefright"
                                        id="axistargetrefright"
                                        label="Axis (RE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.axistargetrefright || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, axistargetrefright: event.target.value } })
                                        }}
                                    />

                                </Grid>
                                <Grid item xs={12} md={2}>
                                </Grid>
                                <Grid item xs={12} md={2}></Grid>


                                <Grid item xs={12} md={2}> <div className={classes.eyeText}>Left Eye : </div></Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="spheretargetrefleft"
                                        id="spheretargetrefleft"
                                        label="Sphere (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.spheretargetrefleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, spheretargetrefleft: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="cyltargetrefleft"
                                        id="cyltargetrefleft"
                                        label="Cyl (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.cyltargetrefleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, cyltargetrefleft: event.target.value } })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        name="axistargetrefleft"
                                        id="axistargetrefleft"
                                        label="Axis (LE)"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.axistargetrefleft || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, axistargetrefleft: event.target.value } })
                                        }}
                                    />

                                </Grid>
                                <Grid item xs={12} md={2}>
                                </Grid>
                            </Grid>

                        </TabPanel>
                        <TabPanel value={value} index={10}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        name="recommendation"
                                        id="recommendation"
                                        label="Recommendation"
                                        fullWidth
                                        multiline
                                        rows={15}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.recommendation || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, recommendation: event.target.value } })
                                        }}
                                    />

                                </Grid>
                            </Grid>
                        </TabPanel>


                    </div>

                    <Backdrop
                        className={classes.backdrop}
                        open={saving}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>


                    <Dialog
                        open={openDeleteDialog}
                        onClose={handleCloseDeleteDialog}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle style={{ color: "#d10202", fontWeight: "600" }} id="alert-dialog-title">
                            {"Delete Patient"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText
                                style={{ color: "#000", fontWeight: "500" }}
                                id="alert-dialog-description"
                            >
                                Are you sure you want to delete this patient?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDeleteDialog} color="default">
                                Back
                                 </Button>
                            <Button onClick={deleteClicked} variant="contained" style={{ backgroundColor: "#d10202", color: "#fff" }}>
                                Yes, Delete this patient
                                 </Button>
                        </DialogActions>
                    </Dialog>



                </Dialog>
            </React.Fragment>
        </React.Fragment>
    );
}
