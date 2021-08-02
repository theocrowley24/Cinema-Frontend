import React, {useContext, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {AuthContext} from "../App";
import {Button, Card, CardContent, CardHeader, Grid, TextField} from "@material-ui/core";
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {signupSubscriber} from "../api";
import {toast} from "react-toastify";

const cardStyles = {
    base: {
        color: '#fff'
    }
}

export const Signup = () => {
    const {user} = useContext(AuthContext);
    const history = useHistory();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState(false);

    if (user) {
        history.push("/");
    }

    // TODO: let user choose account type
    // TODO: if user selects channel then create account as normal
    // TODO: if user selects subscriber then create account and redirect to stripe. Verifying in webhook
    const attemptSignup = async () => {
        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        const cardElement = elements.getElement(CardElement);

        if (cardElement) {
            const {error, paymentMethod} = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement
            });

            if (error) {
                console.log(error);
                return;
            }

            if (paymentMethod) {
                signupSubscriber(email, username, password, paymentMethod.id).then(response => {
                    return response.json();
                }).then(data => {
                    console.log(data);
                    history.push("/");
                }).catch(error => {
                    toast(error.message, {type: "error"});
                    setLoading(false);
                });
            }
        }
    }

    return <div className={"flex flex-center"} style={{height: "100vh"}}>
        <Card style={{width: "300px", padding: "15px"}}>
            <CardHeader
                title={"Sign up"}
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

                        <CardElement options={{style: cardStyles}}/>
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            onClick={attemptSignup}
                            variant={"contained"}
                            disabled={!username || !password || !stripe || loading}
                            fullWidth
                            disableElevation
                            color={"secondary"}
                        >
                            Signup
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
                        {error}
                    </Grid>

                    <span className={"text-align-center full-width"}>Already a subscriber? <Link
                        to={"/ login"}>Login</Link></span>
                </Grid>
            </CardContent>
        </Card>
    </div>
}
