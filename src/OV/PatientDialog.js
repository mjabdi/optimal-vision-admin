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
import TemplateService from "./services/EmailTemplateService";

// import createDOMPurify from 'dompurify'
// import { JSDOM } from 'jsdom'

import SendIcon from '@material-ui/icons/Send';
import CheckIcon from '@material-ui/icons/Check';

// const window = (new JSDOM('')).window
// const DOMPurify = createDOMPurify(window)

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

    const [emailSent, setEmailSent] = React.useState(false)
    const [emailSending, setEmailSending] = React.useState(false)


    const [patientIDError, setPatientIDError] = React.useState(false)
    const [nameError, setNameError] = React.useState(false)
    const [surnameError, setSurnameError] = React.useState(false)
    const [birthDateError, setBirthDateError] = React.useState(false)

    const [patientRepeated, setPatientRepeated] = React.useState(false)


    const [value, setValue] = React.useState(0);

    const [history, setHistory] = React.useState([]);
    const [backupFormData, setBackUpFormData] = React.useState(null);

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)

    const [selectedTemplateID, setSelectedTemplateID] = React.useState(null)
    const [selectedTemplate, setSelectedTemplate] = React.useState(null)  
    const [emailTemplates, setEmailTemplates] = React.useState([])

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false)
    }


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const createPreview = async (_template) => {
        try{
            const res = await TemplateService.getEmailPreview(_template.templateID, null, patient.patientID)
            if (res && res.data && res.data.result){
                console.log(res.data.result)
                setSelectedTemplate({..._template, html: res.data.result.content, subject: res.data.result.newSubject})
            }

        }catch(err)
        {
            console.error(err)
        }
    }

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
            loadEmailTemplates()

        }
    }, [props.patient, props.open])

    const loadEmailTemplates = async () => {
        try{
            const res = await TemplateService.getAllTemplates()
            if (res){
                setEmailTemplates(res.data)
            }

        }catch(err)
        {
            console.error(err)
        }
    }

    const handleClose = () => {
        props.handleClose();
        setValue(0)
        setPatient({ formData: {} })
        setPatientIDError(false)
        setNameError(false)
        setSurnameError(false)
        setPatientRepeated(false)
        setSelectedTemplate(null) 
        setSelectedTemplateID(null)
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

    const handleSelectedTemplateChanged = (value) =>
    {
        setSelectedTemplateID(value)
        const template = emailTemplates.find(e => e.templateID === value)
        setSelectedTemplate(template)
        createPreview(template) 
        setEmailSent(false)
    }

    const sendEmail = async () => {
        try{
            setEmailSending(true)
            setSaving(true)

            await TemplateService.sendManualEmail(selectedTemplate.templateID, patient.email, null, patient.patientID)


            setEmailSending(false)
            setEmailSent(true)
            setSaving(false)

        }catch(err)
        {
            console.error(err)
            setEmailSending(false)
            setSaving(false)
        }

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
                            <Tab label={`Notes From Consultation`} {...a11yProps(2)} />

                            {/* <Tab label="Dry Eyes" {...a11yProps(2)} />
                            <Tab label="Ocular Examination" {...a11yProps(3)} />
                            <Tab label="Diagnostics" {...a11yProps(4)} />
                            <Tab label="Uncorrected VA" {...a11yProps(5)} />
                            <Tab label="Refraction" {...a11yProps(6)} />
                            <Tab label="Auto Refraction" {...a11yProps(7)} />
                            <Tab label="Manifest Refraction" {...a11yProps(8)} />
                            <Tab label="Target Refraction" {...a11yProps(9)} /> */}
                            <Tab label="Recommendation" {...a11yProps(3)} />
                            {props.patient && (
                                <Tab label="Send Emails (Manually)" {...a11yProps(4)} />
                            )}
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
                                        name="othernotes"
                                        id="othernotes"
                                        label="Other Notes"
                                        fullWidth
                                        multiline
                                        rows={10}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.othernotes || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, othernotes: event.target.value } })
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
                            </Grid>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        name="notesfromconsultation"
                                        id="notesfromconsultation"
                                        label="Notes From Consultation"
                                        fullWidth
                                        multiline
                                        rows={25}
                                        variant="outlined"
                                        autoComplete="none"
                                        value={patient.formData.notesfromconsultation || ''}
                                        onChange={(event) => {
                                            setPatient({ ...patient, formData: { ...patient.formData, notesfromconsultation: event.target.value } })
                                        }}
                                    />

                                </Grid>
                            </Grid>
                        </TabPanel>


                        <TabPanel value={value} index={3}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        name="recommendation"
                                        id="recommendation"
                                        label="Recommendation"
                                        fullWidth
                                        multiline
                                        rows={25}
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
                        
                        {props.patient && (
                            <TabPanel value={value} index={4}>
                                <Grid container spacing={2} direction="column">
                                    <Grid item>
                                        <div style={{fontSize:"1.2rem", color:"#777", fontWeight:"500", marginBottom:"0px"}}>
                                            Here you can manually send emails (from templates) to the patients:
                                        </div>   
                                    </Grid>
                                    <Grid item style={{marginBottom:"10px"}}>
                                      <Alert severity="info">Emails will be sent to "{patient.email}"</Alert>
                                    </Grid>
                                    <Grid item xs={6}>
                                    <FormControl fullWidth variant="outlined" className={classes.formControl}>
                                        <InputLabel id="template-label-id">Choose Your Template</InputLabel>
                                            <Select
                                                fullWidth
                                                label="Choose Your Template"
                                                labelId="template-label-id"
                                                id="template-label"
                                                value={selectedTemplateID}
                                                onChange={(event) => {
                                                    handleSelectedTemplateChanged(event.target.value)
                                                }}
                                            >

                                                {emailTemplates.map((item, index) => (
                                                    <MenuItem value={item.templateID}>{`${item.templateID}`}</MenuItem>
                                                ))
                                                }

                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item>
                                        {selectedTemplate && (
                                            <React.Fragment>
                                                <div style={{fontWeight:"500", color:"#777", fontSize:"1rem", width:"100%", padding:"5px"}}>
                                                    Email Preview :
                                                </div>
                                                <Paper elevation={4} style={{padding:"20px",marginBottom:"1px", backgroundColor:"#0083ba"}}>
                                                    <div style={{fontSize:"1rem", fontWeight:"500", color:"#fff", position:"relative"}}>
                                                        {selectedTemplate.subject}
                                                        <div style={{position:"absolute", right:"5px", top:"-5px"}}>
                                                            {!emailSent && (
                                                                <Button disabled={emailSending || (!patient.email || patient.email.length < 3)} onClick={sendEmail} startIcon={<SendIcon/>} variant="contained" color="primary">
                                                                     Send Email
                                                                 </Button>
                                                            )}
                                                            {emailSent && (
                                                                <div style={{fontWeight:"500", fontSize:"1rem", color:"#fff"}}>
                                                                    <Grid container spacing={1} alignItems="center">
                                                                        <Grid item>
                                                                             Email Sent Successfully 
                                                                        </Grid>
                                                                        <Grid item>
                                                                            <CheckIcon/>
                                                                        </Grid>
                                                                    </Grid>
                                                                    
                                                                 </div>
                                                            )}
                                                        </div>
                                                    </div>   
                                                </Paper>
                                                <Paper elevation={4} style={{padding:"20px"}}>
                                                    <div 
                                                        // dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedTemplate.html) }}
                                                        dangerouslySetInnerHTML={{ __html: selectedTemplate.html}}
                                                    >
                                                    </div>
                                                </Paper>
                                            </React.Fragment>
                                        )}
                                    </Grid>

                                </Grid>
                             </TabPanel>                        
                        )}


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
