'use client'
import DatePicker, { registerLocale } from "react-datepicker";
import styles from "../../page.module.css";
import { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { getDay } from "date-fns/getDay";
import { ptBR } from 'date-fns/locale';
import { addDays} from "date-fns";
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, Timestamp, getDoc} from "firebase/firestore"; 

import {db} from '../../../firebase/firebase.js';
import { showUser } from "@/app/context";

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

interface dadosUser{
  count : number,
  email : string,
  id: string,
  nome:string,
  manager: boolean,
}
interface dadosUserScheduled{
  count : number,
  email : string,
  id: string,
  nome:string,
  userId:string,
  time:string,
  dateD: Timestamp,
  date: string,
  dataId: string,
  slotKey: string,
}

export default function Calendar() {

  const {userId} = showUser();


  const [startDate, setStartDate] = useState<Date>(new Date());
  const [times, setTimes] = useState<dadosFire[]>([])
  const isMounted = useRef(false);
  const [deleteTime, setDeleteTime] = useState<dadosFire[]>([])

  const [deleteAShowScheduled, setDeleteAShowScheduled] = useState<dadosUserScheduled[]>([])
  const [schedule, setSchedule] = useState<dadosUserScheduled[]>([])

  const [user, setUser] = useState<dadosUser | null>(null);

  const [selectedSlot, setSelectedSlot] = useState<{docId: string; slotKey: string, value: string} | null>(null);

  const [atualizar, setAtualizar] = useState(0);

  const updateSlot = async (docId: string, slotKey: string, value : string) => {
    const docRef = doc(db, 'data', docId);
    await updateDoc(docRef, {
      [slotKey]: [value, false],
    });
    const increment = (user?.count ?? 0) + 1;
    const createDoc = await addDoc(collection(db, 'scheduled'),{
      nome : user?.nome,
      email: user?.email,
      userId: user?.id,
      count: increment,
      date: startDate.toLocaleString().substr(0, 10),
      dateD: startDate,
      time: value,
      dataId: docId,
      slotKey: slotKey,
    })
    await updateDoc(createDoc, {
      id: createDoc.id
    });
    if (userId) {
    const userRef = doc(db, 'users',String(userId))
   await updateDoc(userRef,{
      count: increment
   })
  } else {
    console.error('userId is undefined or empty');
  }
   const atual = atualizar + 1;
   setAtualizar(atual)
    
  }

  const getSlotClick = (docId : string, slotKey: string, value: string) =>{
    setSelectedSlot({ docId, slotKey, value });
  }

  const handleConfirm = ()=>{
  if(userId){
    if(selectedSlot){
      updateSlot(selectedSlot.docId, selectedSlot.slotKey, selectedSlot.value)
    }else{
      alert('escolha um horario')
    }
  }else{
    alert('Porfavor faça login')
  }
  }
 
  // limite de data e data nula
  const isWeek = (date : Date)=>{
    const day = getDay(date);
    return day !== 0;
  }
  const today = new Date();
  const nextValidDate = getDay(today) === 0 ? addDays(today, 1) : today;

//pegar criar e fazer arquivos

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
    
     console.log('getOrCreate')

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
},[startDate, atualizar])


//deletar datas
useEffect(() => {
  if (isMounted.current) {
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

       const getRefScheduled = await getDocs(collection(db, 'scheduled'))
       const getScheduled = await getRefScheduled.docs.map(doc =>{
        const data = doc.data();
        return{
          date: data.date,
          dateD: data.dateD,
          id: data.id,
          nome: data.nome,
          count : data.count,
          email : data.email,
          userId: data.userId,
          time: data.time,
          slotKey: data.slotKey,
          dataId: data.dataId
        }as dadosUserScheduled
       })
 
       setDeleteTime(getDocuments);
       setDeleteAShowScheduled(getScheduled);


   console.log('deleteDates')
   };

   deleteDates();
  } else {
    isMounted.current = true;
  }
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

  deleteAShowScheduled.forEach(async (d)=>{
     const currentDate = new Date();
     const documentDate = d.dateD;
     const realTime = (documentDate.seconds * 1000) + Math.floor(documentDate.nanoseconds / 1000000);
     const realDate = new Date(realTime);

     const currentDateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
     const documentDateWithoutTime = new Date(realDate.getFullYear(), realDate.getMonth(), realDate.getDate());

    if(currentDateWithoutTime > documentDateWithoutTime) {
      await deleteDoc(doc(db, 'scheduled', d.id))
      
    }
      console.log('deletar');
    })
    
}

