var range = document.querySelector('#fcut'),
    value = document.querySelector('.range-value');
    
let outIds = [
    /*  0 */    '',
    /*  1 */    '',
    /*  2 */    '',
    /*  3 */    'fhpf',
    /*  4 */    'fcut',
    /*  5 */    'glide',
    /*  6 */    'ftrk',
    /*  7 */    'alvl',
    /*  8 */    'fres',
    /*  9 */    'fegn',
    /* 10 */    'flfo',

    /* 11 */    'pulse',
    /* 12 */    'owave',
    /* 13 */    'olevel',
    /* 14 */    'sub',
    /* 15 */    'noise',
    /* 16 */    'olfoa',
    /* 17 */    'oeg',
    /* 18 */    'detune',
    /* 19 */    'chord',

    /* 20 */    'filta',
    /* 21 */    'filtd',
    /* 22 */    'filts',
    /* 23 */    'filtr',
    /* 24 */    'ampa',
    /* 25 */    'ampd',
    /* 26 */    'amps',
    /* 27 */    'ampr',
    /* 28 */    '',
    /* 29 */    '',
    /* 30 */    'pmode',        // Play Modus

    /* 31 */    'lfoar',
    /* 32 */    'lfoaw',
    /* 33 */    'lfoad',
    /* 34 */    'lfoaf',
    /* 35 */    'lfoas',
    /* 36 */    'lfoac',

    /* 37 */    'lfobr',
    /* 38 */    'lfobw',
    /* 39 */    'lfobd',
    /* 40 */    'lfobf',
    /* 41 */    'lfobs',
    /* 42 */    'lfobc',

    /* 43 */    '',
    /* 44 */    'revs',
    /* 45 */    'revd',
    /* 46 */    'revf',
    /* 47 */    'revm',
    /* 48 */    '',
    /* 49 */    '',

    /* 50 */    '',
    /* 51 */    'lfobowave',
    /* 52 */    'lfobolevel',
    /* 53 */    'lfobsub',
    /* 54 */    'lfobnoise',
    /* 55 */    'lfobolfoa',
    /* 56 */    'lfobpulse',
    /* 57 */    'lfobglide',
    /* 58 */    'lfobdetune',
    /* 59 */    'lfobchord',
    /* 60 */    'lfoboeg',

    /* 61 */    'lfobfcut',
    /* 62 */    'lfobfres',
    /* 63 */    'lfobfegn',
    /* 64 */    'susp',
    /* 65 */    'lfobfhpf',
    /* 66 */    'lfobftrk',
    /* 67 */    'lfobflfo',
    /* 68 */    'legat',

    /* 69 */    'lfobfilta',
    /* 70 */    'lfobfiltd',
    /* 71 */    'lfobfilts',
    /* 72 */    'lfobfiltr',

    /* 73 */    'lfobampa',
    /* 74 */    'lfobampd',
    /* 75 */    'lfobamps',
    /* 76 */    'lfobampr',

    /* 77 */    'lfoblfoar', 
    /* 78 */    'lfoblfoaw', 
    /* 79 */    'lfoblfoad', 
    /* 80 */    'lfoblfoaf', 

    /* 81 */    'lfoblfobar', 
    /* 82 */    'lfoblfobaw', 
    /* 83 */    'lfoblfobad', 
    /* 84 */    'lfoblfobaf', 
];

var patch   = {'name' : '', 'data' : [ Array(85).fill(0), Array(85).fill(0), Array(85).fill(0), Array(85).fill(0) ] }; 
let speeds  = ['BPM','LOW','HI','TRK'];
let syncs   = ['OFF','ON'];
let modes   = ['POL','UNA','UNB','TRI','DUO','MON'];
let isSpeed = [35,41];
let isSync  = [36,42];
let isMod   = [51,52,53,54,55,56,57,58,59,60,61,62,63,65,66,67,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84];
var modType = 0;

