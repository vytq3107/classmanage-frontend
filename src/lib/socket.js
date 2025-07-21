import { io } from 'socket.io-client'

let socket

export function connectSocket(userId) {
  if (!socket) {
    socket = io('http://localhost:5003') 
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
      socket.emit('register', userId)
    })
  }

  return socket
}

export function getSocket() {
  return socket
}
