//Login
//---------------------------------------------------------------------------------------------------
function init() {
	document.addEventListener("deviceready", deviceReady, true);
	delete init;
}


function checkPreAuth() {
	console.log("checkPreAuth");
    var form = $("#loginForm");
    if(window.localStorage.getItem("hwr-com-email") != undefined && window.localStorage.getItem("hwr-com-password") != undefined) {
        $("#username", form).val(window.localStorage.getItem("hwr-com-email"));
        $("#password", form).val(window.localStorage.getItem("hwr-com-password"));
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
		var pmd5 = MD5(p);
		console.log("serverabfrage");
		console.log("username: " + u);
		console.log("password: " + p);
		var url = "http://garten-kabel-pflasterbau.de/hwr-com/loghandler.php?un="+u+"&pw="+pmd5;
		console.log(url);  
		$.post(url, function (data) {
			console.log("request gesendet");
			if (data == '({"logincheck":"true"});') {
				//store
                window.localStorage.setItem("hwr-com-email", u);
                window.localStorage.setItem("hwr-com-password", p);    
				console.log("gehe zur naechsten Seite");
				$.mobile.changePage("Kontakte.html");
				navigator.notification.alert("Your login succesed", function() {}, "Error", "OK");
			} else {
				window.localStorage.removeItem("hwr-com-password");
				console.log("keine Daten");
				console.log("false login")
				alert("Your login failed");
				navigator.notification.alert("Your login failed", function() {}, "Error", "OK");
			}
		});
    } else { 
        //Thanks Igor!
		console.log("keine angaben");
		alert("You must enter a Email and password");
		navigator.notification.alert("You must enter a username and password", function() {}, "Error", "OK");
    }
	$("#submitButton").removeAttr("disabled");
    return false;
}

function deviceReady() {
	console.log("deviceReady");
	$("#loginPage").on("pageinit",function() {
		console.log("pageinit run");
		$("#loginForm").on("submit",handleLogin);
		checkPreAuth();
	});
	$.mobile.changePage("#loginPage");
}
//Logoff
//---------------------------------------------------------------------------------------------------
function handleLogoff() {
	console.log("handleLogoff");  
	window.localStorage.removeItem("hwr-com-email");
	window.localStorage.removeItem("hwr-com-password");
	console.log("get Item email: " + window.localStorage.getItem("hwr-com-email"));
	console.log("gehe zur Login Seite");
	$.mobile.changePage("index.html");
}
//Register
//--------------------------------------------------------------------------------------------------
function handleRegister() {
	console.log("handleRegister");
    var form = $("#RegisterForm");    
	$("#RegisterSubmitButton",form).attr("disabled","disabled");
    var u = $("#username", form).val();
    var p = $("#password", form).val();
	var p_wdh = $("#password2", form).val();
	var email = $("#email", form).val();
    if(u != '' && p!= '' && p_wdh!='' && email!='') {
		console.log("serverabfrage");
		console.log("username: " + u);
		console.log("password: " + p);
		console.log("password: " + p_wdh);
		console.log("email: " + email);
		if (p==p_wdh) {
			var pmd5=MD5(p);
			var url = "http://garten-kabel-pflasterbau.de/hwr-com/register.php?un="+u+"&pw="+pmd5+"&em="+email;
			console.log(url);  
			$.post(url, function (data) {
				console.log("request gesendet");
				if (data == '({"Registed":"new user registed"});') {
					//store
					window.localStorage.setItem("hwr-com-email", u);
					window.localStorage.setItem("hwr-com-password", p);    
					console.log("gehe zur anmelde Seite");
					$.mobile.changePage("index.html");
				} else if (data == '({"Registed":"double email"});') {
					console.log("Email schon vorhanden(Bereits angemeldet), failed")
					//alert("Email bereits vorhanden");
					navigator.notification.alert("Email always registed, Your Registration failed", function() {}, "Error", "OK");
				}
			});
		} else {
			console.log("passwöerter nicht identisch");
			alert("Passwörter nicht identisch");
			navigator.notification.alert("Passwörter nicht identisch", function() {}, "Error", "OK");
		}
    } else { 
        //Thanks Igor!
		console.log("keine angaben");
		//alert("You must enter a username and password");
		navigator.notification.alert("You must enter a email and password", function() {}, "Error", "OK");
    }
	$("#RegisterSubmitButton").removeAttr("disabled");
    return false;
}