function sliderChange(type,val,mode=-1) {

    var out = val;
    if(type == 30){ out = modes[val]; }

    if(isSpeed.indexOf(type) !== -1){ out = speeds[val]; }
    if(isSync.indexOf(type)  !== -1){ out = syncs[val]; }

    if((outIds[type] == '')|| (outIds[type] == undefined)){ return; }

    if(mode > -1){ 
        sendSlider(176, 50, mode); 
        modType = mode;
        document.querySelector('#'+outIds[type]+'o'+modType).innerHTML = out;
        patch['data'][mode][type] = parseInt(val,10);
    }else{
        document.querySelector('#'+outIds[type]+'o').innerHTML = out;
        patch['data'][0][type] = parseInt(val,10);
    }
    sendSlider(176, type, val);
}    

function modFold(type){
    for (id in isMod){
        var element = document.querySelector('#'+outIds[isMod[id]]+type);
        if (element.classList.contains('foldin') ){
            element.classList.remove("foldin");
        }else{
            element.classList.add("foldin");
        }
    }
}


function load(){
    document.getElementById("inputfile").click();
}

(function () {
    var textFile = null,

        makeTextFile = function (text) {
            var data = new Blob([text], {type: 'text/plain'});
            if (textFile !== null) { window.URL.revokeObjectURL(textFile); }
            textFile = window.URL.createObjectURL(data);        
            return textFile;
        };
        
    var create = document.getElementById('create');
    var open = document.getElementById('inputfile');
    
    // Read Patch-File
    open.addEventListener('change',function(){
        var fr=new FileReader();
        fr.onload=function(){
            var patchInput = JSON.parse(fr.result);

            document.querySelector('#fname').value = patchInput['name'];

            for (let mod = 3; mod >= 0; mod--) {

                if(mod > -1){ sendSlider(176, 50, mod); }

                for (const patchType in patchInput['data'][mod]) {
                    type = parseInt(patchType,10);
                    if(type < 3){ continue;}
                    if(type==64){ continue; }
                    if(type==68){ continue; }

                    if((mod >0)&&(type <51)){ continue; }
                    if((mod==0)&&(type >76)){ continue; }

                    var val = patchInput['data'][mod][type];
                    var out = val;

                    if(type == 30){ out = modes[val]; }
                
                    if(isSpeed.indexOf(type) !== -1){ out = speeds[val]; }
                    if(isSync.indexOf(type)  !== -1){ out = syncs[val]; }
                
                    if((mod >0)||(type>50)){
                        document.querySelector('#'+outIds[type]+mod).value = val;    
                        document.querySelector('#'+outIds[type]+'o'+mod).innerHTML = out;    
                    }else{
                        if(outIds[type]!=''){
                            document.querySelector('#'+outIds[type]).value = val;  
                            document.querySelector('#'+outIds[type]+'o').innerHTML = out;      
                        }
                    }

                    patch['data'][mod][type] = parseInt(val,10);   
                    sendSlider(176, type, val);
                }
            }
        }              
        fr.readAsText(this.files[0]);    
    });

    // Create Patch-File
    create.addEventListener('click', function () {
        let patchname = document.querySelector('#fname').value;
    
        document.querySelector('.filename').classList.remove("error");
        if(patchname == ""){ document.querySelector('.filename').classList.add("error"); return; }

        patch['name'] = patchname;

        let filename = patchname.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        var link = document.createElement('a');
        link.setAttribute('download', filename+'.nym');

        console.log(JSON.stringify(patch));

        link.href = makeTextFile(JSON.stringify(patch));

        document.body.appendChild(link);
    
        // wait for the link to be added to the document
        window.requestAnimationFrame(function () {
            var event = new MouseEvent('click');
            link.dispatchEvent(event);
            document.body.removeChild(link);
        });
        
      }, false);
    })();


// ====================== Midi Stuff ======================

document.onload = function(){
    // modFold(0);
    // modFold(1);
    // modFold(2);
    // modFold(3);    
};

connect();

function connect() {
    navigator.requestMIDIAccess().then(
      (midi) => midiReady(midi),
      (err) => console.log('Something went wrong', err)
    );
}

function midiReady(midi) {
    // Also react to device changes.
    midi.addEventListener('statechange', (event) => initDevices(event.target));
    initDevices(midi); // see the next section!
    displayDevices();
    startListening();
}

