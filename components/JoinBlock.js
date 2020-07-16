import React, {useState} from 'react'
import axios from 'axios'

const JoinBlock = ({onLogin}) => {
    const [roomId, setRoomId] = useState()
    const [userName, setUserName] = useState()

    const onEnter = async () => {
    
        if(!roomId || !userName)
            return alert('You should fill all the fields.')
        
        const obj = {
            roomId,
            userName
        }

        // const axiosConfig = {
        //     headers: {
        //         'Content-Type': 'application/json; charset=utf-8',
        //         'Access-Control-Allow-Origin': '*'
        //     }
        // }

        const {data:isValid} = await axios.post('/checkVal', obj)

        if(isValid){
            await axios.post('/rooms', obj)
            onLogin(obj)
        } else {
            alert(`${userName} is already taken at ${roomId}`)
        }
        
    }

    return (
        <div className="join-block">
            <input type="text" placeholder="Room ID" 
                defaultValue={roomId} 
                onChange={e=> setRoomId(e.target.value)}/>
            <input type="text" placeholder="User name" 
                defaultValue={userName}
                onChange={e=> setUserName(e.target.value)}
                />
            <button className="btn btn-success"
                onClick={onEnter}>Войти</button>
        </div>
    )
}

export  default JoinBlock