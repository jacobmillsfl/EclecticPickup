import { useState, useEffect, useContext } from 'react'
// import mediaContext from "../../Contexts/Homepage/MediaContext";
import VideoUtility from "../../Utilities/VideoUtility";
import { VideoDetail } from "../../Types/VideoDetail";

function VideoContainer() {
    let defaultVideo = { name: "default", video: null, playbackRate: 1 };
    const [currentVideo, setCurrentVideo] = useState<VideoDetail>(defaultVideo);
    
    useEffect(() => {
        const videos = VideoUtility.getVideos();
        if (videos.length > 0) {
            // Always uses the first video; Assumes unchanging videos
            setCurrentVideo(videos[0]);
        }
    }, [])

    function videoChanged() {
        let videoElement = document.querySelector("#background") as HTMLVideoElement;
        videoElement.playbackRate = currentVideo.playbackRate;
    }

    return (
        <div className="backgroundContainer">
            <video id="background" muted autoPlay loop src={currentVideo.video} onLoadedData={videoChanged} >
                <source type="video/mp4" />
            </video>
        </div>
    )
}

export default VideoContainer;