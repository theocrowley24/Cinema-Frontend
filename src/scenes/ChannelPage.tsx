import React, {useContext, useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {User, UserMapper} from "../types/user";
import {getUser, getVideos, hasActiveToken, transferToken} from "../api";
import {Video, VideoMapper} from "../types/videos";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    Typography
} from "@material-ui/core";
import {toast} from "react-toastify";
import Slider from "react-slick";
import {VideoCarouselPreview} from "../components/VideoCarouselPreview";
import {AuthContext} from "../App";

export const ChannelPage = () => {
    const {userId} = useParams<{ userId: string }>();
    const [videos, setVideos] = useState<Video[]>([]);

    const [subscribeDialogOpen, setSubscribeDialogOpen] = useState(false);
    const [subscribeError, setSubscribeError] = useState("");

    const [channelUser, setChannelUser] = useState<User | null>(null);
    const {user} = useContext(AuthContext);

    const [subscribed, setSubscribed] = useState(false);

    const history = useHistory();

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: Math.min(videos.length, 4)
    }

    const confirmSubscribe = () => {
        if (!channelUser) {
            return;
        }

        transferToken(channelUser.id).then(() => {
            setSubscribeDialogOpen(false);
            toast("Subscribed!", {type: "success"});
            setSubscribeError("");
        }).catch(error => {
            setSubscribeError(error.message);
        })
    }

    useEffect(() => {
        let mounted = true;

        getVideos({user: Number(userId)}).then((response) => {
            return response.json();
        }).then((data) => {
            if (mounted) {
                setVideos(data.map((v: any) => VideoMapper(v)));
            }
        }).catch(error => console.log(error));

        getUser(Number(userId)).then(response => {
            if (mounted) {
                setChannelUser(UserMapper(response));
            }
        }).catch(error => {
            toast(error.message, {type: "error"});
            history.push("/");
        })

        hasActiveToken(Number(userId)).then(response => {
            if (mounted) {
                setSubscribed(response);
            }
        }).catch(error => {
            toast(error.message, {type: "error"});
        });

        return () => {
            mounted = false;
        }
    }, [userId])

    return <div>
        <Paper style={{height: "500px", width: "100%"}}>
            <div style={{height: "70%", width: "100%", background: "grey"}} className={"channel-cover"}>
                {channelUser?.coverFilename && <img alt={"Cover"}
                                                    src={`${process.env.REACT_APP_S3_CDN_URL}/images/covers/${channelUser?.coverFilename}`}/>}
            </div>

            <div style={{height: "30%", width: "100%", display: "flex", justifyContent: "space-between"}}>
                <div className={"padding-md"}>
                    <Typography variant={"h3"}>{channelUser?.displayName || channelUser?.username}</Typography>

                    <Typography variant={"subtitle1"}>
                        {channelUser?.subscribers} subscribers
                    </Typography>

                    <Typography variant={"body1"}>
                        {channelUser?.bio || "No bio"}
                    </Typography>
                </div>

                {channelUser?.id !== user?.id && <div style={{display: "flex", alignSelf: "end", padding: "25px"}}>
                    <Button disableElevation color={"primary"} variant={"contained"} disabled={subscribed}
                            onClick={() => setSubscribeDialogOpen(true)}>{subscribed ? "Subscribed" : "Subscribe"}</Button>
                </div>}

                <Dialog open={subscribeDialogOpen} onClose={() => setSubscribeDialogOpen(false)}>
                    <DialogTitle>Subscribe</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To subscribe to this channel it will cost 1 token. Do you want to proceed?
                        </DialogContentText>

                        <DialogActions>
                            <Button disableElevation onClick={() => setSubscribeDialogOpen(false)}>
                                Cancel
                            </Button>

                            <Button disableElevation onClick={confirmSubscribe} color={"primary"} variant={"outlined"}
                                    disabled={subscribed}>
                                {subscribed ? "Subscribed" : "Subscribe"}
                            </Button>
                        </DialogActions>

                        {subscribeError}
                    </DialogContent>
                </Dialog>
            </div>
        </Paper>

        <div className={"slick-container"}>
            <Slider {...settings}>
                {videos.map((video, i) => <VideoCarouselPreview key={i} video={video}/>)}
            </Slider>
        </div>
    </div>
}
