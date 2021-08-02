import React, {useContext} from "react";
import {Redirect, Route} from "react-router-dom";
import {AuthContext} from "../App";

export const PrivateRoute = ({component: Component, ...rest}: any) => {
    const {user} = useContext(AuthContext);

    return <Route {...rest} render={props =>
        user ?
            <Component {...props}/>
            : <Redirect to={"/login"}/>
    }/>
}
