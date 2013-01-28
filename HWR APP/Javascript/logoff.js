function handleLogoff() {
	console.log("handleLogoff");  
	window.localStorage.removeItem("username");
	window.localStorage.removeItem("password");
   	
	console.log("gehe zur Login Seite");
	$.mobile.changePage("index.html");
}