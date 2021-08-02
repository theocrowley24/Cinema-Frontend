import React, {useEffect, useState} from "react";
import {Button, Typography} from "@material-ui/core";
import {getFeaturedChannel} from "../cms";
import {FeaturedChannel} from "../types/cms";
import {InfoOutlined, VisibilityOutlined} from "@material-ui/icons";
import {useHistory} from "react-router-dom";

export const FeaturedBanner = () => {
    const [featuredChannel, setFeaturedChannel] = useState<FeaturedChannel | null>(null);

    const history = useHistory();

    useEffect(() => {
        let mounted = true;

        getFeaturedChannel().then(response => {
            if (mounted) {
                setFeaturedChannel(response as FeaturedChannel);
            }
        }).catch(error => {
            console.log(error);
        });

        return () => {
            mounted = false;
        };
    }, []);

    return <div className={"featured-banner"}>
        <video loop muted autoPlay src={`${process.env.REACT_APP_CMS_URL}${featuredChannel?.trailer.url}`}/>

        <div className={"featured-banner-overlay margin-md"}>
            <Typography variant={"h1"}>
                {featuredChannel?.name}
            </Typography>

            <Typography variant={"subtitle1"}>
                {featuredChannel?.subtitle}
            </Typography>

            <div className={"flex-row justify-start margin-h-md"}>
                <div>
                    <Button
                        startIcon={<VisibilityOutlined/>}
                        variant={"contained"}
                        color={"primary"}
                        onClick={() => history.push(featuredChannel?.link || "")}
                    >
                        View
                    </Button>
                </div>
                <div>
                    <Button
                        variant={"contained"}
                        color={"secondary"}
                        startIcon={<InfoOutlined/>}
                    >
                        More info
                    </Button>
                </div>
            </div>
        </div>
    </div>
}
