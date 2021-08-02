import React, {useContext, useState} from "react";
import {Button, Card, CardContent, CardHeader, Grid, TextField} from "@material-ui/core";
import {getUser, login} from "../api";
import {Link, useHistory} from "react-router-dom";
import {AuthContext, UserClaimMapper} from "../App";
import jwt from 'jsonwebtoken';
import {UserMapper} from "../types/user";

export const Login = () => {
    const {user, updateUser} = useContext(AuthContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const history = useHistory();

    if (user) {
        history.push("/");
    }

    // TODO: broken with invalid password or username
    const attemptLogin = () => {
        login(username, password).then(async (token) => {
            localStorage.setItem("cinema_token", token);
            let userClaim = UserClaimMapper(jwt.decode(token));

            try {
                let response = await getUser(userClaim.id);
                const actualUser = UserMapper(response);
                updateUser(actualUser);

                history.push("/");
            } catch (error) {
                setError(error.message);
            }
        }).catch(error => {
            setError(error.message);
        });
    }

    return <div className={"flex flex-center"} style={{height: "100vh"}}>
        <Card style={{width: "300px", padding: "15px"}}>
            <CardHeader
                title={"Login"}
            />
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            type={"text"}
                            placeholder={"Username"}
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            type={"password"}
                            placeholder={"Password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            onClick={attemptLogin}
                            variant={"contained"}
                            disabled={!username || !password}
                            fullWidth
                            disableElevation
                            color={"primary"}
                        >Login</Button>
                    </Grid>

                    <Grid item xs={12}>
                        {error}
                    </Grid>

                    <span className={"text-align-center full-width"}>Sign in as a channel instead <Link
                        to={"/channel-login"}>here</Link></span>

                    <span className={"text-align-center full-width"}>Not a member? <Link
                        to={"/signup"}>Sign up</Link></span>
                </Grid>
            </CardContent>
        </Card>
    </div>
}
