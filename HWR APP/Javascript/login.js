function init() {
	document.addEventListener("deviceready", deviceReady, true);
	delete init;
}


function checkPreAuth() {
    var form = $("#loginForm");
    if(window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
        $("#username", form).val(window.localStorage["username"]);
        $("#password", form).val(window.localStorage["password"]);
        handleLogin();
    }
}

function handleLogin() {
	console.log("handleLogin");
    var form = $("#loginForm");    
    //disable the button so we can't resubmit while we wait
	$("#submitButton",form).attr("disabled","disabled");
    var u = $("#username", form).val();
    var p = $("#password", form).val();
    if(u != '' && p!= '') {
		console.log("serverabfrage");
		console.log("username: " + u);
		console.log("password: " + p);
		var url = "http://garten-kabel-pflasterbau.de/hwr-com/hallodu.php?un="+u+"&pw="+p;
		console.log(url);  
		$.post(url, function (data) {
			console.log("request gesendet");
			console.log(data.logincheck);
			if (data == '({"logincheck":"true"});') {
				//store
                window.localStorage["username"] = u;
                window.localStorage["password"] = p;    
				console.log("gehe zur naechsten Seite");
				$.mobile.changePage("Kontakte.html");
				//navigator.notification.alert("Your login succesed", function() {});
			} else {
				console.log("keine Daten");
				console.log("false login")
				alert("Your login failed");
				navigator.notification.alert("Your login failed", function() {});
			}
		});
    } else { 
        //Thanks Igor!
		console.log("keine angaben");
		alert("You must enter a username and password");
		//navigator.notification.alert("You must enter a username and password");
    }
	$("#submitButton").removeAttr("disabled");
    return false;
}

function deviceReady() {  
 $("#loginForm").on("submit",handleLogin);
}