'use client';

import { loginUser } from '@/services/auth/authApi'; // ИЗМЕНЕНО: используем loginUser (не authUser)
import styles from './signin.module.css';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation'; // ДОБАВЛЕНО: для редиректа

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // ДОБАВЛЕНО: инициализируем роутер

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Заполните все поля');
      setIsLoading(false);
      return;
    }

    try {
      // 1.1 — Делаем запрос на сервер (через loginUser → /user/token/)
      const res = await loginUser({ email, password });

      // 1.2 — СОХРАНЯЕМ ТОКЕНЫ В БРАУЗЕР
      localStorage.setItem('access_token', res.access); // ← ДОБАВЛЕНО
      localStorage.setItem('refresh_token', res.refresh); // ← ДОБАВЛЕНО

      // 1.3 — ПЕРЕХОДИМ НА ГЛАВНУЮ СТРАНИЦУ
      router.push('/music/main'); // ← ДОБАВЛЕНО
    } catch (error) {
      if (error instanceof AxiosError) {
        // Улучшенная обработка ошибок
        if (error.response?.data?.detail) {
          setErrorMessage(error.response.data.detail);
        } else if (error.response?.data?.message) {
          setErrorMessage(error.response.data.message);
        } else if (error.request) {
          setErrorMessage('Нет интернета');
        } else {
          setErrorMessage('Что-то пошло не так');
        }
      } else {
        setErrorMessage('Неизвестная ошибка');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.modal__form} onSubmit={onSubmit}>
      <Link href="/music/main">
        <div className={styles.modal__logo}>
          <Image
            src="/img/logo_modal.png"
            alt="logo"
            width={280}
            height={88}
            priority
          />
        </div>
      </Link>

      <input
        className={classNames(styles.modal__input, styles.login)}
        type="email"
        placeholder="Почта"
        value={email}
        onChange={onChangeEmail}
        required
      />
      <input
        className={styles.modal__input}
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={onChangePassword}
        required
      />

      <div className={styles.errorContainer}>{errorMessage}</div>

      <button
        type="submit"
        disabled={isLoading}
        className={styles.modal__btnEnter}
      >
        {isLoading ? 'Вход...' : 'Войти'}
      </button>

      <Link href="/auth/signup" className={styles.modal__btnSignup}>
        Зарегистрироваться
      </Link>
    </form>
  );
}
