import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

let io : SocketIOServer;


export async function initSocket (server: HttpServer){
    io = new SocketIOServer(server, {
        cors:{
            origin: "*"
        }
    });


    const pubClient = createClient({url: "redis://smartbox-api-redis-1:6379" });
    const subClient = pubClient.duplicate();

    await pubClient.connect();
    await subClient.connect();


    io.adapter(createAdapter(pubClient, subClient));

    io.on("connection", (socket) =>{
        console.log(`Yeni bağlantı ${socket.id}`)



        socket.on("chat", (message)=>{
            console.log(`Mesaj alındı ${message}`)
            io.emit("chat", message)

        })


        socket.on("disconnect", ()=>{
            console.log(`Bağlantı koptu ${socket.id}`)
        });
    });
}

export { io};