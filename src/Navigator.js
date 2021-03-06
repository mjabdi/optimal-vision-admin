import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';

import { makeStyles } from '@material-ui/core/styles';

import GlobalState from './GlobalState';




import SignIn from './SignIn';
import Dashboard from './Dashboard';

import { useLocation, useHistory} from "react-router-dom";
import { getUserIdFromToken } from './TokenVerifier';
import UserService from './services/UserService';
import { getMenuId } from './MenuList';
import { getRole, setRole } from './Role';
import { getGlobalPath } from './GlobalPath';


const useStyles = makeStyles((theme) => ({

    appBar: {
        position: 'static',
        backgroundColor: "#333",
        color: "#fff",
        //alignItems: 'center'
    
      },

      signOutButton:{
        color: "#fff",
        marginRight : "20px",
        fontWeight: "500"
      },

      title: {
        flexGrow : 1
      }


}));

export default function Navigator() {

    const classes = useStyles();
    const [state, setState] = React.useContext(GlobalState);

    const [loaded, setLoaded] = React.useState(false)

    let history = useHistory();

    const handleSignOut = () =>
    {
      setState(state => ({...state, signedIn: false}));

    }

    let location = useLocation();

    React.useEffect(() => {

      const checkToken = async () =>
      {
        const authToken = localStorage.getItem('ovadmin-auth-token') || sessionStorage.getItem('ovadmin-auth-token');
        UserService.setToken(authToken)

         if (!authToken)
        {
          setState(state => ({...state, signedIn: false, signedUp: false, forgotPassword: false}));
          setLoaded(true)
          history.push(getGlobalPath('/login'));
        }
        else
        {
           const userId = await getUserIdFromToken(authToken);
           if (!userId)
           {
              setState(state => ({...state, signedIn: false, signedUp: false, forgotPassword: false}));
              history.push(getGlobalPath('/login'));
           }
           else if (location.pathname === getGlobalPath('/') || location.pathname === getGlobalPath('/#') || location.pathname.startsWith(getGlobalPath('/login')))
           {
            if (!getRole())
            {
             setRole(userId.roles[0])
            }
             setState(state => ({...state, signedIn: true, signedUp: false, forgotPassword: false, userId: userId, role: getRole()}));
            
             history.push(getGlobalPath(`/${getMenuId(getRole(),0)}`));
           }
           else
           {
              if (!getRole())
              {
               setRole(userId.roles[0])
              }
             setState(state => ({...state, signedIn: true, userId: userId, role: getRole()}));
           }

           setLoaded(true)
        }
      }

      checkToken();
   
    }, [location.pathname]);

    const getComponentFromState = () =>
    {

      if (state.signedIn)
      {
        return <Dashboard/>
      }
      else
      {
          return <SignIn/>    
      }
    }

    return (
        <React.Fragment>
            <CssBaseline />

            {
              loaded && (
                getComponentFromState()
              )
            }
        
        </React.Fragment>
    );
}