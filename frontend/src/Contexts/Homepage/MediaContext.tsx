import { createContext } from 'react';
import { SongDetail } from '../../Types/SongDetail';
import { HtmlAudioRef } from '../../Types/HtmlAudioRef';

interface MediaPlayerContext {
    currentSongIndex: number;
    songs: Array<SongDetail> | undefined;
    playlist: Array<SongDetail> | undefined;
    playlistName: string | undefined;
    repeat: boolean;
    random: boolean;
    audioPlaying: boolean;
    videoShuffle: boolean;
    audio: HtmlAudioRef;
    setSongsArray: (songArr: Array<SongDetail>) => void;
    toggleMediaPlaying: (play?: boolean) => void;
    toggleVideoShuffle: (play?: boolean) => void;
    toggleRandom: () => void;
    toggleRepeat: () => void;
    setCurrentSong: (id: number) => void;
    setPlaylist: (name: string) => void;
}

const mediaContext = createContext<MediaPlayerContext>({
    currentSongIndex: -1,
    songs: undefined,
    playlist: undefined,
    playlistName: undefined,
    repeat: false,
    random: false,
    audioPlaying: false,
    videoShuffle: true,
    audio: { current: null },
    setSongsArray: () => {},
    toggleMediaPlaying: () => {},
    toggleVideoShuffle: () => {},
    toggleRandom: () => {},
    toggleRepeat: () => {},
    setCurrentSong: () => {},
    setPlaylist: () => {},
});

export default mediaContext;