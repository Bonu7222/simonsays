# cyberpunk simon says

built by aneon version of the classic simon says game bcs i wanted to make smth that tests memory but looks like more modern

## features

-- classic gameplay: watch the sequence of colors light up then repeat it. it gets faster the longer u survive.
-- synth audio: instead of donloading mp3 files, i used the web audio api to generate the sound frequencies from scratch. eahc color has its own pitch.
-- neon design: glowing pads, moving 3d grid background and a pulsing center circle
-- screen shake: if u press the wring color, the whole screen shakes and plays an error sound

## how to run

just open index.html in ur browser.

## what i learned 

-- i learned making oscillitator in my last project and this time i used it again. 
-- async timing: this was the hardest part. i had to use settimeout to play the sequence one by one and make sure the user couldnt click while the game was still flashing the colors. 

