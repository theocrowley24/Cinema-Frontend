import React, {useEffect, useState} from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    TextField,
    Typography
} from "@material-ui/core";
import {Token, TokenMapper} from "../types/user";
import {getMyTokens} from "../api";
import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator
} from "@material-ui/lab";
import {MonetizationOn} from "@material-ui/icons";

export const TokensPage = () => {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [tokensToDisplay, setTokensToDisplay] = useState<Token[]>([]);

    useEffect(() => {
        getMyTokens().then(response => response.json()).then(data => {
            let tokens: Token[] = data.map((t: any) => TokenMapper(t));
            let tokensToDisplay: Token[] = [];

            tokens.forEach(token => {
                tokensToDisplay.push(token);
            });

            tokens.forEach(token => {
                if (token.dateUsed) {
                    let tempToken = {...token};
                    tempToken.used = true;
                    tokensToDisplay.push(tempToken);
                }
            });


            tokensToDisplay = tokensToDisplay.sort((a, b) => {
                let aDate;
                let bDate;

                if (a.used) {
                    aDate = a.dateUsed;
                } else {
                    aDate = a.dateGranted;
                }

                if (b.used) {
                    bDate = b.dateUsed;
                } else {
                    bDate = b.dateGranted;
                }

                if (!aDate || !bDate) {
                    return 0;
                }

                return bDate.getTime() - aDate.getTime();
            });

            setTokensToDisplay(tokensToDisplay);
            setTokens(tokens);
        });
    }, []);

    return <Grid container spacing={3} className={"padding-md"}>
        <Grid item xs={12}>
            <Typography variant={"h2"}>Your Tokens</Typography>
        </Grid>


        <Grid item xs={12}>
            <Grid container>
                <Grid item xs={4}>
                    <Card>
                        <CardHeader
                            title={"Stats"}
                        />

                        <CardContent>
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <MonetizationOn/>
                                    </ListItemIcon>

                                    <ListItemText primary={"Remaining tokens"}/>

                                    <ListItemSecondaryAction>
                                        <Chip color={"primary"} label={tokens.filter(token => !token.dateUsed).length}/>
                                    </ListItemSecondaryAction>
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <MonetizationOn/>
                                    </ListItemIcon>

                                    <ListItemText primary={"Tokens used"}/>

                                    <ListItemSecondaryAction>
                                        <Chip color={"secondary"}
                                              label={tokens.filter(token => token.dateUsed).length}/>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={8}>
                    <Timeline align={"right"}>
                        {tokensToDisplay.map((token, i) => <TimelineItem key={i}>
                            <TimelineOppositeContent>
                                <Typography
                                    color="textSecondary">{token.used ? token.dateUsed?.toDateString() : token.dateGranted.toDateString()}</Typography>
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot/>
                                <TimelineConnector/>
                            </TimelineSeparator>
                            <TimelineContent>
                                <Typography>{token.used ? "Token Used" : "Token Granted"}</Typography>
                            </TimelineContent>
                        </TimelineItem>)}
                    </Timeline>
                </Grid>
            </Grid>
        </Grid>
    </Grid>
}
