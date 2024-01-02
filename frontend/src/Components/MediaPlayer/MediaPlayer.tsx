import { useState, useEffect, useContext } from 'react';
import mediaContext from "../../Contexts/Homepage/MediaContext";
import { Table, ListGroup } from "react-bootstrap";
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from "react-icons/ai";
import { RiVideoFill, RiVideoLine } from "react-icons/ri";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { SongDetail } from "../../Types/SongDetail";
import tafAlbum from "../../media/tafalbum.png";
import CyberBackground from "../../media/cyber_03.mp4";
import { ContentContainer } from '../Controls/ContentContainer';

function MediaPlayer() {
    const {
        currentSongIndex,
        playlist,
        audio,
        random,
        audioPlaying,
        videoShuffle,
        toggleVideoShuffle,
        toggleMediaPlaying,
        toggleRandom,
        toggleRepeat,
        setCurrentSong,
    } = useContext(mediaContext)

    const [currentSongDetail, setCurrentSongDetail] = useState<SongDetail | null>(null);
    const [seekDuration, setSeekDuration] = useState(0);
    const [seekValue, setSeekValue] = useState(0);

    /**
     * Onload event
     */
    useEffect(() => {
        if (audio.current) {

            // Add a listener to update the song duration bar
            audio.current.ontimeupdate = ((timeupdateEvent: Event) => {
                setSeekValue((timeupdateEvent.target as HTMLAudioElement).currentTime);
            });

            // Add a listener for when a new song is loaded
            audio.current.onloadeddata = (() => {
                setSeekDuration(audio.current!.duration);
            })

            // If someone starts playing a song from a different page,
            // then the `onloadeddata` listener above will not fire.
            // This will update the song seek duration in that case.
            if (seekDuration === 0) {
                setSeekDuration(audio.current!.duration);
            }
        }

        // Set initial song info
        if (!playlist || playlist.length == 0) {
            setCurrentSongDetail({ title: "Loading", artist: "", url: "", albumArt: null, album: "", trackNumber: 0 });
        }

    }, [])

    /**
     * Triggers whenever the current song changes.
     */
    useEffect(() => {
        if (playlist && playlist.length > 0 && currentSongIndex >= 0) {
            setCurrentSongDetail(playlist[currentSongIndex]);
        }
    }, [currentSongIndex]);

    /**
     * Triggers whenever the list of songs changes
     */
    useEffect(() => {
        console.log("AudioController::useEffect::playlist", playlist);
        if (playlist && playlist.length > 0 && currentSongIndex >= 0) {
            setCurrentSongDetail({
                title: playlist[currentSongIndex].title,
                artist: playlist[currentSongIndex].artist,
                url: playlist[currentSongIndex].url,
                albumArt: playlist[currentSongIndex].albumArt,
                album: playlist[currentSongIndex].album,
                trackNumber: playlist[currentSongIndex].trackNumber
            });
        }
    }, [playlist])


    /**
     * CSS hack to re-style seek bar as the seek value changes
     */
    useEffect(() => {
        let target = document.querySelector("#AudioSeekBar") as HTMLInputElement;
        let relativeValue = Number(target.value) - Number(target.min);
        let relativeMax = Number(target.max) - Number(target.min)
        let value = relativeValue / relativeMax * 100;
        target.style.background = 'linear-gradient(to right, #0839b3 0%, #3767e1 ' + value + '%, #fff ' + value + '%, white 100%)'
    }, [seekValue]);


    /**
     * Get album art for the current song
     */
    function getAlbumArt(song: SongDetail | null) {
        return song?.albumArt ?? tafAlbum;
    }

    /**
     * Handle behavior for seekbar changes
     */
    function handleSeekInput(target: EventTarget) {
        const timeSeconds = Number((target as HTMLInputElement).value);
        audio.current!.currentTime = timeSeconds;
    }

    /**
     * Handle behavior for backward media navigation
     */
    function handleBackward() {
        if (seekValue < 5) {
            setCurrentSong(currentSongIndex - 1);
        } else {
            // Restart current song
            audio.current!.currentTime = 0;
        }
    }

    function seekInfo(){
        let currentMinutes = `${Math.floor(seekValue / 60)}`.padStart(2, "0");
        let currentSeconds = `${Math.floor(seekValue % 60)}`.padStart(2, "0");
        let maxMinutes = `${Math.floor(seekDuration / 60)}`.padStart(2, "0");
        let maxSeconds = `${Math.floor(seekDuration % 60)}`.padStart(2, "0");
        return `${currentMinutes}:${currentSeconds} | ${maxMinutes}:${maxSeconds}`
    }

    return (
        <ContentContainer>
            <article className={`screen`} style={CyberStyle} >
                <input type="checkbox" value="None" id="magicButton" name="check" />
                <label className="main" htmlFor="magicButton"></label>

                <img className="coverImage" src={getAlbumArt(currentSongDetail)}></img>
                <div className="bodyPlayer"></div>

                <table className="list songlist">
                    <tbody>
                        {
                            playlist?.map((song, index) => (
                                <tr key={index} className="song songlistSong" onClick={() => setCurrentSong(index)} >
                                    <td className="nr" ><h5>{index + 1}</h5></td>
                                    <td className="title"><h6>{song.title}</h6></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                {/* <div className="shadow">
                </div> */}

                <div className="bar">
                    <input
                        id="AudioSeekBar"
                        type="range"
                        step="any"
                        value={seekValue}
                        min="0"
                        max={seekDuration}
                        onChange={(event) => handleSeekInput(event.target)}
                        style={BarStyle}
                    />
                </div>

                <div className="info">
                    <h4>{currentSongDetail?.title}</h4>
                    <h3>{currentSongDetail?.artist}</h3>
                    <h4 style={{"marginTop": "16px"}}>{seekInfo()}</h4>
                </div>
                <table className="footer">
                </table>
            </article>
        </ContentContainer>
    );
}

type cssProperties = Record<string | number, string & {}>

const musicPlayer: cssProperties = {
    color: "white",
    maxHeight: "600px",
    display: "inline-block",
    width: '100%',
    height: '100%',
    overflow: 'scroll',
    position: 'relative'
};


const musicPlayerBody: cssProperties = {
    overflowY: "auto",
    maxHeight: "575px",
    display: "inline-block",
};

const musicPlayerSong: cssProperties = {
    padding: "0px 10px 0px 10px"
}

const CyberStyle = {
    backgroundImage: `url(${CyberBackground})`
}

const BarStyle = {
    "width": "100%"
}

export default MediaPlayer;