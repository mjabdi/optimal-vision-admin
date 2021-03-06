import React, {useEffect, useRef, useState} from 'react';
import BookService from './services/BookService';
import Typography from '@material-ui/core/Typography';
import { Backdrop, Button, Checkbox, CircularProgress, Divider, FormControlLabel, Grid, InputLabel, Link, makeStyles, MenuItem, Select, TextField, Tooltip } from '@material-ui/core';
import GlobalState from './../GlobalState';
import { withStyles } from '@material-ui/core/styles';


import CreditCardIcon from '@material-ui/icons/CreditCard';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import DialogTitle from '@material-ui/core/DialogTitle';
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';

import Alert from '@material-ui/lab/Alert';

import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { corporates } from './Corporates';

var interval;

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(1),

  },
  
  refreshButton:{
    marginLeft: theme.spacing(2),
  },

  checkIcon:{
    color: "green"
  },

  closeIcon:{
    color: "red"
  },

  RefLink: {
    cursor: "pointer"
  },

  BookedLabel:{
    backgroundColor: "#606060",
    color: "#fff",
    paddingRight: "10px",
    paddingLeft: "10px"
  },

  PatientAttendedLabel:{
    backgroundColor: "#0066aa",
    color: "#fff",
    paddingRight: "15px",
    paddingLeft: "10px"
  },

  SampleTakenLabel:{
    backgroundColor: "#0066cc",
    color: "#fff",
    paddingRight: "40px",
    paddingLeft: "10px"
  },

  ReportSentLabel:{
    backgroundColor: "#009900",
    color: "#fff",
    paddingRight: "90px",
    paddingLeft: "10px"
  },

  ReportCertSentLabel:{
    backgroundColor: "#009900",
    color: "#fff",
    paddingRight: "68px",
    paddingLeft: "10px"
  },

  archiveButton: {

  },

  smartMatchButton: {
    backgroundColor : "#2f942e",
    "&:hover": {
      background: "green",
      color: "#fff"
    },
    textDecoration : "none !important",
    marginRight : "10px"
    // padding: "10px"  
  },

  infoTitle:  {
    fontWeight: "400"
  },

  infoData: {
    paddingLeft: "10px",
    fontWeight: "800"
  },

  matchButton:
  {
    marginTop: "30px",
    marginBottom : "20px",
    backgroundColor : "#2f942e",
    "&:hover": {
      background: "green",
      color: "#fff"
    },
    textDecoration : "none !important",
    padding: "10px",
    paddingLeft : "50px",
    paddingRight: "50px"   
  },

  resendButton:
  {
    marginTop: "5px",
    marginBottom : "5px",
    backgroundColor : "#2f942e",
    "&:hover": {
      background: "green",
      color: "#fff"
    },
    textDecoration : "none !important",
    padding: "10px",
    paddingLeft : "50px",
    paddingRight: "50px"   
  },

  resendFilesButton:{
    marginTop: "5px",
    marginBottom : "5px",
    backgroundColor : "#3792ad",
    "&:hover": {
      background: "#2f798f",
      color: "#fff"
    },
    textDecoration : "none !important",
    padding: "10px",
    paddingLeft : "50px",
    paddingRight: "50px"   
  },

  cancelButton:
  {
    marginBottom : "10px",
    textDecoration : "none !important",
    padding: "10px",
    paddingLeft : "90px",
    paddingRight: "90px"   
  },
  
  backdrop: {
    zIndex: theme.zIndex.drawer + 5,
    color: "#fff",
  },
  
}));

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: "#cedbce" //theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#2f942e',
  },
}))(LinearProgress);
function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <BorderLinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography style={{fontWeight:"800", color :  "#5e855e"  }} variant="body2" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
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
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}



export default function PayDialog(props) {
  
  const classes = useStyles();

  const [state, setState] = React.useContext(GlobalState);  
  const [paymentMethod, setPaymentMethod] = useState('credit card');
  const [corporate, setCorporate] = useState(corporates[0]);
  const [saving, setSaving] = useState(false);

  const paymentMethodChanged = (event) =>
  {
    setPaymentMethod(event.target.value);
  }

  const handleClose = () =>
  {
      if (saving)
        return;

      props.handleClose();  
      setPaymentMethod('credit card');
      setCorporate(corporates[0]);
      setSaving(false);
  }

  const corporateChanged = (event) =>
  {
    setCorporate(event.target.value);
  }

  const payClicked = async () =>
  {
    setSaving(true);

    try
    {
         await BookService.payBooking(props.booking._id,paymentMethod, paymentMethod === 'corporate' ? corporate : '');
         setSaving(false);
         setState(state => ({...state, bookingPayChanged : !state.bookingPayChanged ? true : false}));
         handleClose();
    }
    catch(err)
    {
        console.error(err);
        setSaving(false);
    }

  }


  return (
    <React.Fragment>

        {props.booking && ( 

                <React.Fragment>
<Dialog
maxWidth="800px"
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
      <CreditCardIcon
        style={{ color: "#f50057", fontSize: "3rem" }}
      />
    </Grid>

    <Grid item>
      <div
        style={{
          color: "#f50057",
          paddingBottom: "10px",
          fontWeight: "800",
        }}
      >
        {" "}
        PAY the CHARGE{" "}
      </div>
    </Grid>
  </Grid>

  <Divider />
</DialogTitle>
<DialogContent>
  <div
    style={{
      height: "270px",
    
    }}
  >
        <Grid
          container
          direction="column"
          justify="space-between"
          spacing = {2}
          alignItems="flex-start"
        >
            <Grid item>
               <div style={{fontSize: "17px"}}> How do you want to pay? </div> 
            </Grid>

            <Grid item>
      
            <FormControl component="fieldset">
                
                <RadioGroup aria-label="paymentMethod" name="paymentMethod" value={paymentMethod} onChange={paymentMethodChanged}>
                    <FormControlLabel value="credit card" control={<Radio />} label="Credit Card" />
                    <FormControlLabel value="cash" control={<Radio />} label="Cash" />
                    <FormControlLabel value="corporate" control={<Radio />} label="Corporate" />
                </RadioGroup>

                { paymentMethod === 'corporate' && (

                        <FormControl style={{marginTop: "10px"}} className={classes.formControl}>
                        <Select
                            labelId="select-corporate"
                            id="select-corporate-id"
                            value={corporate}
                            onChange={corporateChanged}
                        >
                        {
                        corporates.map(element => (
                                    <MenuItem value={element}>{`${element}`}</MenuItem>
                        ))
                        }     

                        </Select>
                    </FormControl>

                )}
              

                </FormControl>
            </Grid>


        </Grid>

        <Grid item>
           
    </Grid>

    <div style={{position:"absolute", bottom:"20px", right:"20px"}}>
            <Grid
                container
                direction="row"
                justify="flex-end"
                alignItems="center"
                spacing = {1}
            >
               
                <Grid item>
                    <Button onClick={handleClose}  style= {{width : '100px'}} disabled={saving}>
                        back
                    </Button>
                        
                </Grid>
                <Grid item>
                    <Button 
                        onClick = {payClicked}
                        variant="contained"
                        color="secondary"
                        style= {{width : '100px'}}
                        disabled={saving}
                    >
                        Pay
                    </Button>
                </Grid>  
          </Grid>

    </div>

    
  </div>

             <Backdrop
                className={classes.backdrop}
                open={saving}
              >
                <CircularProgress color="inherit" />
              </Backdrop>

</DialogContent>
</Dialog>




</React.Fragment>


        )}
  
    </React.Fragment>
  );
}