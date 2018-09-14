/*
    PageReloader Script 
    by Martin Dagarin
    MIT License
    https://github.com/SloCompTech/PageReloader
*/

$( document ).ready(() => {
    let gPageURL = '<here put your page url>'; // URL to load
    let gDebug = false // Show debug in console
    let gRefresh = true; // Set this to true if you want to enable refresing preiodicly
    let gRefreshInterval = 10000; // Refresh interval in ms

    /*
        ########################################
        DO NOT EDIT BELLOW THIS LINE
        ########################################
    */
    
    // Stack variables
    let gDisconnected = false; // Flag to check if connecting was lost
    let gTimerId = null; // Holds interval ID so we can stop it
    

    if (gDebug) console.log('Init');
    
    // Frame functions
    function frame_load(url) { // Load iframe
        if (gDebug) console.log('Load: ' + url);
        $('#frame').attr('src', url);
    }
    function frame_reload() { // Reload iframe
        if (gDebug) console.log('Reloading ' + $('#frame').attr('src'));
        $('#frame').attr('src', $('#frame').attr('src'));
    }
    function frame_display(display) {
        if (display) {
            if (gDebug) console.log('Frame shown');
            $('#frame').removeClass('iframe-hide');
            $('#frame').addClass('iframe-show');
        } else {
            if (gDebug) console.log('Frame hidden');
            $('#frame').addClass('iframe-hide');
            $('#frame').removeClass('iframe-show');
        }
    }

    // Message related functions
    function msg_display(display) {
        if (display) {
            if (gDebug) console.log('Error message shown');
            $('#errormsg').attr('style',''); // Show error message
        } else {
            if (gDebug) console.log('Error message hidden');
            $('#errormsg').attr('style','display: none;'); // Hide message
        }
    }


    // Network related functions
    function onConnected() { // On Connected back to internet
        if (gDebug) console.log("Connected");
        if (gDisconnected) { // If internet connection was lost we should probably reload
            gDisconnected = false;
            if (gRefresh) {
                timer_start();
            }
            msg_display(false);
            frame_display(true);
            frame_reload();
        }
    }
    function onDisconnected() { // On Disconnected from Internet
        if (gDebug) console.log("Disconnected");
        timer_end();
        frame_display(false);
        msg_display(true);
        gDisconnected = true;
    }
   
    // Timer related functions
    function timer_start() {
        if (!gTimerId) {
            if (gDebug) console.log('Timer started');
            gTimerId = setInterval(() => {
                if (gDebug) console.log('Timer tick');
                frame_reload();
            }, gRefreshInterval);
        }
    }
    function timer_end() {
        if (gTimerId) {
            clearInterval(gTimerId);
            gTimerId = null;
            if (gDebug) console.log('Timer stoped');
        }
    }

    // Register handlers
    window.addEventListener('online',  onConnected);
    window.addEventListener('offline', onDisconnected);
    
    // Start interval if enabled
    if (gRefresh) {
        timer_start();
    }
    if (gDebug) console.log('Ready!');
    
    // Load actual page for first time
    frame_load(gPageURL);
});