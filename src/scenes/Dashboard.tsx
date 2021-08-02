import React, {useContext, useEffect, useState} from "react";
import {
    Button,
    Card,
    CardContent,
    CardHeader, Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    TextField, Tooltip,
    Typography
} from "@material-ui/core";
import {TransactionHistoryDataGrid} from "../components/TransactionHistoryDataGrid";
import {VideosDataGrid} from "../components/VideosDataGrid";
import {generateWithdrawal, getAccountLink, getBalance} from "../api";
import {toast} from "react-toastify";
import {AuthContext} from "../App";
import {HelpOutlineOutlined} from "@material-ui/icons";

export const DashboardPage = () => {
    const [balance, setBalance] = useState(0);
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
    const [unconvertedTokens, setUnconvertedTokens] = useState(0);
    const [accountLink, setAccountLink] = useState("");
    const {user} = useContext(AuthContext);

    const nextConversionDate = new Date();
    nextConversionDate.setMonth(nextConversionDate.getMonth() + 1 % 12);
    nextConversionDate.setDate(1);

    const handleWithdrawDialogClose = () => {
        setWithdrawDialogOpen(false);
    }

    const confirmWithdraw = async () => {
        try {
            await generateWithdrawal({amount: withdrawAmount});

            setWithdrawDialogOpen(false);

            toast("Withdraw success", {type: "success"});
        } catch (error) {
            toast(error.message, {type: "error"});
        }
    }

    useEffect(() => {
        let mounted = true;

        getBalance().then(response => {
            if (mounted) {
                setBalance(response.balance);
                setUnconvertedTokens(response.unconverted_tokens);
            }
        }).catch(error => {
            console.log(error);
        });

        getAccountLink().then(response => {
            if (mounted) {
                setAccountLink(response);
            }
        }).catch(error => {
            console.log(error);
        });

        return () => {
            mounted = false;
        }
    }, []);

    return <div className={"padding-md"}>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant={"h2"}>Dashboard</Typography>
            </Grid>

            <Grid item xs={12}>
                <Divider/>
            </Grid>

            <Grid item xs={12}>
                <VideosDataGrid/>
            </Grid>

            <Grid item xs={12}>
                <Typography variant={"h2"}>Tokens</Typography>
            </Grid>

            <Grid item xs={12}>
                <Divider/>
            </Grid>

            {accountLink && <Grid item xs={12}>
                <Typography variant={"subtitle1"}>
                    Stripe account status <Tooltip title={"To be able to receive payouts you need to complete the on-boarding process linked below."}>
                    <Chip icon={<HelpOutlineOutlined/>} color={"primary"} label={user?.channelOnboarded ? "ENABLED" : "NOT ENABLED"}/>
                </Tooltip>
                </Typography>

                <Typography variant={"subtitle1"}>
                    Manage stripe account <a href={accountLink}>here</a>
                </Typography>
            </Grid>}

            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={8}>
                        <div className={"flex-row justify-start margin-h-md"}>
                            <div>
                                <Typography variant={"subtitle2"}>Balance</Typography>
                                <Typography variant={"body1"}>{balance}p</Typography>
                            </div>

                            <div>
                                <Typography variant={"subtitle2"}>Unconverted tokens</Typography>
                                <Typography variant={"body1"}>{unconvertedTokens}</Typography>
                            </div>

                            <div>
                                <Typography variant={"subtitle2"}>Token exchange rate</Typography>
                                <Typography variant={"body1"}>1 token : 180p</Typography>
                            </div>

                            <div>
                                <Typography variant={"subtitle2"}>Next conversion date</Typography>
                                <Typography variant={"body1"}>{nextConversionDate.toDateString()}</Typography>
                            </div>

                            <div>
                                <Typography variant={"subtitle2"}>Estimated balance after conversion</Typography>
                                <Typography variant={"body1"}>{unconvertedTokens * 180}p</Typography>
                            </div>
                        </div>
                    </Grid>

                    <Grid item xs={4}>
                        <div className={"flex-row justify-end margin-h-md"}>
                            <div>
                                <TextField
                                    label={"Withdraw amount (pence)"}
                                    value={withdrawAmount}
                                    onChange={e => setWithdrawAmount(Number(e.target.value))}
                                    variant={"outlined"}
                                    type={"number"}
                                />
                            </div>

                            <div>
                                <Button
                                    color={"secondary"}
                                    disableElevation
                                    variant={"contained"}
                                    onClick={() => setWithdrawDialogOpen(true)}
                                    disabled={withdrawAmount === 0 || withdrawAmount > balance}
                                >
                                    Withdraw
                                </Button>

                                <Dialog open={withdrawDialogOpen} onClose={handleWithdrawDialogClose}>
                                    <DialogTitle>Confirm withdrawal</DialogTitle>

                                    <DialogContent>
                                        <DialogContentText>
                                            Are you sure you want to withdraw {withdrawAmount}p? This cannot be undone.
                                            Once confirmed the money should appear in your account within 5 business
                                            days.
                                        </DialogContentText>

                                        <DialogActions>
                                            <Button color={"secondary"}
                                                    onClick={handleWithdrawDialogClose}>Cancel</Button>
                                            <Button color={"primary"} variant={"contained"} disableElevation
                                                    onClick={confirmWithdraw}>Confirm</Button>
                                        </DialogActions>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <TransactionHistoryDataGrid/>
            </Grid>
        </Grid>
    </div>
}
