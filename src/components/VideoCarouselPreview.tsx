import React from "react";
import {Video} from "../types/videos";
import {Link} from "react-router-dom";
import {Avatar, Chip, Typography} from "@material-ui/core";

export const VideoCarouselPreview = ({video}: { video: Video }) => {
    return <div className={"video-carousel-preview"}>
        <Link to={`/video/${video.id}`}>
            <img alt={video.title} src={`${process.env.REACT_APP_S3_CDN_URL}/videos/${video.fileName}/thumbnail.jpeg`}/>

            <div className={"video-carousel-preview-overlay"}>
                <div className={"flex-row justify-start margin-h-md"}>
                    <Avatar
                        src={`${process.env.REACT_APP_S3_CDN_URL}/images/avatars/${video.user.avatarFilename}`}
                    >
                        {!video.user.avatarFilename && video.user.username[0].toUpperCase()}
                    </Avatar>

                    <Typography variant={"h6"}>
                        {video.user.displayName || video.user.username}
                    </Typography>
                </div>

                <Typography variant={"subtitle1"}>
                    {video.title}
                </Typography>

                <div className={"flex-row justify-start margin-h-sm"}>
                    {video.tags.map((tag, i) => <Chip key={i} color={"secondary"} label={tag.name}/>)}
                </div>
            </div>
        </Link>
    </div>
}