//Edit User 

function editUser(edittype, name) {
	console.log("edittype: " + edittype);
	console.log("name: " + name);
	var input;
	if(name=='pw') {
			input = "<form id='changePW'><input type='password' name='password' id='password' placeholder='neues passwort' class='required'><input type='password' name='password2' id='password2' placeholder='passwort wiederholen' class='required'><a rel='close' data-role='button' href='#' onclick='changeUser(\"pw\")'>Speichern</a><a rel='close' data-role='button' href='#' id='simpleclose'>Abbrechen</a></form>"; 
		} else if(name=='un') {
			input ="<form id='changeUN'><input type='text' name='username' id='username' placeholder='neuer username' class='required'><a rel='close' data-role='button' href='#' onclick='changeUser(\"un\")'>Speichern</a><a rel='close' data-role='button' href='#' id='simpleclose'>Abbrechen</a></form>";
		} else { //name = 'em'
			input = "<form id='changeEM'><input type='email' name='email' id='email' placeholder='neue Email' class='required'><a rel='close' data-role='button' href='#' onclick='changeUser(\"em\")'>Speichern</a><a rel='close' data-role='button' href='#' id='simpleclose'>Abbrechen</a></form>"; 
		}
  $(document).delegate(edittype, 'click', function() {
	$(this).simpledialog({
      'mode' : 'blank',
        'prompt': false,
        'forceInput': false,
        'useModal':true,
        'fullHTML' : 
			input
	})
	});
}

function changeUser(updatetyp) {
	var email = window.localStorage.getItem("hwr-com-email");
	console.log("account email: " + email);
	if (email != undefined) {
		switch (updatetyp) {
			case "un":
				var un = $("#username", "#changeUN").val();
				console.log(un);
				if (un != undefined) {
					console.log("un geändert - start sql");
					var url = "http://garten-kabel-pflasterbau.de/hwr-com/updateUser.php?un="+un+"&em="+email;
					console.log(url);
					//--- Request
					$.post(url, function (data) {
						console.log("request gesendet");
						if (data == '(true);') {
							//alert("Username geÃ¤ndert!");
							navigator.notification.alert("Username geÃ¤ndert!", function() {}, "Error", "OK");
						} else {
							//alert("Fehler beim update");
							navigator.notification.alert("Fehler beim update", function() {}, "Error", "OK");
						}	
					});
					//---
				} else {
					console.log("Usernamen eingeben");
					//alert("Usernamen eingeben");
					navigator.notification.alert("Usernamen eingeben", function() {}, "Error", "OK");
				}
			break;
			case "pw":
				var pw = $("#password", "#changePW").val();
				var pw2 = $("#password2", "#changePW").val();
				console.log("passwort1: " + pw);
				console.log("passwort2: " + pw2);
				if (pw == undefined || pw != pw2) {
					console.log("eingabefehler");
					//alert("Eingabefehler");
					navigator.notification.alert("Eingabefehler", function() {}, "Error", "OK");
				} else {
					console.log("passwort geÃ¤ndert - start sql");
					pw=MD5(pw);
					var url = "http://garten-kabel-pflasterbau.de/hwr-com/updateUser.php?pw="+pw+"&em="+email;
					console.log(url);
					//--- Request
					$.post(url, function (data) {
						console.log("request gesendet");
						if (data == '(true);') {
							window.localStorage.setItem("hwr-com-password", pw2);
							//alert("Passwort geÃ¤ndert!");
							navigator.notification.alert("Username geÃ¤ndert!", function() {}, "complete", "OK");
						} else {
							//alert("Fehler beim update");
							navigator.notification.alert("Fehler beim update", function() {}, "complete", "OK");
						}	
					});
					//---
					//alert("Passwort geÃ¤ndert!");
					navigator.notification.alert("Passwort geändert!", function() {}, "complete", "OK");
				}	
			break;
			case "em":
				var newem = $("#email", "#changeEM").val();
				console.log(newem);
				if (newem != undefined) {
					console.log("email geÃ¤ndert - start sql");
					var url = "http://garten-kabel-pflasterbau.de/hwr-com/updateUser.php?newem="+newem+"&em="+email;
					console.log(url);
					//--- Request
					$.post(url, function (data) {
						console.log("request gesendet");
						if (data == '(true);') {
							window.localStorage.setItem("hwr-com-email", newem);
							//alert("Email geÃ¤ndert!");
							navigator.notification.alert("Username geä¤ndert!", function() {}, "complete", "OK");
						} else {
							//alert("Fehler beim update");
							navigator.notification.alert("Fehler beim update", function() {}, "Error", "OK");
						}	
					});
					//---
					alert("Email geÃ¤ndert!");
					navigator.notification.alert("Email geÃ¤ndert!", function() {}, "complete", "OK");
				} else {
					console.log("email leer");
					//alert("Bitte beim Ã¤ndern auch email angeben!");
					navigator.notification.alert("Bitte beim Ändern auch email angeben!", function() {}, "Error", "OK");	
				}
			break;
		}
	} else {
		console.log("Ã¤nderungen nicht mÃ¶glich da keine email im speicher");
		//alert("nicht mÃ¶glich da keine email");
		navigator.notification.alert("nicht mÃ¶glich da keine email", function() {}, "Error", "OK");	
	}
}

