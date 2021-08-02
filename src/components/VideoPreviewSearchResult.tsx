import React from "react";
import {Video} from "../types/videos";
import {Avatar, Badge, Chip, Tooltip, Typography} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {CheckCircleOutlined} from "@material-ui/icons";

export const VideoPreviewSearchResult = ({video}: { video: Video }) => {
    const history = useHistory();

    const mainOnClick = () => {
        history.push(`/video/${video.id}`);
    }

    const channelRedirect = () => {
        history.push(`/channel/${video.user.id}`);
    }

    return <div onClick={mainOnClick}
                className={"flex-row justify-start align-start margin-h-md video-preview-search-result"}>
        <div className={"video-thumbnail"}>
            <img src={`${process.env.REACT_APP_S3_CDN_URL}/videos/${video.fileName}/thumbnail.jpeg`}/>
        </div>

        <div className={"margin-v-md"}>
            <Typography variant={"h6"} align={"left"}>
                {video.title}
            </Typography>

            <div className={"flex-row justify-start margin-h-md"}>
                <Avatar
                    src={`${process.env.REACT_APP_S3_CDN_URL}/images/avatars/${video.user.avatarFilename}`}
                >
                    {!video.user.avatarFilename && video.user.username[0].toUpperCase()}
                </Avatar>

                <Tooltip title={video.user.username}>
                    <>
                        <Typography variant={"subtitle1"} align={"left"} onClick={channelRedirect}>
                            {video.user.displayName || video.user.username}
                        </Typography>

                        <Chip color={"secondary"} label={"Verified"}/>
                    </>
                </Tooltip>
            </div>

            <Typography variant={"body1"} align={"left"}>
                {video.plays} views - {video.uploadDate.toDateString()}
            </Typography>

            <div className={"flex-row justify-start margin-h-sm"}>
                {video.tags.map((tag, i) => <Chip key={i} label={tag.name} color={"secondary"}/>)}
            </div>
        </div>
    </div>
}
