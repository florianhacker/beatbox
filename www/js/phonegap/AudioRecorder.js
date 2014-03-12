FH.AudioRecorder = function() {

}

FH.AudioRecorder.prototype.init = function(fileName) {

}

	
FH.AudioRecorder.prototype.record = function(fileName) {

  this.mediaRec = new Media(fileName, onRecordSuccess.bind(this), onRecordError.bind(this), onRecordStatus.bind(this) );

    function onRecordSuccess(e){

      console.log("Audio Record success", e);
    }

    function onRecordError(e){

      console.log("Media Recording didn't work", e);
    }

    function onRecordStatus(e){

      //console.log("onRecordStatus:", e);  
    }

  // Record audio
  console.log("ok, record audio file to location:", fileName);
  this.mediaRec.startRecord();

}

FH.AudioRecorder.prototype.stopRecording = function() {
  
  this.mediaRec.stopRecord();
  this.mediaRec.play();
  this.mediaRec.stop();
  //this.mediaRec.release();
}
