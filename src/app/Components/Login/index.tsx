
import { useEffect, useState } from 'react';
import styles from './login.module.css'

import Modal from 'react-modal';


import { useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, db } from '@/firebase/firebase';
import { addDoc, collection, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { FacebookAuthProvider } from 'firebase/auth/web-extension';
import { showUser } from '@/app/context';
import { setuid } from 'process';



const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      padding: '20px'
    }
  };

export function Login(){

//context

const {setUserId} = showUser();

//Modal
  const [modalLoginIsOpen, setModalLoginIsOpen] = useState(false);
  const [modalCreateIsOpen, setModalCreateIsOpen] = useState(false);
  const [modalPasswordIsOpen, setModalPasswordIsOpen] = useState(false);  

  const openModalLogin = () => {
    setModalLoginIsOpen(true);
  };

  const closeModalLogin = () => {
    setModalLoginIsOpen(false);
  };

  const openPassword = ()=>{
     setModalLoginIsOpen(false);
     setModalPasswordIsOpen(true);
  }

  const closeModalPassword = () => {
    setModalPasswordIsOpen(false);
  };

  const openCreate = ()=>{
    setModalCreateIsOpen(true);
    setModalLoginIsOpen(false);
 }

 const closeModalCreate = () => {
   setModalCreateIsOpen(false);
 };

//status
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [nome, setNome] = useState('');
const [login, setLogin] = useState(false);

//create a Count

const [
    createUserWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useCreateUserWithEmailAndPassword(auth);

const prencherCampos = async () => {
    if (!email || !password || !nome) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(email, password);

      const getRefUser = await addDoc(collection(db, 'users'), {
        nome: nome,
        email: email,
        count: 0,
        manager: false,
      });

      await updateDoc(getRefUser, {
        id: getRefUser.id
      });

      setLogin(true);
      localStorage.setItem('conect', 'true');
      localStorage.setItem('userId', getRefUser.id);

      closeModalCreate();
      alert('Usuário criado com sucesso');
    } catch (error) {
      
      alert('Erro ao criar conta ou usuário já existe.');
    }
  };

// conectar a conta 

const [
    signInWithEmailAndPassword,
  ] = useSignInWithEmailAndPassword(auth);
  
const conectCount = async () =>{

    if (!email || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
      }
    try{

        signInWithEmailAndPassword(email, password);
        console.log('Você se logou');
        setLogin(true);
        localStorage.setItem('conect', 'true');
        //pegar o usuario no database por EMAIL
        const userRef = collection(db, 'users');
        const q = query(userRef, where('email', '==', email))
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc)=>{
            localStorage.setItem('userId', doc.id);
            setUserId(doc.id);
        })
        closeModalLogin();
       
    } catch (error) {
      
      alert('Erro ao se conectar');
    }

}

useEffect(() =>{

  const conected = localStorage.getItem('conect')
  const idUser = localStorage.getItem('userId')
  if(idUser){
    setUserId(idUser);
  }
  
  
  if(conected && conected === 'true'){
    setLogin(true);
  }else{
    setLogin(false);
  }

},[])

const desconect = async()=>{
    
    localStorage.removeItem('conect');
    localStorage.removeItem('userId'); 
    setLogin(false);
    window.location.reload();
}

    return(
        <div>

            <div>
                { login?(
                      <button onClick={desconect}>desconectar</button>
                ):(
                    <button onClick={openModalLogin}>Logar</button>

                )}

                <Modal
                    isOpen={modalLoginIsOpen}
                    onRequestClose={closeModalLogin}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <div className={styles.modalLogin}>
                        <input                         
                        type='Email' 
                        placeholder='Email'
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}/>

                        <input                       
                        type='password' 
                        placeholder='Senha'
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}/>

                        <p onClick={openPassword}>Esqueci a senha</p>
                        <p onClick={openCreate}>Criar uma conta</p>
                        <button onClick={conectCount}>Conectar</button>
                    </div>
                </Modal>
            </div>

            <Modal
                    isOpen={modalPasswordIsOpen}
                    onRequestClose={closeModalPassword}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <div className={styles.modalLogin}>
                        <input type='email'/>
                        <button onClick={closeModalPassword}>Fechar Modal</button>
                    </div>
                </Modal>

                <Modal
                    isOpen={modalCreateIsOpen}
                    onRequestClose={closeModalCreate}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <div className={styles.modalLogin}>
                        <input 
                        placeholder='Nome'
                        value={nome}
                        onChange={(e)=> setNome(e.target.value)}
                        />
                        <input 
                        type='Email' 
                        placeholder='Email'
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}/>

                        <input 
                        type='password' 
                        placeholder='Senha'
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}/>
                        <button onClick={prencherCampos}>Criar conta</button>
                    </div>
                </Modal>


        </div>
    )
}