/*
Simon game emulator where the user is required to remember a sequence of colors/sounds and repeat them.
Success at repeating a sequence allows user to progress to next sequence which is the same as the prior sequence with one additional step added.

[x] Generate a sequence for the user to repeat
    [x] choose a random sequence step
    [x] if player progresses, append new random step to end of sequence
    [x] sequence should repeat while a user is still in the same game instance
    [x] sequence should reset and choose a new random set when a new game is started

[] Provide cues to the player
    [x] visual highlight cue
    [] short tone auditory cue
    [x] mistake cue

[x] As the user progresses, update the number at the bottom of the screen to show the current score

[] Allow user to choose a step in the sequence
    [x] compare against the corresponding step in the generated sequence
    [x] mouse input
    [x] wasd input
    [] ijkl input
    [x] directional keys input
    [] numpad keys input

[x] Game end
    [x] game over when user misses a step in the sequence
    [] player wins when the score hits 20
*/

// Sets global variables for use in app
d = document
difficulty = 5 // sets the required user score to 'win'
clickable = false // keeps the user from clicking on any game control buttons before the game begins and during round presentation
playingRound = false // allows the user to click the start button while a round is not in progress

// Sounds taken from http://codeperspectives.com/front-end/simon-says-sound/

sounds = {
    a_sharp: function() {
        playSound = new Audio('sounds/a_sharp.wav')
        playSound.play()}
    
    ,aww: function() {
        playSound = new Audio('sounds/aww.wav')
        playSound.play()}
    
    ,applause: function() {
        playSound = new Audio('sounds/applause.wav')
        playSound.play()}
    
    ,c_sharp: function() {
        playSound = new Audio('sounds/c_sharp.wav')
        playSound.play()}
    
    ,d_sharp: function() {
        playSound = new Audio('sounds/d_sharp.wav')
        playSound.play()}
    
    ,f_sharp: function() {
        playSound = new Audio('sounds/f_sharp.wav')
        playSound.play()}
    
    ,g_sharp: function() {
        playSound = new Audio('sounds/g_sharp.wav')
        playSound.play()}
}

buttonSounds = {
    'up-button': sounds.c_sharp()
    ,'down-button': sounds.d_sharp()
    ,'left-button': sounds.f_sharp()
    ,'right-button': sounds.g_sharp()
}

