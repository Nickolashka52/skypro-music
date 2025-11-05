import { TrackType } from '@/sharedTypes/sharedTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createShuffledPlaylist,
  getNextTrack,
  getPrevTrack,
} from './trackUtils';

type initialStateType = {
  currentTrack: TrackType | null;
  playlist: TrackType[];
  shuffledPlaylist: TrackType[];
  playedTracks: TrackType[];
  currentIndex: number;
  isPlay: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
};

const initialState: initialStateType = {
  currentTrack: null,
  playlist: [],
  shuffledPlaylist: [],
  playedTracks: [],
  currentIndex: -1,
  isPlay: false,
  isShuffle: false,
  isRepeat: false,
};

const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setCurrentPlaylist: (state, action: PayloadAction<TrackType[]>) => {
      state.playlist = action.payload;
      state.shuffledPlaylist = [...action.payload];
      state.playedTracks = [];
      state.currentIndex = -1;
      state.currentTrack = null;
    },

    setCurrentTrack: (
      state,
      action: PayloadAction<{ track: TrackType; playlist?: TrackType[] }>,
    ) => {
      const { track, playlist } = action.payload;

      if (playlist) {
        state.playlist = playlist;
        state.shuffledPlaylist = [...playlist];
      }

      state.currentTrack = track;
      state.currentIndex = state.playlist.findIndex((t) => t._id === track._id);
      state.playedTracks = [track];

      if (state.isShuffle) {
        state.shuffledPlaylist = createShuffledPlaylist(state.playlist, track);
      }
    },

    setIsPlay: (state, action: PayloadAction<boolean>) => {
      state.isPlay = action.payload;
    },

    toggleShuffle: (state) => {
      state.isShuffle = !state.isShuffle;

      if (state.isShuffle && state.currentTrack) {
        state.shuffledPlaylist = createShuffledPlaylist(
          state.playlist,
          state.currentTrack,
        );
        state.playedTracks = [state.currentTrack];
      } else {
        state.playedTracks = state.currentTrack ? [state.currentTrack] : [];
      }
    },

    toggleRepeat: (state) => {
      state.isRepeat = !state.isRepeat;
    },

    setNextTrack: (state) => {
      const nextTrack = getNextTrack(state);
      if (!nextTrack) return;

      state.currentTrack = nextTrack;
      state.currentIndex = state.playlist.findIndex(
        (t) => t._id === nextTrack._id,
      );

      if (state.isShuffle) {
        // Добавляем в playedTracks, если ещё не был
        if (!state.playedTracks.some((t) => t._id === nextTrack._id)) {
          state.playedTracks.push(nextTrack);
        }

        // Если все сыграли — пересоздаём в getNextTrack, но playedTracks сбрасываем
        if (state.playedTracks.length === state.playlist.length) {
          state.playedTracks = [state.currentTrack];
          state.shuffledPlaylist = createShuffledPlaylist(
            state.playlist,
            state.currentTrack,
          );
        }
      } else {
        state.playedTracks = [nextTrack];
      }
    },

    setPrevTrack: (state) => {
      const prevTrack = getPrevTrack(state);
      if (!prevTrack) return;

      state.currentTrack = prevTrack;
      state.currentIndex = state.playlist.findIndex(
        (t) => t._id === prevTrack._id,
      );

      // Обновляем playedTracks: обрезаем "будущее"
      const prevIndex = state.playedTracks.findIndex(
        (t) => t._id === prevTrack._id,
      );
      if (prevIndex !== -1) {
        state.playedTracks = state.playedTracks.slice(0, prevIndex + 1);
      }
    },
  },
});

export const {
  setCurrentTrack,
  setCurrentPlaylist,
  setIsPlay,
  setNextTrack,
  setPrevTrack,
  toggleShuffle,
  toggleRepeat,
} = trackSlice.actions;

export const trackSliceReducer = trackSlice.reducer;