function initDevices(midi) {
    // Reset.
    midiIn = [];
    midiOut = [];
    
    // MIDI devices that send you data.
    const inputs = midi.inputs.values();
    for (let input = inputs.next(); input && !input.done; input = inputs.next()) { midiIn.push(input.value); }
    
    // MIDI devices that you send data to.
    const outputs = midi.outputs.values();
    for (let output = outputs.next(); output && !output.done; output = outputs.next()) { midiOut.push(output.value); }
}

function displayDevices() {
    selectIn.innerHTML  = midiIn.map( device => {
        nymphes_available = (device.name == 'Nymphes' ? ' selected="selected"' : '')
        return `<option${nymphes_available}>${device.name}</option>`
    }).join('');
    selectOut.innerHTML = midiOut.map(device => {
        nymphes_available = (device.name == 'Nymphes' ? ' selected="selected"' : '')
        return `<option${nymphes_available}>${device.name}</option>`
    }).join('');
}
  
function startListening() {     
    // Start listening to MIDI messages.
    for (const input of midiIn) {
        input.addEventListener('midimessage', midiMessageReceived);
    }
}
  
function midiMessageReceived(event) {
    if(Number.isInteger(event.data[1])){

        if(event.data[1]< 50){ modType = 0; }
        if(event.data[1]==50){ modType = event.data[2]; return; }
        if((modType==0)&&(event.data[1] >76)){ return; }

        if((outIds[event.data[1]]!='')&&(outIds[event.data[1]]!= undefined)){            
            var outId = outIds[event.data[1]];

            if(isMod.indexOf(event.data[1]) !== -1){  
                document.querySelector('#'+outId+'o'+modType).innerHTML = event.data[2];
                document.querySelector('#'+outId+modType).value = event.data[2]; 
            }else{
                document.querySelector('#'+outId+'o').innerHTML = event.data[2];
                document.querySelector('#'+outId).value = event.data[2];    
            }
            patch['data'][modType][event.data[1]] = parseInt(event.data[2],10);   
        }
    }
}
    
function sendSlider(valA,valB,valC){
    const device = midiOut[selectOut.selectedIndex];
    const msg = [valA,valB,valC];
    device.send(msg); 
}

function noteOn(note) { // later on, add [note, velocity, duration=0] to attributes
    const device = midiOut[selectOut.selectedIndex];
    device.send([0x90, note, 0x7f]); // send full velocity note-ON A4 on channel 0. note A4 = 69
}

function noteOff(note) { // later on, add [note, velocity, duration=0] to attributes
    const device = midiOut[selectOut.selectedIndex];
    device.send([0x80, note, 0]); // send full velocity note-OFF A4 on channel 0
}

Array.from(document.getElementsByClassName('keyboard-key')).forEach(key => {
    key.addEventListener('mousedown', function() {
        noteOn(this.getAttribute('data_note_number'));
    })  
    key.addEventListener('mouseup', function() {
        noteOff(this.getAttribute('data_note_number'));
    })
});

document.addEventListener('keypress', event => {
    keys_notes = {
        "a": 60,
        "w": 61,
        "s": 62,
        "e": 63,
        "d": 64,
        "f": 65,
        "t": 66,
        "g": 67,
        "y": 68,
        "h": 69,
        "u": 70,
        "j": 71
    }
    keys_to_capture = Object.keys(keys_notes);
    pressed_key = event.key;
    if (keys_to_capture.includes(pressed_key)) {
        // console.log(event.key + " is a target key");
        noteOn(keys_notes[pressed_key]);
    }
});

document.addEventListener('keyup', event => {
    keys_notes = {
        "a": 60,
        "w": 61,
        "s": 62,
        "e": 63,
        "d": 64,
        "f": 65,
        "t": 66,
        "g": 67,
        "y": 68,
        "h": 69,
        "u": 70,
        "j": 71
    }
    keys_to_capture = Object.keys(keys_notes);
    pressed_key = event.key;
    if (keys_to_capture.includes(pressed_key)) {
        // console.log(event.key + " is a target key");
        noteOff(keys_notes[pressed_key]);
    }
});
