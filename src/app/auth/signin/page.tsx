'use client';

import styles from './signin.module.css';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';

export default function Signin() {
  return (
    <>
      <Link href="/music/main">
        <div className={styles.modal__logo}>
          <Image
            src="/img/logo_modal.png"
            alt="logo"
            width={280}
            height={88}
            priority // ← опционально: быстрее загрузка
          />
        </div>
      </Link>

      <input
        className={classNames(styles.modal__input, styles.login)}
        type="text"
        name="login"
        placeholder="Почта"
      />
      <input
        className={classNames(styles.modal__input)}
        type="password"
        name="password"
        placeholder="Пароль"
      />

      <div className={styles.errorContainer}>{/* Блок для ошибок */}</div>

      <button type="submit" className={styles.modal__btnEnter}>
        Войти
      </button>

      <Link href="/auth/signup" className={styles.modal__btnSignup}>
        Зарегистрироваться
      </Link>
    </>
  );
}
