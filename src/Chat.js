

import './Chat.css'
import React, { useEffect, useState } from 'react'
import { Avatar, IconButton } from '@material-ui/core'
import { AttachFile, Message, MoreVert,SearchOutlined } from '@material-ui/icons';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import MicIcon from '@material-ui/icons/Mic'
import { useParams } from 'react-router-dom';
import db from './firebase';
import firebase from "firebase";
import { useStateValue } from './StateProvider';
function Chat() {
    const [input, setInput] = useState(" ");
    const [seed, setSeed] = useState(" ");
    const {roomId} =useParams();
    const [roomName, setRoomName] = useState(" ");
    const [messages, setMessages] = useState([]);
    const [{ user }, dispatch] = useStateValue();
    useEffect(()=>{
        if(roomId){
            db.collection('rooms').doc(roomId).onSnapshot((snapshot)=>(
                setRoomName(snapshot.data().name)
            ));
            db.collection("rooms")
                .doc(roomId)
                .collection("messages")
                .orderBy("timestamp", "asc")
                .onSnapshot((snapshot) =>
                    setMessages(snapshot.docs.map((doc) => doc.data()))
                );
        }
    } ,[roomId]);
    useEffect(() => {
        Math.floor(
            setSeed(Math.random() * 5000))
    }, [roomId]);
    const sendMessage =(e)=>{
       e.preventDefault();
       console.log("you typed",input);
       db.collection("rooms").doc(roomId).collection('messages').add({
           message :input,
          name: user.displayName,
          timestamp:firebase.firestore.FieldValue.serverTimestamp(),
       })
       setInput(" ");
    }
    return (
        <div className="chat">
            <div className="chat_header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="chat_headerinfo">
                    <h3>{roomName}</h3>
                    <p>Last Messaage:{" "}
                        {
                      new Date(
                                messages[messages.length - 1]?.timestamp?.toDate()
                            ).toUTCString()}</p>
                </div>
                <div className="chat_header_right">
                    <IconButton>

                        <SearchOutlined />
                    </IconButton>
                    <IconButton>    
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className="chat_body">
                {messages.map((message)=>(
                    <p className={`chat_messages  ${message.name === user.displayName && `chat_receiver`}`}>
                        <span className="chat_name">{message.name}</span>
                              {message.message}
                        <span className="chat_timestamp">
                            {new Date(message.timestamp?.toDate()).toUTCString()}</span>
                    </p>
                ))}
             
            </div>
            <div className="chat_footer">
                <InsertEmoticonIcon/>
                <form >
                    <input  value={input} onChange={(e)=> setInput(e.target.value)} placeholder="Type a message"type="text" />
                    <button  onClick={sendMessage} type="submit">Send a message</button>
                </form>
                <MicIcon/>
            </div>
        </div>
    )
}

export default Chat
