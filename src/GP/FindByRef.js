import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import GlobalState from './../GlobalState';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import { FormControl, Grid, Input, InputLabel } from '@material-ui/core';
import BookService from './services/BookService';
import PersonsBox from './PersonsBox';
import { width } from '@material-ui/system';


const isBoolean = (param) => typeof(param) === "boolean"

const useFocus = (initialFocus = false, id = "") => {
    const [focus, setFocus] = React.useState(initialFocus)
    const setFocusWithTrueDefault = (param) => setFocus(isBoolean(param)? param : true)
    return ([
        setFocusWithTrueDefault, {
            autoFocus: focus,
            key: `${id}${focus}`,
            onFocus: () => setFocus(true),
            onBlur: () => setFocus(false),
        },
    ])
}


function TextMaskCustom(props) {
    const { inputRef, ...other } = props;
  
    return (
      <MaskedInput
        {...other}
        ref={(ref) => {
          inputRef(ref ? ref.inputElement : null);
        }}
        mask={[/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
        // placeholderChar={'\u2000'}
        showMask
      />
    );
  }
  
  TextMaskCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
  };



const useStyles = makeStyles((theme) => ({

    root: {
        width: '100%',
        '& > * + *': {
          marginTop: theme.spacing(2),
        },
        marginTop: "20px"
      },  

    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },

    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },

    Find: {
        width: "80px"
    },

    Clear:{
        marginRight: "20px"
    },

    title:{
        marginTop : "20px"
    },

    TextBox:{
        marginTop: "30px",
        "& > *" :
        {
            textAlign: "center"
        },
  
    },

    TextField:{

    },

    NoRecordsFound:{
        marginTop: "20px",
        color: "red",
        fontWeight: "600",
        fontSize: "14px",
    },

    PersonsBox:{
        marginTop : "20px",
        marginBottom: "50px",
    }

}));

export default function FindByRef() {
  const classes = useStyles();
  const [state, setState] = React.useContext(GlobalState);
  
  const [setFocus, focusProps] = useFocus(true);

//   useEffect( () =>
//   {
//      findRecords();
//   }, [state.findRecords]);

 useEffect ( () => {
    setState(state => ({...state, foundRecords : []}));
 }, [])

  useEffect( () => {
    BookService.getBookingsByRef(state.ref).then( (res)=>
    {
        if (res.data.length > 0)
        {
            setState(state => ({...state, foundRecords : res.data}));
        }
    });
    }, [state.RefreshPersonInfo]);

    const handleChange = (event) =>
    {
        setState(state => ({...state, ref : event.target.value}));
        setState(state => ({...state, refError : false})); 
    }

    const clearField = () =>
    {
        setState(state => ({...state, refError : false})); 
        setState(state => ({...state, ref : '___-___-___'}));
        setState(state => ({...state, foundRecords : []}));
        setFocus();
    }

    const findRecords = () =>
    {
        if (!state.ref || state.ref.indexOf('_') >= 0)
        {
            setState(state => ({...state, refError : true}));  
            return;
        }

        setState(state => ({...state, submiting : true}));
        setState(state => ({...state, foundRecords : []}));

        BookService.getBookingsByRef(state.ref).then( (res)=>
        {
            setState(state => ({...state, submiting : false}));
            if (res.data.length > 0)
            {
                setState(state => ({...state, foundRecords : res.data}));
            }
            else
            {
                setState(state => ({...state, foundRecords : null}));
            }
            
            console.log(res.data);

        }).catch( (err) =>
        {
            console.log(err);
            setState(state => ({...state, submiting : false}));
        });
    }

  return (
    <React.Fragment>
        <CssBaseline />
        <div className={classes.title}>
            <Typography component="h6" variant="h6" align="center">
                Find Booking Appoinments
            </Typography>  
        </div> 

        <Grid container direction="column" spacing={1} justify="flex-start"  alignItems="center">

        <Grid item xs={12} md={12}>
            <FormControl className={classes.TextBox}>
                <TextField
                    {...focusProps}
                    autoFocus 
                    pattern="[0-9]*"
                    error = {state.refError ? true : false} 
                    value = {state.ref}
                    className = {classes.TextField}
                    width = "50px"
                    onChange={handleChange}
                    label="Reference No."
                    helperText="Enter Your 9-digits Reference No."
                    name="refNo"
                    id="refNo"
                    variant="outlined"
                    
                    size="medium"
                    margin="normal"
                    fullWidth = {true}
                    InputProps={{
                        inputComponent: TextMaskCustom,
                        style: { textAlign: 'center', fontSize:"24px", width: "210px", paddingLeft: "20px" }
                    }}

                    onKeyPress= {event => {
                        if (event.key === 'Enter') {
                            findRecords();
                        }
                      }}
                />         
            </FormControl>
        </Grid>

        <Grid item xs={12} md={12}>
               
                <Button
                    disabled = {state.submiting}
                    color="default"
                    onClick = {clearField}
                    onTouchTap = {clearField}
                    className={classes.Clear}
                >
                    Clear 
                </Button>  
            
                <Button
                    type="button"
                    disabled = {state.submiting}
                    variant="contained"
                    color="primary"
                    onClick = {findRecords}
                    onTouchTap = {findRecords}
                    className={classes.Find}
                >
                    Find 
                </Button>  
        </Grid>

        <Grid item xs={12} md={12}>

                    

            {state.foundRecords && state.foundRecords.length > 0 && (
                <React.Fragment>

                    <div className={classes.PersonsBox}>
                          <PersonsBox/>
                    </div>
                    


                </React.Fragment>
            )}   

            {!state.foundRecords && (
                <React.Fragment>

                <div className={classes.root}>
                    <Alert severity="error"> <strong>No Records Found !</strong> <br/> Please check you reference number again.</Alert>
                </div> 
                   
                </React.Fragment>
            )}

        </Grid>
        
        
        </Grid>
        
    </React.Fragment>
   
  );
}