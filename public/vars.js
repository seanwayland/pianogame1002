"use strict";

/**
 * variables used in the game ..
 * should these be less global ?? what happens when 10 people all play games at once??
 * @type {number[]}
 */

/// variable to store whether a piano key is clicked on or off
let keyChecked = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let notesinCode = [];
/// variable to store id names of keys
let keyNames = ["Ckeyb", "Cskeyb", "Dkeyb", "Dskeyb", "Ekeyb", "Fkeyb", "Fskeyb", "Gkeyb", "Gskeyb", "Akeyb", "Askeyb", "Bkeyb", "Ckeyb2", "Cskeyb2", "Dkeyb2", "Dskeyb2", "Ekeyb2", "Fkeyb2", "Fskeyb2", "Gkeyb2", "Gskeyb2", "Akeyb2", "Askeyb2", "Bkeyb2"]
let notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

var secretMelody = [];
var seanName;

var guessesLeft = 0;
var guessedNotes = 0;

var started = 0;

let myData = 5;
let counter = 0;

/***
 * this function is executed on the "click me to make a new code"
 * each player takes turns at this button
 */

function changeMelody() {
    /**
     * create a new melody
     * @type {boolean}
     */
    // document.getElementById('dolltext').beginElement();
    document.getElementById("melody").disabled = false;
    //animateDollar();
    secretMelody = []; // the secret cham cham code
    notesinCode = []; // array to store "chosen" notes
    melodyGuess = []; // array to store a players guess
    guessesLeft = 3;
    guessedNotes = 0;
    var noteCheck = 0;
    // populate notes in code with checked notes
    for (var tt = 0; tt < 12; tt++) {
        if (keyChecked[tt] == 1) {
            notesinCode.push(tt);
            noteCheck = 1;
        }
    }
    if (noteCheck == 0) {
        alert("Please select some notes first !!! ")
    }
    var numNotesinCode = notesinCode.length;
    for (var dd = 0; dd < Number(numberofNotes.value); dd++) {
        var newNote = notesinCode[(Math.floor(Math.random() * numNotesinCode))];
        secretMelody.push(newNote);
    }
    if (noteCheck == 1) {
        bet.value = numNotesinCode * 100 + 100 * (Number(numberofNotes.value));
        playerDolls.value = playerDolls.value - bet.value;
        // alert(playerDollars);
        alert("New Secret Code created ");
        console.log('sending secret code');
        alert(vm.RoomNumber);
        socket.emit('CodeMsg', {roomnum: vm.RoomNumber, message: secretMelody.toString(), user: vm.nickname});
    }
}


function instructionsFunction() {
    alert("Before you start enter your name and chat with the other player in your room and decide who goes first. Take turns trying to run the other player out of money. Game Instructions: A bank error has caused $10000 of YOUR MONEY to be in the bank's hands. Fortunately the bank uses a cham cham from the Thunderbirds episode of the same name to keep the safe locked.  If you can intercept the melody you can open the safe and steal money from the other player. You still have to make a bet with the guard who guards the safe. The more notes in the melody and the more notes in the game the bigger your bet! First select some notes from the keyboard on the left. This keyboard restricts which musical notes from all twelve semitones are included in the cham cham code .Next, select the number of notes you want in your melody with the slider underneath the keyboard. Remember, the more notes in your melody the bigger the bet! Now click on the “make a new secret melody code “ button. Then, click on the “play secret melody code” button to hear the notes of the code. One note at a time will be played for you to listen and remember.  You can listen to the notes again if you need to. Now use the piano on the right to guess the melody.  A correct guess puts the bet amount into your account and takes it away from the bank.  After three wrong guesses you lose the bet.  Whoever runs out of money first loses.  Each note selected and the number of notes to guess increases the bet.  A winning guess puts the bet amount into your account or takes it away from other player. 3 wrong guesses you lose the bet.")
}

function myFunction() {
    if (secretMelody === undefined || secretMelody.length === 0) {
        // array empty or does not exist
        alert("please create a secret code first")
    } else {
        playNote(secretMelody[counter] + 12);
        counter++;
        if (counter === Number(numberofNotes.value)) {
            counter = 0
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function playNote(note) {
    if (document.getElementById("melody").disabled == false) {
        socket.emit('GuessMsg', {roomnum: vm.RoomNumber, message: note.toString(), user: vm.nickname});
        Synth.play(0, notes[note - 12], 4, 2);
    }

}

/*** SLEEP FUNCTIONS NOT USED BUT INCLUDED */

function sleep(miliseconds) {
    var currentTime = new Date().getTime();

    while (currentTime + miliseconds >= new Date().getTime()) {
    }
}

function time_sleep_until(timestamp) {
    // http://kevin.vanzonneveld.net
    // +   original by: Brett Zamir (http://brett-zamir.me)
    // %          note: For study purposes. Current implementation could lock up the user's browser.
    // %          note: Expects a timestamp in seconds, so DO NOT pass in a JavaScript timestamp which are in milliseconds (e.g., new Date()) or otherwise the function will lock up the browser 1000 times longer than probably intended.
    // %          note: Consider using setTimeout() instead.
    // *     example 1: time_sleep_until(1233146501) // delays until the time indicated by the given timestamp is reached
    // *     returns 1: true
    while (new Date() < timestamp * 1000) {
    }
    return true;
}
