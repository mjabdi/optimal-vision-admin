import React, { Fragment, Suspense, lazy } from "react";
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import theme from "./theme";
import GlobalStyles from "./GlobalStyles";
import * as serviceWorker from "./serviceWorker";

import GlobalState from "./GlobalState";
import Navigator from './Navigator';




// Configure JSS


function App() {
  const [state, setState] = React.useState({currentMenuIndex:0});

  return (
    <GlobalState.Provider value={[state, setState]}>
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles />

       

              <Navigator/>

       


        </MuiThemeProvider>
      </BrowserRouter>
    </GlobalState.Provider>
  );
}

serviceWorker.register();

export default App;
