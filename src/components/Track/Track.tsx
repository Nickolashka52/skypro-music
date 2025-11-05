'use client';

import { useAppDispatch, useAppSelector } from '@/store/store';
import { setCurrentTrack, setIsPlay } from '@/store/features/trackSlice';
import { TrackType } from '@/sharedTypes/sharedTypes';
import classNames from 'classnames';
import Link from 'next/link';
import styles from './track.module.css';
import { formatDuration } from '@/utils/helper';

interface TrackProps {
  track: TrackType;
  playlist: TrackType[];
}

export default function Track({ track, playlist }: TrackProps) {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlay);

  const isCurrentTrack = currentTrack?._id === track._id;

  const handleTrackClick = () => {
    dispatch(setCurrentTrack({ track, playlist }));
    dispatch(setIsPlay(true));
  };

  return (
    <div className={styles.playlist__item} onClick={handleTrackClick}>
      <div className={styles.playlist__track}>
        <div className={styles.track__title}>
          <div className={styles.track__titleImage}>
            {isCurrentTrack ? (
              <span
                className={classNames(styles.track__pulseDot, {
                  [styles.track__pulseDotActive]: isPlaying,
                })}
              ></span>
            ) : (
              <svg className={styles.track__title__svg}>
                <use href="/img/icon/sprite.svg#icon-note"></use>
              </svg>
            )}
          </div>
          <div className={styles.track__titleText}>
            <Link className={styles.track__titleLink} href="">
              {track.name} <span className={styles.track__titleSpan}></span>
            </Link>
          </div>
        </div>
        <div className={styles.track__author}>
          <Link className={styles.track__authorLink} href="">
            {track.author}
          </Link>
        </div>
        <div className={styles.track__album}>
          <Link className={styles.track__albumLink} href="">
            {track.album}
          </Link>
        </div>
        <div className={styles.track__time}>
          <svg className={styles.track__time__svg}>
            <use href="/img/icon/sprite.svg#icon-like"></use>
          </svg>
          <span className={styles.track__timeText}>
            {formatDuration(track.duration_in_seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
