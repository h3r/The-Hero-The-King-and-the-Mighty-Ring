var _ = {

};

new state('welcome','The Hero, the King and the Mighty Ring').addOption('play!', 'init', async()=>{
    //Create random name
    _['name'] = await axios("https://randomuser.me/api/").then(e=>e.data.results[0]).then(info=>{return info.name.first.capitalize()+" "+info.name.last.capitalize()});
    _['hero'] = { location: "town", gold: 0 };
    _['king'] = { location: "castle", gold: 1000, quest:"not-given"};
    _['ring'] = { location:"lost somewhere in world"};
})

new state('init', ` You are {{name}}, a fellow habitant of Rivet Town. 
                    You woke up a bit dizzy in the tiddy town tabbern.
                    As soon you recover your senses you make your way out.`)
.addOption("walk to forest", "forest", ()=>{ _['hero'].location = "forest";})
.addOption("walk to the castle", "castle", ()=>{ _['hero'].location = "castle";});

new state('town', "You are now in the town. Tonight's party went too bad and there still people drunk arround, YAIKS!")
.addOption("walk to forest", "forest", ()=>{ _['hero'].location = "forest";})
.addOption('walk to the castle', 'castle', ()=>{_['hero'].location = "castle";});

new state('forest', "You walked to the forest. There is a road that leads to the deeper part of the forest.")
.addOption("walk to deppest part of the forest", "deep-forest", ()=>{_['hero'].location= "forest";})
.addOption('walk to the town', 'town', ()=>{_['hero'].location = "town";})
.addOption('walk to the castle', 'castle', ()=>{_['hero'].location = "castle";});

new state('deep-forest', "You are now on the deep-forest. The tall trees create a shadow that sorrounds the forest, you can barely see a glowing ahead.")
.addOption('walk back to the entry of the forest', 'forest')
.addOption("look for the glowing", "find-ring-wquest", ()=>{ _['ring'].location = "in hero's pocket";}, ()=>{ return (_['ring'].location == "lost somewhere in world" && _['king'].quest == "given")})
.addOption("look for the glowing ", "find-ring-woquest", ()=>{ _['ring'].location = "in hero's pocket";}, ()=>{ return (_['ring'].location == "lost somewhere in world"  && _['king'].quest == "not-given")})
.addOption("look for the glowing  ", "no-ring", ()=>{ _['ring'].location = "in hero's pocket";}, ()=>{ return _['ring'].location != "lost somewhere in world"});

new state('find-ring-wquest',  `You can barely see it but, as soon you get closer, you realize its something small. 
                                YOU FOUND IT! It's the Kings precious ring.`)
.addOption('walk back to the entry of the forest', 'forest');
new state('find-ring-woquest', `You can barely see it but, as soon you closer, you realize its something small. 
                                Its a regular ring, not too fancy... It has an inscription on the inside "Property of the king"`)
.addOption('walk back to the entry of the forest', 'forest');
new state('no-ring',           `You can barely see it but, as soon you get closer...
                                BAH it was just a cat with bright eyes... ` )
.addOption('walk back to the entry of the forest', 'forest');


new state('castle', "You walked to the castle. The king is at the end of front of you, sorrounded by his loyal guard.")
.addOption('talk to the king', 'king-give-quest', ()=>{ _['king'].quest = "given"; }, ()=>{ return _['king'].quest == "not-given" && _['ring'].location == "lost somewhere in world"})
.addOption('talk to the king ', 'talk-ring', ()=>{ _['king'].quest = "given"; }, ()=>{ return _['king'].quest == "not-given" && _['ring'].location == "in hero's pocket"})
.addOption('talk to the king  ', 'king-given-quest', ()=>{}, ()=>{ return _['king'].quest == "given"})
.addOption('walk to the town', 'town', ()=>{_['hero'].location = "town";})
.addOption("walk to forest", "forest", ()=>{_['hero'].location = "forest";})


new state('king-give-quest',   `Oh fellow villager!. 
                                What a mess! In the last hunt I lost my precious ring, T_T. 
                                Would you like to embark to this mission and become adventurer?`)
.addOption( 'accept', 'castle', ()=>_['king'].quest = "given")
.addOption( 'not now', 'castle');

new state('king-given-quest',  `Hi again my fellow adventurer!
                                Did you find my precious? I mean, my precious ring obviously.`)
.addOption("continue", "talk-ring",     false, ()=>{ return _['ring'].location == "in hero's pocket" }) 
.addOption("continue ","talk-noring",   false, ()=>{ return _['ring'].location != "in hero's pocket" })

new state('talk-noring',  `Bah I see you havent yet, come back when you have it.`)
.addOption("continue", "castle");

new state('talk-ring',    `YOU FOUND IT! My precious lost ring! So many thanks my fellow adventurer.`)
.addOption("give the ring", "king-quest-reward2", ()=> _['ring'].location = "in the king's hands");

new state('king-quest-reward2', `Here is your reward, 1000 gold coins of the orphanage, 
                                 have all my infinite gratitude`)
.addOption('accept reward', 'king-gives-reward', ()=>{ _['hero'].gold += 1000; _['king'].gold -= 1000;})
.addOption('reject reward', 'king-gives-execution')

new state('king-gives-reward', `Thanks again! But now leave my castle :), 
                                Guards! Lead this adventurer to the exit.`)
.addOption('continue', 'good-end?', ()=>{ _['hero'].location = "out of the castle"; _['hero'].status = "alive";})

new state('good-end?', `You survived this quest and now you may spend your money on the brothel
                        
                        ~ THE END ~`)
.addOption('play again', 'welcome');

new state('king-gives-execution', `WHO YOU THINK YOU ARE TO REJECT MY KINDNESS??! GUARDS EXECUTE THEM RIGHT NOW!`)
.addOption('continue', 'bad-end?', ()=>{ _['hero'].location = "heaven"; _['hero'].status = "dead";})

new state('bad-end?', `You died following your righterous principles, 
                      but at least you are in heaven now sorrounded by the most epic party you ever seen.
                      
                      ~ THE END ~`)
.addOption('play again', 'welcome');

state.current = state.states['welcome'];