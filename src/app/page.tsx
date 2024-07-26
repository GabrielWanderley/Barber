'use client'
import "./styles.css";
import Calendar from "./Components/Calendar";
import  {Login}  from "./Components/Login";
import { UserProvider } from "./context";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import logoT from '../assets/LogoT.png'
import youngM from '../assets/young-man-barbershop-trimming-hair.jpg'

import Image from "next/image";

export default function Home() {
  return (
    <main className='main' >
      <UserProvider>
        <div className='content'>
          <div className='PaperContent'>
            <div className="paperContentItens">
              <div className='floatL'>
                <Image src={logoT} alt='logo' style={{ float: "left", width: "40px", height: "50px" }} />
                <h3>Barbeiro</h3>
              </div>
              <div className="paperText">
                <h1>Mude seu estilo conosco</h1>
                <h3>Cortar cabelo é moldar a personalidade através da estética.</h3>

                <div className="paperDivText">
                  <p>
                    Cortar cabelo é mais do que uma simples manutenção; é uma expressão de estilo e personalidade, redefinindo a confiança de quem o usa.
                  </p>
                  <h3>Sobre nós</h3>
                </div>
                <Image src={youngM} alt="young" className='fisrtImg'  />
                <div className="contentTextPaper">
                  <h1>sobre mim</h1>
                  <div className="pDiv">
                    <p>Eu comecei minha carreira de barbeiro na pequena cidade de Santa Clara, onde cresci. Com o tempo, aperfeiçoei minhas habilidades e conquistei a confiança dos moradores. Minha barbearia, 'Estilo do João', se tornou um ponto de encontro na cidade. Adoro conhecer cada cliente e proporcionar um corte de cabelo que realce sua personalidade. Hoje, me sinto realizado ao ver como um simples corte pode transformar a autoestima das pessoas.</p>
                  </div>
                </div>
              </div>
              <div className="cortesImages">
                <div className="ImageContent1">

                </div>
                <div className="ImageContent2">

                
                </div>
                <div className="ImageContent3">

                </div>
              </div>
            </div>
            
          </div>
          <div className="habilidades">
            <h1>Habilidades</h1>
            <div className="habilidade1">
              <h3>Barba</h3>
            </div> 
            <div className="habilidade2">
            <h3>Cabelo</h3>
            </div>     
            <div className="habilidade3">
            <h3>Bigode</h3>
            </div>                
          </div>

          <Login/>
          <Calendar/>
          <ToastContainer />
        </div>
      </UserProvider>
    </main>
  );
}