deleteDocumentes();
},[deleteTime])

//get user By id 

useEffect(()=>{

  const getUsuario = async () =>{
   try{
    if(userId){
    const docRef = doc(db, 'users',String(userId))
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()){
      const docUserSnap = docSnap.data() as dadosUser;
      setUser(docUserSnap);
    }else{
      console.log('erroDocSnap')
    }    
  }else{
}
   }catch(err){
    console.log(err);
   }
  }
  getUsuario();

},[userId])

//getScheduled fire base

useEffect(()=>{
  const getScheduled = async ()=>{
    const getRefS = await getDocs(collection(db, 'scheduled'))
    const getDocsS = await getRefS.docs.map((doc)=>{
      const data = doc.data();
      return{
        count : data.count,
        email : data.email,
        id: data.id,
        nome:data.nome,
        userId:data.userId,
        time: data.time,
        dateD: data.dataD,
        date: data.date,
        dataId: data.dataId,
        slotKey: data.slotKey,
      }as dadosUserScheduled
    })
    setSchedule(getDocsS)
    console.log('getScheduled')

  }
  getScheduled();
},[atualizar]);

//cancel scheduled

const handleCancel = async (docId: string, slotKey: string, docTime: string, docRefId: string)=>{

  try{
    const docRef = doc(db, 'data', docId);
    await updateDoc(docRef, {
      [slotKey]: [docTime, true],
    });
    await deleteDoc(doc(db, 'scheduled', String(docRefId)))

    const atual = atualizar + 1;
    setAtualizar(atual)
    
    alert('Cancelado com sucesso')


  }catch(err){
  alert('erro ao cancelar')
  }

}


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
         {times.map(times =>{  console.log('oi'); return(
          <div key={times.date}>
            
          <h1>{times.date}</h1>
          {Object.entries(times).map(([key, value]) => {
            if (key !== 'date' && Array.isArray(value) && value.length === 2 && typeof value[1] === 'boolean' && value[1] === true) {
              console.log('maximo de 16')
              return (
              <div key={key} onClick={()=>getSlotClick(times.id, key, value[0])}>
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
         )})}
        </div>
      )
     }

    {/* lembrar que aq ao colocar console antes do return ele está sendo chamdo infinito */}
     {schedule.map((doc) =>{
      if(doc.userId === userId){
        console.log('pessoal')
        return(
          <div key={doc.id}>
            <h1>
              você {doc.nome} reservol o horario {doc.time} para o data {doc.date}
            </h1>
            <button onClick={()=>handleCancel(doc.dataId, doc.slotKey, doc.time, doc.id)} >Cancelar horario</button>
          </div>
        )
      } else return null
     })}
    


    {user ?(
        user.manager ? (
          <div>
            {user.nome}
          {schedule.map(doc =>{
            if(doc.date == startDate.toLocaleString().substr(0, 10)){
              console.log('manager');
              return(
                <div key={doc.id}> {doc.nome} reservol para as {doc.time} e já cortou o cabelo {doc.count}</div>
              )
            }else return (<h1>Para esse dia ainda não foi reservado nenhum horario</h1>)
          })}
          </div>
        ) : null
      ):(
        <h1> </h1>
      )}

      </div>
    </main>
  );
}
