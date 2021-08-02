import {Typography} from "@material-ui/core";
import Slider from "react-slick";
import {VideoCarouselPreview} from "./VideoCarouselPreview";
import React, {useEffect, useState} from "react";
import {Video, VideoMapper} from "../types/videos";
import {getVideos} from "../api";
import {trackPromise} from "react-promise-tracker";

export const RecommendedVideos = () => {
    const [videos, setVideos] = useState<Video[]>([]);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: Math.min(videos.length, 4)
    }

    useEffect(() => {
        let mounted = true;

        trackPromise(
            getVideos({recommended: true}).then((response) => {
                return response.json();
            }).then((data) => {
                const videos = data.map((d: any) => VideoMapper(d));

                if (mounted) {
                    setVideos(videos);
                }
            }).catch((error) => {
                console.log(error);
            })
        )

        return () => {
            mounted = false;
        }
    }, []);

    if (videos.length === 0) {
        return <></>
    }

    return <div>
        <Typography variant={"h4"}>
            What to watch next
        </Typography>

        <div className={"slick-container"}>
            <Slider {...settings}>
                {videos.map((video, i) => <VideoCarouselPreview key={i} video={video}/>)}
            </Slider>
        </div>
    </div>
}
