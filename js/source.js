
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
var main = document.querySelector('main');
var dialog = document.querySelector('dialog');
var sound = document.querySelector('#move');
class state {
    constructor(name, message) {
        if (state.states[name])
            return state.states[name];

        state.states[name] = this;
        this.name = name;
        this.message = message;
        this.options = {};
        this.conditions = {};
    }

    addOption(optionMessage, nextstate, doSomething, condition) {
        this.conditions[optionMessage] = condition || function(){return true;};
        this.options[optionMessage] = async function() {

            if (doSomething)
                await doSomething();
            if (!state.states[nextstate])
                throw "state not found: " + nextstate;
            state.current = nextstate;
            sound.play();
        }
        return this;
    }

}
state.states = {};

var regex = /({{[a-zA-Z]*}})/g;
function renderGUI(){
    //Update STATE
    main.innerHTML = "<h1>"+state.current.name+"</h1>";
    var table  = document.createElement('table');
    for(var i in _){
        var row = table.insertRow();
        var cell1 = row.insertCell();    cell1.appendChild(document.createTextNode(i+": ")); cell1.style.textAlign = "right"; cell1.style.fontWeight = "bold";
        var cell2 = row.insertCell();    cell2.appendChild(document.createTextNode(JSON.stringify(_[i])));
    } 
    main.appendChild(table);

    //Update DIALOG
    var finalstring = state.current.message;
    var match = regex.exec(state.current.message);
    while(match){
        var index = match.index;
        var length = match[1].length;
        var value = _[match[1].substring(2,length-2)];
        finalstring = finalstring.replace(new RegExp(match[1],"g"), value);
        match = regex.exec(state.current.message); 
    }
    dialog.innerText = finalstring;
    dialog.innerHTML += "<ul>"
    for (var o in state._current.options) {
        if(!state._current.conditions[o]()) continue;
        dialog.innerHTML += "<li onclick='state.states[\"" + state.current.name + "\"].options[\"" + o + "\"]()'>" + o + "</li>";
    }
    dialog.innerHTML += "</ul>";

}

Object.defineProperty(state, 'current', {
    get: function() {
        return state._current;
    },
    set: function(newValue) {
        if (newValue.constructor.name == "String")
            newValue = state.states[newValue];
       
        state._current = newValue;
        renderGUI(); 
        return true;
    },
    enumerable: true,
    configurable: true
});