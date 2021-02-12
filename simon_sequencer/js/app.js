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
difficulty = 1
sequenceOptions = [
    'up-button'
    ,'left-button'
    ,'right-button'
    ,'down-button'
]
clickable = false
playingRound = false

const app = {
    addRandomSequenceStep: function () {
        randomChoice = Math.floor(Math.random() * 4)
        generatedSequence.push(sequenceOptions[randomChoice])
        console.log(generatedSequence)
    }
    
    ,checkSequence: function (userStep) {
        sequenceLength = generatedSequence.length
        if (userStep == generatedSequence[generatedSequenceIndex]) {
            generatedSequenceIndex++
            // console.log('user selection matches computer generated sequence step')
            if (generatedSequenceIndex == generatedSequence.length) {
                app.main()
            }
        } else {
            // call user mistake function here
            gameOver = true
            app.loseGame()
            // console.log('user selection does not match computer generated sequence step')
        }
    }

    ,loseGame: function () {
        userInterface.cueMistake()
        userInterface.showModal('try again!')
        return
    }

    ,wait: function (ms) {
        return new Promise((resolve, reject) => {
            setTimeout(()=>{
                resolve()
            }, ms)
        })
    }

    ,main: async function () {
        playingRound = true
        userInterface.toggleWait()
        d.querySelector('#current-score').textContent = userScore
        if (userScore === difficulty) {
            app.winGame()
        } else {
            userScore++
            currentUserStep = ''
            generatedSequenceIndex = 0
            app.addRandomSequenceStep()
            await this.wait(1000)
            for (step of generatedSequence) {
                await userInterface.cueUser(step)
            }
            clickable = true
        }
        playingRound = false
        userInterface.toggleWait()
    }

    ,startGame: function () {
        if (!playingRound) {
            app.resetGame()
            app.main()
        }
    }

    ,resetGame: function () {
        generatedSequence = []
        gameOver = false
        playingRound = false
        clickable = false
        generatedSequenceIndex = 0
        userName = ''
        userScore = 0
        currentUserStep = ''
        buttonList = d.querySelectorAll('.step-selection-button')
        for (button of buttonList) {
            button.classList.remove('active')
            button.classList.remove('mistake')
            button.classList.remove('playable')
        }
    }

    ,winGame: async function () {
        confetti({
                particleCount: 1500
                ,spread: 90
        })
        await userInterface.showModal('you win!')
    }

    ,playAgain: function () {
        app.resetGame()
        userInterface.hideModal()
        d.querySelector('#current-score').textContent = userScore
    }
}

const userInterface = {
    cueMistake: function () {
        clickable = false
        buttonList = d.querySelectorAll('.step-selection-button')
        for (button of buttonList) {
            button.classList.add('active')
            button.classList.add('mistake')
            button.classList.remove('playable')
        }
    }

    ,cueUser: async function () {
        clickable = false
        button = d.querySelector('#' + step)
        // console.log(button)
        await userInterface.blinkButton(button, 750, 250)
    }

    ,blinkButton: function (button, show, hide) {
        return new Promise((resolve, reject) => {
            button.classList.add('active')
            setTimeout(()=>{
                button.classList.remove('active')
                setTimeout(()=>{
                    resolve()
                }, hide)
            }, show)
        })
    }

    ,showModal: async function (gameOverMessage) {
        modal = d.querySelector('#modal')
        d.querySelector('#game-over-message').textContent = gameOverMessage.toUpperCase()
        opacity = Number(window.getComputedStyle(modal).getPropertyValue('opacity'))
        // console.log(opacity)
        modal.style.zIndex = 1
        while (opacity < 1) {
            opacity += .1
            modal.style.opacity = opacity
            console.log(opacity)
            await app.wait(15)
        }
    }

    ,hideModal: async function () {
        modal = d.querySelector('#modal')
        opacity = Number(window.getComputedStyle(modal).getPropertyValue('opacity'))
        // console.log(opacity)
        while (opacity > 0) {
            opacity -= .1
            modal.style.opacity = opacity
            console.log(opacity)
            await app.wait(15)
        }
        modal.style.zIndex = -1
    }
    
    ,toggleWait: function () {
        startButton = d.querySelector('#start-button')
        startButton.classList.toggle('wait')
        console.log(startButton.innerHTML)

        gameButtons = d.querySelectorAll('.step-selection-button')

        if (startButton.innerHTML == 'START') {
            startButton.classList.add('wait')
            console.log('The button should say wait')
            startButton.innerHTML = 'WAIT'
            for (button of gameButtons) {
                button.classList.remove('playable')
            }
        } else {
            startButton.classList.remove('wait')
            console.log('The button should say start')
            startButton.innerHTML = 'START'
            for (button of gameButtons) {
                button.classList.add('playable')
            }
        }
    }
}

const eventHandlers = {
    onUserStepSelection: async function (button) {
        console.log(button.id)
        if (clickable) {
            currentUserStep = button.id
            app.checkSequence(currentUserStep)
            if (!gameOver) {
                await userInterface.blinkButton(button, 150, 100)
            }
        }
        
    }

    ,onKeyDown: function (e) {
        // console.log(e.keyCode)
        keyDown = keyCodes['k' + e.keyCode]
        button = d.querySelector('#' + keyDown)
        // console.log(button)
        eventHandlers.onUserStepSelection(button)
    }
}

const keyCodes = {
    k37: 'left-button'
    ,k38: 'up-button'
    ,k39: 'right-button'
    ,k40: 'down-button'
    ,k65: 'left-button'
    ,k87: 'up-button'
    ,k68: 'right-button'
    ,k83: 'down-button'

}

/////////////////////////////////////
// Event Listeners
/////////////////////////////////////
d.addEventListener('keydown', eventHandlers.onKeyDown)