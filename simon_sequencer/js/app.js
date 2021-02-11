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
    [] wasd input
    [] ijkl input
    [] directional keys input
    [] numpad keys input

[] Game end
    [] game over when user misses a step in the sequence
*/

// Sets variables for use in app
// generatedSequence = []
// clickable = true
// generatedSequenceIndex = 0
// userName = ''
// userScore = 0
// currentUserStep = ''
sequenceOptions = [
    'up-button'
    ,'left-button'
    ,'right-button'
    ,'down-button'
]

d = document

const App = {
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
                this.main()
            }
        } else {
            // call user mistake function here
            gameOver = true
            this.endGame()
            // console.log('user selection does not match computer generated sequence step')
        }
    }

    ,endGame: function () {
        UI.cueMistake()
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
        d.querySelector('#current-score').textContent = userScore
        userScore++
        currentUserStep = ''
        generatedSequenceIndex = 0
        this.addRandomSequenceStep()
        await this.wait(1000)
        for (step of generatedSequence) {
            await UI.cueUser(step)
        }
        clickable = true
    }

    ,startGame: function () {
        this.resetGame()
        this.main()
    }

    ,resetGame: function () {
        generatedSequence = []
        gameOver = false
        clickable = true
        generatedSequenceIndex = 0
        userName = ''
        userScore = 0
        currentUserStep = ''
        buttonList = d.querySelectorAll('.step-selection-button')
        for (button of buttonList) {
            button.classList.remove('active')
            button.classList.remove('mistake')
        }
    }
}

const UI = {
    cueMistake: function () {
        buttonList = d.querySelectorAll('.step-selection-button')
        for (button of buttonList) {
            button.classList.add('active')
            button.classList.add('mistake')
        }
    }

    ,cueUser: async function () {
        clickable = false
        button = d.querySelector('#' + step)
        // console.log(button)
        await this.blinkButton(button, 750, 250)
    }

    ,blinkButton: function (target, show, hide) {
        return new Promise((resolve, reject) => {
            target.classList.add('active')
            setTimeout(()=>{
                target.classList.remove('active')
                setTimeout(()=>{
                    resolve()
                }, hide)
            }, show)
        })
    }
}

const EventHandlers = {
    onUserStepSelection: async function (button) {
        // console.log(button)
        currentUserStep = button.id
        App.checkSequence(currentUserStep)
        if (!gameOver) {
            await UI.blinkButton(button, 150, 100)
        }
    }
}
