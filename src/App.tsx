import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Home} from "./scenes/Home";
import jwt from 'jsonwebtoken';
import {Login} from "./scenes/Login";
import {PrivateRoute} from "./components/PrivateRoute";
import {Signup} from "./scenes/Signup";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js/pure";
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from "react-toastify";
import {CircularProgress, createMuiTheme, ThemeProvider} from "@material-ui/core";
import {ChannelLoginPage} from "./scenes/ChannelLoginPage";
import {ChannelSignupPage} from "./scenes/ChannelSignupPage";
import {User, UserMapper} from "./types/user";
import {getUser} from "./api";
import 'react-image-crop/lib/ReactCrop.scss';
import {trackPromise, usePromiseTracker} from "react-promise-tracker";
import {LoadingSpinner} from "./components/LoadingSpinner";

const theme = createMuiTheme({
    typography: {
        fontFamily: ['"Lato"', 'Open Sans'].join(','),
        allVariants: {
            color: "#fff"
        }
    },
    palette: {
        primary: {
            main: "#892cdc"
        },
        secondary: {
            main: "#e94560"
        }
    }
});

// TODO: move to .env
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK || "");

export interface UserClaim {
    id: number,
    username: string,
    email: string,
    exp: number,
    userType: string
}

export const UserClaimMapper = (data: any): UserClaim => {
    return {
        id: data?.id,
        username: data?.username,
        email: data?.email,
        exp: data?.exp,
        userType: data?.user_type
    }
}

export const AuthContext = React.createContext<{ user: User | null, updateUser: (user: User | null) => void }>({
    user: null,
    updateUser: () => {
    }
});

const App = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("cinema_token");


    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                let initialUser = UserClaimMapper(jwt.decode(token));

                try {
                    const response = await getUser(initialUser.id);
                    const actualUser = UserMapper(response);
                    setUser(actualUser);
                    setLoading(false);
                } catch (error) {
                    toast(error.message, {type: 'error'});
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        }

        trackPromise(fetchData());

    }, [token]);

    if (loading) {
        return <></>
    }

    return <ThemeProvider theme={theme}>
        <LoadingSpinner/>

        <Elements stripe={stripePromise}>
            <AuthContext.Provider value={{user: user, updateUser: (u: User | null) => setUser(u)}}>
                <BrowserRouter>
                    <Switch>
                        <Route path={"/login"} component={Login}/>
                        <Route path={"/signup"} component={Signup}/>
                        <Route path={"/channel-login"} component={ChannelLoginPage}/>
                        <Route path={"/channel-signup"} component={ChannelSignupPage}/>
                        <PrivateRoute path={"/"} component={Home}/>
                    </Switch>
                </BrowserRouter>
            </AuthContext.Provider>
            <ToastContainer position={"bottom-right"}/>
        </Elements>
    </ThemeProvider>

}

export default App;
