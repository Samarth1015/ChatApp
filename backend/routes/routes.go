package routes

import (
	"backend/controller"

	"github.com/gorilla/mux"
)


func Router() *mux.Router{
    r:=mux.NewRouter();
    r.HandleFunc("/message",controller.HandlMessage);
    
   return r
}