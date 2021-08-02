import {Typography} from "@material-ui/core";
import Slider from "react-slick";
import {VideoCarouselPreview} from "./VideoCarouselPreview";
import React, {useEffect, useState} from "react";
import {Video, VideoMapper} from "../types/videos";
import {getVideos} from "../api";
import {trackPromise} from "react-promise-tracker";
import {toast} from "react-toastify";

export const SubscriptionVideos = () => {
    const [videos, setVideos] = useState<Video[]>([]);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: Math.min(videos.length, 4)
    }



    useEffect(() => {
        let mounted = true;

        const fetchData = async (): Promise<boolean> => {
            try {
                const response = await getVideos({subscriptions: true});
                const data = await response.json();
                const _videos = data.map((d: any) => VideoMapper(d));

                if (mounted) {
                    setVideos(_videos);
                }

            } catch (error) {
                toast(error.message, {type: "error"});
            }

            return true;
        }

        trackPromise(
            fetchData()
        );

        return () => {
            mounted = false;
        }
    }, []);

    if (videos.length === 0) {
        return <></>
    }

    return <div>
        <Typography variant={"h4"}>
            New from your subscriptions
        </Typography>

        <div className={"slick-container"}>
            <Slider {...settings}>
                {videos.map((video, i) => <VideoCarouselPreview key={i} video={video}/>)}
            </Slider>
        </div>
    </div>
}
