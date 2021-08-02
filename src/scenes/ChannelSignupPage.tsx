import React, {useContext, useState} from "react";
import {Button, Card, CardContent, CardHeader, Grid, TextField} from "@material-ui/core";
import {AuthContext} from "../App";
import {Link, useHistory} from "react-router-dom";
import {signupChannel} from "../api";
import {useStripe} from "@stripe/react-stripe-js";

export const ChannelSignupPage = () => {
    const stripe = useStripe();

    const {user, updateUser} = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const history = useHistory();

    if (user) {
        history.push("/");
    }

    const attemptSignup = async () => {
        setLoading(true);
        signupChannel({email, password, username}).then(onboard_url => {
            window.location.href = onboard_url;
        }).catch(error => {
            setLoading(false);
            setError(error.message);
        });
    }

    return <div className={"flex flex-center primary-gradient-bg"} style={{height: "100vh"}}>
        <Card style={{width: "300px", padding: "15px"}}>
            <CardHeader
                title={"Join Cinema as a channel"}
            />
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            type={"email"}
                            placeholder={"Email"}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            fullWidth
                        />
                    </Grid>

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
                        <TextField
                            type={"password"}
                            placeholder={"Repeat password"}
                            value={passwordRepeat}
                            onChange={e => setPasswordRepeat(e.target.value)}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            onClick={attemptSignup}
                            variant={"contained"}
                            disabled={!username || !password || !email || !passwordRepeat || loading}
                            color={"secondary"}
                            fullWidth
                            disableElevation
                        >Signup</Button>
                    </Grid>

                    <Grid item xs={12}>
                        {error}
                    </Grid>

                    <span className={"text-align-center full-width"}>Already a member? <Link
                        to={"/channel-login"}>Login</Link></span>
                </Grid>
            </CardContent>
        </Card>
    </div>
}
