import { TrackType } from '@/sharedTypes/sharedTypes';

export const shuffleArray = <T>(array: T[]): T[] => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const createShuffledPlaylist = (
  playlist: TrackType[],
  currentTrack: TrackType | null,
): TrackType[] => {
  if (!currentTrack) return shuffleArray(playlist);
  const withoutCurrent = playlist.filter(t => t._id !== currentTrack._id);
  return [currentTrack, ...shuffleArray(withoutCurrent)];
};

export const getNextTrack = (
  state: {
    playlist: TrackType[];
    shuffledPlaylist: TrackType[];
    playedTracks: TrackType[];
    currentTrack: TrackType | null;
    currentIndex: number;
    isShuffle: boolean;
    isRepeat: boolean;
  }
): TrackType | null => {
  if (!state.currentTrack || state.playlist.length === 0) return null;

  if (state.isShuffle) {
    const available = state.shuffledPlaylist.filter(
      t => !state.playedTracks.some(p => p._id === t._id)
    );

    if (available.length === 0) {
      // Пересоздать shuffledPlaylist
      const newShuffled = createShuffledPlaylist(state.playlist, state.currentTrack);
      return newShuffled[1]; // следующий после текущего
    }

    const randomIdx = Math.floor(Math.random() * available.length);
    return available[randomIdx];
  }

  // Обычный порядок
  let nextIdx = state.currentIndex + 1;
  if (nextIdx >= state.playlist.length) {
    nextIdx = state.isRepeat ? 0 : state.currentIndex;
  }
  return state.playlist[nextIdx];
};

export const getPrevTrack = (
  state: {
    playlist: TrackType[];
    shuffledPlaylist: TrackType[];
    currentTrack: TrackType | null;
    isShuffle: boolean;
    isRepeat: boolean;
  }
): TrackType | null => {
  if (!state.currentTrack || state.playlist.length === 0) return null;

  const list = state.isShuffle ? state.shuffledPlaylist : state.playlist;
  const currentIdxInList = list.findIndex(t => t._id === state.currentTrack!._id);

  let prevIdx = currentIdxInList - 1;
  if (prevIdx < 0) {
    prevIdx = state.isRepeat ? list.length - 1 : currentIdxInList;
  }

  return list[prevIdx];
};