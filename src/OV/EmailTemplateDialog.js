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
import templateService from "./services/EmailTemplateService";
import dateFormat from "dateformat";

import SaveIcon from '@material-ui/icons/Save';


import { EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {htmlToText} from 'html-to-text';
import {stateFromHTML} from 'draft-js-import-html';
import "./react-draft-wysiwyg.css";


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

export default function EmailTemplateDialog(props) {
    const classes = useStyles();

    const [state, setState] = React.useContext(GlobalState);

    const [template, settemplate] = React.useState({ formData: {} })
    const [saving, setSaving] = React.useState(false);


    const [templateIDError, settemplateIDError] = React.useState(false)
    const [nameError, setNameError] = React.useState(false)
    const [surnameError, setSurnameError] = React.useState(false)
    const [birthDateError, setBirthDateError] = React.useState(false)

    const [templateRepeated, settemplateRepeated] = React.useState(false)


    const [value, setValue] = React.useState(0);

    const [history, setHistory] = React.useState([]);
    const [backupFormData, setBackUpFormData] = React.useState(null);

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)


    // const [editorState, setEditorState] = React.useState(EditorState.createWithContent(stateFromHTML(`<p>...</p>`)))
    const [editorState, setEditorState] = React.useState(EditorState.createEmpty())

    const onEditorStateChange = (_editorState) =>
    {
        setEditorState(_editorState)
        const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        settemplate({...template, 
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
                settemplate({ ...props.template})
                const html = props.template.html
                const contentBlock = htmlToDraft(html);
                if (contentBlock) {
                    const contentState = ContentState.createFromBlockArray(
                      contentBlock.contentBlocks
                    );
                    const _editorState = EditorState.createWithContent(contentState);
                    setEditorState(_editorState)
                  }
            }
            else {
                const html = '<p style="font-size:16px">You can write your <strong>Text</strong> here ... 😀</p>';
                const contentBlock = htmlToDraft(html);
                if (contentBlock) {
                    const contentState = ContentState.createFromBlockArray(
                      contentBlock.contentBlocks
                    );
                    const _editorState = EditorState.createWithContent(contentState);
                    setEditorState(_editorState)
                    settemplate({...template, 
                                html: html,
                                rawText: htmlToText(html),
                     })             
                  }
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
    };

    const saveClicked = async () => {

        if (!validatetemplate()) {
            setValue(0)
            return
        }

        try {
            settemplateRepeated(false)
            setSaving(true)
            template.paremeters = JSON.stringify(template.parameters)
            if (props.template) {
                const res = await templateService.updateTemplate({ id: template._id, template: template })
                setSaving(false)
                if (res.data.status === "OK") {
                    setState(state => ({ ...state, templateDialogDataChanged: !state.templateDialogDataChanged }))
                    handleClose();
                }
            } else {
                const res = await templateService.registerNewTemplate({ template: template })
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

        setOpenDeleteDialog(false)

        setSaving(true)
        try {
            await templateService.deletetemplate(props.template._id)
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
        }

        if (!template.html || template.html.length === 0) {
            error = true
            setNameError(true)
        }

        if (!template.rawText || template.rawText.length === 0) {
            error = true
            setNameError(true)
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
                                settemplate({ ...template, formData: backupFormData })
                            } else {
                                settemplate({ ...template, formData: history[event.target.value - 1] })
                            }

                        }}

                    >
                        <MenuItem value={0}>{`${formatDate(template.formData.timeStamp)} ( Current )`}</MenuItem>

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
                    <AppBar className={classes.appBar} style={(selectedVersion > 0 && history && history.length > 0) ? { backgroundColor: "#777" } : {}} color="primary">
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                {props.title}
                            </Typography>


                            <Button startIcon={<SaveIcon />} variant="contained" color="secondary" onClick={saveClicked} disabled={selectedVersion > 0 && history && history.length > 0}>
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
                            <Tab label="Email Text" {...a11yProps(0)} />
                            <Tab label={`Parameters`} {...a11yProps(1)} />

                        </Tabs>
                        <TabPanel value={value} index={0}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        disabled={props.template}
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
                                <Grid item xs={12}>
                                        <Editor
                                            autoFocus
                                            editorState={editorState}
                                            wrapperClassName="demo-wrapper"
                                            editorClassName="demo-editor"
                                            onEditorStateChange={onEditorStateChange}
                                            />
                                </Grid>
                                {/* <Grid item xs={12}>
                                 <textarea
                                    disabled
                                    value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                                    />
                                </Grid> */}
                            </Grid>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
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
                                Are you sure you want to delete this template?
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