//Delete Account 
//--------------------------------------------------------------------------------------

$(document).delegate('#deleteAccount', 'click', function() {
  $(this).simpledialog({
    'mode' : 'bool',
    'prompt' : 'delete Account?',
    'useModal': true,
    'buttons' : {
      'delete': { //Account lÃ¶schen
        click: function () {
			console.log("Account lÃ¶schen!");
			var email = window.localStorage["hwr-com-email"];
			if (email!=null) { // löschen
				var url = "http://garten-kabel-pflasterbau.de/hwr-com/deleteAccount.php?em="+email;
				console.log(url);  
				$.post(url, function (data) {
				console.log("request gesendet");
				if (data == '(true);') {
					//delete store
					window.localStorage.removeItem("hwr-com-email");
					window.localStorage.removeItem("hwr-com-password");
					console.log("gehe zur anmelde Seite");
					$.mobile.changePage("index.html");
				} else {
					console.log("löschen nicht möglich, sever failed")
					//alert("server process abgebrochen");
					navigator.notification.alert("sorry, delete not possible, server abbort", function() {}, "Error", "OK");
				}
			});
			} else {
				console.log("löschen nicht möglich, keine email");
				//alert("process abgebrochen, keine email");
				navigator.notification.alert("sorry, delete not possible, no email", function() {}, "Error", "OK");
			}			
        },
		 icon: "delete"
      },
      'Cancel': { //Abbrechen
        click: function () {
          console.log("Account löschen abgebrochen!");
		icon: "abbort"
      }
	 } 
    }
  })
})

//MD5
//---------------------------------------------------------------------------------------

function array(n) {
  for(i=0;i<n;i++) this[i]=0;
  this.length=n;
}
function integer(n) { return n%(0xffffffff+1); }

function shr(a,b) {
  a=integer(a);
  b=integer(b);
  if (a-0x80000000>=0) {
    a=a%0x80000000;
    a>>=b;
    a+=0x40000000>>(b-1);
  } else
    a>>=b;
  return a;
}

function shl1(a) {
  a=a%0x80000000;
  if (a&0x40000000==0x40000000)
  {
    a-=0x40000000;
    a*=2;
    a+=0x80000000;
  } else
    a*=2;
  return a;
}

function shl(a,b) {
  a=integer(a);
  b=integer(b);
  for (var i=0;i<b;i++) a=shl1(a);
  return a;
}

function and(a,b) {
  a=integer(a);
  b=integer(b);
  var t1=(a-0x80000000);
  var t2=(b-0x80000000);
  if (t1>=0)
    if (t2>=0)
      return ((t1&t2)+0x80000000);
    else
      return (t1&b);
  else
    if (t2>=0)
      return (a&t2);
    else
      return (a&b);
}