// app object holds all the game logic that doesn't deal with updating the user
// interface or listening for/handling user interactions
const app = {

    // adds a random step to the sequence for the user to guess
    addRandomSequenceStep: function () {
        sequenceOptions = [ //  contains possible random choices
            'up-button'
            ,'left-button'
            ,'right-button'
            ,'down-button'
        ]
        randomChoice = Math.floor(Math.random() * 4) // randomly chooses number from 0 - 3 to be used as the index for the sequenceOptions array
        generatedSequence.push(sequenceOptions[randomChoice]) // adds the new randomly chosen sequenceOptions item to the end of the array
        console.log(generatedSequence)
    }
    
    // checks the user's input to see if it matches the next expected step in the sequence
    ,checkSequence: function (userStep) {
        sequenceLength = generatedSequence.length // gets the length of the sequence
        if (userStep == generatedSequence[generatedSequenceIndex]) { // checks the user's input against the item in the generatedSequence array
            generatedSequenceIndex++ // if user input is correct, proceed to the next item in the generatedSequence
            // console.log('user selection matches computer generated sequence step')
            if (generatedSequenceIndex == generatedSequence.length) { // if the user has reached the end of the current round, proceed to next round
                app.main()
            }
        } else { // if the user did not input the correct step in the sequence set gameOver to true and call the loseGame function
            // call user mistake function here
            gameOver = true
            app.loseGame()
            // console.log('user selection does not match computer generated sequence step')
        }
    }

    // loseGame is called if the user inputs the wrong sequence step
    ,loseGame: function () {
        sounds.aww()
        userInterface.cueMistake() // cues the user that they made a mistake, redundant after introduction of modal
        userInterface.showModal('try again!') // shows a modal with the message 'TRY AGAIN!' and a button to reset the game
        return
    }

    // waits for a specified amount of time in milliseconds
    ,wait: function (ms) {
        return new Promise((resolve, reject) => {
            setTimeout(()=>{
                resolve()
            }, ms)
        })
    }

    // main game loop
    ,main: async function () {
        playingRound = true // restricts the user interactions available while the computer shows the current sequence
        userInterface.toggleWait() // adds formatting to show the buttons are not clickable while the current round is being presented to the user
        d.querySelector('#current-score').textContent = userScore // finds/sets the user score in the center of the game controls to show last completed level of the sequence
        if (userScore === difficulty) { // if the user has hit the difficulty limit, displays the winGame modal
            app.winGame()
        } else { // if the user has not hit the difficulty limit, proceeds to next round
            userScore++ // user score iterates by 1 to indicate passing the previous round
            currentUserStep = '' // resets the user choice to be blank, without this the app double counts the ending step
            generatedSequenceIndex = 0 // resets the position in the sequence so the user starts from the beginning each new round
            app.addRandomSequenceStep() // adds a random step to the end of the sequence
            await app.wait(1000) // waits 1 second to create a gap between user inputs and presentation of the next round
            for (step of generatedSequence) { // flashes buttons in correspondence with the steps of the sequence
                await userInterface.cueUser(step)
            }
            clickable = true // sets the game controls to be available for the user to interact with
        }
        playingRound = false // allows the user to interact with the start button and restart the game if desired
        userInterface.toggleWait() // reverts formatting to show the user the buttons can be interacted with
    }

    // called when the user clicks the start button
    ,startGame: async function () {
        if (!playingRound) { // if the round is currently being presented to the user, then clicking the button doesn't do anything
            app.resetGame() // reset the variables and classes on the game controls
            await app.wait(50) // wait 50 milliseconds to allow the start button to return to original position before proceeding with main loop
            app.main() // starts the first round of the game
        }
    }

    // resets all the variables and style classes on the game controls to start a new game
    ,resetGame: function () {
        sounds.a_sharp()
        generatedSequence = []
        gameOver = false
        playingRound = false
        clickable = false
        generatedSequenceIndex = 0
        userScore = 0
        currentUserStep = ''
        buttonList = d.querySelectorAll('.step-selection-button')
        for (button of buttonList) {
            button.classList.remove('active')
            button.classList.remove('mistake')
            button.classList.remove('playable')
        }
    }

    // when the user wins, show a modal with the "YOU WIN!" message and pop confetti in celebration
    ,winGame: async function () {
        sounds.applause()
        confetti({
                particleCount: 1500 // controls how many pieces of confetti are created
                ,spread: 90 // controls the angle of spread of the confetti firing
        })
        await userInterface.showModal('you win!')
    }

    // called if the player selects the play-again-button on the game over modal
    ,playAgain: function () {
        app.resetGame() // resets the game state so the everything looks the same as when the page is first loaded
        d.querySelector('#current-score').textContent = userScore
        userInterface.hideModal() // hides the game over modal
    }
}

