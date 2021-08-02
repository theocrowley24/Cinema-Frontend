import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {getComments, getVideo, getVideos, hasActiveToken, postIncrementPlay, toggleVideoUpvote} from "../api";
import {Video, VideoMapper} from "../types/videos";
import {Comment, CommentMapper} from "../types/comments";
import {toast} from "react-toastify";
import {CommentList} from "../components/CommentList";
import VideoPlayer from "../components/VideoPlayer";
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    LinearProgress,
    Typography
} from "@material-ui/core";
import {ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined} from "@material-ui/icons";
import Slider from "react-slick";
import {VideoCarouselPreview} from "../components/VideoCarouselPreview";

// TODO: redirect if the user does not have an active token!
export const VideoPage = () => {
    const {videoId} = useParams<{ videoId: string }>();
    const [video, setVideo] = useState<Video | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [videos, setVideos] = useState<Video[]>([]);
    const [subscribed, setSubscribed] = useState(true);

    const history = useHistory();

    const [upvoteState, setUpvoteState] = useState("NONE");

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2
    }

    const incrementPlay = () => {
        postIncrementPlay(Number(videoId)).then(() => {
        }).catch(() => {
        });
    }

    const attemptToggleUpvote = () => {
        if (!video) {
            return;
        }

        toggleVideoUpvote({upvoteType: "UP", video: video.id}).then(() => {
            toast("Upvoted", {type: "success"});

            if (upvoteState === "UP") {
                setUpvoteState("NONE");
            } else {
                setUpvoteState("UP");
            }
        }).catch(error => {
            toast(error.message, {type: "error"});
        });
    }

    const attemptToggleDownvote = () => {
        if (!video) {
            return;
        }

        toggleVideoUpvote({upvoteType: "DOWN", video: video.id}).then(() => {
            toast("Downvoted", {type: "success"});

            if (upvoteState === "DOWN") {
                setUpvoteState("NONE");
            } else {
                setUpvoteState("DOWN");
            }
        }).catch(error => {
            toast(error.message, {type: "error"});
        });
    }

    const videoOptions = {
        sources: [
            {
                src: `${process.env.REACT_APP_S3_CDN_URL}/videos/${video?.fileName}/output.m3u8`,
                type: "application/x-mpegURL"
            }
        ],
        height: 800
    }

    const onCommentAdd = () => {
        fetchComments();
    }

    const fetchComments = () => {
        getComments(Number(videoId)).then(data => {
            setComments(data.map((d: any) => CommentMapper(d)));
        }).catch(error => {
            toast(error.message, {type: "error"});
        });
    }

    useEffect(() => {
        if (!video) {
            return;
        }

        // Check if user is subscribed

        hasActiveToken(video.user.id).then(response => {
            setSubscribed(response);
        }).catch(error => {
            toast(error.message, {type: "error"});
        });
    }, [video]);

    useEffect(() => {
        getVideo(Number(videoId)).then(data => {
            const v = VideoMapper(data);

            setVideo(v);

            let initialState = "NONE";
            if (v.upvoted) {
                initialState = "UP";
            } else if (v.downvoted) {
                initialState = "DOWN";
            }

            setUpvoteState(initialState);
        }).catch(error => {
            toast(error.message, {type: "error"});
            history.push("/");
        });

        getVideos({}).then((response) => {
            return response.json();
        }).then((data) => {
            setVideos(data.map((d: any) => VideoMapper(d)));
        }).catch((error) => {
            console.log(error);
        });


        fetchComments();

    }, [videoId]);

    if (video) {
        return <div style={{marginBottom: "50px"}} className={!subscribed ? "blur" : ""}>
            <Dialog open={!subscribed}>
                <DialogTitle>You are not subscribed to {video.user.displayName || video.user.username}</DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        To be able to view this video from {video.user.displayName || video.user.username} you need to
                        be subscribed. You can do so from the channels home page.
                    </DialogContentText>

                    <DialogActions>
                        <Button onClick={() => history.goBack()}>Back</Button>

                        <Button
                            color={"primary"}
                            variant={"contained"}
                            disableElevation
                            onClick={() => history.push(`/channel/${video.user.id}`)}
                        >
                            Subscribe
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>

            <VideoPlayer onPlay={incrementPlay} options={videoOptions} onReady={() => console.log("Ready")}/>

            <div className={"flex-row padding-md"}>
                <div className={"flex-row margin-md"}>
                    <Avatar
                        src={`${process.env.REACT_APP_S3_CDN_URL}/images/avatars/${video.user.avatarFilename}`}
                    >
                        {!video.user.avatarFilename && video.user.username[0].toUpperCase()}
                    </Avatar>

                    <Typography variant={"body1"}>
                        {video.user.displayName || video.user.username}
                    </Typography>
                </div>

                <div className={"flex-row margin-md"}>
                    <Typography variant={"h4"}>{video.title}</Typography>
                </div>

                <div className={"flex-row margin-md"}>
                    <div>
                        <Typography variant={"subtitle1"}>
                            {video.plays} views
                        </Typography>
                    </div>

                    <div>
                        <Typography variant={"subtitle1"}>
                            {video.uploadDate.toDateString()}
                        </Typography>
                    </div>

                    <div>
                        <div className={"margin-h-sm"}>
                            <IconButton onClick={attemptToggleUpvote}>
                                {upvoteState === "UP" ? <ThumbUp color={"primary"}/> : <ThumbUpOutlined/>}
                            </IconButton>

                            <span>{video.upvotes}</span>

                            <IconButton onClick={attemptToggleDownvote}>
                                {upvoteState === "DOWN" ? <ThumbDown color={"primary"}/> : <ThumbDownOutlined/>}
                            </IconButton>

                            <span>{video.downvotes}</span>
                        </div>

                        <LinearProgress variant={"determinate"} value={video.upvotes / (video.downvotes + 1) * 100}/>
                    </div>
                </div>
            </div>

            <div className={"flex-row padding-md align-start"} style={{height: "200px"}}>
                <Typography variant={"body1"}>
                    {video.description}
                </Typography>
            </div>

            <Divider className={"full-width"} style={{marginBottom: "50px"}}/>

            <Grid container>
                <Grid item xs={12} lg={6}>
                    <div className={"flex-row justify-center"}>
                        <Typography variant={"subtitle1"}>
                            {comments.length} Comments
                        </Typography>
                    </div>
                    <CommentList onAdd={onCommentAdd} comments={comments} video={video}/>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <div className={"flex-row justify-center"}>
                        <Typography variant={"subtitle1"}>
                            What to watch next
                        </Typography>
                    </div>

                    <div className={"slick-container"}>
                        <Slider {...settings}>
                            {videos.slice(0, 2).map((video, i) => <VideoCarouselPreview key={i} video={video}/>)}
                        </Slider>
                    </div>
                </Grid>
            </Grid>
        </div>
    } else {
        return <div>
            Loading...
        </div>
    }
}
