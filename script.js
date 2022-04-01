//global constants
const cluePauseTime = 333;
const nextClueWaitTime = 1000;
const holdTimeModifier = 0.875;
var gameTime = 20;


//Global Variables
var myTimer;
var timeLeft = gameTime;
var strike = 0;
var pattern = [];
var patternLength = 10;
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;
var clueHoldTime = 1000; //sets how long the clue sound/light plays


document.getElementById("timer").innerHTML = gameTime;


//audio 
function timer() {
  //plays audio cue
  if (gamePlaying) {
  playTone(0, 250);
  }
  console.log("timer prints: "+timeLeft);
  timeLeft = timeLeft - 1;
  //updates visual timer
  document.getElementById("timer").innerHTML = timeLeft;
  //
  if(timeLeft <= 0){
    loseGame();
  }
}

//returns random integer between 1 and max
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max) + 1);
}

function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }
  if (pattern[guessCounter] == btn) {
    //Guess was correct!
    if (guessCounter == progress) {
      if (progress == pattern.length - 1) {
        //GAME OVER: WIN!
        winGame();
      } else {
        //Pattern correct. Add next segment
        clearTimeout(myTimer);
        timeLeft = gameTime;       //resets timer
          document.getElementById("timer").innerHTML = timeLeft;             //resets timer
        progress++;
        playClueSequence();
      }
    } else {
      //so far so good... check the next guess
      // clearTimeout(myTimer);
      // console.log("clear timer");
      guessCounter++;
    }
  } else {
    //Guess was incorrect
    //GAME OVER: LOSE!
    if (strike < 2) {
      //try again
      strike++;
      alert("Strike" + strike);
      playClueSequence();
    } else {
      loseGame();
    }
  }
}

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
  
}

function playClueSequence() {
  clearInterval(myTimer);
  guessCounter = 0;
  context.resume();
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
    clueHoldTime *= holdTimeModifier;
    
  }
setTimeout(function() {
    myTimer = setInterval(timer,1000)
  }, delay-clueHoldTime+500);
  console.log("set timer");


}

function loseGame() {
  endGame();
  alert("Game Over. You Lose.");
  clueHoldTime = 1000;
}
function winGame() {
  endGame();
  alert("Game Over. You Win!");
}

function startGame() {
  pattern = []; // reset array
  for (var i = 0; i < patternLength; i++) {
    pattern.push(getRandomInt(8));
  }

  //init game variables
  strike = 0;
  progress = 0;
  gamePlaying = true;

  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("endBtn").classList.remove("hidden");
  playClueSequence();
}


function endGame() {
  gamePlaying = false;
  // swap the Start and Stop buttons
  document.getElementById("endBtn").classList.add("hidden");
  document.getElementById("startBtn").classList.remove("hidden");
  //resets timer
  document.getElementById("timer").innerHTML = gameTime;
  clearInterval(myTimer);
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 587.33,
  6: 622.25,
  7: 659.25,
  8: 783.99,
  9: 932.33,
  0: 440,
};
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);
