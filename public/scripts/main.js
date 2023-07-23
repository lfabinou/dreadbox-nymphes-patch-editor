var test_mode = window.location.href.includes('test=1')

var range = document.querySelector('#fcut'),
    value = document.querySelector('.range-value');
    
let outIds = [
    /*  0 */    '',
    /*  1 */    '',
    /*  2 */    'lfobampd',
    /*  3 */    'fegn',
    /*  4 */    'ftrk',
    /*  5 */    'glide',
    /*  6 */    'lfobfilts',
    /*  7 */    'alvl',
    /*  8 */    'flfo',
    /*  9 */    'olevel',
    /* 10 */    'sub',

    /* 11 */    'noise',
    /* 12 */    'pulse',
    /* 13 */    'olfoa',
    /* 14 */    'oeg',
    /* 15 */    'detune',
    /* 16 */    'chord',
    /* 17 */    'pmode',
    /* 18 */    'lfoar',
    /* 19 */    'lfoaw',

    /* 20 */    'lfoad',
    /* 21 */    'lfoaf',
    /* 22 */    'lfoas',
    /* 23 */    'lfoac',
    /* 24 */    'lfobampa',
    /* 25 */    'lfoblfobaf',
    /* 26 */    '',
    /* 27 */    'lfobfiltr',
    /* 28 */    'lfobs',
    /* 29 */    'lfobc',
    /* 30 */    'lfoblfobar',

    /* 31 */    'lfobfiltd',
    /* 32 */    'lfoblfobaw',
    /* 33 */    'lfoblfoad',
    /* 34 */    'lfoblfoaf',
    /* 35 */    'lfoblfobad',
    /* 36 */    '',

    /* 37 */    'lfobr',
    /* 38 */    'lfobw',
    /* 39 */    'lfobd',
    /* 40 */    'lfobf',
    /* 41 */    '',
    /* 42 */    '',

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
    /* 70 */    'owave',
    /* 71 */    'fres',
    /* 72 */    'ampr',

    /* 73 */    'ampa',
    /* 74 */    'fcut',
    /* 75 */    'lfobamps',
    /* 76 */    'lfobampr',

    /* 77 */    'lfoblfoar', 
    /* 78 */    'lfoblfoaw', 
    /* 79 */    'filta', 
    /* 80 */    'filtd', 

    /* 81 */    'fhpf', 
    /* 82 */    'filts', 
    /* 83 */    'filtr', 
    /* 84 */    'ampd', 
    /* 85 */    'amps', 
];

var patch   = {'name' : '', 'data' : [ Array(85).fill(0), Array(85).fill(0), Array(85).fill(0), Array(85).fill(0) ] }; 
let speeds  = ['BPM','LOW','HI','TRK'];
let syncs   = ['OFF','ON'];
let modes   = ['Poly','Uni6','Uni4','Tri','Duo','Mono'];
let isSpeed = [22,28];
let isSync  = [23,29];
let isMod   = [51,52,53,54,55,56,57,58,59,60,61,62,63,65,66,67,69,75,76,77,78];
var modType = 0;

