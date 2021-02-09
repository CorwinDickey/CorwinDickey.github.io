/*
Simon game emulator where the user is required to remember a sequence of colors/sounds and repeat them.
Success at repeating a sequence allows user to progress to next sequence which is the same as the prior sequence with one additional step added.

[] Allow user to set the name of the current player
    [] incorporated into high scores
    [] get demographic data
    [] modal describing how the game works and requesting a user input their name

[] Generate a sequence for the user to repeat
    [x] choose a random sequence step
    [] if player progresses, append new random step to end of sequence
    [x] sequence should repeat while a user is still in the same game instance
    [x] sequence should reset and choose a new random set when a new game is started

[] Allow user to pause between rounds and proceed when ready
    [] use a modal
    [] allow user to accept current score and end/restart the game

[] Provide cues to the player
    [x] visual highlight cue
    [] short tone auditory cue
    [] mistake auditory cue

[] As the user progresses, update the number at the bottom of the screen to show the current score

[] Allow user to choose a step in the sequence
    [x] compare against the corresponding step in the generated sequence
    [x] mouse input
    [] wasd input
    [] ijkl input
    [] directional keys input
    [] numpad keys input

[] Game end
    [] game over when user misses a step in the sequence
    [] pop-up with player name, score, and position in high-scores
    [] show position in demographics
    [] ask player if done, or ready to restart
    [] tied scores are sorted by time with the most recent score on top
*/

// Sets variables for use in app
generatedSequence = []
generatedSequenceIndex = 0
currentUserStep = ''
sequenceOptions = [
    'up-button'
    ,'left-button'
    ,'right-button'
    ,'down-button'
]

d = document

// add a new randomly generated step to the sequence
function addRandomSequenceStep() {
    randomChoice = Math.floor(Math.random() * 4)
    generatedSequence.push(sequenceOptions[randomChoice])
    console.log(generatedSequence)
}

    // check if the user's selected sequence step matches the generated sequence step
function checkSequence(userStep) {

    sequenceLength = generatedSequence.length

    if (userStep.id === generatedSequence[generatedSequenceIndex]) {
        generatedSequenceIndex++
        // console.log(generatedSequenceIndex)
        // console.log('user selection matches computer generated sequence step')
        if (generatedSequenceIndex === generatedSequence.length) {
            generatedSequenceIndex = 0
            // console.log(generatedSequenceIndex)
            addRandomSequenceStep()
            main()
            return
        }
    } else {
        // call user mistake function here
        // console.log('user selection does not match computer generated sequence step')
    }
}

function cueUser(step) {
    // console.log(step)
    // console.log(d.querySelector('#' + step))
    button = d.querySelector('#' + step)
    // console.log(button)
    return new Promise((resolve, reject) => {
        button.classList.add('active')
        setTimeout(()=>{
            button.classList.remove('active')
            resolve()
        }, 1000)
    })
}

// testing sequence generation
// for (i=0; i<5; i++) {
//     App.increaseSequence()
// }

function onUserStepSelectionMouse(button) {
    currentUserStep = button.id
}

d.querySelector('#game-controls').addEventListener('click', (e) => {
    if (e.target.className == 'step-selection-button') {
        // console.log(e.target)
        onUserStepSelectionMouse(e.target)
        // App.checkSequence();
        checkSequence(e.target)

        // main()
    }
})

async function main() {
    for (step of generatedSequence) {
        // console.log(generatedSequence)
        // console.log(step)
        // console.log(generatedSequence[step])
        await cueUser(step)
    }
}

addRandomSequenceStep()
main()