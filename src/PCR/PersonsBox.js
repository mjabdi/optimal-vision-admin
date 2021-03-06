import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import GlobalState from './../GlobalState';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Button, Checkbox, FormControlLabel, Link, TextField, Tooltip } from '@material-ui/core';
import PDFService from './services/PDFService';

import {calculatePrice} from './PriceCalculator';


import bookingService from './services/BookService';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';

import {FormatDateFromString, RevertFormatDateFromString} from './DateFormatter';

import PrintIcon from '@material-ui/icons/Print';


const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor : "#373737",
    color: "#fff",
    padding : "1px",
    borderRadius : "4px",
    textAlign: "justify",
    paddingRight: "40px"
  },

  boxRed: {
    backgroundColor : "#dc2626",
    color: "#fff",
    padding : "1px",
    borderRadius : "4px",
    textAlign: "justify",
    paddingRight: "40px"
  },

  boxInfo: {
    textAlign: "justify",
    backgroundColor : "#fafafa",
    color: "#333",
    padding : "1px",
    borderRadius : "4px",
    paddingRight: "40px",
    border: "1px solid #eee",
  },

  ul: {
     listStyle: "none",
     padding: "0",
     margin: "0"
  },

  li: {
    marginBottom : "15px"
  },


  icon: {
    marginRight : "8px"
  },

  root: {
    width: '100%',
  },

  lineThrough:{
    textDecoration : "line-through",
  },



  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
    color: theme.palette.text.secondary,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
  },

  infoDetails:{
    textAlign: "left",
  },

  infoTitle:{
    fontWeight: "800",
    marginRight: "10px"
  },

  infoData:{
    fontWeight: "400",
  },

  title:
  {
    // textAlign : "center",
    // fontWeight : "500",
    // margin: "10px",
    // backgroundColor : "#eee",
    // padding : "10px",
    // borderRadius : "4px"
    textAlign: "center",
    fontWeight : "600",
    marginLeft: "10px",
    marginBottom: "5px"

  },

  Accordion:{
    backgroundColor : "#f5f5f5",
    color: "#222"
  },

  AccordionDeleted:{
    backgroundColor : "#aaa",
    color: "#555"
  },

  DownloadForm:{
      marginTop: "10px",
      marginBottom : "10px"
  },

  infoDataCharges:{
    fontSize : "18px",
    color: "green",
    fontWeight : "600"
  },

  infoDataChargesHigher:{
    fontSize : "18px",
    color: "red",
    fontWeight : "600"
  },
  BookedLabel:{
    color: "#606060",
    paddingRight: "10px",
    paddingLeft: "5px",
    paddingBottom: "3px",
    paddingTop: "3px",
    fontWeight: "800",
    borderLeft: "5px solid",
    borderColor: "#606060"
  },

  PatientAttendedLabel:{
    color: "#0066aa",
    paddingRight: "10px",
    paddingLeft: "5px",
    paddingBottom: "3px",
    paddingTop: "3px",
    fontWeight: "800",
    borderLeft: "5px solid",
    borderColor: "#0066aa"
  },

  SampleTakenLabel:{
    color: "#0066cc",
    paddingRight: "10px",
    paddingLeft: "5px",
    paddingBottom: "3px",
    paddingTop: "3px",
    fontWeight: "800",
    borderLeft: "5px solid",
    borderColor: "#0066cc"
  },

  ReportSentLabel:{
    color: "#009900",
    paddingRight: "10px",
    paddingLeft: "5px",
    paddingBottom: "3px",
    paddingTop: "3px",
    fontWeight: "800",
    borderLeft: "5px solid",
    borderColor: "#009900"
  },

  ReportCertSentLabel:{
    color: "#009900",
    paddingRight: "10px",
    paddingLeft: "5px",
    paddingBottom: "3px",
    paddingTop: "3px",
    fontWeight: "800",
    borderLeft: "5px solid",
    borderColor: "#009900"
  },

  PositiveLabel:{
    color: "red",
    paddingRight: "10px",
    paddingLeft: "5px",
    paddingBottom: "3px",
    paddingTop: "3px",
    fontWeight: "800",
    borderLeft: "5px solid",
    borderColor: "red"
  },


  EditButton:
  {
    marginBottom : "20px",
    backgroundColor : "#2f942e",
    "&:hover": {
      background: "green",
      color: "#fff"
    },
    textDecoration : "none !important",
    padding: "10px"   
  },

  RestoreButton:
  {
    marginBottom : "20px",
    backgroundColor : "#fafafa",
    color: "#555",
    "&:hover": {
      background: "#f1f1f1",
      color: "#111"
    },
    textDecoration : "none !important",
    padding: "10px"   
  },


  DeleteButton:
  {
    marginBottom : "20px",
    backgroundColor : "#d90015",
    "&:hover": {
      background: "#b80012",
      color: "#fff"
    },

    padding: "10px"
    
  },

  SaveButton:
  {
    marginBottom : "10px",
    padding: "10px",

    backgroundColor : "#d1175e",
    "&:hover": {
      background: "#bd0d50",
      color: "#fff"
    },

  },

  CancelButton:
  {
    marginBottom : "20px",
    // padding: "10px"
  },

  TextBox: {
    
    padding : "0px"

  },

  checkIcon:{
    color: "green",   
  },

  closeIcon:{
    color: "red"
  },

  centeredLabel : {
    display: "flex",
    alignItems: "center"
  }






}));




