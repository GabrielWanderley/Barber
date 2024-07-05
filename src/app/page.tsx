'use client'
import DatePicker, { registerLocale } from "react-datepicker";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { getDay } from "date-fns/getDay";
import { ptBR } from 'date-fns/locale';
import { addDays} from "date-fns";
import { collection, addDoc, getDocs, query, where, doc, getDoc} from "firebase/firestore"; 

import {db} from '../firebase/firebase.js'

registerLocale('pt-BR', ptBR);

interface dadosFire{
  cincoMeiaT: boolean,
cincoT: boolean,
date: string,
dezM: boolean,
duasT: boolean,
duasTardeT: boolean,
noveM: boolean,
noveMeiaM: boolean,
oitoM: boolean,
oitoMeiaM: boolean,
onzeM: boolean,
onzeMeiaM: boolean,
quatroT: boolean,
qutroMeiaT: boolean,
seisT: boolean
}

export default function Home() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [times, setTimes] = useState<dadosFire[]>([])
  const isMounted = useRef(false);
 
  const isWeek = (date : Date)=>{
    const day = getDay(date);
    return day !== 0;
  }


const getDocument = async (id : string)=>{

 try{
   
  //pegar por id 
   const docRef = doc(db, 'data', id);
   const docSnap = await getDoc(docRef);
  
   const getItens = await getDocs(collection(db, 'data'))
   const docsGet = await getItens.docs.map((itens) =>{
    const dados = itens.data();
     return{ 
       date: dados.date,
       oitoM: dados.oitoM,
       oitoMeiaM: dados.oitoMeiaM,
       noveM: dados.noveM,
       noveMeiaM: dados.noveMeiaM,
       dezM: dados.dezM,
       onzeM: dados.onzeM,
       onzeMeiaM: dados.onzeMeiaM,
       duasT: dados.duasT,
       duasTardeT: dados.duasTardeT,
       tresT: dados.tresT,
       tresMeiaT: dados.tresMeiaT,
       quatroT: dados.quatroT,
       qutroMeiaT: dados.qutroMeiaT,
       cincoT: dados.cincoT,
       cincoMeiaT: dados.cincoMeiaT,
       seisT: dados.seisT

     } as dadosFire
  });

  const foundItens = docsGet.filter(item => startDate.toLocaleString().substr(0, 10) === item.date);
    if (foundItens.length > 0) {
      setTimes(foundItens);

    } else {
      await createDocument();
    }

   }catch(err){
    console.error('Erro ´Pegar documento:', err)
  }

}


const createDocument = async ()=>{
  try{
    
   const querySnapshot = await getDocs(query(collection(db, 'data'), where('date', '==',startDate.toLocaleString().substr(0, 10))));

   if (!querySnapshot.empty) {
    console.log('Documento já existe para esta data');
    return;
  }
  
  const docRef = await addDoc(collection(db, 'data'), {
    date: startDate.toLocaleString().substr(0, 10),
    oitoM: true,
    oitoMeiaM: true,
    noveM: true,
    noveMeiaM: true,
    dezM: true,
    onzeM: true,
    onzeMeiaM: true,
    duasT: true,
    duasTardeT: true,
    tresT: true,
    tresMeiaT: true,
    quatroT: true,
    qutroMeiaT: true,
    cincoT: true,
    cincoMeiaT: true,
    seisT: true,
  });
  
  console.log('Novo documento criado com sucesso:', docRef.id);
  getDocument(docRef.id);
  }catch(err){
    console.error('Erro ao criar documento:', err)
  }
}

useEffect(()=>{
  if (isMounted.current) {
  const getOrCreate = async ()=>{
    //get itens 
     const getItens = await getDocs(collection(db, 'data'))
      const docsGet = await getItens.docs.map((itens) =>{
       const dados = itens.data();
        return{ 
          date: dados.date,
          oitoM: dados.oitoM,
          oitoMeiaM: dados.oitoMeiaM,
          noveM: dados.noveM,
          noveMeiaM: dados.noveMeiaM,
          dezM: dados.dezM,
          onzeM: dados.onzeM,
          onzeMeiaM: dados.onzeMeiaM,
          duasT: dados.duasT,
          duasTardeT: dados.duasTardeT,
          tresT: dados.tresT,
          tresMeiaT: dados.tresMeiaT,
          quatroT: dados.quatroT,
          qutroMeiaT: dados.qutroMeiaT,
          cincoT: dados.cincoT,
          cincoMeiaT: dados.cincoMeiaT,
          seisT: dados.seisT

        } as dadosFire
     });
    
    // Verifica se há documentos para a data atual e define times
    const foundTimes = docsGet.filter(item => startDate.toLocaleString().substr(0, 10) === item.date);
    if (foundTimes.length > 0) {
      setTimes(foundTimes);

    } else {
      await createDocument();
    }
  };

  getOrCreate();
} else {
  isMounted.current = true;
}
},[startDate ])


  return (
    <main className={styles.main}>
      <div>
      <DatePicker
        inline
        dateFormat="dd/MM/yyyy"
        showIcon
        selected={startDate}
        minDate={new Date()}
        maxDate={addDays(new Date(),7)}
        onChange={(date) => {
          if( date !== null){
          setStartDate(date)
        }}}
        locale="pt-BR" 
        filterDate={isWeek}
        
      />       

      <button>aq</button>

     {
      startDate &&(
        <div>
         {times.map(times =>(
          <div key={times.date}>
          <h1>{times.date}</h1>
          <h1>{times.cincoT}</h1>
          </div>
         ))}
        </div>
      )
     }
      </div>

    </main>
  );
}
