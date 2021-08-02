import React, {useContext, useEffect, useState} from "react";
import {getMySubscriptions} from "../api";
import {
    AppBar,
    Avatar,
    Button,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
    Toolbar,
    Typography
} from "@material-ui/core";
import {
    AccountBalanceOutlined,
    DashboardOutlined,
    ExitToAppOutlined,
    NotificationsOutlined,
    OndemandVideoOutlined,
    PersonOutlined,
    PublishOutlined,
    SettingsOutlined
} from "@material-ui/icons";
import {ChannelPage} from "./ChannelPage";
import {Route, Switch, useHistory} from "react-router-dom";
import {TokensPage} from "./UserTokens";
import {DashboardPage} from "./Dashboard";
import {AuthContext} from "../App";
import {VideoPage} from "./VideoPage";
import {Subscription, SubscriptionMapper, UserType} from "../types/user";
import {toast} from "react-toastify";
import {YourSettings} from "./YourSettings";
import UploadVideoComponent from "./UploadVideoPage";
import {UploadVideoSuccessPage} from "./UploadVideoSuccessPage";
import {DiscoveryPage} from "./DiscoveryPage";
import {SearchResults} from "./SearchResults";
import {SearchBar} from "../components/SearchBar";
import {trackPromise} from "react-promise-tracker";

