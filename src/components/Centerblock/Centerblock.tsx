'use client';

import classNames from 'classnames';
import styles from './centerblock.module.css';
import Search from '../Search/Search';
import FilterItem from '../FilterItem/FilterItem';
import Track from '../Track/Track';
import { data } from '@/data';
import { useState } from 'react';

export default function Centerblock() {
  const [activeFilter, setActiveFilter] = useState<
    'author' | 'year' | 'genre' | null
  >(null);

  const handleFilterChange = (
    type: 'author' | 'year' | 'genre',
    selected: string[],
  ) => {
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
          {data.map((track) => (
            <Track key={track._id} track={track} />
          ))}
        </div>
      </div>
    </div>
  );
}
