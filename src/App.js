import React, { useRef, useState } from 'react';
import './App.css';


import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
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
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}

      </section>

    </div>
  );
}

function SignIn() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const [invalid, setinvalid] = useState("");
 
 const signin = ()=> signInWithEmailAndPassword(auth, email,password )
  .then((userCredential) => {
    // Signed in 
    console.log(userCredential,"--------------------")
    const user = userCredential.user;
    console.log(user,"++++++++++++++++");
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    console.log(errorCode,"aamer")
    if(errorCode == "auth/wrong-password"){
      setinvalid("Invalid Password");
    }
    else{
      setinvalid("User does not Exist");
    }
    const errorMessage = error.message;
  });

  return (
    <>
      <form className='loginform'>
        <input type="text" onChange={(e)=>{setEmail(e.target.value)}}></input>
        <input type="password" onChange={(e)=>{setPassword(e.target.value)}}></input>
      </form>
      <div className="warning">{invalid}</div>
      <button className="sign-in" onClick={signin}>Sign in </button>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  

  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
  </>)
}




function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;