// contains the logic for modifications to the user interface
const userInterface = {

    // called if the user inputs the wrong step while attempting to match the generated sequence
    // mostly redundant after introduction of the game over modal
    cueMistake: function () {
        clickable = false // restricts user from continuing to click buttons
        buttonList = d.querySelectorAll('.step-selection-button') // gets list of all the game control buttons
        for (button of buttonList) { // for each of the game control buttons
            button.classList.add('active') // add the active class to highlight the button
            button.classList.add('mistake') // add the mistake class to change the formatting to show the user made a mistake
            button.classList.remove('playable') // remove the playable class to provide feedback showing the buttons can't be clicked
        }
    }

    // highlights the button to cue the user to the next step in the sequence
    ,cueUser: async function (step) {
        clickable = false // prevents the user from clicking buttons while being shown the current round
        // buttonSounds[step]
        button = d.querySelector('#' + step) // selects the button for the appropriate step in the sequence
        // console.log(button)
        await userInterface.blinkButton(button, 750, 250) // blinks the button to show the user which button should be clicked
    }

    // causes the button to be highlighted, then un-highlighted to provide feedback to the user
    // arguments include which button should be highlighted, how long the button should be highlighted, and how long the game should wait before the next button is highlighted
    ,blinkButton: function (button, show, hide) {
        buttonSounds[button.id]
        return new Promise((resolve, reject) => {
            button.classList.add('active') // highlights the button
            setTimeout(()=>{
                button.classList.remove('active') // un-highlights the button
                setTimeout(()=>{
                    resolve()
                }, hide)
            }, show)
        })
    }

    // called when the game is over
    // single argument allows for the message to be changed depending on win/lose conditions
    ,showModal: async function (gameOverMessage) {
        modal = d.querySelector('#modal') // selects the modal
        d.querySelector('#game-over-message').textContent = gameOverMessage.toUpperCase() // sets the message in all uppercase
        opacity = Number(window.getComputedStyle(modal).getPropertyValue('opacity')) // gets the current opacity of the modal
        // console.log(opacity)
        modal.style.zIndex = 1 // brings the modal above the game screen
        while (opacity < 1) { // fades the modal into view so it isn't as jarring to the user
            opacity += .1 // increases the opacity by 10%
            modal.style.opacity = opacity
            // console.log(opacity)
            await app.wait(15) // waits 15 milliseconds before next increase to opacity
        }
    }

    // called when user clicks the play-again-button
    ,hideModal: async function () {
        modal = d.querySelector('#modal') // selects the modal
        opacity = Number(window.getComputedStyle(modal).getPropertyValue('opacity')) // gets the opacity of the modal
        // console.log(opacity)
        while (opacity > 0) { // fades the modal out of view so it isn't as jarring to the user
            opacity -= .1 // decreases the opacity by 10%
            modal.style.opacity = opacity
            // console.log(opacity)
            await app.wait(15) // waits 15 milliseconds before next decrease to opacity
        }
        modal.style.zIndex = -1 // pushes the modal behind the game screen
    }
    
    // toggled on when a round is being presented to the user, toggled off when the round is no longer being presented to the user
    // changes the formatting for the start button and game controls to show they cannot be clicked while round is being presented
    ,toggleWait: function () {
        startButton = d.querySelector('#start-button') // selects the start button
        // console.log(startButton.innerHTML)
        gameButtons = d.querySelectorAll('.step-selection-button') // creates array of all of the game buttons

        if (startButton.innerHTML == 'START') { // if the start button is showing start
            startButton.classList.add('wait') // adds the wait class to the start button
            // console.log('The button should say wait')
            startButton.innerHTML = 'WAIT' // changes the start button to say WAIT
            for (button of gameButtons) { // removes the playable class from the game controls
                button.classList.remove('playable')
            }
        } else { // if the start button says wait
            startButton.classList.remove('wait') // removes the wait class from the start button
            // console.log('The button should say start')
            startButton.innerHTML = 'START' // reverts the start button from WAIT to START
            for (button of gameButtons) { // adds the playable class to the game controls to show they can be clicked
                button.classList.add('playable')
            }
        }
    }
}

// contains the event handlers for user interaction with the game controls
const eventHandlers = {

    // handler for when a user presses a key down
    // button argument is the string equivalent of the button id that corresponds to the player's step choice
    onUserStepSelection: async function (button) {
        // console.log(button.id)
        if (clickable) { // if the user is not being presented the current round
            currentUserStep = button.id // gets the string value of the id for the button the user chose
            app.checkSequence(currentUserStep) // checks to see if the user choice matches the expected next step in the generatedSequence
            if (!gameOver) { // if the game is not over, blink the button to show feedback to the user on their choice
                await userInterface.blinkButton(button, 150, 100)
            }
        }
        
    }

    // gets the button id that should be associated with a given key selection to
    ,onKeyDown: function (e) {
        // console.log(e.keyCode)
        keyDown = keyCodes['k' + e.keyCode] // uses the keycode of the key that was pressed and pulls the corresponding button id out of the keyCodes object
        button = d.querySelector('#' + keyDown) // finds the button associated with the user key press
        // console.log(button)
        eventHandlers.onUserStepSelection(button) // passes the correct button to the handler
    }
}

// contains the keycodes for key press events and their corresponding button id
const keyCodes = {
    k37: 'left-button' // left arrow
    ,k38: 'up-button' // up arrow
    ,k39: 'right-button' // right arrow
    ,k40: 'down-button' // down arrow
    ,k65: 'left-button' // 'a' key
    ,k87: 'up-button' // 'w' key
    ,k68: 'right-button' // 'd' key
    ,k83: 'down-button' // 's' key

}

// listens for a button down event and calls the onKeyDown handler
d.addEventListener('keydown', eventHandlers.onKeyDown)