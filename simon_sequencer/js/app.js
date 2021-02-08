/*
Simon game emulator where the user is required to remember a sequence of colors/sounds and repeat them.
Success at repeating a sequence allows user to progress to next sequence which is the same as the prior sequence with one additional step added.

[] Allow user to set the name of the current player
    [] incorporated into high scores
    [] get demographic data
    [] modal describing how the game works and requesting a user input their name

[] Generate a sequence for the user to repeat
    [] choose a random sequence step
    [] if player progresses, append new random step to end of sequence
    [] sequence should repeat while a user is still in the same game instance
    [] sequence should reset and choose a new random set when a new game is started

[] Allow user to pause between rounds and proceed when ready
    [] use a modal
    [] allow user to accept current score and end/restart the game

[] Provide cues to the player
    [] visual highlight cue
    [] short tone auditory cue
    [] mistake auditory cue

[] As the user progresses, update the number at the bottom of the screen to show the current score

[] Allow user to choose a step in the sequence
    [] compare against the corresponding step in the generated sequence
    [] mouse input
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

