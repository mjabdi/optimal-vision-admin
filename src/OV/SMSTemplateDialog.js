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
    Switch,
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
import templateService from "./services/SMSTemplateService";
import dateFormat from "dateformat";

import SaveIcon from '@material-ui/icons/Save';


import { EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { htmlToText } from 'html-to-text';
import { stateFromHTML } from 'draft-js-import-html';
import "./react-draft-wysiwyg.css";
import TemplateService from "./services/SMSTemplateService";

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';


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
        backgroundColor: "#009e28"
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
    },

    createSMSButton : {
        backgroundColor : "#009e28",
        color: "#fff",
        "&:hover" : {
          backgroundColor: "#00751e"
        }
      },
    


}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function SMSTemplateDialog(props) {
    const classes = useStyles();

    const [state, setState] = React.useContext(GlobalState);

    const [template, settemplate] = React.useState({ formData: {} })
    const [saving, setSaving] = React.useState(false);


    const [templateIDError, settemplateIDError] = React.useState(false)
    const [rawTextError, setRawTextError] = React.useState(false)

    const [subjectError, setSubjectError] = React.useState(false)

    const [nameError, setNameError] = React.useState(false)
    const [surnameError, setSurnameError] = React.useState(false)
    const [birthDateError, setBirthDateError] = React.useState(false)

    const [templateRepeated, settemplateRepeated] = React.useState(false)

    const [clinicError, setClinicError] = React.useState(false)

    const [value, setValue] = React.useState(0);

    const [history, setHistory] = React.useState([]);
    const [backupFormData, setBackUpFormData] = React.useState(null);

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)

    const [variable, setVariable] = React.useState({})
    const [variableErrors, setVariableErrors] = React.useState({})


    // const [editorState, setEditorState] = React.useState(EditorState.createWithContent(stateFromHTML(`<p>...</p>`)))
    const [editorState, setEditorState] = React.useState(EditorState.createEmpty())

    const onEditorStateChange = (_editorState) => {
        setEditorState(_editorState)
        const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        settemplate({
            ...template,
            html: html,
            rawText: htmlToText(html),
        })
    }


    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false)
    }


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (props.open) {

            if (props.template) {
                let parameters = []
                try{
                    parameters = JSON.parse(props.template.parameters)
                }
                catch(err){}

                settemplate({ ...props.template, parameters: parameters})
            }
            else {
                settemplate({parameters: []})
            }
        }
    }, [props.template, props.open])



    const handleClose = () => {
        props.handleClose();
        setValue(0)
        settemplate({})
        settemplateIDError(false)
        setNameError(false)
        setSurnameError(false)
        settemplateRepeated(false)
        settemplatenameuser('')
        settemplatenameusererror(false)
        setVariable({})
        setVariableErrors({})
        setSubjectError(false)
        setRawTextError(false)
        setClinicError(false)
    };

    const saveClicked = async () => {

        if (!validatetemplate()) {
            return
        }

        try {
            settemplateRepeated(false)
            setSaving(true)
            const parameters = JSON.stringify(template.parameters)
            if (props.template) {
                const res = await templateService.updateTemplate({ id: template._id, template: {...template, parameters: parameters} })
                setSaving(false)
                if (res.data.status === "OK") {
                    setState(state => ({ ...state, templateDialogDataChanged: !state.templateDialogDataChanged }))
                    handleClose();
                }
            } else {
                const res = await templateService.registerNewTemplate({ template: {...template, parameters: parameters}  })
                setSaving(false)
                if (res.data.status === "OK") {
                    setState(state => ({ ...state, templateDialogDataChanged: !state.templateDialogDataChanged }))
                    handleClose();
                } else if (res.data.status === "FAILED" && res.data.error === "Repeated template!") {
                    settemplateIDError(true)
                    settemplateRepeated(true)
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

        if (templatenameuser !== props.template.templateID) {
            settemplatenameusererror(true)
            return
        }

        setOpenDeleteDialog(false)

        setSaving(true)
        try {
            await templateService.deleteTemplate(props.template._id)
            setSaving(false)
            setState((state) => ({
                ...state,
                templateDialogDataChanged: !state.templateDialogDataChanged
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



    const validatetemplate = () => {

        var error = false
        if (!template.templateID || template.templateID.trim().length === 0) {
            error = true
            settemplateIDError(true)
            setValue(0)
        }

        if (!template.rawText || template.rawText.length === 0) {
            error = true
            setRawTextError(true)
            setValue(0)
        }

        if (template.sendWhenBookedCalendar && !template.clinic) {
            error = true
            setClinicError(true)
            setValue(2)
        }


        return !error
    }

    const formatDate = (date) => {
        return dateFormat(date, "dd-mm-yyyy , HH:MM:ss")
    }

    const [selectedVersion, setSelectedVersion] = React.useState(0)

    const [templatenameuser, settemplatenameuser] = React.useState('')
    const [templatenameusererror, settemplatenameusererror] = React.useState(false)

    const addVariableCliced = () => {
        setVariableErrors({})
        if (!ValidateVariable()) {
            return
        }

        const _variable = {
            keyword: variable.keyword,
            builtinValue: variable.builtinValue,
            defaultValue: variable.defaultValue
        }

        settemplate({ ...template, parameters: [...template.parameters, _variable] })
        setVariable({})
    }

    const ValidateVariable = () => {
        var error = false
        if (!variable.keyword) {
            setVariableErrors((prev) => prev = { ...prev, keywordError: true })
            error = true
        }

        if (variable.keyword)
        {
            if (template.parameters.find(e => e.keyword === variable.keyword))
            {
                setVariableErrors((prev) => prev = { ...prev, keywordError: true })
                error = true
            }
        }


        if (!variable.builtinValue) {
            setVariableErrors((prev) => prev = { ...prev, builtinValueError: true })
            error = true
        }


        return !error
    }

    const deleteParameter = (_keyword) =>
    {
        settemplate({...template, parameters: template.parameters.filter(e => e.keyword !== _keyword)})
    }

    return (
        <React.Fragment>
            <React.Fragment>
                <Dialog fullScreen open={props.open} onClose={handleClose} TransitionComponent={Transition}>
                    <AppBar className={classes.appBar} style={(selectedVersion > 0 && history && history.length > 0) ? { backgroundColor: "#777" } : {}} color="primary">
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                {props.title}
                            </Typography>


                            <Button startIcon={<SaveIcon />} variant="contained" onClick={saveClicked} disabled={selectedVersion > 0 && history && history.length > 0}>
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
                            <Tab label="SMS Text" {...a11yProps(0)} />
                            <Tab label={`Parameters`} {...a11yProps(1)} />
                            <Tab label={`Settings`} {...a11yProps(2)} />

                        </Tabs>
                        <TabPanel value={value} index={0}>
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={8}>
                                            <TextField
                                                // disabled={props.template}
                                                name="templatename"
                                                id="templatename"
                                                label="Template Name"
                                                fullWidth
                                                required
                                                helperText={templateRepeated ? '* This Name is already assigned to another template! Please choose a different name.' : '* Please give a unique name to each templete.'}
                                                error={templateIDError}
                                                value={template.templateID || ''}
                                                onChange={(event) => {
                                                    settemplate({ ...template, templateID: event.target.value })
                                                    settemplateIDError(false)
                                                }}
                                                autoComplete="none"
                                                variant="outlined"
                                            />

                                        </Grid>
                                        {props.template && (
                                            <Grid item xs={4}>
                                                <Button onClick={() => setOpenDeleteDialog(true)} variant="contained" style={{ backgroundColor: "#d10202", color: "#fff", marginBottom: "5px" }}>
                                                    Delete This Template
                                                </Button>
                                            </Grid>
                                        )}

                                    </Grid>

                                </Grid>
                                <Grid item xs={12}>
                                        <TextField
                                                autoFocus
                                                name="rawtext"
                                                id="rawtext"
                                                label="SMS Body"
                                                fullWidth
                                                multiline={true}
                                                rows={20}
                                                required
                                                error={rawTextError}
                                                value={template.rawText || ''}
                                                onChange={(event) => {
                                                    settemplate({ ...template, rawText: event.target.value })
                                                    setRawTextError(false)
                                                }}
                                                autoComplete="none"
                                                variant="outlined"
                                            />

                                </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <Grid container direction="column" spacing={2}>
                                <Grid item>
                                    <Grid container direction="row" spacing={1} alignItems="bottom">
                                        <Grid item xs={3}>
                                            <TextField
                                                name="keyword"
                                                id="keyword"
                                                label="Keyword"
                                                fullWidth
                                                required
                                                error={variableErrors.keywordError}
                                                helperText={'This is the TEXT within your SMS that you want to be replaced by a value'}
                                                autoComplete="none"
                                                variant="outlined"
                                                value={variable.keyword || ''}
                                                onChange={(event) => setVariable({ ...variable, keyword: event.target.value })}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <FormControl
                                                error={variableErrors.builtinValueError}
                                                fullWidth required variant="outlined" className={classes.formControl}>
                                                <InputLabel id="builtinvalueid"> Value</InputLabel>
                                                <Select
                                                    labelId="builtinvalueid"
                                                    id="builtinvalue"
                                                    value={variable.builtinValue || null}
                                                    onChange={(event) => setVariable({ ...variable, builtinValue: event.target.value })}
                                                    label="Built-in Value"
                                                >
                                                    <MenuItem value={'Patient Name'}>Patient Name</MenuItem>
                                                    <MenuItem value={'Patient Surname'}>Patient Surname</MenuItem>
                                                    <MenuItem value={'Patient Fullname'}>Patient Fullname</MenuItem>
                                                    <MenuItem value={'Today Date'}>Today Date</MenuItem>
                                                    <MenuItem value={'Appointment DateTime'}>Appointment DateTime</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                name="defaultvalue"
                                                id="defaultvalue"
                                                label="Default Value"
                                                fullWidth
                                                autoComplete="none"
                                                helperText={'* This value is used if the variable is empty.'}
                                                variant="outlined"
                                                value={variable.defaultValue || ''}
                                                onChange={(event) => setVariable({ ...variable, defaultValue: event.target.value })}

                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Button className={classes.createSMSButton} onClick={addVariableCliced} startIcon={<AddIcon />} variant="contained" color="primary" fullWidth style={{ height: "55px" }}>
                                                Add Variable
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    </Grid>

                                    <Grid item style={{marginTop:"20px", fontWeight:"500", height:"20px"}}>
                                         <Divider/>
                                         <Grid container direction="row" spacing={1} alignItems="center">
                                                <Grid item xs={3}>
                                                    {"Keyword"}
                                                </Grid>
                                                <Grid item xs={3}>
                                                    {"Value"}
                                                </Grid>
                                                <Grid item xs={3}>
                                                    {"Default Value"}
                                                </Grid>
                                                <Grid item xs={3}>
                                                </Grid>
                                            </Grid>
                                            <Divider/>
                                      </Grid>      

                                    {(!template.parameters || template.parameters.length === 0) && (
                                        <Grid item>
                                            <div style={{width:"80%", textAlign:"center", color:"#777", marginTop:"50px", fontSize:"1rem"}}>
                                                 No Parameters Defined
                                            </div>                                           
                                        </Grid>    
                                    )}

                                    {template.parameters && template.parameters.length > 0 && template.parameters.map((item => (
                                        <Grid item style={{marginTop:"10px", fontWeight:"500", height:"30px"}}>
                                            <Grid container direction="row" spacing={1} alignItems="center">
                                                <Grid item xs={3}>
                                                    {item.keyword}
                                                </Grid>
                                                <Grid item xs={3}>
                                                    {item.builtinValue}
                                                </Grid>
                                                <Grid item xs={3}>
                                                    {item.defaultValue}
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Tooltip title="Delete Parameter">
                                                        <IconButton onClick={() => deleteParameter(item.keyword)}>
                                                            <DeleteIcon color="primary" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    )))}
                            </Grid>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                             <div style={{fontSize:"1.2rem", color:"#777", fontWeight:"500", marginBottom:"50px"}}>
                                 Here you can set which SMSs (and when) should be sent to the patients automatically by the system :
                             </div>   
                             <Paper elevation={3}>
                            <Grid container direction="column" spacing={2} style={{minHeight:"300px", padding:"10px 15px"}}>
                                <Grid item>
                                    <FormControlLabel
                                        control={
                                        <Switch
                                            checked={template.sendWhenBookedCalendar}
                                            onChange={(e) => {settemplate({...template,sendWhenBookedCalendar : e.target.checked})}}
                                            name="check-whenbooked"
                                            color="primary"
                                        />
                                        }
                                          label={<span style={template.sendWhenBookedCalendar ? {fontWeight:"500",color:"#333" } : {color:"#777"}}>
                                                Automatically send this SMS to the patients when an appointment is booked on the calendar.
                                                </span> 
                                            }
                                    />
                                </Grid>
                                {template.sendWhenBookedCalendar && (
                                        <React.Fragment>
                                            <Grid item xs={12}>
                                                <Grid container alignItems="center" spacing={2}>
                                                    <Grid item>
                                                        <div style={{ fontSize: "1rem", color: "#777", fontWeight: "500" }}>
                                                            Please choose the <strong>clinic</strong> you want this email would be sent for:
                                                         </div>

                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        <FormControl
                                                            error={clinicError}
                                                            fullWidth required variant="outlined" className={classes.formControl}>
                                                            <InputLabel id="clinic">Select Clinic</InputLabel>
                                                            <Select
                                                                labelId="clinic"
                                                                id="clinic-id"
                                                                value={template.clinic || null}
                                                                onChange={(event) => {
                                                                    settemplate({...template, clinic: event.target.value})
                                                                    setClinicError(false)
                                                                }}
                                                                label="Select Clinic"
                                                            >
                                                                <MenuItem value={'All Clinics'}>All Clinics</MenuItem>
                                                                <MenuItem value={'Virtual Consultation'}>Virtual Consultation</MenuItem>
                                                                <MenuItem value={'F2F Clinic'}>F2F Clinic</MenuItem>
                                                                <MenuItem value={'Laser Theatre'}>Laser Theatre</MenuItem>
                                                                <MenuItem value={'Lens Theatre'}>Lens Theatre</MenuItem>
                                                                <MenuItem value={'Post Op'}>Post Op</MenuItem>
                                                                <MenuItem value={'Optometry'}>Optometry</MenuItem>

                                                            </Select>
                                                        </FormControl>

                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </React.Fragment>
                                    )}

                            </Grid>
                            </Paper>

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
                            {"Delete template"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText
                                style={{ color: "#000", fontWeight: "500" }}
                                id="alert-dialog-description"
                            >
                                <Grid container spacing={4}>
                                    <Grid item xs={12}>
                                        Are you sure you want to delete this template?
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            autoFocus
                                            name="templatenameuser"
                                            id="templatenameuser"
                                            label="Template Name"
                                            placeholder="Please Retype The Template Name"
                                            fullWidth
                                            required
                                            error={templatenameusererror}
                                            helperText={`* Please retype the template name you want to be deleted.`}
                                            value={templatenameuser}
                                            onChange={(event) => {
                                                settemplatenameuser(event.target.value)
                                            }}
                                            autoComplete="none"
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDeleteDialog} color="default">
                                Back
                                 </Button>
                            <Button onClick={deleteClicked} variant="contained" style={{ backgroundColor: "#d10202", color: "#fff" }}>
                                Yes, Delete this template
                                 </Button>
                        </DialogActions>
                    </Dialog>



                </Dialog>
            </React.Fragment>
        </React.Fragment>
    );
}
