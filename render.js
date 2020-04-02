"use strict";

/***
 * These functions and variables basically take care of the game play
 */
/**
 *start the synth used to play audio
 */
Synth instanceof AudioSynth; // start synth

var testInstance = new AudioSynth;
testInstance instanceof AudioSynth; // true

testInstance === Synth; // true


document.getElementById(keyNames[0]).style.fill = "white";
document.getElementById(keyNames[2]).style.fill = "white";
document.getElementById(keyNames[4]).style.fill = "white";
document.getElementById(keyNames[5]).style.fill = "white";
document.getElementById(keyNames[7]).style.fill = "white";
document.getElementById(keyNames[9]).style.fill = "white";
document.getElementById(keyNames[11]).style.fill = "white";

var melodyGuess = [];


function checkNote(note) {
    /***
     * every time a note is pressed it checks to see if it is correct and if the player has won
     *
     * @type {number}
     */

        // alert(notesinCode.length);

    var theNote = note - 12;
    melodyGuess.push(theNote);
    //alert(melodyGuess.toString());
    guessedNotes++;
    // alert(melodyGuess.toString());
    if (guessedNotes === Number(numberofNotes.value)) {

        guessedNotes = 0;
        if (melodyGuess.length === secretMelody.length && melodyGuess.every(function (value, index) {
            return value === secretMelody[index]
        })) {

            alert("you guessed it ");
            //socket.emit('WinMsg', {amount: bet.value, user: vm.nickname, roomnum: vm.RoomNumber});
            playerDolls.value = playerDolls.value + 3 * bet.value;
           // playerDolls.value2 = playerDolls.value2 - 2 * bet.value;
            bet.value = 0;
            document.querySelector('animate').beginElement();
            //   document.getElementById('dollarText').visibility = "visible";
            document.getElementById('dollarText').beginElement();
            document.getElementById("winAudio").play();
            document.getElementById("melody").disabled = false;
            document.getElementById("newCode").disabled = false;


            if (playerDolls.value2 <= 0) {
                alert("You ran the other player out of Money ! You win  !! ");
                playerDolls.value = 10000;
              //  playerDolls.value2 = 10000;
                bet.value = 0;
                document.getElementById("applauseAudio").play();
                document.getElementById("melody").disabled = false;
                document.getElementById("newCode").disabled = false;

                /***
                 * send gameWin message
                 */
              //  socket.emit('gameWinMsg', {user: vm.nickname, roomnum: vm.RoomNumber});

            }

            if (playerDolls.value <= 0) {
                alert("You ran out of Money ! You lose baby  !! ");
                playerDolls.value = 10000;
                playerDolls.value2 = 10000;
                bet.value = 0;
                var lose = document.getElementById("loseAudio");
                lose.volume = 0.5;
                lose.play()


                document.getElementById("melody").disabled = false;
                document.getElementById("newCode").disabled = false;

                /***
                 * send gameLose message
                 */
              //  socket.emit('gameLoseMsg', {user: vm.nickname, roomnum: vm.RoomNumber});
            }


        } else {

            guessedNotes = 0;
            melodyGuess = [];

            guessesLeft--;

            if (guessesLeft < 1) {
                alert("you are out of guesses");
                ///you
                /**
                 * send a win message
                 * @type {number}
                 */
               // socket.emit('LoseMsg', {amount: bet.value, user: vm.nickname, roomnum: vm.RoomNumber});
                playerDolls.value = playerDolls.value - 3 * bet.value;
                /// other guy
              //  playerDolls.value2 = playerDolls.value2 + 2 * bet.value;
                bet.value = 0;
                document.querySelector('animate').beginElement();
                //   document.getElementById('dollarText').visibility = "visible";
                document.getElementById('dollarText').beginElement();

                var lose = document.getElementById("loseAudio");
                lose.volume = 0.5;
                lose.play()


                document.getElementById("melody").disabled = false;
                document.getElementById("newCode").disabled = false;



                if (playerDolls.value < 0) {
                    alert("You ran out of money! Game Over !! ");
                    /**
                     * send a lose message
                     * @type {number}
                     */
                    playerDolls.value = 10000;
                  //  playerDolls.value2 = 10000;
                    bet.value = 0;

                    var sound = document.getElementById('loseAudio');
                    sound.volume = 0.5;
                    sound.play()
                    document.getElementById("melody").disabled = false;
                    document.getElementById("newCode").disabled = false;

                }

            } else {
                alert("try again");
            }
        }
    }


}


/// function which changes the key of a clicked white key
function WhiteKeyClicked(id) {

    if (id > 11) {

        playerDollars = 100;

        playNote(id);
        //checkNote(id);
        setTimeout(function () {
            checkNote(id);
        }, 1000);


        d3.select(document.getElementById(keyNames[id]))
            .transition()
            .duration(100)
            .style("fill", "green")

            .transition()
            .duration(100)
            .style("fill", "white")


    } else {

        if (keyChecked[id] == 0) {
            document.getElementById(keyNames[id]).style.fill = "yellow";
            keyChecked[id] = 1;
        } else {
            document.getElementById(keyNames[id]).style.fill = "white";
            keyChecked[id] = 0;
        }
    }


}

/// function which changes the key of a clicked black key
function BlackKeyClicked(id) {

    if (id > 11) {
        playNote(id);
        setTimeout(function () {
            checkNote(id);
        }, 1000);

        /// take a guess
        d3.select(document.getElementById(keyNames[id]))
            .transition()
            .duration(100)
            .style("fill", "green")

            .transition()
            .duration(100)
            .style("fill", "black")
    } else {

        if (keyChecked[id] == 0) {
            document.getElementById(keyNames[id]).style.fill = "yellow";
            keyChecked[id] = 1;
        } else {
            document.getElementById(keyNames[id]).style.fill = "black";
            keyChecked[id] = 0;
        }
    }

}
