import React, {useEffect, useRef, useState} from "react";
import videojs, {VideoJsPlayer, VideoJsPlayerOptions} from 'video.js'

const VideoPlayer = ({options, onReady, onPlay}: { options: VideoJsPlayerOptions, onReady: () => void, onPlay: () => void }) => {
    const [player, setPlayer] = useState<VideoJsPlayer>();
    const video = useRef(null);

    useEffect(() => {
        setPlayer(videojs(video.current, options, onReady));

        player?.on('play', e => {
            onPlay();
        })
    }, [onReady, options, onPlay]);

    return <div data-vjs-player style={{width: "100%"}}>
        <video controls ref={video} className={"video-js"}/>
    </div>
}

export default VideoPlayer;
