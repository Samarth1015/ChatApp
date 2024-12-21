package main

import (
	"backend/routes"
	"net/http"
)	

func main() {
	
	
	r:=routes.Router();

	http.ListenAndServe(":8000",r)



}