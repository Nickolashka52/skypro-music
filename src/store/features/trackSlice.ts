import { TrackType } from '@/sharedTypes/sharedTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    // Установка плейлиста
    setCurrentPlaylist: (state, action: PayloadAction<TrackType[]>) => {
      state.playlist = action.payload;
      state.shuffledPlaylist = [...action.payload];
      state.playedTracks = [];
      state.currentIndex = -1;
    },

    // Выбор трека
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

      // Если shuffle включён — пересоздать перемешанный список
      if (state.isShuffle) {
        const withoutCurrent = state.playlist.filter(
          (t) => t._id !== track._id,
        );
        state.shuffledPlaylist = [...withoutCurrent].sort(
          () => Math.random() - 0.5,
        );
        state.shuffledPlaylist.unshift(track); // текущий — первый
      }
    },

    setIsPlay: (state, action: PayloadAction<boolean>) => {
      state.isPlay = action.payload;
    },

    toggleShuffle: (state) => {
      state.isShuffle = !state.isShuffle;

      if (state.isShuffle && state.currentTrack) {
        const withoutCurrent = state.playlist.filter(
          (t) => t._id !== state.currentTrack!._id,
        );
        state.shuffledPlaylist = [...withoutCurrent].sort(
          () => Math.random() - 0.5,
        );
        state.shuffledPlaylist.unshift(state.currentTrack); // текущий — первый
        state.playedTracks = [state.currentTrack];
      } else {
        state.playedTracks = state.currentTrack ? [state.currentTrack] : [];
      }
    },

    toggleRepeat: (state) => {
      state.isRepeat = !state.isRepeat;
    },

    // === NEXT TRACK ===
    setNextTrack: (state) => {
      if (!state.currentTrack || state.playlist.length === 0) return;

      let nextTrack: TrackType;

      if (state.isShuffle) {
        // Доступные треки (ещё не играли)
        const available = state.shuffledPlaylist.filter(
          (t) => !state.playedTracks.some((p) => p._id === t._id),
        );

        if (available.length === 0) {
          // Все сыграли → пересоздать и начать заново
          const withoutCurrent = state.playlist.filter(
            (t) => t._id !== state.currentTrack!._id,
          );
          state.shuffledPlaylist = [...withoutCurrent].sort(
            () => Math.random() - 0.5,
          );
          state.shuffledPlaylist.unshift(state.currentTrack);
          state.playedTracks = [state.currentTrack];

          nextTrack = state.shuffledPlaylist[1]; // следующий после текущего
        } else {
          // Выбираем случайный из доступных
          const randomIdx = Math.floor(Math.random() * available.length);
          nextTrack = available[randomIdx];
          state.playedTracks.push(nextTrack);
        }
      } else {
        // Обычный порядок
        let nextIdx = state.currentIndex + 1;
        if (nextIdx >= state.playlist.length) {
          nextIdx = state.isRepeat ? 0 : state.currentIndex;
        }
        nextTrack = state.playlist[nextIdx];
        state.playedTracks = [nextTrack]; // сбрасываем при обычном режиме
      }

      state.currentTrack = nextTrack;
      state.currentIndex = state.playlist.findIndex(
        (t) => t._id === nextTrack._id,
      );
    },

    // === PREV TRACK ===
    setPrevTrack: (state) => {
      if (!state.currentTrack || state.playlist.length === 0) return;

      const list = state.isShuffle ? state.shuffledPlaylist : state.playlist;
      const currentIdxInList = list.findIndex(
        (t) => t._id === state.currentTrack!._id,
      );

      let prevIdx = currentIdxInList - 1;
      if (prevIdx < 0) {
        prevIdx = state.isRepeat ? list.length - 1 : currentIdxInList;
      }

      const prevTrack = list[prevIdx];
      state.currentTrack = prevTrack;
      state.currentIndex = state.playlist.findIndex(
        (t) => t._id === prevTrack._id,
      );

      // Обновляем playedTracks — обрезаем "будущее"
      const prevInHistory = state.playedTracks.findIndex(
        (t) => t._id === prevTrack._id,
      );
      if (prevInHistory !== -1) {
        state.playedTracks = state.playedTracks.slice(0, prevInHistory + 1);
      } else {
        state.playedTracks = [...state.playedTracks, prevTrack];
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