function sliderChange(type,val,mode=-1) {
    var outputMidiChannel = channelOut.selectedIndex - 1;
    var out = val;
    if(type == 17){ out = modes[val]; } // Poly/Unison/Mono modes (CC17)

    if(isSpeed.indexOf(type) !== -1){ out = speeds[val]; }
    if(isSync.indexOf(type)  !== -1){ out = syncs[val]; }

    if((outIds[type] == '')|| (outIds[type] == undefined)){ return; }

    if(mode > -1){ 
        sendSlider(0xB0 + outputMidiChannel, 50, mode); 
        modType = mode;
        document.querySelector('#'+outIds[type]+'o'+modType).innerHTML = out;
        patch['data'][mode][type] = parseInt(val,10);
    } else {
        document.querySelector('#'+outIds[type]+'o').innerHTML = out;
        patch['data'][0][type] = parseInt(val,10);
    }
    if (test_mode) {
        console.log(`Sending slider #CC${type} with value=${val}`)
    }
    sendSlider(0xB0 + outputMidiChannel, type, val);
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

                if(mod > -1){ sendSlider(0xB0 + outputMidiChannel, 50, mod); }

                for (const patchType in patchInput['data'][mod]) {
                    type = parseInt(patchType,10);
                    if(type < 3){ continue;}
                    if(type==64){ continue; }
                    if(type==68){ continue; }

                    var val = patchInput['data'][mod][type];
                    var out = val;
                    
                    if(type == 17){ out = modes[val]; }
                    if((mod >0)&&(type <51)){ continue; }
                    if((mod==0)&&(type >76)){ continue; }

                    if(isSpeed.indexOf(type) !== -1){ out = speeds[val]; }
                    if(isSync.indexOf(type)  !== -1){ out = syncs[val]; }
                
                    if((mod >0)||(type>50)) {
                        document.querySelector('#'+outIds[type]+mod).value = val;    
                        document.querySelector('#'+outIds[type]+'o'+mod).innerHTML = out;    
                    } else {
                        if(outIds[type]!=''){
                            document.querySelector('#'+outIds[type]).value = val;  
                            document.querySelector('#'+outIds[type]+'o').innerHTML = out;      
                        }
                    }

                    patch['data'][mod][type] = parseInt(val,10);   
                    sendSlider(0xB0 + outputMidiChannel, type, val);
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
    // Display inputs
    selectIn.innerHTML  = midiIn.map( device => {
        nymphes_available = (device.name == 'Nymphes' ? 'selected="selected"' : '')
        return `<option ${nymphes_available}>${device.name} v${device.version}</option>`
    }).join('');
    
    // Display outputs
    selectOut.innerHTML = midiOut.map(device => {
        nymphes_available = (device.name == 'Nymphes' ? 'selected="selected"' : '')
        return `<option ${nymphes_available}>${device.name} v${device.version}</option>`
    }).join('');
    
    // Display output channels
    channelOut.innerHTML = [...Array(16).keys()].map(channel => {
        return `<option>Channel ${channel}</option>`
    });

}
  
function startListening() {     
    // Start listening to MIDI messages.
    for (const input of midiIn) {
        input.addEventListener('midimessage', midiMessageReceived);
    }
}
  
function midiMessageReceived(event) {
    var cc_code = event.data[1]
    var cc_value = event.data[2];
    if(Number.isInteger(cc_code)){
        console.log(`Received slider #CC${cc_code} with value=${cc_value}`)

        if(cc_code< 70){ modType = 0; }
        if(cc_code==50){ modType = cc_value; return; }
        if((modType==0)&&(cc_code >85)){ return; }

        if((outIds[cc_code]!='')&&(outIds[cc_code]!= undefined)){            
            var outId = outIds[cc_code];


            if (isMod.indexOf(cc_code) !== -1) { // this is a modulation matrix change
                document.querySelector('#'+outId+'o'+modType).innerHTML = cc_value;
                document.querySelector('#'+outId+modType).value = cc_value; 
            } else { // this is not a modulation change
                document.querySelector('#'+outId+'o').innerHTML = cc_value;
                document.querySelector('#'+outId).value = cc_value;    
                
                if (cc_code==17) { // this is a mode change
                    console.log('blah')
                    document.querySelector('#pmode'+'o').innerHTML = modes[cc_value];
                    document.querySelector('#pmode').value = cc_value;    
                } 
            }
            patch['data'][modType][cc_code] = parseInt(cc_value,10);   
        }
    }
}
    
function sendSlider(valA,valB,valC){
    const device = midiOut[selectOut.selectedIndex];
    const msg = [valA,valB,valC];
    device.send(msg); 
}

function noteOn(note) { // later on, add [note, velocity, duration=0] to attributes
    // console.log(`starting note ${note}`)
    var outputMidiChannel = channelOut.selectedIndex - 1;
    const device = midiOut[selectOut.selectedIndex];
    device.send([0x90 + outputMidiChannel, note, 0x7f]); // send full velocity note-ON (0x90) on channel (0x01)
}

function noteOff(note) { // later on, add [note, velocity, duration=0] to attributes
    // console.log(`stopping note ${note}`)
    var outputMidiChannel = channelOut.selectedIndex - 1;
    const device = midiOut[selectOut.selectedIndex];
    device.send([0x90 + outputMidiChannel, note, 0]); // send full velocity note-OFF on channel 0
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
