'use client';

import styles from './sidebar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { logoutUser } from '@/services/auth/authApi';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react'; // ДОБАВИЛИ

export default function Sidebar() {
  const router = useRouter();

  // Состояние: залогинен ли пользователь
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Проверяем localStorage ТОЛЬКО в браузере, после первого рендера
  useEffect(() => {
    const checkLogin = () => {
      const token =
        typeof window !== 'undefined' && localStorage.getItem('access_token');
      setIsLoggedIn(!!token);
    };

    checkLogin();

    // Опционально: слушаем изменения localStorage (на случай выхода из другой вкладки)
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, []);

  const handleLogout = () => {
    logoutUser();
    router.push('/auth/signin');
  };

  return (
    <div className={styles.main__sidebar}>
      {/* Блок с иконкой выхода — только если залогинен */}
      <div className={styles.sidebar__personal}>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className={styles.logout__button}
            title="Выйти из аккаунта"
          >
            <Image
              src="/img/icon/exit.svg"
              alt="Выйти"
              width={38}
              height={38}
              className={styles.logout__icon}
              priority={true} // заодно убираем предупреждение LCP
            />
          </button>
        ) : (
          <div style={{ height: 38 }}></div> // сохраняем место
        )}
      </div>

      {/* Плейлисты */}
      <div className={styles.sidebar__block}>
        <div className={styles.sidebar__list}>
          <div className={styles.sidebar__item}>
            <Link className={styles.sidebar__link} href="/music/category/1">
              <Image
                className={styles.sidebar__img}
                src="/img/playlist01.png"
                alt="Плейлист дня"
                width={250}
                height={150}
                priority={true}
              />
            </Link>
          </div>
          <div className={styles.sidebar__item}>
            <Link className={styles.sidebar__link} href="/music/category/2">
              <Image
                className={styles.sidebar__img}
                src="/img/playlist02.png"
                alt="100 танцевальных хитов"
                width={250}
                height={150}
                priority={true}
              />
            </Link>
          </div>
          <div className={styles.sidebar__item}>
            <Link className={styles.sidebar__link} href="/music/category/3">
              <Image
                className={styles.sidebar__img}
                src="/img/playlist03.png"
                alt="Инди-заряд"
                width={250}
                height={150}
                priority={true}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
