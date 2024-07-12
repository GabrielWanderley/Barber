'use client'
import styles from "./page.module.css";
import Calendar from "./Components/Calendar";
import  {Login}  from "./Components/Login";



export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <Calendar/>
        <Login/>
      </div>
    </main>
  );
}
