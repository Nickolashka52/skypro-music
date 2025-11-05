// import './page.css';
import styles from './page.module.css';
import Bar from '@/components/Bar/Bar';
import Nav from '@/components/Nav/Nav';
import Centerblock from '@/components/Centerblock/Centerblock';
import Sidebar from '@/components/Sidebar/Sidebar';

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
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
