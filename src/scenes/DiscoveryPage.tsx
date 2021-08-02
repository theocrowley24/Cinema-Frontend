import React, {useContext, useEffect, useState} from "react";
import {Avatar, Grid, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Typography} from "@material-ui/core";
import {Video, VideoMapper, VideoTag, VideoTagMapper} from "../types/videos";
import {getPopularTags, getTopChannels, getVideos} from "../api";
import {TagFacesOutlined} from "@material-ui/icons";
import {User, UserMapper, UserType} from "../types/user";
import {useHistory} from "react-router-dom";
import {AuthContext} from "../App";
import {SubscriptionVideos} from "../components/SubscriptionVideos";
import {RecommendedVideos} from "../components/RecommendedVideos";
import {FeaturedBanner} from "../components/FeaturedBanner";
import {RecommendedChannels} from "../components/RecommendedChannels";
import {toast} from "react-toastify";
import {trackPromise} from "react-promise-tracker";


export const DiscoveryPage = () => {
    const [upvotedVideos, setUpvotedVideos] = useState<Video[]>([]);
    const [recentlyWatchedVideos, setRecentlyWatchedVideos] = useState<Video[]>([]);
    const [popularTags, setPopularTags] = useState<VideoTag[]>([]);
    const [topChannels, setTopChannels] = useState<User[]>([]);

    const {user} = useContext(AuthContext);

    const history = useHistory();

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            try {
                const topChannelsResponse = await getTopChannels();

                if (mounted) {
                    setTopChannels(topChannelsResponse.map((d: any) => UserMapper(d)));
                }

                const popularTagsResponse = await getPopularTags();

                if (mounted) {
                    setPopularTags(popularTagsResponse.map((d: any) => VideoTagMapper(d)));
                }

                const upvotedVideosResponse = await getVideos({upvoted: true});
                const upvotedVideosData = await upvotedVideosResponse.json();

                const upvotedVideos = upvotedVideosData.map((d: any) => VideoMapper(d));

                if (mounted) {
                    setUpvotedVideos(upvotedVideos);
                }

                const recentlyWatchedVideosResponse = await getVideos({recently_watched: true});
                const recentlyWatchedVideosData = await recentlyWatchedVideosResponse.json();

                const recentlyWatchedVideos = recentlyWatchedVideosData.map((d: any) => VideoMapper(d));

                if (mounted) {
                    setRecentlyWatchedVideos(recentlyWatchedVideos);
                }
            } catch (error) {
                toast(error.message, {type: "error"});
            }
        }

        trackPromise(fetchData());

        return () => {
            mounted = false;
        }
    }, []);

    return <div>
        <Grid container>
            <Grid item xs={10}>
                <div>
                    <FeaturedBanner/>

                    <div className={"padding-md"}>

                        {user?.userType === UserType.SUBSCRIBER && <SubscriptionVideos/>}

                        <RecommendedVideos/>

                        {user?.userType === UserType.SUBSCRIBER && <RecommendedChannels/>}
                    </div>
                </div>
            </Grid>

            <Grid item xs={2}>
                <div className={"discovery-right-panel padding-md"}>
                    <List subheader={<Typography variant={"subtitle1"}>Top Channels</Typography>}>
                        {topChannels.map((channel, i) => <ListItem button key={i}
                                                                   onClick={() => history.push(`/channel/${channel.id}`)}>
                            <ListItemAvatar>
                                <Avatar
                                    src={`${process.env.REACT_APP_S3_CDN_URL}/images/avatars/${channel.avatarFilename}`}
                                >
                                    {!channel.avatarFilename && channel.username[0].toUpperCase()}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText>
                                <div style={{overflow: "hidden", textOverflow: "ellipsis"}}>
                                    {channel.displayName || channel.username}
                                </div>
                            </ListItemText>
                        </ListItem>)}
                    </List>

                    {user?.userType === UserType.SUBSCRIBER &&
                    <List subheader={<Typography variant={"subtitle1"}>Recently watched</Typography>}>
                        {recentlyWatchedVideos.slice(0, 5).map((video, i) => <ListItem key={i} button>
                            <ListItemIcon>
                                <img width={25} height={25}
                                     src={`${process.env.REACT_APP_S3_CDN_URL}/videos/${video.fileName}/thumbnail.jpeg`}/>
                            </ListItemIcon>
                            <ListItemText secondary={video.user.displayName || video.user.username}>
                                {video.title}
                            </ListItemText>
                        </ListItem>)}
                    </List>}

                    {user?.userType === UserType.SUBSCRIBER &&
                    <List subheader={<Typography variant={"subtitle1"}>Upvoted videos</Typography>}>

                        {upvotedVideos.slice(0, 5).map((video, i) => <ListItem key={i} button>
                            <ListItemIcon>
                                <img width={25} height={25}
                                     src={`${process.env.REACT_APP_S3_CDN_URL}/videos/${video.fileName}/thumbnail.jpeg`}/>
                            </ListItemIcon>
                            <ListItemText secondary={video.user.displayName || video.user.username}>
                                {video.title}
                            </ListItemText>
                        </ListItem>)}
                    </List>}

                    <List subheader={<Typography variant={"subtitle1"}>Popular tags</Typography>}>
                        {popularTags.map((tag, i) => <ListItem button key={i}
                                                               onClick={() => history.push(`search/none/${tag.id}`)}>
                            <ListItemIcon>
                                <TagFacesOutlined color={"secondary"}/>
                            </ListItemIcon>
                            <ListItemText>
                                {tag.name}
                            </ListItemText>
                        </ListItem>)}
                    </List>
                </div>
            </Grid>
        </Grid>
    </div>
}
