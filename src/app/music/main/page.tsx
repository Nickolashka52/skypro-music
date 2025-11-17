'use client';

import styles from './page.module.css';
import Bar from '@/components/Bar/Bar';
import Nav from '@/components/Nav/Nav';
import Centerblock from '@/components/Centerblock/Centerblock';
import Sidebar from '@/components/Sidebar/Sidebar';
import { useEffect, useState } from 'react';
import { getTracks } from '@/services/tracks/tracksApi';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { AxiosError } from 'axios';

export default function Home() {
  const [tracks, setTracks] = useState<TrackType[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getTracks()
      .then((res) => {
        setTracks(res);
        alert('res');
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response) {
            setError(error.response.data);
          } else if (error.request) {
            setError('Что-то с интернетом');
          } else {
            setError('Неизвестная ошибка');
          }
        }
      });
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          {error}
          <Nav />
          <Centerblock />
          <Sidebar />
        </main>
        <Bar />
        {/* <footer className="footer"></footer> */}
      </div>
    </div>
  );
}
