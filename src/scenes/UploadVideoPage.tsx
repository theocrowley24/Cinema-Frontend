import React, {FormEvent, useContext, useEffect, useState} from "react";
import {Box, Button, Grid, LinearProgress, Slider, TextField, Typography} from "@material-ui/core";
import {VideoTag, VideoTagMapper} from "../types/videos";
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from "axios";
import {toast} from "react-toastify";
import {AuthContext} from "../App";
import {useHistory} from "react-router-dom";
import {getAvailableTags} from "../api";
import ReactCrop, {Crop} from "react-image-crop";
import {getCroppedImg} from "../helpers/CropImage";
import {UserType} from "../types/user";

const UploadVideoComponent = () => {
    const history = useHistory();
    const {user} = useContext(AuthContext);

    if (user?.userType !== UserType.CHANNEL) {
        history.push("/");
    }

    const [videoTitle, setVideoTitle] = useState("");
    const [videoDescription, setVideoDescription] = useState("");
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoFileSrc, setVideoFileSrc] = useState("");
    const [videoDuration, setVideoDuration] = useState(0);

    // Todo combine these into 2
    const [uploadedThumbnailFile, setUploadedThumbnailFile] = useState<File | null>(null);
    const [uploadedThumbnailSrc, setUploadedThumbnailSrc] = useState<string>("");
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailSrc, setThumbnailSrc] = useState<string>("");

    const [availableTags, setAvailableTags] = useState<VideoTag[]>([]);
    const [selectedTags, setSelectedTags] = useState<VideoTag[]>([]);
    const [progress, setProgress] = useState(0);

    const [crop, setCrop] = useState<Crop>({aspect: 1.8});
    const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);

    const [loading, setLoading] = useState(false);

    const uploadVideo = async (e: FormEvent) => {
        e.preventDefault();
        if (videoFile && (thumbnailFile || (uploadedThumbnailFile && imageElement))) {
            setLoading(true);

            //TODO move all this out to Video Api
            const formData = new FormData();
            formData.append("video", videoFile);

            if (uploadedThumbnailFile && imageElement) {
                const croppedThumbnail = await getCroppedImg(imageElement, crop, "thumbnail");

                if (croppedThumbnail) {
                    formData.append("thumbnail", croppedThumbnail);
                } else {
                    // This shouldn't happen...
                    return;
                }
            } else if (thumbnailFile) {
                console.log(thumbnailFile)
                formData.append("thumbnail", thumbnailFile);
            }

            formData.append("data", new Blob([JSON.stringify({
                video_title: videoTitle,
                video_description: videoDescription,
                video_tags: selectedTags.map(t => t.id)
            })], {
                type: "application/json"
            }));

            axios.request({
                method: "post",
                url: "http://localhost:5000/upload/",
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("cinema_token")
                },
                onUploadProgress: (p) => {
                    setProgress(p.loaded / p.total * 100);
                },
                data: formData
            }).then(data => {
                console.log(data);
                toast("Upload complete!", {type: "success"});
                setLoading(false);
            }).catch(error => {
                toast(error.message, {type: "error"});
                setLoading(false);
            });
        }
    }


    const uploadedThumbnailOnChange = (e: FormEvent<HTMLInputElement>) => {
        const file = e?.currentTarget?.files ? e?.currentTarget?.files[0] : null
        setUploadedThumbnailFile(file);
        setUploadedThumbnailSrc(URL.createObjectURL(file));
    }

    const loadVideo = (file: File): Promise<HTMLVideoElement> => new Promise((resolve, reject) => {
        try {
            let video = document.createElement('video')
            video.preload = 'metadata'

            video.onloadedmetadata = function () {
                resolve(video)
            }

            video.onerror = function () {
                reject("Invalid video. Please select a video file.")
            }

            video.src = window.URL.createObjectURL(file)
        } catch (e) {
            reject(e)
        }
    })

    const videoFileOnChange = async (e: FormEvent<HTMLInputElement>) => {
        const file = e?.currentTarget?.files ? e?.currentTarget?.files[0] : null

        setVideoFile(file);
        setVideoFileSrc(URL.createObjectURL(file));

        if (file) {
            if (!uploadedThumbnailFile) {
                await updateGeneratedThumbnail(file, 0);
            }

            const video: HTMLVideoElement = await loadVideo(file);
            setVideoDuration(video.duration);
        }
    }

    const thumbnailSliderOnChange = async (event: any, value: any) => {
        if (videoFile) {
            await updateGeneratedThumbnail(videoFile, value);
        }
    }

    const updateGeneratedThumbnail = async (file: File, position: number) => {
        const blob = await getVideoThumbnail(file, position);
        if (blob) {
            const file = new File([blob], "thumbnail", {type: "image/jpeg"});
            setThumbnailFile(file);
            setThumbnailSrc(URL.createObjectURL(file));
        }
    }

    const getVideoThumbnail = (file: File, seekTo = 0.0): Promise<Blob | null> => {
        return new Promise((resolve, reject) => {
            // load the file to a video player
            const videoPlayer = document.createElement('video');
            videoPlayer.setAttribute('src', URL.createObjectURL(file));
            videoPlayer.load();
            videoPlayer.addEventListener('error', (ex) => {
                reject(ex.message);
            });
            // load metadata of the video to get video duration and dimensions
            videoPlayer.addEventListener('loadedmetadata', () => {
                // seek to user defined timestamp (in seconds) if possible
                if (videoPlayer.duration < seekTo) {
                    reject("video is too short.");
                    return;
                }
                // delay seeking or else 'seeked' event won't fire on Safari
                setTimeout(() => {
                    videoPlayer.currentTime = seekTo;
                }, 200);
                // extract video thumbnail once seeking is complete
                videoPlayer.addEventListener('seeked', () => {
                    // define a canvas to have the same dimension as the video
                    const canvas = document.createElement("canvas");
                    canvas.width = videoPlayer.videoWidth;
                    canvas.height = videoPlayer.videoHeight;
                    // draw the video frame to canvas
                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
                    // return the canvas image as a blob
                    ctx?.canvas.toBlob(
                        blob => {
                            resolve(blob);
                        },
                        "image/jpeg",
                        0.75 /* quality */
                    );
                });
            });
        });
    }

    useEffect(() => {
        getAvailableTags().then(response => {
            setAvailableTags(response.map((d: any) => VideoTagMapper(d)));
        }).catch(error => {
            console.log(error);
        });
    }, []);

    return <form onSubmit={uploadVideo}>
        <div className={"padding-md"}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant={"h2"}>
                        Upload
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant={"h4"}>
                                Info
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                required
                                label={"Title"}
                                variant={"outlined"}
                                value={videoTitle}
                                onChange={e => setVideoTitle(e.target.value)}
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                required
                                multiline
                                label={"Description"}
                                variant={"outlined"}
                                value={videoDescription}
                                onChange={e => setVideoDescription(e.target.value)}
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Autocomplete
                                multiple
                                options={availableTags}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Video tags"
                                        placeholder="E.g. Comedy"
                                    />
                                )}
                                onChange={(e, value) => {
                                    setSelectedTags(value);
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={6}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant={"h4"}>
                                Video
                            </Typography>
                        </Grid>


                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                component="label"
                                disableElevation
                                color={"secondary"}
                                fullWidth
                            >
                                Select Video
                                <input
                                    required
                                    type="file"
                                    accept={"video/*"}
                                    onChange={videoFileOnChange}
                                    hidden
                                />
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            {videoFile && <video style={{maxWidth: "100%"}} controls src={videoFileSrc}/>}
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={6}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant={"h4"}>
                                Thumbnail
                            </Typography>
                        </Grid>


                        <Grid item xs={12}>
                            <Button
                                variant={"contained"}
                                component="label"
                                disableElevation
                                color={"secondary"}
                                fullWidth
                            >
                                Upload your own thumbnail
                                <input
                                    required
                                    type="file"
                                    accept={"image/*"}
                                    onChange={uploadedThumbnailOnChange}
                                    hidden
                                />
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            {uploadedThumbnailFile && <div>
                                <ReactCrop
                                    src={URL.createObjectURL(uploadedThumbnailFile)}
                                    crop={crop}
                                    onChange={newCrop => setCrop(newCrop)}
                                    onImageLoaded={el => setImageElement(el)}
                                />
                                <br/>
                                <Button disableElevation onClick={() => setUploadedThumbnailFile(null)}>Select one from
                                    the video</Button>
                            </div>}

                            {!uploadedThumbnailFile && videoFile && <div>
                                <img style={{width: "320px", height: "180px", margin: "auto"}} alt={"Thumbnail"}
                                     src={thumbnailSrc}/>
                                <Slider
                                    step={5}
                                    min={0}
                                    max={videoDuration}
                                    onChangeCommitted={thumbnailSliderOnChange}
                                />
                            </div>}
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Box display="flex" alignItems="center">
                        <Box width="100%" mr={1}>
                            <LinearProgress variant="determinate" color={"secondary"} value={progress}/>
                        </Box>
                        <Box minWidth={35}>
                            <Typography variant="body2" color="textSecondary">{`${Math.round(
                                progress
                            )}%`}</Typography>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Button
                        disableElevation
                        fullWidth
                        onClick={uploadVideo}
                        type={"submit"}
                        variant={"contained"}
                        color="primary"
                        disabled={loading}
                    >
                        Upload
                    </Button>
                </Grid>
            </Grid>
        </div>
    </form>
}

export default UploadVideoComponent;
