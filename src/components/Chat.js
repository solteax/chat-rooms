import React, {useState, useRef, useEffect} from 'react'
import socket from '../socket'

const Chat = ({users, messages, userName, roomId, onAddMessage}) => {

    const [messageValue, setMessageValue] = useState('')

    const messagesRef = useRef(null)

    const onSendMessage = () => {
        const msg = messageValue.trim()
        
        if(msg && msg!=''){
            socket.emit('ROOM:NEW_MESSAGE', {
                text: messageValue,
                userName,
                roomId
            })
    
            onAddMessage({
                text: messageValue,
                userName
            })
    
            setMessageValue('')
        }
    }

    useEffect(()=>{
        messagesRef.current.scrollTo(0, messagesRef.current.scrollHeight)
    }, [messages])

    return (
        <div className="chat">
            <div className="chat-users">
                Комната: <b>{roomId}</b>
                <hr />
                <b>Онлайн ({users.length}):</b>
                <ul>
                    {users.map((user,index) => <li key={user + index}>{user}</li>)}
                </ul>
            </div>
            <div className="chat-messages">
                <div ref={messagesRef} className="messages">
                    {
                        messages.map((message, index)=>(
                            <div 
                                key={message+index} 
                                className={ message.userName===userName?"message my-message":"message" }>
                                
                                <p>{message.text}</p>
                                <div>
                                <span>{message.userName}</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <form>
                    <textarea
                        className="form-control"
                        value={messageValue}
                        autofocus="true"
                        onChange={e=>setMessageValue(e.target.value)}
                        onKeyPress={e=>{
                            if(e.key === 'Enter' && !e.shiftKey){
                                e.preventDefault();

                                onSendMessage();
                            }
                        }}
                        rows="3"
                    ></textarea>
                    <button onClick={onSendMessage} type="button" className="btn btn-primary">
                    Отправить
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Chat
