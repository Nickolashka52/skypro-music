'use client';

import Link from 'next/link';
import styles from './bar.module.css';
import classnames from 'classnames';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useRef, useState, useEffect, ChangeEvent } from 'react';
import {
  setIsPlay,
  setNextTrack,
  setPrevTrack,
  toggleShuffle,
  toggleRepeat,
} from '@/store/features/trackSlice';
import ProgressBar from '../ProgressBar/ProgressBar';
import { formatTime } from '@/utils/helper'; // ← создадим эту функцию

export default function Bar() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dispatch = useAppDispatch();

  // Состояния
  const [volume, setVolume] = useState(0.5);
  const [isLoadedTrack, setIsLoadedTrack] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Данные из Redux
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlay);
  const isShuffle = useAppSelector((state) => state.tracks.isShuffle);
  const isRepeat = useAppSelector((state) => state.tracks.isRepeat); // ← НОВОЕ

  // === Синхронизация с аудио ===
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => dispatch(setIsPlay(true));
    const handlePause = () => dispatch(setIsPlay(false));

    const handleEnded = () => {
      if (isRepeat) {
        // Повтор текущего — loop сам перезапустит
        dispatch(setIsPlay(true));
      } else {
        // Переход к следующему + автозапуск
        dispatch(setNextTrack());
        dispatch(setIsPlay(true));
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoadedTrack(true);
      if (isPlaying) audio.play();
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [dispatch, isPlaying, isRepeat]);

  // 1. Смена трека — только при смене currentTrack
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.track_file;
      setCurrentTime(0);
      setIsLoadedTrack(false);
    }
  }, [currentTrack]);

  // 2. Повтор — отдельно
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isRepeat;
    }
  }, [isRepeat]);

  // === Управление воспроизведением ===
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
  };

  const handleNext = () => dispatch(setNextTrack());
  const handlePrev = () => dispatch(setPrevTrack()); // ← НОВОЕ
  const handleToggleRepeat = () => dispatch(toggleRepeat()); // ← НОВОЕ
  const handleToggleShuffle = () => dispatch(toggleShuffle());

  // === Прогресс ===
  const onChangeProgress = (e: ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // === Громкость ===
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  if (!currentTrack) return <></>;

  return (
    <div className={styles.bar}>
      <div className={styles.bar__content}>
        {/* Аудио элемент */}
        <audio ref={audioRef} />

        {/* Прогресс-бар + время */}
        <div className={styles.progressContainer}>
          <span className={styles.time}>{formatTime(currentTime)}</span>
          <ProgressBar
            max={duration || 0}
            step={0.1}
            readOnly={!isLoadedTrack}
            value={currentTime}
            onChange={onChangeProgress}
          />
          <span className={styles.time}>{formatTime(duration)}</span>
        </div>

        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <div className={styles.player__controls}>
              {/* Предыдущий трек */}
              <div
                className={classnames(styles.player__btnPrev, styles.btn)}
                onClick={handlePrev}
              >
                <svg className={styles.player__btnPrev__svg}>
                  <use href="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </div>

              {/* Плей / Пауза */}
              <div
                className={classnames(styles.player__btnPlay, styles.btn)}
                onClick={handlePlayPause}
              >
                <svg className={styles.player__btnPlay__svg}>
                  <use
                    href={`/img/icon/sprite.svg#icon-${isPlaying ? 'pause' : 'play'}`}
                  />
                </svg>
              </div>

              {/* Следующий трек */}
              <div
                onClick={handleNext}
                className={classnames(styles.player__btnNext, styles.btn)}
              >
                <svg className={styles.player__btnNext__svg}>
                  <use href="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </div>

              {/* Повтор — жирный, если включён */}
              <div
                onClick={handleToggleRepeat}
                className={classnames(
                  styles.player__btnRepeat,
                  styles.btnIcon,
                  {
                    [styles.active]: isRepeat, // ← жирный стиль
                  },
                )}
              >
                <svg className={styles.player__btnRepeat__svg}>
                  <use href="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>

              {/* Shuffle — жирный, если включён */}
              <div
                onClick={handleToggleShuffle}
                className={classnames(
                  styles.player__btnShuffle,
                  styles.btnIcon,
                  {
                    [styles.active]: isShuffle, // ← жирный стиль
                  },
                )}
              >
                <svg className={styles.player__btnShuffle__svg}>
                  <use href="/img/icon/sprite.svg#icon-shuffle"></use>
                </svg>
              </div>
            </div>

            {/* Инфа о треке */}
            <div className={styles.player__trackPlay}>
              <div className={styles.trackPlay__contain}>
                <div className={styles.trackPlay__image}>
                  <svg className={styles.trackPlay__svg}>
                    <use href="/img/icon/sprite.svg#icon-note"></use>
                  </svg>
                </div>
                <div className={styles.trackPlay__author}>
                  <Link className={styles.trackPlay__authorLink} href="">
                    {currentTrack.name}
                  </Link>
                </div>
                <div className={styles.trackPlay__album}>
                  <Link className={styles.trackPlay__albumLink} href="">
                    {currentTrack.author}
                  </Link>
                </div>
              </div>

              <div className={styles.trackPlay__likeDis}>
                <div
                  className={classnames(styles.trackPlay__like, styles.btnIcon)}
                >
                  <svg className={styles.trackPlay__like__svg}>
                    <use href="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                </div>
                <div
                  className={classnames(
                    styles.trackPlay__dislike,
                    styles.btnIcon,
                  )}
                >
                  <svg className={styles.trackPlay__dislike__svg}>
                    <use href="/img/icon/sprite.svg#icon-dislike"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Громкость */}
          <div className={styles.bar__volumeBlock}>
            <div className={styles.volume__content}>
              <div className={styles.volume__image}>
                <svg className={styles.volume__svg}>
                  <use href="/img/icon/sprite.svg#icon-volume"></use>
                </svg>
              </div>
              <div className={classnames(styles.volume__progress, styles.btn)}>
                <input
                  className={classnames(
                    styles.volume__progressLine,
                    styles.btn,
                  )}
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={(e) => setVolume(Number(e.target.value) / 100)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
