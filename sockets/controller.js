const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require('../models');

const chatMensajes = new ChatMensajes();
const socketController = async(socket = new Socket(), io) =>{
    // console.log('cliente conectado ' , socket.id);
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);
    if(!usuario){
        return socket.disconnect();
    }
    
    //Agregar al usuario conectado 
    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    //Limpiar cuando un usuario se desconecta
    socket.on('disconect', () =>{
        chatMensajes.desconectarUsuario(usuario.id);
    });
} 

module.exports = {
    socketController
}