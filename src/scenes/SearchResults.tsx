import React, {useEffect, useState} from "react";
import {Video, VideoMapper} from "../types/videos";
import {getUsers, getVideos} from "../api";
import {VideoPreviewSearchResult} from "../components/VideoPreviewSearchResult";
import {useParams} from "react-router-dom";
import {CircularProgress, Tab, Tabs, Typography} from "@material-ui/core";
import {User, UserMapper} from "../types/user";
import {ChannelPreviewSearchResult} from "../components/ChannelPreviewSearchResult";

export const SearchResults = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [tabValue, setTabValue] = useState(0);

    const {query, tags} = useParams<{ query: string, tags: string }>();

    const parsedTags = tags ? tags.split(",").map(t => Number(t)) : [];

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue);
    };

    const [localLoading, setLocalLoading] = useState(0);

    useEffect(() => {

        if (!query) return;

        const correctedQuery = query === "none" ? "" : query;

        setLocalLoading(localLoading + 1);
        getVideos({title: correctedQuery}).then(response => {
            return response.json();
        }).then(data => {
            let _videos: Video[] = data.map((d: any) => VideoMapper(d));
            _videos = _videos.filter(v => {

                const videoTags = v.tags.map(t => t.id);
                let allowed = true;

                videoTags.forEach(t => {
                    if (parsedTags.indexOf(t) === -1) {
                        allowed = false;
                        return;
                    }
                });

                return allowed;
            });
            setVideos(_videos);
            setLocalLoading(localLoading - 1);
        }).catch(error => {
            setLocalLoading(localLoading - 1);
        });

        setLocalLoading(localLoading + 1);
        getUsers({name: correctedQuery}).then(response => {
            const _users = response.map((d: any) => UserMapper(d));
            setUsers(_users);
            setLocalLoading(localLoading - 1);
        }).catch(error => {
            setLocalLoading(localLoading - 1);
        });
    }, [query, tags]);

    return <div className={"margin-v-md padding-md"}>
        <Typography variant={"h5"}>
            Showing results for: {query === "none" ? "" : query}
        </Typography>

        <Tabs
            value={tabValue}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="secondary"
            variant={"fullWidth"}
        >
            <Tab label={"Channels"}/>
            <Tab label={"Videos"}/>
        </Tabs>

        {localLoading > 0 && <div className={"h-center"}>
            <CircularProgress color={"secondary"} variant={"indeterminate"}/>
        </div>}

        {tabValue === 0 && <div>
            {users.map((user, i) => <ChannelPreviewSearchResult key={i} user={user}/>)}
            {users.length === 0 && <span>No results</span>}
        </div>}

        {tabValue === 1 && <div>
            {videos.map((video, i) => <VideoPreviewSearchResult key={i} video={video}/>)}
            {videos.length === 0 && <span>No results</span>}
        </div>}
    </div>
}
