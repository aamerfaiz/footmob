import React, { useRef, useState } from 'react';
import './App.css';


import { getAuth, signInWithEmailAndPassword, addDoc, getDocs } from "firebase/auth";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';


import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyAK_k2ki7bhx-foUgjZ1uMIlgdDhzdx3IQ",
  authDomain: "footmob-sims.firebaseapp.com",
  databaseURL: "https://footmob-sims-default-rtdb.firebaseio.com",
  projectId: "footmob-sims",
  storageBucket: "footmob-sims.appspot.com",
  messagingSenderId: "549857284048",
  appId: "1:549857284048:web:7664307b6b8f36d3c073d5",
  measurementId: "G-V27J4YRCGL"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();




function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <span>{auth.currentUser ? <span>{auth.currentUser.email}</span> : <span>dsads</span>} </span>

          <img src={'./images/simslogo.png'} />
          <SignOut />
      </header>

      <section>

        {user ? <ChatRoom /> : <SignIn />}

      </section>

    </div>
  );
}

function SignIn() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [invalid, setinvalid] = useState("");

  const signin = () => signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      // firestore.collection("users").doc(userCredential.uid).set
      console.log(userCredential, "--------------------")
      const user = userCredential.user;
      console.log(user, "++++++++++++++++");
      
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      console.log(errorCode, "aamer")
      if (errorCode == "auth/wrong-password") {
        setinvalid("Invalid Password");
      }
      else {
        setinvalid("User does not Exist");
      }
      const errorMessage = error.message;
    });


    
  return (
    <>
      <form className='loginform'>
        <input type="text" onChange={(e) => { setEmail(e.target.value) }}></input>
        <input type="password" onChange={(e) => { setPassword(e.target.value) }}></input>
      </form>
      <div className="warning">{invalid}</div>
      <button className="sign-in" onClick={signin}>Sign in </button>
      <button className="sign-in" onClick={signin}>Sign up </button>
    </>
  )

}

console.log(auth.currentUser);


function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {

  const dummy = useRef();
  function something(){
    setTimeout(() => { dummy.current.scrollIntoView({ behavior: 'smooth' }); }, 0);

  }
  something();
  const messagesRef = firestore.collection('messages');


  const query = messagesRef.orderBy('createdAt');

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid
    })

    setFormValue('');
    setTimeout(() => { dummy.current.scrollIntoView({ behavior: 'smooth' }); }, 0)


  }

  return (<>
    <main className='chatroom'>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form className='chatinput' onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="CHAT HERE" />

      <button type="submit" disabled={!formValue}>ENTER</button>
    </form>
  </>)
}




function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>

      <div className='sender'>
        <div className='imagesender'>
          <img src={photoURL || './images/usericon.png'} />
        </div>
        <div className='messagesender'>
          <span>{auth.currentUser.displayName || auth.currentUser.email}</span>
          <p>{text}</p>

        </div>
      </div>
    </div>

  </>)
}


export default App;