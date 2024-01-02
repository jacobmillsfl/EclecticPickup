import { VideoDetail } from '../Types/VideoDetail';
import bandshot from '../media/bandshot.mov';

export default class VideoUtility {
    static getVideos() : Array<VideoDetail> {
        return [
            {
                name: "band_shot",
                video: bandshot,
                playbackRate: .5,
            }
        ]
    }
}