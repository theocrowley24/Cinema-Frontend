import React from "react";
import {User} from "../types/user";
import {Button, Chip, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";

export const ChannelPreviewSearchResult = ({user}: { user: User }) => {
    return <Link to={`/channel/${user.id}`} style={{textDecoration: "none"}}>
        <div className={"flex-row justify-start channel-preview-search-result"}>
            <div className={"full-height"} style={{width: "20%"}}>
                <img src={`${process.env.REACT_APP_S3_CDN_URL}/images/avatars/${user.avatarFilename}`}/>
            </div>

            <div className={"full-height"} style={{width: "40%"}}>

                <div className={"flex-row justify-start margin-h-md"}>
                    <Typography variant={"h6"}>
                        {user.displayName || user.username}
                    </Typography>

                    <Chip color={"secondary"} label={"Verified"}/>
                </div>

                <Typography variant={"subtitle1"}>
                    {user.subscribers} subscribers
                </Typography>

                <Typography variant={"body2"}>
                    {user.bio}
                </Typography>
            </div>
        </div>
    </Link>
}
