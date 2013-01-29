<?php 
session_start(); 
?> 

<?php 
$verbindung = mysql_connect("localhost", "root" , "") 
or die("Verbindung zur Datenbank konnte nicht hergestellt werden"); 
mysql_select_db("HWR APP") or die ("Datenbank konnte nicht ausgewählt werden"); 

$username = $_POST["username"]; 
$passwort = md5($_POST["password"]); 

$abfrage = "SELECT username, passwort FROM login WHERE username LIKE '$username' LIMIT 1"; 
$ergebnis = mysql_query($abfrage); 
$row = mysql_fetch_object($ergebnis); 

if($row->passwort == $passwort) 
    { 
    $_SESSION["username"] = $username; 
    echo "Login erfolgreich. <br> <a href=\"file:///C|/Users/Witeged/Desktop/Studienprojekt/HWR APP/Kontakte.html\">Geschützer Bereich</a>"; 
    } 
else 
    { 
    echo "Benutzername und/oder Passwort waren falsch. <a href=\"file:///C|/Users/Witeged/Desktop/Studienprojekt/HWR APP/index.html\">Login</a>"; 
    } 

?>