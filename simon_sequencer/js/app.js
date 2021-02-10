/*
Simon game emulator where the user is required to remember a sequence of colors/sounds and repeat them.
Success at repeating a sequence allows user to progress to next sequence which is the same as the prior sequence with one additional step added.

[] Allow user to set the name of the current player
    [] incorporated into high scores
    [] get demographic data
    [] modal describing how the game works and requesting a user input their name

[] Generate a sequence for the user to repeat
    [x] choose a random sequence step
    [x] if player progresses, append new random step to end of sequence
    [x] sequence should repeat while a user is still in the same game instance
    [x] sequence should reset and choose a new random set when a new game is started

[] Allow user to pause between rounds and proceed when ready
    [] use a modal
    [] allow user to accept current score and end/restart the game

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
    [] pop-up with player name, score, and position in high-scores
    [] show position in demographics
    [] ask player if done, or ready to restart
    [] tied scores are sorted by time with the most recent score on top
*/

// Sets variables for use in app
generatedSequence = []
clickable = true
generatedSequenceIndex = 0
userName = ''
userScore = 0
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
    if (userStep == generatedSequence[generatedSequenceIndex]) {
        generatedSequenceIndex++
        // console.log('user selection matches computer generated sequence step')
        if (generatedSequenceIndex == generatedSequence.length) {
            main()
        }
    } else {
        // call user mistake function here
        cueMistake()
        endGame()
        // console.log('user selection does not match computer generated sequence step')
    }
}

// function newHighScore(name, score) {
//     newListItem = d.createElement('li')
//     newListItem.classList.add('high-score-item')
    
//     newName = d.createElement('p')
//     newName.textContent = name
//     newListItem.appendChild(newName)

//     newScore = d.createElement('p')
//     newScore.textContent = score
//     newListItem.appendChild(newScore)

//     d.querySelector('#high-scores-list').appendChild(newListItem)
// }

function endGame() {
    // add modal telling user they lost
    // pull player score
    // add new item to highscores list with the user name and score
    // newHighScore(userName, userScore - 1)
    // sort highscores list
}

function cueMistake() {
    buttonList = d.querySelectorAll('.step-selection-button')
    for (button of buttonList) {
        button.classList.add('active')
        button.style.backgroundColor = 'red'
    }
}

// can only be used in an async function
function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            resolve()
        }, ms)
    })
}

function cueUser(step) {
    clickable = false
    button = d.querySelector('#' + step)
    // console.log(button)
    return new Promise((resolve, reject) => {
        button.classList.add('active')
        setTimeout(()=>{
            button.classList.remove('active')
            setTimeout(()=>{
                resolve()
            }, 250)
        }, 750)
    })
}

function onUserStepSelectionMouse(button) {
    // console.log(button)
    button.classList.add('active')
        setTimeout(()=>{
            button.classList.remove('active')
            setTimeout(()=>{
            }, 100)
        }, 150)
    currentUserStep = button.id
    checkSequence(currentUserStep)
}

d.querySelector('#game-controls').addEventListener('click', (e) => {
    if (clickable === true) {
        if (e.target.className === 'step-selection-button') {
            onUserStepSelectionMouse(e.target)
        } else if (e.target.className === 'chevron') {
            onUserStepSelectionMouse(e.target.parentNode)
        }
    }
})

async function main() {
    d.querySelector('#current-score').textContent = userScore
    userScore++
    currentUserStep = ''
    generatedSequenceIndex = 0
    addRandomSequenceStep()
    await wait(1000)
    for (step of generatedSequence) {
        await cueUser(step)
    }
    clickable = true
}

function startGame() {
    main()
}
