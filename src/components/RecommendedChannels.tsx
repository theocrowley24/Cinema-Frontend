import {Typography} from "@material-ui/core";
import Slider from "react-slick";
import React, {useEffect, useState} from "react";
import {getUsers} from "../api";
import {User, UserMapper} from "../types/user";
import {ChannelCarouselPreview} from "./ChannelCarouselPreview";
import {toast} from "react-toastify";
import {trackPromise} from "react-promise-tracker";

export const RecommendedChannels = () => {
    const [channels, setChannels] = useState<User[]>([]);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: Math.min(channels.length, 4)
    }

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            try {
                let response = await getUsers({});

                const channels = response.map((d: any) => UserMapper(d));

                if (mounted) {
                    setChannels(channels);
                }
            } catch (error) {
                toast(error.message, {type: "error"});
            }
        }

        trackPromise(
            fetchData()
        );

        return () => {
            mounted = false;
        }
    }, []);

    if (channels.length === 0) {
        return <></>
    }

    return <div>
        <Typography variant={"h4"}>
            Subscribe to...
        </Typography>

        <div className={"slick-container"}>
            <Slider {...settings}>
                {channels.map((channel, i) => <ChannelCarouselPreview key={i} user={channel}/>)}
            </Slider>
        </div>
    </div>
}
