var FH = FH || {};

CONTEXT = new webkitAudioContext();
CONTEXT.createGain();

FH.BeatBox = function(){

	this.init();	
};

FH.BeatBox.prototype.init = function(){
	console.log("init");

	var fs = new FH.FileReader();
	fs.deleteAllFiles( onAllFilesDeleted.bind(this) );

		function onAllFilesDeleted(){

			console.log("onAllFilesDeleted ....")

			this.samples = []; 
			this.recordingSessions = {};
			this.beats = document.getElementsByClassName("beat");

			for(var i = 0; i<this.beats.length; i++){
				this.beats[i].addEventListener("touchstart", this.onBeatTouchStart.bind(this), false);
				this.beats[i].addEventListener("touchend", this.onBeatTouchEnd.bind(this), false);
				//beats[i].addEventListener("touchcancel", this.onBeatTouched.bind(this), false);
				//beats[i].addEventListener("touchleave", this.onBeatTouched.bind(this), false);
				//beats[i].addEventListener("touchmove", this.onBeatTouched.bind(this), false);		
			}

			this.rtm = new FH.Rhythm( this.onBeatTriggered.bind(this), this.beats.length );

			//DOUBLE TAP ON SCREEN
			//$('.drum_pattern').tap( this.onPlayPause.bind(this) );
		}
};

FH.BeatBox.prototype.onBeatTouchStart = function(e){

	e.preventDefault();
	e.stopImmediatePropagation();

	var beatIndex = $(e.target).attr('data-index');
	$(e.target).addClass('touched');

	if( !this.samples[beatIndex] ){

		this.openFileStream( beatIndex );
	}
	else{

		this.playFile( this.samples[beatIndex] );	
	}
};


FH.BeatBox.prototype.onBeatTouchEnd = function(e){

	$(e.target).removeClass('touched');
	var beatIndex = $(e.target).attr('data-index');

	this.stopRecordingSound(beatIndex);
}


FH.BeatBox.prototype.openFileStream = function(beatIndex){
		
	var fileName = "beat_" + beatIndex + ".wav";

	var fw = new FH.FileWriter();

	fw.write( fileName, onFileWritten.bind(this) );


	function onFileWritten(entry){

		this.recordSound( fileName, entry, beatIndex );
	}
}

FH.BeatBox.prototype.recordSound = function(fileName, entry, beatIndex){

	var recordingSession = {
		"recorder" : new FH.AudioRecorder(),
		"entry" : entry,
		"beatIndex" : beatIndex
	}

	recordingSession.recorder.record( entry.toURL() );

	this.recordingSessions["session_" + beatIndex] = recordingSession;
};

FH.BeatBox.prototype.stopRecordingSound = function(beatIndex){

	var recordingSession = this.recordingSessions["session_" + beatIndex];

	if( recordingSession ){

		recordingSession.recorder.stopRecording();
		this.samples[beatIndex] = recordingSession.entry.toNativeURL();
		this.beats[beatIndex].classList.add('sample');
		recordingSession.audioRecorder = null;	
		recordingSession = null;
	}
};

FH.BeatBox.prototype.loadSound = function(file, callback){
	
	console.log("load sound: ", file);

	var bufferLoader = new FH.BufferLoader([file], function(buffers){
		
		var source = CONTEXT.createBufferSource(); // creates a sound source
  		source.buffer = buffers[0];
		source.connect(CONTEXT.destination);

		callback(source);
	})

	bufferLoader.load();
}

FH.BeatBox.prototype.onPlayPause = function(e){

	e.preventDefault();
	e.stopImmediatePropagation();

	if( this.rtm.isRunning ){

		this.rtm.stop();
	}
	else{

		for(var i = 0; i < this.beats.length; i++){
			var beat = this.beats[i];
			beat.classList.remove('onTrigger');
		}
		this.rtm.start();
	}
}

FH.BeatBox.prototype.playFile = function(file){

	this.loadSound(file, function(audioSource){
		audioSource.start(0);
	});
}

FH.BeatBox.prototype.onBeatTriggered = function(currentIndex, previousIndex){

	this.beats[previousIndex].classList.remove('onTrigger');
	this.beats[currentIndex].classList.add('onTrigger');

	var sample = this.samples[currentIndex];

	if( sample ){

		this.playFile(sample);
	}
}