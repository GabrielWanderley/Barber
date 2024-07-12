'use client'
import DatePicker, { registerLocale } from "react-datepicker";
import styles from "../../page.module.css";
import { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { getDay } from "date-fns/getDay";
import { ptBR } from 'date-fns/locale';
import { addDays} from "date-fns";
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, Timestamp} from "firebase/firestore"; 

import {db} from '../../../firebase/firebase.js';

registerLocale('pt-BR', ptBR);



interface dadosFire{
  date: string,
  dateD: Timestamp,
  id:string,
  cincoMeiaT: [string, boolean],
  cincoT: [string, boolean],
  dezM: [string, boolean],
  duasT: [string, boolean],
  duasTardeT: [string, boolean],
  noveM: [string, boolean],
  noveMeiaM: [string, boolean],
  oitoM: [string, boolean],
  oitoMeiaM: [string, boolean],
  onzeM: [string, boolean],
  onzeMeiaM: [string, boolean],
  quatroT: [string, boolean],
  qutroMeiaT: [string, boolean],
  seisT: [string, boolean]
}

export default function Calendar() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [times, setTimes] = useState<dadosFire[]>([])
  const isMounted = useRef(false);
  const [deleteTime, setDeleteTime] = useState<dadosFire[]>([])

  const [selectedSlot, setSelectedSlot] = useState<{docId: string; slotKey: string} | null>(null);

  const updateSlot = async (docId: string, slotKey: string) => {
    const docRef = doc(db, 'data', docId);
    await updateDoc(docRef, {
      [slotKey]: [slotKey, false],
    });
  }

  const getSlotClick = (docId : string, slotKey: string) =>{
    setSelectedSlot({ docId, slotKey});
  }

  const handleConfirm = ()=>{

    if(selectedSlot){
      updateSlot(selectedSlot.docId, selectedSlot.slotKey)
    }else{
      alert('escolha um horario')
    }
  }
 
  const isWeek = (date : Date)=>{
    const day = getDay(date);
    return day !== 0;
  }
  const today = new Date();
  const nextValidDate = getDay(today) === 0 ? addDays(today, 1) : today;

const getDocument = async ()=>{

 try{
   
  //pegar todos
   const getItens = await getDocs(collection(db, 'data'))
   const docsGet = await getItens.docs.map((itens) =>{
    const dados = itens.data();
     return{ 
       date: dados.date,
       dateD: dados.dateD,
       id: dados.id,
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

  const dom = new Date();

  if(getDay(dom)=== 0){
    console.log('Não pode criar aos domingos');
    return;
  }
  const docRef = await addDoc(collection(db, 'data'), {
    date: startDate.toLocaleString().substr(0, 10),
    dateD: startDate,
    oitoM: ['08:00', true],
    oitoMeiaM: ['08:30', true],
    noveM: ['09:00', true],
    noveMeiaM: ['09:30', true],
    dezM: ['10:00', true],
    onzeM: ['11:00', true],
    onzeMeiaM: ['11:30', true],
    duasT: ['14:00', true],
    duasTardeT: ['14:30', true],
    tresT: ['15:00', true],
    tresMeiaT: ['15:30', true],
    quatroT: ['16:00', true],
    quatroMeiaT: ['16:30', true],
    cincoT: ['17:00', true],
    cincoMeiaT: ['17:30', true],
    seisT: ['18:00', true],
  });
  await updateDoc(docRef, {
    id: docRef.id
  });
  
  console.log('Novo documento criado com sucesso:', docRef.id);
  getDocument();
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
          dateD: dados.dateD,
          id: dados.id,
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
},[startDate])

useEffect(() => {
   const deleteDates = async () => {
     

       const getItens = await getDocs(collection(db, 'data'))
       const getDocuments = await getItens.docs.map((doc) =>{
        const dados = doc.data();
        return{ 
          date: dados.date,
          dateD: dados.dateD,
          id: dados.id,
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
       })

       setDeleteTime(getDocuments)



   };
   deleteDates();
},[])

useEffect(()=> {

const deleteDocumentes = async()=>{
  deleteTime.forEach(async (d) =>{
    const currentDate = new Date();
    const documentDate = d.dateD;
    const realTime = (documentDate.seconds * 1000) + Math.floor(documentDate.nanoseconds / 1000000);
    const realDate = new Date(realTime);

    const currentDateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const documentDateWithoutTime = new Date(realDate.getFullYear(), realDate.getMonth(), realDate.getDate());

  if (currentDateWithoutTime > documentDateWithoutTime) {
    await deleteDoc(doc(db, 'data', d.id))
  }
   })
}

deleteDocumentes();
},[deleteTime])


  return (
    <main className={styles.main}>
      <div>
      <DatePicker
        inline
        dateFormat="dd/MM/yyyy"
        showIcon
        selected={startDate}
        minDate={nextValidDate}
        maxDate={addDays(new Date(),7)}
        locale="pt-BR" 
        filterDate={isWeek}      
        onChange={(date) => {
          if( date !== null){
          setStartDate(date)
        }}}
        
      />             

     {
      startDate &&(
        <div>
         {times.map(times =>(
          <div key={times.date}>
          <h1>{times.date}</h1>
          {Object.entries(times).map(([key, value]) => {
            if (key !== 'date' && Array.isArray(value) && value.length === 2 && typeof value[1] === 'boolean' && value[1] === true) {
              return (
              <div key={key} onClick={()=>getSlotClick(times.id, key)}>
              <h1 >
                {value[0]}
              </h1>
              </div>
            )
            }
            return null;
          })}              
          <button onClick={handleConfirm}>Confirmar horario</button>
          </div>
         ))}
        </div>
      )
     }
      </div>

    </main>
  );
}
