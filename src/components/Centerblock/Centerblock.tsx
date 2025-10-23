'use client';

import classNames from 'classnames';
import styles from './centerblock.module.css';
import Link from 'next/link';
import Search from '../Search/Search';
import FilterItem from '../FilterItem/FilterItem';
import { data } from '@/data';
import { formatDuration } from '@/utils/helper';
import { useState } from 'react';

export default function Centerblock() {
  const [activeFilter, setActiveFilter] = useState<
    'author' | 'year' | 'genre' | null
  >(null);

  const handleFilterChange = (
    type: 'author' | 'year' | 'genre',
    selected: string[],
  ) => {
    // Заглушка для будущей логики фильтрации
    console.log(`Filter ${type} changed:`, selected);
  };

  const handleFilterToggle = (type: 'author' | 'year' | 'genre') => {
    setActiveFilter((prev) => (prev === type ? null : type));
  };

  return (
    <div className={styles.centerblock}>
      <Search />
      <h2 className={styles.centerblock__h2}>Треки</h2>
      <div className={styles.centerblock__filter}>
        <div className={styles.filter__title}>Искать по:</div>
        <FilterItem
          type="author"
          tracks={data}
          onFilterChange={handleFilterChange}
          isOpen={activeFilter === 'author'}
          onToggle={() => handleFilterToggle('author')}
          activeFilter={activeFilter}
        />
        <FilterItem
          type="year"
          tracks={data}
          onFilterChange={handleFilterChange}
          isOpen={activeFilter === 'year'}
          onToggle={() => handleFilterToggle('year')}
          activeFilter={activeFilter}
        />
        <FilterItem
          type="genre"
          tracks={data}
          onFilterChange={handleFilterChange}
          isOpen={activeFilter === 'genre'}
          onToggle={() => handleFilterToggle('genre')}
          activeFilter={activeFilter}
        />
      </div>
      <div className={styles.centerblock__content}>
        <div className={styles.content__title}>
          <div className={classNames(styles.playlistTitle__col, styles.col01)}>
            Трек
          </div>
          <div className={classNames(styles.playlistTitle__col, styles.col02)}>
            Исполнитель
          </div>
          <div className={classNames(styles.playlistTitle__col, styles.col03)}>
            Альбом
          </div>
          <div className={classNames(styles.playlistTitle__col, styles.col04)}>
            <svg className={styles.playlistTitle__svg}>
              <use href="/img/icon/sprite.svg#icon-watch"></use>
            </svg>
          </div>
        </div>
        <div className={styles.content__playlist}>
          {data.map((track) => {
            return (
              <div key={track._id} className={styles.playlist__item}>
                <div className={styles.playlist__track}>
                  <div className={styles.track__title}>
                    <div className={styles.track__titleImage}>
                      <svg className={styles.track__title__svg}>
                        <use href="/img/icon/sprite.svg#icon-note"></use>
                      </svg>
                    </div>
                    <div className={styles.track__titleText}>
                      <Link className={styles.track__titleLink} href="">
                        {track.name}{' '}
                        <span className={styles.track__titleSpan}></span>
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
          })}
        </div>
      </div>
    </div>
  );
}
