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

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
            style={{width:"100%"}}
        >
            {value === index && (
                <div style={{padding:"20px", width:"100%"}}>
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
        paddingTop:"8px",
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
    

}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function PatientDialog(props) {
    const classes = useStyles();

    const [state, setState] = React.useContext(GlobalState);

    const [patient, setPatient] = React.useState({formData:{}})
    const [saving, setSaving] = React.useState(false);


    const [patientIDError, setPatientIDError] = React.useState(false)
    const [nameError, setNameError] = React.useState(false)
    const [surnameError, setSurnameError] = React.useState(false)

    const [patientRepeated, setPatientRepeated] = React.useState(false)
    

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (props.open) {
            if (props.patient)
            {
               setPatient({...props.patient, formData: props.patient.formData ? JSON.parse(props.patient.formData) : {}})
            }
            else
            {
                setPatient({formData:{}})
            }
        }
    }, [props.patient, props.open])



    const handleClose = () => {

        setValue(0)
        setPatient({formData:{}})
        setPatientIDError(false)
        setNameError(false)
        setSurnameError(false)
        setPatientRepeated(false)
        props.handleClose();
    };

    const saveClicked = async () => {

        if (!validatePatient())
        {
            setValue(0)
            return
        }

        try{
            setPatientRepeated(false)
            setSaving(true)
            patient.formData = JSON.stringify(patient.formData)
            if (props.patient)
            {
                const res = await PatientService.updatePatient({id: patient._id , patient: patient})
                setSaving(false)
                if (res.data.status === "OK")
                {
                    setState(state => ({...state,patientDialogDataChanged : !state.patientDialogDataChanged}))
                    handleClose();
                }
            }else
            {
                const res = await PatientService.registerNewPatient({patient: patient})
                setSaving(false)
                if (res.data.status === "OK")
                {
                    setState(state=>({...state,patientDialogDataChanged : !state.patientDialogDataChanged}))
                    handleClose();
                }else if (res.data.status === "FAILED" && res.data.error === "Repeated Patient!")
                {
                    setPatientIDError(true)
                    setPatientRepeated(true)
                    setValue(0)

                }
            }
        }
        catch(err)
        {
            setSaving(false)
            console.error(err)
        }
    }

    const validatePatient = () =>
    {
        var error = false
        if (!patient.patientID || patient.patientID.trim().length === 0)
        {
            error = true
            setPatientIDError(true)
        }
        if (!patient.name || patient.name.trim().length === 0)
        {
            error = true
            setNameError(true)
        }

        if (!patient.surname || patient.surname.trim().length === 0)
        {
            error = true
            setSurnameError(true)
        }

        return !error

    }


    return (
        <React.Fragment>
            <React.Fragment>
                <Dialog fullScreen open={props.open} onClose={handleClose} TransitionComponent={Transition}>
                    <AppBar className={classes.appBar} color="secondary">
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                {props.title}
                            </Typography>
                            <Button color="inherit" onClick={saveClicked}>
                                {props.saveButtonText}
                            </Button>
                        </Toolbar>
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
                                        helperText={patientRepeated ? 'This PatientID is already assigned to another patient' : '' }
                                        error={patientIDError}
                                        value={patient.patientID}
                                        onChange={(event) => {
                                            setPatient({...patient, patientID: event.target.value})
                                            setPatientIDError(false)
                                        }}
                                        autoComplete="none"
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
                                        value={patient.name}
                                        onChange={(event) => {
                                            setPatient({...patient, name: event.target.value})
                                            setNameError(false)
                                        }}
                                        autoComplete="none"
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
                                        value={patient.surname}
                                        onChange={(event) => {
                                            setPatient({...patient, surname: event.target.value})
                                            setSurnameError(false)
                                        }}
                                        autoComplete="none"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        name="gender"
                                        id="gender"
                                        label="Gender"
                                        fullWidth
                                        autoComplete="none"
                                        value={patient.gender}
                                        onChange={(event) => {
                                            setPatient({...patient, gender: event.target.value})
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={8}>
                                    <TextField
                                        name="dob"
                                        id="dob"
                                        label="DOB"
                                        fullWidth
                                        autoComplete="none"
                                        value={patient.birthDate}
                                        onChange={(event) => {
                                            setPatient({...patient, birthDate: event.target.value})
                                        }}


                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        name="postcode"
                                        id="postcode"
                                        label="Postcode"
                                        fullWidth
                                        autoComplete="false"
                                        value={patient.postCode}
                                        onChange={(event) => {
                                            setPatient({...patient, postCode: event.target.value})
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={8}>
                                    <TextField
                                        name="address"
                                        id="address"
                                        label="Address"
                                        fullWidth
                                        autoComplete="none"
                                        value={patient.address}
                                        onChange={(event) => {
                                            setPatient({...patient, address: event.target.value})
                                        }}


                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        name="hometel"
                                        id="hometel"
                                        label="Home Tel"
                                        fullWidth
                                        autoComplete="none"
                                        value={patient.homeTel}
                                        onChange={(event) => {
                                            setPatient({...patient, homeTel: event.target.value})
                                        }}


                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        name="mobiletel"
                                        id="mobiletel"
                                        label="Mobile Tel"
                                        fullWidth
                                        autoComplete="none"
                                        value={patient.mobileTel}
                                        onChange={(event) => {
                                            setPatient({...patient, mobileTel: event.target.value})
                                        }}


                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        name="email"
                                        id="email"
                                        label="Email"
                                        fullWidth
                                        autoComplete="none"
                                        value={patient.email}
                                        onChange={(event) => {
                                            setPatient({...patient, email: event.target.value})
                                        }}


                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="occupation"
                                        id="occupation"
                                        label="Occupation"
                                        fullWidth
                                        autoComplete="none"
                                        value={patient.formData.occupation}
                                        onChange={(event) => {
                                            setPatient({...patient, formData : {...patient.formData, occupation: event.target.value}})
                                        }}


                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="gpname"
                                        id="gpname"
                                        label={`GP Name & Address`}
                                        fullWidth
                                        autoComplete="none"
                                        value={patient.formData.gpname}
                                        onChange={(event) => {
                                            setPatient({...patient, formData : {...patient.formData, gpname: event.target.value}})
                                        }}


                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="kincontact"
                                        id="kincontact"
                                        label="Next of Kin Contact"
                                        fullWidth
                                        autoComplete="none"
                                        value={patient.formData.kincontact}
                                        onChange={(event) => {
                                            setPatient({...patient, formData : {...patient.formData, kincontact: event.target.value}})
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="prevsighttest"
                                        id="prevsignttest"
                                        label="Previous Sight Test"
                                        fullWidth
                                        autoComplete="none"
                                        value={patient.formData.prevsighttest}
                                        onChange={(event) => {
                                            setPatient({...patient, formData : {...patient.formData, prevsighttest: event.target.value}})
                                        }}

                                    />
                                </Grid>
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
                                            value={patient.formData.cc}
                                            onChange={(event) => {
                                                setPatient({...patient, formData : {...patient.formData, cc: event.target.value}})
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
                                            value={patient.formData.prevmedicalhistory}
                                            onChange={(event) => {
                                                setPatient({...patient, formData : {...patient.formData, prevmedicalhistory: event.target.value}})
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
                                            value={patient.formData.prevocularhistory}
                                            onChange={(event) => {
                                                setPatient({...patient, formData : {...patient.formData, prevocularhistory: event.target.value}})
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
                                            value={patient.formData.familyhistory}
                                            onChange={(event) => {
                                                setPatient({...patient, formData : {...patient.formData, familyhistory: event.target.value}})
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
                                            value={patient.formData.medications}
                                            onChange={(event) => {
                                                setPatient({...patient, formData : {...patient.formData, medications: event.target.value}})
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
                                            value={patient.formData.grafth}
                                            onChange={(event) => {
                                                setPatient({...patient, formData : {...patient.formData, grafth: event.target.value}})
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
                                            value={patient.formData.allergies}
                                            onChange={(event) => {
                                                setPatient({...patient, formData : {...patient.formData, allergies: event.target.value}})
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
                                            value={patient.formData.contactlenswearer}
                                            onChange={(event) => {
                                                setPatient({...patient, formData : {...patient.formData, contactlenswearer: event.target.value}})
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
                                            value={patient.formData.hobbies}
                                            onChange={(event) => {
                                                setPatient({...patient, formData : {...patient.formData, hobbies: event.target.value}})
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
                                            value={patient.formData.vdu}
                                            onChange={(event) => {
                                                setPatient({...patient, formData : {...patient.formData, vdu: event.target.value}})
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
                                            value={patient.formData.driver}
                                            onChange={(event) => {
                                                setPatient({...patient, formData : {...patient.formData, driver: event.target.value}})
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
                                            value={patient.formData.othernotes}
                                            onChange={(event) => {
                                                setPatient({...patient, formData : {...patient.formData, othernotes: event.target.value}})
                                            }}

                                        />
                                    </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            Item Three
                        </TabPanel>
                        <TabPanel value={value} index={3}>
                            Item Four
                        </TabPanel>
                        <TabPanel value={value} index={4}>
                            Item Five
                        </TabPanel>
                        <TabPanel value={value} index={5}>
                            Item Six
                          </TabPanel>
                        <TabPanel value={value} index={6}>
                            Item Seven
                        </TabPanel>
                    </div>

                    <Backdrop
                        className={classes.backdrop}
                        open={saving}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>


                </Dialog>
            </React.Fragment>
        </React.Fragment>
    );
}
