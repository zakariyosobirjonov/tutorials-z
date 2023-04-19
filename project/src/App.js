import "./App.css"

import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection } from "react-firebase-hooks/firestore"
import {
  collection,
  orderBy,
  limit,
  query,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"
import { db, auth } from "./config"
import { useEffect, useRef, useState } from "react"
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"

function App() {
  const [user] = useAuthState(auth)

  const messageRef = collection(db, "messages")
  const queryRef = query(messageRef, orderBy("createdAt", "desc"), limit(20))
  const [messages] = useCollection(queryRef, { idField: "id" })

  const [formValue, setFormValue] = useState("")

  const scrollTo = useRef(null)

  const sendMessage = async (e) => {
    e.preventDefault()

    if (!user || !formValue) return

    const payload = {
      text: formValue,
      createdAt: serverTimestamp(),
      uid: user.uid,
      photoUrl: user.photoURL,
    }
    await addDoc(messageRef, payload)

    setFormValue("")
  }

  useEffect(() => {
    scrollTo.current.scrollIntoView({ behavior: "smooth" })
  }, [messages])
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  }

  const logOut = () => {
    signOut(auth)
  }

  return (
    <div className="App">
      <h1>Messages</h1>
      <div className="messages">
        <div ref={scrollTo}></div>
        {messages &&
          messages.docs.map((msg) => (
            <ChatMessage key={msg.id} message={msg.data()} />
          ))}
      </div>
      <form>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button onClick={(e) => sendMessage(e)}>Send</button>
      </form>
      <div className="buttons">
        {!user ? (
          <button className="login" onClick={() => googleSignIn()}>
            Login With Google
          </button>
        ) : (
          <button className="logout" onClick={() => logOut()}>
            Log out
          </button>
        )}
      </div>
    </div>
  )
}

function ChatMessage(props) {
  if (!auth.currentUser) return
  const { text, uid, photoUrl } = props.message

  const className = uid === auth.currentUser.uid ? "sent" : "recieved"

  return (
    <div className={className}>
      <p>{text}</p>
      <img src={photoUrl} alt="User Photo" />
    </div>
  )
}

export default App