export default function PersonsBox() {
    const classes = useStyles();

    const [state, setState] = React.useContext(GlobalState);

    const [expanded, setExpanded] = React.useState('panel0');

    const [editMode, setEditMode] = React.useState({edit : false, person : null});
    const [deleteMode, setDeleteMode] = React.useState({delete : false, person : null});
    const [restoreMode, setRestoreMode] = React.useState({restore : false, person : null});

    const [saving, setSaving] =  React.useState(false);
    const [deleting, setDeleting] =  React.useState(false);
    const [restoring, setRestoring] =  React.useState(false);

    const [validationError, setValidationError] = React.useState({});


    const [bookingDate, setBookingDate] = React.useState('');
    const [bookingTime, setBookingTime] = React.useState('');

    const [gender, setGender] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [forename, setForename] = React.useState('');
    const [surname, setSurnme] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [dob, setDOB] = React.useState('');
    const [tel, setTel] = React.useState('');
    const [postCode, setPostCode] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [notes, setNotes] = React.useState('');
    const [passport, setPassport] = React.useState('');
    const [passport2, setPassport2] = React.useState('');
    const [certificate, setCertificate] = React.useState(false);
    const [antiBodyTest, setAntiBodyTest] = React.useState(false);


    const bookingDateChanged = (event) =>
    {
      setBookingDate(event.target.value);
      setValidationError({...validationError, bookingDateError : false});
    }

    const bookingTimeChanged = (event) =>
    {
      setBookingTime(event.target.value);
      setValidationError({...validationError, bookingTimeError : false});
    }

    const genderChanged = (event) =>
    {
      setGender(event.target.value);
    }

    const titleChanged = (event) =>
    {
      setTitle(event.target.value);
    }

    const forenameChanged = (event) =>
    {
      setForename(event.target.value);
    }

    const surnameChanged = (event) =>
    {
      setSurnme(event.target.value);
    }

    const emailChanged = (event) =>
    {
      setEmail(event.target.value);
    }

    const dobChanged = (event) =>
    {
      setDOB(event.target.value);
      setValidationError({...validationError, dobError : false});
    }

    const telChanged = (event) =>
    {
      setTel(event.target.value);
    }

    const postCodeChanged = (event) =>
    {
      setPostCode(event.target.value);
    }

    const addressChanged = (event) =>
    {
      setAddress(event.target.value);
    }

    const passportChanged = (event) =>
    {
      setPassport(event.target.value);
    }

    const passport2Changed = (event) =>
    {
      setPassport2(event.target.value);
    }

    const certificateChanged = (event) =>
    {
      setCertificate(event.target.checked);
    }

    const antiBodyTestChanged = (event) =>
    {
      setAntiBodyTest(event.target.checked);
    }


    const handleChange = (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    };

    const getStatusLabel = (status) => {
      if (status === 'booked')
      {
        return (
          <span className={classes.BookedLabel}> Booking Made </span>
        );
    
      }else if (status === 'patient_attended')
      {
        return (
          <span  className={classes.PatientAttendedLabel}> Patient Attended </span>
        );
    
      }else if (status === 'sample_taken')
      {
        return (
          <span  className={classes.SampleTakenLabel}> Sample Taken </span>
        );
    
      }else if (status === 'report_sent')
      {
        return (
          <span  className={classes.ReportSentLabel}> Report Sent </span>
        );
    
      }else if (status === 'report_cert_sent')
      {
        return (
          <span  className={classes.ReportCertSentLabel}> {`Report & Certificate Sent`} </span>
        );
      }
      else if (status === 'positive')
      {
        return (
          <span  className={classes.PositiveLabel}> {`POSITIVE`} </span>
        );
    
      }
      else{
        return 'Unknown';
      }
    }

   const downloadForm1 = (id) =>
   {
       PDFService.downloadCovidForm1(id).then( (res) => 
       {
          const file = new Blob(
            [res.data], 
            {type: 'application/pdf'});

          const fileURL = URL.createObjectURL(file);   
          window.open(fileURL, "_blank");

       }).catch( (err) =>
       {
           console.log(err);
       });
   }

   const downloadForm2 = (id) =>
   {
        PDFService.downloadCovidForm2(id).then( (res) => 
        {
          const file = new Blob(
            [res.data], 
            {type: 'application/pdf'});

          const fileURL = URL.createObjectURL(file);   
          window.open(fileURL, "_blank");

        setState(state => ({...state, RefreshPersonInfo : !state.RefreshPersonInfo}));

        }).catch( (err) =>
        {
            console.log(err);
        });
   }

   const downloadLabResults = (id) =>
   {
        PDFService.downloadPdfResult(id).then( (res) => 
        {
          const file = new Blob(
            [res.data], 
            {type: 'application/pdf'});

          const fileURL = URL.createObjectURL(file);   
          window.open(fileURL, "_blank");

        }).catch( (err) =>
        {
            console.log(err);
        });
   }

   const downloadCertificate = (id) =>
   {
        PDFService.downloadPdfCert(id).then( (res) => 
        {
          const file = new Blob(
            [res.data], 
            {type: 'application/pdf'});

          const fileURL = URL.createObjectURL(file);   
          window.open(fileURL, "_blank");

        }).catch( (err) =>
        {
            console.log(err);
        });
   }

   const handleEditModeChanged = (edit, person) => {

       if (edit)
       {
         setForename(person.forenameCapital);
         setSurnme(person.surnameCapital);
         setBookingDate(FormatDateFromString(person.bookingDate));
         setBookingTime(person.bookingTime.toUpperCase());
         setGender(person.gender.toUpperCase());
         setTitle(person.title.toUpperCase());
         setEmail(person.email.toUpperCase());
         setDOB(FormatDateFromString(person.birthDate));
         setTel(person.phone.toUpperCase());
         setPostCode(person.postCode.toUpperCase());
         setAddress(person.address.toUpperCase());
         if (person.notes)
         {
          setNotes(person.notes.toUpperCase());
         }
        
         if (person.passportNumber)
         {
           setPassport(person.passportNumber.toUpperCase());
         }
        
         if (person.passportNumber2)
         {
           setPassport2(person.passportNumber2.toUpperCase());
         }
        
         setCertificate(person.certificate);
         setAntiBodyTest(person.antiBodyTest);

         setEditMode({edit: edit, person: person});

       }
       else if (!edit && !person)
       {
         setEditMode({edit: edit, person: person});
       }
       else if (!edit && person)
       {
          const booking = {};
          const bookingId = person._id;
          booking.certificate = certificate;
          booking.antiBodyTest = antiBodyTest;
          booking.gender = gender;
          booking.title = title;
          booking.birthDate = RevertFormatDateFromString(dob);
          booking.email = email;
          booking.phone = tel;
          booking.postCode = postCode;
          booking.address = address;
          booking.passportNumber = passport;
          booking.passportNumber2 = passport2;
          booking.forename = forename;
          booking.surname = surname;
          booking.notes = notes;
          booking.bookingDate = RevertFormatDateFromString(bookingDate);
          booking.bookingTime = bookingTime;
          booking.bookingRef = person.bookingRef;

          if  (validateBooking(booking))
          {
            updateBooking({bookingId: bookingId, person: booking});
          }
       }
   }

   const validateDate = (str) =>
   {
     var error = false;
     if (!str || str.length !== 10)
     {
       error = true;
     }

     if (str.charAt(4) !== '-'  || str.charAt(7) !== '-')
     {
       error = true;
     }

     try
     {
       
       const result = /^\d{4}-\d{2}-\d{2}$/.test(str);
       if (!result)
       {
          error = true;
       }

       const year = parseInt(str.substr(0,4));
       const month = parseInt(str.substr(5,2));
       const day = parseInt(str.substr(8,2));

       if (year < 1900)
       {
          error = true;
       }

       if (month < 1 || month > 12)
       {
         error = true;
       }        

       if (day > 31)
       {
         error = true;
       }

     }catch(err)
     {
       error = true;
     }



     return !error;
   }

   const validateTime =(str) =>
   {
     var error = false;

     const result = /^\d{2}:\d{2} AM$|^\d{2}:\d{2} PM$/.test(str);
     if (!result)
     {
        error = true;
     }

     try{
       const hour = parseInt(str.substr(0,2));
       const minute = parseInt(str.substr(3,2));

       if (hour < 0 || hour > 12)
       {
         error = true;
       }

       if (minute < 0 || minute > 59)
       {
         error = true;
       }

     }catch(err)
     {
       error = true;
     }

     return !error;
   }

   const validateBooking = (booking) =>
   {
      var error = false;

      if (!validateDate(booking.bookingDate))
      {
        error = true;
        setValidationError({...validationError, bookingDateError : true});
      }

      if (!validateDate(booking.birthDate))
      {
        error = true;
        setValidationError({...validationError, dobError : true});
      }

      if (!validateTime(booking.bookingTime))
      {
        error = true;
        setValidationError({...validationError, bookingTimeError : true});
      }
     

      return !error;
   }

   const updateBooking = (payload) =>
   {
       setSaving(true);
       bookingService.updateBooking(payload).then( (res) => {
        setSaving(false);
        setEditMode({edit: false, person: null});
        setState(state => ({...state, RefreshPersonInfo : !state.RefreshPersonInfo}));

       }).catch ( (err) => {
         setSaving(false);
         setEditMode({edit: false, person: null});
         console.log(err);
       });
   }

   const deleteBooking = (id) =>
   {
       setDeleting(true);
       bookingService.deleteBooking(id).then( (res) => {
        setDeleting(false);
        setDeleteMode({delete: false, person: null});
        setState(state => ({...state, RefreshPersonInfo : !state.RefreshPersonInfo}));

       }).catch ( (err) => {
          setDeleting(false);
          setDeleteMode({delete: false, person: null});
         console.log(err);
       });
   }

   const restoreBooking = (id) =>
   {
       setRestoring(true);
       bookingService.unDeleteBooking(id).then( (res) => {
        setRestoring(false);
        setRestoreMode({restore: false, person: null});
        setState(state => ({...state, RefreshPersonInfo : !state.RefreshPersonInfo}));

       }).catch ( (err) => {
        setRestoring(false);
        setRestoreMode({restore: false, person: null});
         console.log(err);
       });
   }

   const changeBackToBookingMade = (event, id) =>
   {
     setSaving(true);
     bookingService.changeBackToBookingMade(id).then(res => {
       setSaving(false);
       setState(state => ({...state, RefreshPersonInfo : !state.RefreshPersonInfo}));
     }).catch(err => {
       console.log(err);
       setSaving(false);
     })
   }



   const handleDeleteModeChanged = (del, person) => {

    if (del)
    {
      setDeleteMode({delete: del, person: person});
    }
    else if (!del && !person)
    {
      setDeleteMode({delete: del, person: person});
    }
    else if (!del && person)
    {
        deleteBooking(person._id);
    }
  }

  const handleRestoreModeChanged = (restore, person) => {

    if (restore)
    {
      setRestoreMode({restore: restore, person: person});
    }
    else if (!restore && !person)
    {
      setRestoreMode({restore: restore, person: person});
    }
    else if (!restore && person)
    {
        restoreBooking(person._id);
    }
  }

  return (
    <React.Fragment>
          
      <Grid container direction="column" spacing={1} justify="flex-start"  alignItems="stretch">
          <div className={classes.title}> Following Records Found :</div>

          {state.foundRecords.map((person,index) => (
   
                <Grid item xs={12} md={12} key={`panel${index}`}>
                <div className={classes.root}>
                    <Accordion className={person.deleted ? classes.AccordionDeleted : classes.Accordion} expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
                    <AccordionSummary className={person.deleted ? classes.lineThrough : ''}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id={`panel${index}bh-header`}
                    >
                      {person.deleted && (
                          <Tooltip  title="This record has been deleted.">
                            <DeleteIcon  style={{padding: 0, margin: 0,  color: "#fff", fontSize: 25 }}/>
                        </Tooltip>
                      )}

                        <Typography className={classes.heading}> {`#${index+1}`} </Typography>
                        <Typography className={classes.secondaryHeading}>
                        {`${person.forenameCapital} ${person.surnameCapital}`}
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails className={classes.infoDetails}>
                        


                        <ul className={classes.ul}>

                        {/* Restore Functionality ******************************************* */}  
                        <li hidden={!(restoreMode.restore && restoreMode.person._id  === person._id)}>
                              <div style={{fontWeight: "500", paddingBottom: "5px", paddingLeft: "5px", fontSize:"16px" , color:"#fff"}}>
                                Are you sure you want to restore this record?
                              </div>
                            </li>

                            <li hidden={!person.deleted || (restoreMode.restore && restoreMode.person._id === person._id)}>
                                 <Button
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick = {() => {handleRestoreModeChanged(true, person)}}
                                    className={classes.RestoreButton}
                                 >
                                   Restore This Record
                                </Button>
                            </li>

                            <li hidden={!(restoreMode.restore && restoreMode.person._id  === person._id)}>
                                 <Button
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    disabled = {restoring}
                                    onClick = {() => {handleRestoreModeChanged(false, person)}}
                                    className={classes.SaveButton}
                                 >
                                    YES, Restore this!
                                </Button>
                            </li>

                            <li hidden={!(restoreMode.restore && restoreMode.person._id  === person._id)}>
                                 <Button
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    color="default"
                                    disabled = {restoring}
                                    onClick = {() => {handleRestoreModeChanged(false, null)}}
                                    className={classes.CancelButton}
                                 >
                                    Cancel
                                </Button>
                            </li>

                           {/*  ******************************************************************* */}

                              {/* Edit Functionality ******************************************* */}

                            <li hidden={person.deleted || deleteMode.delete || (editMode.edit && editMode.person._id === person._id)}>
                                 <Button
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick = {() => {handleEditModeChanged(true, person)}}
                                    className={classes.EditButton}
                                 >
                                    Edit Booking Info
                                </Button>
                            </li>

                            <li hidden={!(editMode.edit && editMode.person._id  === person._id)}>
                                 <Button
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    disabled = {saving}
                                    onClick = {() => {handleEditModeChanged(false, person)}}
                                    className={classes.SaveButton}
                                 >
                                    Save Changes
                                </Button>
                            </li>

                            <li hidden={!(editMode.edit && editMode.person._id === person._id)}>
                                 <Button
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    color="default"
                                    disabled = {saving}
                                    onClick = {() => {handleEditModeChanged(false, null)}}
                                    className={classes.CancelButton}
                                 >
                                    Cancel
                                </Button>
                            </li>
                            
                            {/* ****************************************************************************************** */}


                            {/* Delete Functionality ******************************************* */}

                            <li hidden={!(deleteMode.delete && deleteMode.person._id  === person._id)}>
                              <div style={{fontWeight: "600",  paddingBottom: "5px", paddingLeft: "5px", fontSize:"16px"}}>
                                Are you sure you want to delete this record?
                              </div>
                            </li>

                            <li hidden={person.deleted ||  editMode.edit || (deleteMode.delete && deleteMode.person._id === person._id)}>
                                 <Button
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick = {() => {handleDeleteModeChanged(true, person)}}
                                    className={classes.DeleteButton}
                                 >
                                   Delete This Record
                                </Button>
                            </li>

                            <li hidden={!(deleteMode.delete && deleteMode.person._id  === person._id)}>
                                 <Button
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    disabled = {deleting}
                                    onClick = {() => {handleDeleteModeChanged(false, person)}}
                                    className={classes.SaveButton}
                                 >
                                    YES, Delete this!
                                </Button>
                            </li>

                            <li hidden={!(deleteMode.delete && deleteMode.person._id === person._id)}>
                                 <Button
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    color="default"
                                    disabled = {deleting}
                                    onClick = {() => {handleDeleteModeChanged(false, null)}}
                                    className={classes.CancelButton}
                                 >
                                    Cancel
                                </Button>
                            </li>
                                 
                            {/* ****************************************************************************************** */}

                            <li className={classes.li}>
                                <span className={classes.infoTitle}>BOOKED DATE</span> 
                            

                                <span hidden={(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>
                                   {FormatDateFromString(person.bookingDate) }
                                  </span>  
                                        <span hidden={!(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>
                                          <TextField 
                                                      fullWidth
                                                      error={validationError.bookingDateError}
                                                      className={classes.TextBox} 
                                                      value={bookingDate}
                                                      onChange = {bookingDateChanged}
                                                      inputProps= {{
                                                          style:{
                                                            padding: 0
                                                          }
                                                        }
                                                      }
                                                      > 
                                          </TextField> 
                                        </span> 


                            </li>

                            <li className={classes.li}>
                                <span className={classes.infoTitle}>BOOKED TIME</span> 
                                <span hidden={(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>{person.bookingTime.toUpperCase()}</span>  
                                        <span hidden={!(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>
                                          <TextField 
                                                      fullWidth
                                                      error={validationError.bookingTimeError}
                                                      className={classes.TextBox} 
                                                      value={bookingTime}
                                                      onChange = {bookingTimeChanged}
                                                      inputProps= {{
                                                          style:{
                                                            padding: 0
                                                          }
                                                        }
                                                      }
                                                      > 
                                          </TextField> 
                                        </span> 


                            </li>

                            <li className={classes.li}>
                            <span className={classes.infoTitle}>GENDER</span> 
                                        <span hidden={(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>{person.gender?.toUpperCase()}</span>  
                                        <span hidden={!(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>
                                          <TextField 
                                                      fullWidth
                                                      className={classes.TextBox} 
                                                      value={gender}
                                                      onChange = {genderChanged}
                                                      inputProps= {{
                                                          style:{
                                                            padding: 0
                                                          }
                                                        }
                                                      }
                                                      > 
                                          </TextField> 
                                        </span> 
                            </li>
                            <li className={classes.li}>
                            <span className={classes.infoTitle}>TITLE</span> 
                                       <span hidden={(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>{person.title?.toUpperCase()}</span>  
                                        <span hidden={!(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>
                                          <TextField 
                                                      fullWidth
                                                      className={classes.TextBox} 
                                                      value={title}
                                                      onChange = {titleChanged}
                                                      inputProps= {{
                                                          style:{
                                                            padding: 0
                                                          }
                                                        }
                                                      }
                                                      > 
                                          </TextField> 
                                        </span> 
                             
                            </li>
                            <li className={classes.li}>
                            <span className={classes.infoTitle}>FORENAME</span> 
                                        <span hidden={(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>{person.forenameCapital}</span>  
                                        <span hidden={!(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>
                                        <TextField 
                                                      fullWidth
                                                      className={classes.TextBox} 
                                                      value={forename}
                                                      onChange = {forenameChanged}
                                                      inputProps= {{
                                                          style:{
                                                            padding: 0
                                                          }
                                                        }
                                                      }
                                                      > 
                                          </TextField> 
                                        </span> 
                            </li>
                            <li className={classes.li}>
                                <span className={classes.infoTitle}>SURNAME</span>
                                        <span hidden={(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>{person.surnameCapital}</span>  
                                        <span hidden={!(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>
                                        <TextField 
                                                      fullWidth
                                                      className={classes.TextBox} 
                                                      value={surname}
                                                      onChange = {surnameChanged}
                                                      inputProps= {{
                                                          style:{
                                                            padding: 0
                                                          }
                                                        }
                                                      }
                                                      > 
                                          </TextField> 
                                        </span>   
                            </li>
                            <li className={classes.li}>
                                <span className={classes.infoTitle}>EMAIL</span> 
                                       <span hidden={(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>{person.email?.toUpperCase()}</span>  
                                        <span hidden={!(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>
                                        <TextField 
                                                      fullWidth
                                                      className={classes.TextBox} 
                                                      value={email}
                                                      onChange = {emailChanged}
                                                      inputProps= {{
                                                          style:{
                                                            padding: 0
                                                          }
                                                        }
                                                      }
                                                      > 
                                          </TextField> 
                                        </span>   
                            </li>
                            <li className={classes.li}>
                                <span className={classes.infoTitle}>D.O.B</span>
                                        <span hidden={(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>
                                            {FormatDateFromString(person.birthDate) }
                                          </span>  
                                        <span hidden={!(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>
                                        <TextField 
                                                      fullWidth
                                                      error={validationError.dobError} 
                                                      className={classes.TextBox} 
                                                      value={dob}
                                                      onChange = {dobChanged}
                                                      inputProps= {{
                                                          style:{
                                                            padding: 0
                                                          }
                                                        }
                                                      }
                                                      > 
                                          </TextField> 
                                        </span>   
                            </li>
                            <li className={classes.li}>
                                <span className={classes.infoTitle}>TEL</span>
                                 <span hidden={(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>{person.phone?.toUpperCase()}</span>  
                                        <span hidden={!(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>
                                        <TextField 
                                                      fullWidth
                                                      className={classes.TextBox} 
                                                      value={tel}
                                                      onChange = {telChanged}
                                                      inputProps= {{
                                                          style:{
                                                            padding: 0
                                                          }
                                                        }
                                                      }
                                                      > 
                                          </TextField> 
                                        </span>  
                            </li>
                            <li className={classes.li}>
                                <span className={classes.infoTitle}>POST CODE</span> 
                                        <span hidden={(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>{person.postCode?.toUpperCase()}</span>  
                                        <span hidden={!(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>
                                        <TextField 
                                                      fullWidth
                                                      className={classes.TextBox} 
                                                      value={postCode}
                                                      onChange = {postCodeChanged}
                                                      inputProps= {{
                                                          style:{
                                                            padding: 0
                                                          }
                                                        }
                                                      }
                                                      > 
                                          </TextField> 
                                        </span>  
                            </li>
                            <li className={classes.li}>
                                <span className={classes.infoTitle}>ADDRESS</span> 
                                        <span hidden={(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>{person.address?.toUpperCase()}</span>  
                                        <span hidden={!(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>
                                        <TextField 
                                                      fullWidth
                                                      className={classes.TextBox} 
                                                      value={address}
                                                      onChange = {addressChanged}
                                                      inputProps= {{
                                                          style:{
                                                            padding: 0
                                                          }
                                                        }
                                                      }
                                                      > 
                                          </TextField> 
                                        </span>  
                            </li>

                            <li className={classes.li}>
                                <span className={classes.infoTitle}>PASSPORT NO.</span>
                                <span hidden={(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>{person.passportNumber?.toUpperCase()}</span>  
                                        <span hidden={!(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>
                                        <TextField 
                                                      fullWidth
                                                      className={classes.TextBox} 
                                                      value={passport}
                                                      onChange = {passportChanged}
                                                      inputProps= {{
                                                          style:{
                                                            padding: 0
                                                          }
                                                        }
                                                      }
                                                      > 
                                          </TextField> 
                                        </span>  
                            </li>

                            <li className={classes.li}>
                                <span className={classes.infoTitle}>SECOND PASSPORT NO.</span> 
                                        <span hidden={(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>{person.passportNumber2?.toUpperCase()}</span>  
                                        <span hidden={!(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>
                                        <TextField 
                                                      fullWidth
                                                      className={classes.TextBox} 
                                                      value={passport2}
                                                      onChange = {passport2Changed}
                                                      inputProps= {{
                                                          style:{
                                                            padding: 0
                                                          }
                                                        }
                                                      }
                                                      > 
                                          </TextField> 
                                        </span>   
                            </li>

                            <li className={classes.li}>
                                <span className={classes.infoTitle}>REQUEST FOR CERTIFICATE</span> 
                                <span hidden={(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>{person.certificate ? ( <CheckIcon className={classes.checkIcon}/> ) :  <CloseIcon className={classes.closeIcon}/> }</span>
                                <span hidden={!(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>
                                    <FormControlLabel className={classes.formControl} 
                                          control={<Checkbox className={classes.formControl}  color="secondary" name="certificate" checked={certificate} onChange={certificateChanged} />}
                                          label=''
                                        />
                                </span>    
                            </li>
                            <li className={classes.li}>
                                <span className={classes.infoTitle}>REQUEST FOR ANTIBODY TEST</span>
                                <span hidden={(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>{person.antiBodyTest ? <CheckIcon className={classes.checkIcon}/> :  <CloseIcon className={classes.closeIcon}/> }</span>  
                                <span hidden={!(editMode.edit && editMode.person._id  === person._id)} className={classes.infoData}>
                                    <FormControlLabel className={classes.formControl} 
                                          control={<Checkbox className={classes.formControl}  color="secondary" name="certificate" checked={antiBodyTest} onChange={antiBodyTestChanged} />}
                                          label=''
                                        />
                                </span>   
                            </li>
                            <li className={classes.li}>
                                <span className={classes.infoTitle}>STATUS</span> 
                                {getStatusLabel(person.status)} 
                                
                                {person.status === "sample_taken" &&
                                          !(
                                            editMode.edit && editMode.person._id === person._id
                                          ) && (
                                            <Button 
                                                  variant="outlined"
                                                  color="primary"
                                                  disabled = {saving}
                                                  onClick = {event => changeBackToBookingMade(event,person._id)}

                                                    >
                                              Change Back To Booking Made
                                            </Button>
                                          )}

                            </li>
      
                            <li className={classes.li}>
                                <span className={classes.infoTitle}>TOTAL CHARGES</span> <span className={calculatePrice(person) <= 199 ? classes.infoDataCharges : classes.infoDataChargesHigher}>{`£${calculatePrice(person)}`}</span>  
                            </li>

                            <li  hidden={person.deleted} >
                                 <Button
                                    startIcon = {<PrintIcon/>}
                                    type="button"
                                    fullWidth
                                    variant="outlined"
                                    color="primary"
                                    onClick = {() => {downloadForm1(person._id)}}
                                    // onTouchTap = {() => {downloadForm1(person._id)}}
                                    className={classes.DownloadForm}
                                 >
                                    Download Registration Form
                                </Button>
                            </li>

                            <li  hidden={person.deleted}>
                                  <Button
                                    startIcon = {<PrintIcon/>}
                                    type="button"
                                    fullWidth
                                    variant="outlined"
                                    color="primary"
                                    onClick = {() => {downloadForm2(person._id)}}
                                    // onTouchTap = {() => {downloadForm2(person._id)}}
                                    className={classes.DownloadForm}
                                    >
                                    Download Lab Form
                                 </Button>
                            </li>

                            <li hidden={ person.deleted || (person.status !== 'report_sent' && person.status !== 'report_cert_sent') }>
                                 <Button
                                    startIcon = {<PrintIcon/>}
                                    type="button"
                                    fullWidth
                                    variant="outlined"
                                    color="primary"
                                    onClick = {() => {downloadLabResults(person._id)}}
                                    // onTouchTap = {() => {downloadForm1(person._id)}}
                                    className={classes.DownloadForm}
                                 >
                                    Download Lab Results
                                </Button>
                            </li>

                            <li hidden={person.deleted || person.status !== 'report_cert_sent'}>
                                 <Button
                                    startIcon = {<PrintIcon/>}
                                    type="button"
                                    fullWidth
                                    variant="outlined"
                                    color="primary"
                                    onClick = {() => {downloadCertificate(person._id)}}
                                    // onTouchTap = {() => {downloadForm1(person._id)}}
                                    className={classes.DownloadForm}
                                 >
                                    Download Certificate
                                </Button>
                            </li>

                        </ul>

                    </AccordionDetails>
                    </Accordion>
                </div>
            </Grid> 
          ))}
    </Grid>
    </React.Fragment>
  );
}
