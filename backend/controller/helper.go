package controller

import (
	
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)


var clients =make(map[*websocket.Conn]bool)
var lock = &sync.Mutex{}


var upgrader = websocket.Upgrader{
	
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}


func HandlMessage(w http.ResponseWriter, r *http.Request) {
	
	conn, err := upgrader.Upgrade(w, r, nil)
	
	if err != nil {
		log.Println("Error upgrading to WebSocket:", err)
		return
	}
	lock.Lock()
	clients[conn]=true;
	lock.Unlock()
	broadcastconnectedmsg(1);

	for{
		ty,msg,err:=conn.ReadMessage()
		if err!=nil {
			
			break
		}
		fmt.Println(msg);
		broadcast(ty,msg);

			

	}
   	defer func() {
		
		lock.Lock()
		delete(clients, conn)
		lock.Unlock()
		conn.Close()
		fmt.Println("Client disconnected")
	}()

	
	
}
func broadcastconnectedmsg(ty int){
	for	con,_:= range clients{
		con.WriteMessage(ty,[]byte(`user connected`));
	}

}
func broadcast (ty int,msg []byte ){
	lock.Lock();
	defer lock.Unlock();
	for  client,connected:= range clients{
		if connected {
			client.WriteMessage(ty,msg)
			
		}

	}

}
