'use client';

import { registerUser, loginUser } from '@/services/auth/authApi';
import styles from './signup.module.css';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation'; // для редиректа

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    // Валидация на клиенте
    if (!email || !username || !password) {
      setErrorMessage('Заполните все поля');
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Пароли не совпадают');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Регистрация
      await registerUser({ email, password, username });

      // 2. Автоматический вход после успешной регистрации
      const loginRes = await loginUser({ email, password });

      // 3. Сохраняем токены
      localStorage.setItem('access_token', loginRes.access);
      localStorage.setItem('refresh_token', loginRes.refresh);

      // 4. Переходим на главную
      router.push('/music/main');
    } catch (error) {
      if (error instanceof AxiosError) {
        const msg = error.response?.data?.message || 'Ошибка регистрации';
        setErrorMessage(msg);
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
        type="email"
        placeholder="Почта"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={classNames(styles.modal__input, styles.login)}
        required
      />
      <input
        type="text"
        placeholder="Имя пользователя"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className={styles.modal__input}
        required
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.modal__input}
        required
      />
      <input
        type="password"
        placeholder="Повторите пароль"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className={styles.modal__input}
        required
      />

      <div className={styles.errorContainer}>{errorMessage}</div>

      <button
        type="submit"
        disabled={isLoading}
        className={styles.modal__btnSignupEnt}
      >
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>
    </form>
  );
}
