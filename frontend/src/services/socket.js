let socket = null;

export async function connectSocket(){
  if(socket) return socket;
  try{
    const { io } = await import('socket.io-client');
    const URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;
    socket = io(URL);
    return socket;
  }catch(err){
    console.warn('socket.io-client no está instalado o no puede conectarse', err);
    return null;
  }
}

export function on(event, cb){ if(!socket) return; socket.on(event, cb); }
export function off(event, cb){ if(!socket) return; socket.off(event, cb); }
export function emit(event, payload){ if(!socket) return; socket.emit(event, payload); }
export function getSocket(){ return socket; }
