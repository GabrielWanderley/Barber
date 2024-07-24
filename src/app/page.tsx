'use client'
import styles from "./page.module.css";
import Calendar from "./Components/Calendar";
import  {Login}  from "./Components/Login";
import { UserProvider } from "./context";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Home() {
  return (
    <main className={styles.main} >
      <UserProvider>
        <div>
          <Login/>
          <Calendar/>
          <ToastContainer />
        </div>      
     </UserProvider>
    </main>
  );
}