export const Home = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

    const {user, updateUser} = useContext(AuthContext);

    const history = useHistory();


    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const logout = () => {
        localStorage.removeItem("cinema_token");
        updateUser(null);
        history.push("/login");
    }

    useEffect(() => {
        let mounted = true;

        trackPromise(
            getMySubscriptions().then(response => {
                const subs = response.map((sub: any) => SubscriptionMapper(sub));

                if (mounted) {
                    setSubscriptions(subs);
                }
            }).catch(error => {
                toast(error.message, {type: "error"});
            })
        )

        return () => {
            mounted = false;
        }
    }, []);

    return <div className={"layout"}>
        <div className={"header"}>
            <AppBar
                position={"relative"}
            >
                <Toolbar>
                    <div className={"flex-row full-width"}>

                        <SearchBar/>


                        <div className={"flex-row margin-h-md"}>
                            {user?.userType === UserType.CHANNEL &&
                            <Button
                                style={{width: "205px"}}
                                variant={"contained"}
                                color={"primary"}
                                onClick={() => history.push("/upload")}
                            >
                                Upload a video
                            </Button>}

                            <div className={"flex-row margin-h-sm"}>
                                <IconButton onClick={() => history.push(`/your-settings`)}>
                                    <Avatar
                                        src={`${process.env.REACT_APP_S3_CDN_URL}/images/avatars/${user?.avatarFilename}`}
                                    >
                                        {!user?.avatarFilename && user?.username[0].toUpperCase()}
                                    </Avatar>
                                </IconButton>

                                <Button onClick={openMenu}>{user?.displayName || user?.username}</Button>

                                <Menu
                                    open={Boolean(anchorEl)}
                                    anchorEl={anchorEl}
                                    onClose={() => setAnchorEl(null)}
                                    getContentAnchorEl={null}
                                    anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                                    transformOrigin={{vertical: "top", horizontal: "center"}}
                                >
                                    <MenuList>
                                        <MenuItem onClick={() => history.push("/tokens")}>
                                            <ListItemIcon>
                                                <AccountBalanceOutlined color={"primary"} fontSize="small"/>
                                            </ListItemIcon>
                                            <Typography variant="body1">Your Tokens</Typography>
                                        </MenuItem>
                                        <MenuItem onClick={() => history.push("/your-settings")}>
                                            <ListItemIcon>
                                                <PersonOutlined color={"primary"} fontSize="small"/>
                                            </ListItemIcon>
                                            <Typography variant="body1">Profile settings</Typography>
                                        </MenuItem>
                                        <MenuItem onClick={logout}>
                                            <ListItemIcon>
                                                <ExitToAppOutlined color={"primary"} fontSize="small"/>
                                            </ListItemIcon>
                                            <Typography variant="body1">Logout</Typography>
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </div>

                            <NotificationsOutlined/>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
        <div className={"sidebar"}>
            <Grid container justify={"center"} alignItems={"center"} style={{margin: "12px"}}>
                <Grid item xs={3}>
                    <img src={"/images/logo.svg"} alt={"Logo"}/>
                </Grid>
                <Grid item xs={9}>
                    <Typography variant={"h6"}>Cinema</Typography>
                </Grid>
            </Grid>

            <Typography variant={"subtitle1"} className={"font-color-grey"}
                        style={{marginLeft: "12px"}}>Navigation</Typography>

            <List>
                <ListItem
                    button
                    onClick={() => history.push('/')}
                >
                    <ListItemIcon>
                        <OndemandVideoOutlined color={"secondary"}/>
                    </ListItemIcon>
                    <ListItemText>Home</ListItemText>
                </ListItem>

                {user?.userType === UserType.CHANNEL && <ListItem
                    button
                    onClick={() => history.push('/dashboard')}
                >
                    <ListItemIcon>
                        <DashboardOutlined color={"secondary"}/>
                    </ListItemIcon>
                    <ListItemText>Dashboard</ListItemText>
                </ListItem>}

                {user?.userType === UserType.CHANNEL && <ListItem
                    button
                    onClick={() => history.push('/upload')}
                >
                    <ListItemIcon>
                        <PublishOutlined color={"secondary"}/>
                    </ListItemIcon>
                    <ListItemText>Upload</ListItemText>
                </ListItem>}

                {user?.userType === UserType.SUBSCRIBER && <ListItem
                    button
                    onClick={() => history.push('/tokens')}
                >
                    <ListItemIcon>
                        <AccountBalanceOutlined color={"secondary"}/>
                    </ListItemIcon>
                    <ListItemText>Your Tokens</ListItemText>
                </ListItem>}

                <ListItem
                    button
                    onClick={() => history.push('/your-settings')}
                >
                    <ListItemIcon>
                        <SettingsOutlined color={"secondary"}/>
                    </ListItemIcon>
                    <ListItemText>Your Settings</ListItemText>
                </ListItem>

                <ListItem button onClick={logout}>
                    <ListItemIcon>
                        <ExitToAppOutlined color={"secondary"}/>
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </ListItem>
            </List>

            <hr/>

            {user?.userType !== UserType.CHANNEL &&
            <Typography variant={"subtitle1"} className={"font-color-grey"}
                        style={{marginLeft: "12px"}}>Active Subscriptions</Typography>}

            {user?.userType !== UserType.CHANNEL &&
            <List>
                {subscriptions.map((subscription, i) => <ListItem
                    button
                    onClick={() => history.push(`/channel/${subscription.user.id}`)}
                    key={i}
                >
                    <ListItemIcon>
                        <Avatar
                            src={`${process.env.REACT_APP_S3_CDN_URL}/images/avatars/${subscription.user.avatarFilename}`}
                        >
                            {!subscription.user.avatarFilename && subscription.user.username[0].toUpperCase()}
                        </Avatar>
                    </ListItemIcon>
                    <ListItemText
                        secondary={`Expires ${subscription.expires.toDateString()}`}>{subscription.user.displayName || subscription.user.username}</ListItemText>
                </ListItem>)}
            </List>}
        </div>
        <div className={"content"}>
            <Switch>
                <Route path={"/video/:videoId"} component={VideoPage}/>
                <Route path={"/channel/:userId"} component={ChannelPage}/>
                <Route path={"/tokens"} component={TokensPage}/>
                <Route path={"/your-settings"} component={YourSettings}/>
                <Route path={"/dashboard"} component={DashboardPage}/>
                <Route path={"/search/:query?/:tags?"} component={SearchResults}/>
                <Route exact path={"/upload"} component={UploadVideoComponent}/>
                <Route path={"/upload/success"} component={UploadVideoSuccessPage}/>
                <Route path={"/"} component={DiscoveryPage}/>
            </Switch>

            <Grid container className={"footer"}>
                <Grid item xs={4}>
                    <List>
                        <ListItem>Privacy</ListItem>
                        <ListItem>Contact Us</ListItem>
                    </List>
                </Grid>

                <Grid item xs={4}>

                </Grid>

                <Grid item xs={4}>

                </Grid>

                <div className={"full-width padding-md"}>
                    <Typography variant={"body1"}>
                        &#169; Copyright {(new Date()).getFullYear()} Theo Crowley
                    </Typography>
                </div>
            </Grid>
        </div>
    </div>
}