function or(a,b) {
  a=integer(a);
  b=integer(b);
  var t1=(a-0x80000000);
  var t2=(b-0x80000000);
  if (t1>=0)
    if (t2>=0)
      return ((t1|t2)+0x80000000);
    else
      return ((t1|b)+0x80000000);
  else
    if (t2>=0)
      return ((a|t2)+0x80000000);
    else
      return (a|b);
}

function xor(a,b) {
  a=integer(a);
  b=integer(b);
  var t1=(a-0x80000000);
  var t2=(b-0x80000000);
  if (t1>=0)
    if (t2>=0)
      return (t1^t2);
    else
      return ((t1^b)+0x80000000);
  else
    if (t2>=0)
      return ((a^t2)+0x80000000);
    else
      return (a^b);
}

function not(a) {
  a=integer(a);
  return (0xffffffff-a);
}

/* Here begin the real algorithm */

    var state = new array(4);
    var count = new array(2);
	count[0] = 0;
	count[1] = 0;
    var buffer = new array(64);
    var transformBuffer = new array(16);
    var digestBits = new array(16);

    var S11 = 7;
    var S12 = 12;
    var S13 = 17;
    var S14 = 22;
    var S21 = 5;
    var S22 = 9;
    var S23 = 14;
    var S24 = 20;
    var S31 = 4;
    var S32 = 11;
    var S33 = 16;
    var S34 = 23;
    var S41 = 6;
    var S42 = 10;
    var S43 = 15;
    var S44 = 21;

    function F(x,y,z) {
	return or(and(x,y),and(not(x),z));
    }

    function G(x,y,z) {
	return or(and(x,z),and(y,not(z)));
    }

    function H(x,y,z) {
	return xor(xor(x,y),z);
    }

    function I(x,y,z) {
	return xor(y ,or(x , not(z)));
    }

    function rotateLeft(a,n) {
	return or(shl(a, n),(shr(a,(32 - n))));
    }

    function FF(a,b,c,d,x,s,ac) {
        a = a+F(b, c, d) + x + ac;
	a = rotateLeft(a, s);
	a = a+b;
	return a;
    }

    function GG(a,b,c,d,x,s,ac) {
	a = a+G(b, c, d) +x + ac;
	a = rotateLeft(a, s);
	a = a+b;
	return a;
    }

    function HH(a,b,c,d,x,s,ac) {
	a = a+H(b, c, d) + x + ac;
	a = rotateLeft(a, s);
	a = a+b;
	return a;
    }

    function II(a,b,c,d,x,s,ac) {
	a = a+I(b, c, d) + x + ac;
	a = rotateLeft(a, s);
	a = a+b;
	return a;
    }

    function transform(buf,offset) {
	var a=0, b=0, c=0, d=0;
	var x = transformBuffer;

	a = state[0];
	b = state[1];
	c = state[2];
	d = state[3];

	for (i = 0; i < 16; i++) {
	    x[i] = and(buf[i*4+offset],0xff);
	    for (j = 1; j < 4; j++) {
		x[i]+=shl(and(buf[i*4+j+offset] ,0xff), j * 8);
	    }
	}

	/* Round 1 */
	a = FF ( a, b, c, d, x[ 0], S11, 0xd76aa478); /* 1 */
	d = FF ( d, a, b, c, x[ 1], S12, 0xe8c7b756); /* 2 */
	c = FF ( c, d, a, b, x[ 2], S13, 0x242070db); /* 3 */
	b = FF ( b, c, d, a, x[ 3], S14, 0xc1bdceee); /* 4 */
	a = FF ( a, b, c, d, x[ 4], S11, 0xf57c0faf); /* 5 */
	d = FF ( d, a, b, c, x[ 5], S12, 0x4787c62a); /* 6 */
	c = FF ( c, d, a, b, x[ 6], S13, 0xa8304613); /* 7 */
	b = FF ( b, c, d, a, x[ 7], S14, 0xfd469501); /* 8 */
	a = FF ( a, b, c, d, x[ 8], S11, 0x698098d8); /* 9 */
	d = FF ( d, a, b, c, x[ 9], S12, 0x8b44f7af); /* 10 */
	c = FF ( c, d, a, b, x[10], S13, 0xffff5bb1); /* 11 */
	b = FF ( b, c, d, a, x[11], S14, 0x895cd7be); /* 12 */
	a = FF ( a, b, c, d, x[12], S11, 0x6b901122); /* 13 */
	d = FF ( d, a, b, c, x[13], S12, 0xfd987193); /* 14 */
	c = FF ( c, d, a, b, x[14], S13, 0xa679438e); /* 15 */
	b = FF ( b, c, d, a, x[15], S14, 0x49b40821); /* 16 */

	/* Round 2 */
	a = GG ( a, b, c, d, x[ 1], S21, 0xf61e2562); /* 17 */
	d = GG ( d, a, b, c, x[ 6], S22, 0xc040b340); /* 18 */
	c = GG ( c, d, a, b, x[11], S23, 0x265e5a51); /* 19 */
	b = GG ( b, c, d, a, x[ 0], S24, 0xe9b6c7aa); /* 20 */
	a = GG ( a, b, c, d, x[ 5], S21, 0xd62f105d); /* 21 */
	d = GG ( d, a, b, c, x[10], S22,  0x2441453); /* 22 */
	c = GG ( c, d, a, b, x[15], S23, 0xd8a1e681); /* 23 */
	b = GG ( b, c, d, a, x[ 4], S24, 0xe7d3fbc8); /* 24 */
	a = GG ( a, b, c, d, x[ 9], S21, 0x21e1cde6); /* 25 */
	d = GG ( d, a, b, c, x[14], S22, 0xc33707d6); /* 26 */
	c = GG ( c, d, a, b, x[ 3], S23, 0xf4d50d87); /* 27 */
	b = GG ( b, c, d, a, x[ 8], S24, 0x455a14ed); /* 28 */
	a = GG ( a, b, c, d, x[13], S21, 0xa9e3e905); /* 29 */
	d = GG ( d, a, b, c, x[ 2], S22, 0xfcefa3f8); /* 30 */
	c = GG ( c, d, a, b, x[ 7], S23, 0x676f02d9); /* 31 */
	b = GG ( b, c, d, a, x[12], S24, 0x8d2a4c8a); /* 32 */

	/* Round 3 */
	a = HH ( a, b, c, d, x[ 5], S31, 0xfffa3942); /* 33 */
	d = HH ( d, a, b, c, x[ 8], S32, 0x8771f681); /* 34 */
	c = HH ( c, d, a, b, x[11], S33, 0x6d9d6122); /* 35 */
	b = HH ( b, c, d, a, x[14], S34, 0xfde5380c); /* 36 */
	a = HH ( a, b, c, d, x[ 1], S31, 0xa4beea44); /* 37 */
	d = HH ( d, a, b, c, x[ 4], S32, 0x4bdecfa9); /* 38 */
	c = HH ( c, d, a, b, x[ 7], S33, 0xf6bb4b60); /* 39 */
	b = HH ( b, c, d, a, x[10], S34, 0xbebfbc70); /* 40 */
	a = HH ( a, b, c, d, x[13], S31, 0x289b7ec6); /* 41 */
	d = HH ( d, a, b, c, x[ 0], S32, 0xeaa127fa); /* 42 */
	c = HH ( c, d, a, b, x[ 3], S33, 0xd4ef3085); /* 43 */
	b = HH ( b, c, d, a, x[ 6], S34,  0x4881d05); /* 44 */
	a = HH ( a, b, c, d, x[ 9], S31, 0xd9d4d039); /* 45 */
	d = HH ( d, a, b, c, x[12], S32, 0xe6db99e5); /* 46 */
	c = HH ( c, d, a, b, x[15], S33, 0x1fa27cf8); /* 47 */
	b = HH ( b, c, d, a, x[ 2], S34, 0xc4ac5665); /* 48 */

	/* Round 4 */
	a = II ( a, b, c, d, x[ 0], S41, 0xf4292244); /* 49 */
	d = II ( d, a, b, c, x[ 7], S42, 0x432aff97); /* 50 */
	c = II ( c, d, a, b, x[14], S43, 0xab9423a7); /* 51 */
	b = II ( b, c, d, a, x[ 5], S44, 0xfc93a039); /* 52 */
	a = II ( a, b, c, d, x[12], S41, 0x655b59c3); /* 53 */
	d = II ( d, a, b, c, x[ 3], S42, 0x8f0ccc92); /* 54 */
	c = II ( c, d, a, b, x[10], S43, 0xffeff47d); /* 55 */
	b = II ( b, c, d, a, x[ 1], S44, 0x85845dd1); /* 56 */
	a = II ( a, b, c, d, x[ 8], S41, 0x6fa87e4f); /* 57 */
	d = II ( d, a, b, c, x[15], S42, 0xfe2ce6e0); /* 58 */
	c = II ( c, d, a, b, x[ 6], S43, 0xa3014314); /* 59 */
	b = II ( b, c, d, a, x[13], S44, 0x4e0811a1); /* 60 */
	a = II ( a, b, c, d, x[ 4], S41, 0xf7537e82); /* 61 */
	d = II ( d, a, b, c, x[11], S42, 0xbd3af235); /* 62 */
	c = II ( c, d, a, b, x[ 2], S43, 0x2ad7d2bb); /* 63 */
	b = II ( b, c, d, a, x[ 9], S44, 0xeb86d391); /* 64 */

	state[0] +=a;
	state[1] +=b;
	state[2] +=c;
	state[3] +=d;

    }

    function init() {
	count[0]=count[1] = 0;
	state[0] = 0x67452301;
	state[1] = 0xefcdab89;
	state[2] = 0x98badcfe;
	state[3] = 0x10325476;
	for (i = 0; i < digestBits.length; i++)
	    digestBits[i] = 0;
    }

    function update(b) {
	var index,i;

	index = and(shr(count[0],3) , 0x3f);
	if (count[0]<0xffffffff-7)
	  count[0] += 8;
        else {
	  count[1]++;
	  count[0]-=0xffffffff+1;
          count[0]+=8;
        }
	buffer[index] = and(b,0xff);
	if (index  >= 63) {
	    transform(buffer, 0);
	}
    }

    function finish() {
	var bits = new array(8);
	var	padding;
	var	i=0, index=0, padLen=0;

	for (i = 0; i < 4; i++) {
	    bits[i] = and(shr(count[0],(i * 8)), 0xff);
	}
        for (i = 0; i < 4; i++) {
	    bits[i+4]=and(shr(count[1],(i * 8)), 0xff);
	}
	index = and(shr(count[0], 3) ,0x3f);
	padLen = (index < 56) ? (56 - index) : (120 - index);
	padding = new array(64);
	padding[0] = 0x80;
        for (i=0;i<padLen;i++)
	  update(padding[i]);
        for (i=0;i<8;i++)
	  update(bits[i]);

	for (i = 0; i < 4; i++) {
	    for (j = 0; j < 4; j++) {
		digestBits[i*4+j] = and(shr(state[i], (j * 8)) , 0xff);
	    }
	}
    }

/* End of the MD5 algorithm */

function hexa(n) {
 var hexa_h = "0123456789abcdef";
 var hexa_c="";
 var hexa_m=n;
 for (hexa_i=0;hexa_i<8;hexa_i++) {
   hexa_c=hexa_h.charAt(Math.abs(hexa_m)%16)+hexa_c;
   hexa_m=Math.floor(hexa_m/16);
 }
 return hexa_c;
}


var ascii="01234567890123456789012345678901" +
          " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
          "[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

function MD5(entree)
{
 var l,s,k,ka,kb,kc,kd;

 init();
 for (k=0;k<entree.length;k++) {
   l=entree.charAt(k);
   update(ascii.lastIndexOf(l));
 }
 finish();
 ka=kb=kc=kd=0;
 for (i=0;i<4;i++) ka+=shl(digestBits[15-i], (i*8));
 for (i=4;i<8;i++) kb+=shl(digestBits[15-i], ((i-4)*8));
 for (i=8;i<12;i++) kc+=shl(digestBits[15-i], ((i-8)*8));
 for (i=12;i<16;i++) kd+=shl(digestBits[15-i], ((i-12)*8));
 s=hexa(kd)+hexa(kc)+hexa(kb)+hexa(ka);
 return s;
}
