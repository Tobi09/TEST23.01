    function onDeviceReady() {
		console.log("test on device ready");
		alert("on device ready!!!!");
		navigator.notification.alert("PhoneGap is working");
    }

    function showAlert() {
        navigator.notification.alert(
            'You are the winner!',  // message
            'Game Over',            // title
            'Done'                  // buttonName
        );
    }

    // Beep three times
    //
    function playBeep() {
        navigator.notification.beep(3);
    }

    // Vibrate for 2 seconds
    //
    function vibrate() {
        navigator.notification.vibrate(2000);
    }
	
	
