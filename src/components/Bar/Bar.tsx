'use client';

import Link from 'next/link';
import styles from './bar.module.css';
import classnames from 'classnames';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useRef, useState, useEffect } from 'react';
import { setIsPlay } from '@/store/features/trackSlice';

export default function Bar() {
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const dispatch = useAppDispatch();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Синхронизация isPlaying с реальным состоянием аудио
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      setIsPlaying(true);
      dispatch(setIsPlay(true));
    };
    const handlePause = () => {
      setIsPlaying(false);
      dispatch(setIsPlay(false));
    };
    const handleEnded = () => {
      setIsPlaying(false);
      dispatch(setIsPlay(false));
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [dispatch]);

  // Обновляем src аудио и запускаем воспроизведение при смене трека
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.track_file;
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
        dispatch(setIsPlay(false));
      });
      setIsPlaying(true);
      dispatch(setIsPlay(true));
    }
  }, [currentTrack, dispatch]);

  const playTrack = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
        dispatch(setIsPlay(false));
      });
      setIsPlaying(true);
      dispatch(setIsPlay(true));
    }
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      dispatch(setIsPlay(false));
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      playTrack();
    }
  };

  if (!currentTrack) return <></>;

  return (
    <div className={styles.bar}>
      <audio ref={audioRef} src={currentTrack?.track_file}></audio>
      <div className={styles.bar__content}>
        <div className={styles.bar__playerProgress}></div>
        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <div className={styles.player__controls}>
              <div className={styles.player__btnPrev}>
                <svg className={styles.player__btnPrev__svg}>
                  <use href="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </div>
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
              <div className={styles.player__btnNext}>
                <svg className={styles.player__btnNext__svg}>
                  <use href="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </div>
              <div
                className={classnames(styles.player__btnRepeat, styles.btnIcon)}
              >
                <svg className={styles.player__btnRepeat__svg}>
                  <use href="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>
              <div
                className={classnames(
                  styles.player__btnShuffle,
                  styles.btnIcon,
                )}
              >
                <svg className={styles.player__btnShuffle__svg}>
                  <use href="/img/icon/sprite.svg#icon-shuffle"></use>
                </svg>
              </div>
            </div>

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
                  name="range"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}