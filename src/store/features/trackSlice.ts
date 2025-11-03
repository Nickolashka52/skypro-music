import { TrackType } from '@/sharedTypes/sharedTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type initialStateType = {
  currentTrack: null | TrackType;
  isPlay: boolean;
  isShuffle: boolean;
  isRepeat: boolean; 
  playlist: TrackType[];
  shufflePlaylist: TrackType[];
};

const initialState: initialStateType = {
  currentTrack: null,
  isPlay: false,
  isShuffle: false,
  isRepeat: false, 
  playlist: [],
  shufflePlaylist: [],
};

const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    // Устанавливаем текущий трек
    setCurrentTrack: (state, action: PayloadAction<TrackType>) => {
      state.currentTrack = action.payload;
    },

    // Устанавливаем плейлист и создаём перемешанную копию
    setCurrentPlaylist: (state, action: PayloadAction<TrackType[]>) => {
      state.playlist = action.payload;
      state.shufflePlaylist = [...action.payload].sort(
        () => Math.random() - 0.5,
      );
    },

    // Воспроизведение / пауза
    setIsPlay: (state, action: PayloadAction<boolean>) => {
      state.isPlay = action.payload;
    },

    // Переключение shuffle
    toggleShuffle: (state) => {
      state.isShuffle = !state.isShuffle;
    },

    // переключение режима повтора
    toggleRepeat: (state) => {
      state.isRepeat = !state.isRepeat;
    },

    // следующий трек с проверкой границ
    setNextTrack: (state) => {
      if (!state.currentTrack) return;

      const list = state.isShuffle ? state.shufflePlaylist : state.playlist;
      const curIndex = list.findIndex(
        (el) => el._id === state.currentTrack!._id,
      );

      if (curIndex === -1) return;

      let nextIndex = curIndex + 1;

      // Если это последний трек и включён repeat — зацикливаем
      if (nextIndex >= list.length) {
        nextIndex = state.isRepeat ? 0 : curIndex; // если не repeat — остаёмся на месте
      }

      state.currentTrack = list[nextIndex];
    },

    // предыдущий трек
    setPrevTrack: (state) => {
      if (!state.currentTrack) return;

      const list = state.isShuffle ? state.shufflePlaylist : state.playlist;
      const curIndex = list.findIndex(
        (el) => el._id === state.currentTrack!._id,
      );

      if (curIndex === -1) return;

      let prevIndex = curIndex - 1;

      // Если это первый трек и включён repeat — переходим к последнему
      if (prevIndex < 0) {
        prevIndex = state.isRepeat ? list.length - 1 : curIndex;
      }

      state.currentTrack = list[prevIndex];
    },
  },
});

// Экспортируем все действия
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
