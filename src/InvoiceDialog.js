import React, { useEffect, useRef, useState } from "react";
import InvoiceService from "./services/InvoiceService";
import Typography from "@material-ui/core/Typography";

import Autocomplete from "@material-ui/lab/Autocomplete";

import {
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
  Tooltip,
} from "@material-ui/core";
import GlobalState from "./GlobalState";
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
import NumberFormat from "react-number-format";

import ReceiptIcon from "@material-ui/icons/Receipt";

import DeleteIcon from "@material-ui/icons/Delete";

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

  backdrop: {
    zIndex: theme.zIndex.drawer + 5,
    color: "#fff",
  },
}));

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

export default function InvoiceDialog(props) {
  const classes = useStyles();

  const [state, setState] = React.useContext(GlobalState);
  const [saving, setSaving] = useState(false);

  const defaultCode = null; //{code:"",description:"",price:"0"}

  const [code, setCode] = useState(defaultCode);
  const [codeError, setCodeError] = useState(false);

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState(false);

  const [notes, setNotes] = useState("");
  const notesChanged = (event) => {
    setNotes(event.target.value);
  };

  const [items, setItems] = React.useState([]);

  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState(false);

  const [title, setTitle] = React.useState("INVOICE ISSUANCE");

  const [allCodes, setAllCodes] = React.useState([]);

  useEffect(() => {
    if (props.invoice) {
      setItems(props.invoice.items);
      setNotes(props.invoice.notes || "");
      setTitle("EDIT INVOICE");
    } else {
      setTitle("INVOICE ISSUANCE");
    }

    fetchAllCodes();

    return () => {
      setItems([]);
    };
  }, [props.invoice]);

  useEffect(() => {
    if (!props.invoice && props.defaultCodes) {
      setItems(props.defaultCodes)
    }

    return () => {
      setItems([]);
    };
  }, [props.defaultCodes]);



  const fetchAllCodes = async () => {
    try {
      const res = await InvoiceService.getAllCodes();
      setAllCodes(res.data.result);
    } catch (err) {
      console.error(err);
    }
  };

  const priceChanged = (event) => {
    setPrice(event.target.value);
    setPriceError(false);
  };

  const codeChanged = (event) => {
    setCode(event.target.value?.toUpperCase());
    setCodeError(false);
  };

  const descriptionChanged = (event) => {
    setDescription(event.target.value);
    setDescriptionError(false);
  };

  const handleClose = (refresh) => {
    if (saving) return;

    setPrice("");
    setCode(defaultCode);
    setDescription("");
    setPriceError(false);
    setCodeError(false);
    setDescriptionError(false);
    setItems([]);
    setNotes("");
    setSaving(false);

    props.handleClose(refresh);
  };

  const codeLeft = () => {
    fetchCodeDetails();
  };

  const fetchCodeDetails = async () => {
    try {
      setDescription("...");
      const res = await InvoiceService.getCodeDetails(code);
      if (res.data.status === "OK") {
        const result = res.data.result;
        if (result.length === 0) {
          setCodeError(true);
          setDescription("");
          setPrice("");
        } else if (result.length >= 1) {
          setDescription(result[0].description);
          setPrice(result[0].price);
          setDescriptionError(false);
          setPriceError(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addItemClicked = () => {
    if (!validateItem()) {
      return;
    }

    setItems([
      ...items,
      { code: code.code, description: code.description, price: code.price },
    ]);
    setCode(defaultCode);
  };

  const addItemClicked2 = () => {
    if (!validateItem2()) {
      return;
    }

    setItems([...items, { code: "", description: description, price: price }]);
    setDescription("");
    setPrice("");
  };

  const validateItem = () => {
    let error = false;
    if (!code) return false;

    if (!code.description || code.description.length === 0) {
      error = true;
    }
    if (!code.price || code.price.length === 0) {
      error = true;
    }

    return !error;
  };

  const validateItem2 = () => {
    let error = false;
    if (!description || description.length === 0) {
      setDescriptionError(true);
      error = true;
    }
    if (!price || price.length === 0) {
      setPriceError(true);
      error = true;
    }

    return !error;
  };

  const removeItem = (index) => {
    let temp = [...items];
    temp.splice(index, 1);
    setItems(temp);
  };

  const getGrandTotal = (_items) => {
    let total = 0;
    _items.forEach((element) => {
      total += parseFloat(element.price);
    });

    return total;
  };

  const saveClikced = async () => {
    if (items.length === 0 && !props.invoice) {
      return;
    }

    try {
      setSaving(true);
      let name = "";
      let postCode = "";
      let address = "";

      if (props.booking.formData) {
        const formData = JSON.parse(props.booking.formData)
        name = `${formData.title} ${formData.forename} ${formData.surname}`;
        postCode = formData.postCode;
        address = formData.address;
      } else if (props.booking.forename && props.booking.surname) {
        name = `${props.booking.forename} ${props.booking.surname}`;
        postCode = props.booking.postCode;
        address = props.booking.address;
      } else if (props.booking.fullname) {
        name = `${props.booking.fullname}`;
      }

      const invoice = {
        name: name,
        date: new Date(),
        dateAttended: new Date(props.booking.bookingDate),
        items: items,
        grandTotal: getGrandTotal(items),
        bookingId: props.booking._id,
        postCode: postCode,
        address: address,
        notes: notes,
      };
      if (!props.invoice) {
        await InvoiceService.createInvoice(invoice);
      } else if (items.length > 0) {
        await InvoiceService.updateInvoice(
          props.invoice.invoiceNumber,
          invoice
        );
      } else {
        await InvoiceService.deleteinvoice(props.invoice.invoiceNumber);
      }

      setSaving(false);
      handleClose(true);
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  return (
    <React.Fragment>
      {props.booking && (
        <React.Fragment>
          <Dialog
            maxWidth="md"
            open={props.open}
            onClose={() => handleClose(false)}
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
                  <ReceiptIcon style={{ color: "#1cb2c9", fontSize: "3rem" }} />
                </Grid>

                <Grid item>
                  <div
                    style={{
                      color: "#1cb2c9",
                      paddingBottom: "10px",
                      fontWeight: "800",
                    }}
                  >
                    {`${title}`}
                  </div>
                </Grid>
              </Grid>

              <Divider />
            </DialogTitle>
            <DialogContent>
              <div
                style={{
                  height: "700px",
                  width: "100%",
                }}
              >
                <Grid
                  container
                  direction="column"
                  justify="flex-start"
                  spacing={1}
                  alignItems="flex-start"
                >
                  <Grid item style={{ width: "100%" }}>
                    <Grid container direction="row" spacing={5}>
                      <Grid item xs={10}>
                        <Autocomplete
                          id="code-auto-complete"
                          value={code}
                          onChange={(event, newValue) => {
                            setCode(newValue);
                          }}
                          options={allCodes}
                          getOptionLabel={(option) =>
                            `.${option.code} -- ${
                              option.description
                            } -- ${parseFloat(
                              option.price
                            ).toLocaleString("en-GB", {
                              style: "currency",
                              currency: "GBP",
                            })}`
                          }
                          style={{ width: "750px" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="System Codes"
                              helperText="Standard codes already defined in the system"
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <Button
                          onClick={addItemClicked}
                          variant="outlined"
                          color="primary"
                          style={{ marginTop: "15px" }}
                          disabled={saving}
                        >
                          + Add
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item style={{ width: "100%", marginTop: "20px" }}>
                    <Grid container direction="row" spacing={5}>
                      <Grid item xs={8}>
                        <TextField
                          error={descriptionError}
                          value={description}
                          onChange={descriptionChanged}
                          fullWidth
                          label="Description (Custom)"
                          name="desc"
                          helperText="You can enter any description you want to be placed on the invoice"
                          id="desc-id"
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <TextField
                          error={priceError}
                          value={price}
                          onChange={priceChanged}
                          fullWidth
                          label="Price"
                          name="price"
                          id="price-id"
                          InputProps={{
                            inputComponent: NumberFormatCustom,
                            startAdornment: (
                              <InputAdornment position="start">
                                £
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <Button
                          onClick={addItemClicked2}
                          variant="outlined"
                          color="primary"
                          style={{ marginTop: "12px" }}
                          disabled={saving}
                        >
                          + Add
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>

                  <div
                    style={{
                      backgroundColor: "#fff",
                      color: "#1cb2c9",
                      fontWeight: "500",
                      fontSize: "0.95rem",
                      padding: "5px 8px",
                      marginBottom: "-15px",
                      marginLeft: "10px",
                      zIndex: "99",
                      marginTop: "30px",
                    }}
                  >
                    Invoice Items
                  </div>

                  <div
                    style={{
                      width: "100%",
                      height: "300px",
                      overflowY: "scroll",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      padding: "25px",
                      position: "relative",
                    }}
                  >
                    <Grid item>
                      <Grid
                        container
                        direction="column"
                        justify="flex-start"
                        spacing={2}
                        alignItems="flex-start"
                      >
                        <Grid item style={{ width: "100%", fontWeight: "500" }}>
                          <Grid container direction="row" spacing={4}>
                            <Grid item xs={2}>
                              Code
                            </Grid>
                            <Grid item xs={5}>
                              Description
                            </Grid>
                            <Grid item xs={2}>
                              Price
                            </Grid>
                            <Grid item xs={3}></Grid>
                          </Grid>
                        </Grid>
                        {items.map((item, index) => (
                          <Grid item style={{ width: "100%" }}>
                            <Grid container direction="row" spacing={4}>
                              <Grid item xs={2}>
                                {item.code}
                              </Grid>
                              <Grid item xs={5}>
                                {item.description}
                              </Grid>
                              <Grid item xs={2}>
                                {parseFloat(item.price).toLocaleString(
                                  "en-GB",
                                  { style: "currency", currency: "GBP" }
                                )}
                              </Grid>
                              <Grid item xs={3}>
                                <Tooltip title="Remove Item">
                                  <IconButton
                                    style={{ marginTop: "-15px" }}
                                    onClick={() => removeItem(index)}
                                  >
                                    <DeleteIcon color="primary" />
                                  </IconButton>
                                </Tooltip>
                              </Grid>
                            </Grid>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </div>

                  <Grid item style={{ marginTop: "10px", width:"100%", display:"flex", justifyContent:"flex-end", paddingRight:"30px" }}>
                    <span style={{ fontWeight: "500", color: "#777" }}>
                      Grand Total :{" "}
                    </span>{" "}
                    <span
                      style={{
                        fontWeight: "500",
                        color: "#1cb2c9",
                        marginLeft: "10px",
                        fontSize: "1rem",
                      }}
                    >
                      {" "}
                      {getGrandTotal(items).toLocaleString("en-GB", {
                        style: "currency",
                        currency: "GBP",
                      })}{" "}
                    </span>
                  </Grid>

                  <Grid item style={{ marginTop: "10px", width: "100%" }}>
                    <TextField
                      value={notes}
                      onChange={notesChanged}
                      multiline
                      rows={2}
                      helperText="* notes will be printed on the invoice (optional)"
                      label="Notes"
                      fullWidth
                      variant="outlined"
                      placeholder="enter any addional notes you want to be printed on the invoice..."
                    ></TextField>
                  </Grid>
                </Grid>
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
                    onClick={() => handleClose(false)}
                    style={{ width: "100px" }}
                    disabled={saving}
                  >
                    back
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    onClick={saveClikced}
                    variant="contained"
                    color=   {props.invoice ? 'secondary' : 'primary'}
                    // style={{ width: "100px" }}
                    disabled={saving}
                  >
                    {props.invoice ? 'Save Changes' : 'Issue Invoice'}
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
