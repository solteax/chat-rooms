const express = require('express');
const useSocket = require('socket.io');
const path = require('path');
const favicon = require('express-favicon');
const app = express();
const server = require('http').Server(app);
const io = useSocket(server);
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 80

app.use(bodyParser.json()); // !!!!!!

app.use(favicon(__dirname + '/build/favicon.ico'));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')))

const rooms = new Map();

app.get('/rooms/:id', function(req, res){
    const { id: roomId } = req.params;
    const obj = rooms.has(roomId) ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()],
    } : { users: [], messages: [] }
    res.json(obj);
});

app.post('/rooms', function(req, res){
    const {roomId} = req.body
    if(!rooms.has(roomId)){
        rooms.set(roomId, new Map([
            ['users', new Map()],
            ['messages', []],
        ]))
    }

    res.send()
});

app.post('/checkVal', function(req, res){
    const {roomId, userName} = req.body
    let isValid = true

    if(rooms.has(roomId)){
        isValid = true
        const users = rooms.get(roomId).get('users').values()

        for(let user of users){
            if (user===userName)
                isValid = false
        }
    }

    res.send(isValid)
});

io.on('connection', socket => {
    socket.on('ROOM:JOIN', ({roomId,userName})=>{
        socket.join(roomId)
        rooms.get(roomId).get('users').set(socket.id, userName)
        const users = [...rooms.get(roomId).get('users').values()]
        socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users)
    })

    socket.on('ROOM:NEW_MESSAGE', ({roomId,userName, text})=>{
        const obj = {
            userName,
            text
        }
        rooms.get(roomId).get('messages').push(obj)
        socket.to(roomId).broadcast.emit('ROOM:NEW_MESSAGE', obj)
    })

    socket.on('disconnect', ()=>{
        rooms.forEach((value,roomId)=>{
            if(value.get('users').delete(socket.id)){
                const users = [...value.get('users').values()]
                socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users)
            }
        })
    })

    console.log('user connected by socket', socket.id)
})

server.listen(PORT, err => {
    if(err)
        throw new Error(err)
    else 
        console.log('server started')
})