
import { useEffect, useState } from 'react';
import './style.css'

import Modal from 'react-modal';


import { useCreateUserWithEmailAndPassword, useSendPasswordResetEmail, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, db } from '@/firebase/firebase';
import { addDoc, collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { showUser } from '@/app/context';

import logo from '../../../assets/logoas.png'
import Image from 'next/image';

import sla from '../../../assets/user-interface.png'
import enter from '../../../assets/enter.png'

import { toast } from 'react-toastify';

import { IconButton, InputAdornment, Input, InputLabel, FormControl } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

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

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

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
      toast.warning('Por favor, preencha todos os campos.');
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
      toast.success('Usuário criado com sucesso');
    } catch (error) {
      
      toast.error('Erro ao criar conta ou usuário já existe.');
    }
  };

// conectar a conta 

const [
    signInWithEmailAndPassword,
  ] = useSignInWithEmailAndPassword(auth);
  
const conectCount = async () =>{

    if (!email || !password) {
        toast.warning('Por favor, preencha todos os campos.');
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
      
      toast.error('Erro ao se conectar');
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

// desconectar 

const desconect = async()=>{
    
    localStorage.removeItem('conect');
    localStorage.removeItem('userId'); 
    setLogin(false);
    window.location.reload();
}


//resetar Senha 

const actionCodeSettings = {
  url: 'http://localhost:3000/',
};

const [sendPasswordResetEmail, sending] = useSendPasswordResetEmail(auth);

const [passReset, setPassReset] = useState('');

    return(
        <div className='loginContent'>

            <div>
                { login?(
                      <button onClick={desconect} className='buttonLogin'>
                        <Image src={enter} alt='enter' className='buttonImage2'/>
                        Desconectar
                        </button>
                ):(
                    <button onClick={openModalLogin} className='buttonLogin'>
                      <Image src={sla} alt='user' className='buttonImage1'/>
                      Conectar
                      </button>

                )}

                <Modal
                    isOpen={modalLoginIsOpen}
                    onRequestClose={closeModalLogin}
                    style={customStyles}
                    contentLabel="Example Modal"
                    ariaHideApp={false}
                >
                    <div className='modalLogin'>
                      <div className='logoName'>
                        <Image src={logo} alt='logo' className='logo'/>
                        <h2>Barbearia</h2>
                      </div>
                      <h3>Email</h3>
                        <input                         
                        type='Email' 
                        placeholder='Insira seu email'
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}/>

                        <h3>Senha</h3>
                        <input                       
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Insira sua senha'
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        className='senha'
                        />
      <button
        type="button"
        className="password-toggle"
        onClick={handleClickShowPassword}
      >
              {showPassword ? <VisibilityOff /> : <Visibility />}
              </button>


                        <p onClick={openPassword}>Esqueci a senha</p>
                        <p onClick={openCreate}>Criar uma conta</p>
                        <button onClick={conectCount} className='confirmButtons'>Conectar</button>
                    </div>
                </Modal>
            </div>

            <Modal
                    isOpen={modalPasswordIsOpen}
                    onRequestClose={closeModalPassword}
                    style={customStyles}
                    contentLabel="Example Modal"
                    ariaHideApp={false}
                >
                  
                    <div className='modalLogin'>
                    <div className='logoName'>
                        <Image src={logo} alt='logo' className='logo'/>
                        <h2>Barbearia</h2>
                      </div>
                      <h3>Email</h3>
                        <input type='email'
                        placeholder='Email'
                        value={passReset}
                        onChange={(e) =>setPassReset(e.target.value)}
                        />
                        <button className='confirmButtons' onClick={async () => {
          const success = await sendPasswordResetEmail(
            passReset,
            actionCodeSettings
          );
          if (success) {
            toast.warning('Email enviado');
          }else{
            toast.warning('Email errado ou conta inexistente')
          }
        }}>Mudar a senha</button>
                    </div>
                </Modal>

                <Modal
                    isOpen={modalCreateIsOpen}
                    onRequestClose={closeModalCreate}
                    style={customStyles}
                    contentLabel="Example Modal"
                    ariaHideApp={false}
                >
                    <div className='modalLogin'>
                    <div className='logoName'>
                        <Image src={logo} alt='logo' className='logo'/>
                        <h2>Barbearia</h2>
                      </div>

                      <h3>Nome e sobrenome</h3>
                        <input 
                        placeholder='Insira nome e sobrenome'
                        value={nome}
                        onChange={(e)=> setNome(e.target.value)}
                        />

                        <h3>Email</h3>
                        <input 
                        type='Email' 
                        placeholder='Insira seu email'
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}/>

                        <h3>Senha</h3>
                        <input 
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Insira sua senha'
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}/>
      <button
        type="button"
        className="password-toggle"
        onClick={handleClickShowPassword}
      >
              {showPassword ? <VisibilityOff /> : <Visibility />}
              </button>

                        <button onClick={prencherCampos} className='confirmButtons'>Criar conta</button>
                    </div>
                </Modal>


        </div>
    )
}