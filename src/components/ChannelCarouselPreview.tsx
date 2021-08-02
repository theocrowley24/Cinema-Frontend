import {User} from "../types/user";
import React from "react";
import {Typography} from "@material-ui/core";
import {Link} from "react-router-dom";

export const ChannelCarouselPreview = ({user}: { user: User }) => {
    return <Link to={`/channel/${user.id}`} style={{textDecoration: "none"}}>
        <div className={"channel-carousel-preview"}>
            <div className={"channel-carousel-preview-avatar"}>
                {user.avatarFilename && <img alt={user.username} src={`${process.env.REACT_APP_S3_CDN_URL}/images/avatars/${user.avatarFilename}`}/>}

                {!user.avatarFilename && <div className={"v-center"}>
                    <Typography variant={"h4"} style={{textTransform: "uppercase"}} align={"center"}>
                        No avatar
                    </Typography>
                </div>}
            </div>

            <Typography variant={"h6"} style={{overflow: "hidden", textOverflow: "ellipsis"}}>
                {user.displayName || user.username}
            </Typography>

            <Typography variant={"body2"}>
                {user.subscribers} subscribers
            </Typography>
        </div>
    </Link>
}
