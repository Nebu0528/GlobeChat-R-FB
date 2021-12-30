import React, { useRef, useState } from 'react';
import './App.css';

//import firebase from 'firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


firebase.initializeApp({
apiKey: "AIzaSyB78WRVfLmUsjCKa7mKuzsxH9kCkJ99KaU",
authDomain: "chatapp-2e57c.firebaseapp.com",
projectId: "chatapp-2e57c",
storageBucket: "chatapp-2e57c.appspot.com",
messagingSenderId: "245795858874",
appId: "1:245795858874:web:c5cf2b381cd93585b91583",
measurementId: "G-55QHP6WJT5"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1> CHAT 💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

// Sign in with Google
function SignIn() {

  const signInWithGoogle = () => {
    auth.useDeviceLanguage();
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(error => console.error(error));
    }



  //Anonymous Sign in
  const signInAnonymously = () => {
    auth.useDeviceLanguage();
    auth.signInAnonymously().then(user => {
      user.user.updateProfile({
        displayName: "Anonymous " + (Math.random() * 999999 + 1).toFixed(0),
        photoURL: "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
      })
    })
      .catch(error => alert(error));
  }


  return (
     
      <div id="login-card">
      <h3>A live chatting web application</h3> 
      <p>Made by Neel B</p>
      <br />
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>      <br />

      <br /> < button className="sign-in" onClick={signInAnonymously}>Sign in Anonymously</button>
      </div>

  )

}



//Sign Out
function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

// Chatroom
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

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Enter a Message" />

      <button type="submit" disabled={!formValue}>Enter</button>

    </form>
  </>)
}

// Message
function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  
  return (
  <>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;

