FH.FileWriter = function() {

}

FH.FileWriter.prototype.init = function() {

}

	
FH.FileWriter.prototype.write = function(fileName, cb) {

  this.callBack = cb;
  this.fileName = fileName;

  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, this.onReady.bind(this), this.onFail.bind(this) );
}

FH.FileWriter.prototype.onReady = function(fileSystem) {

  var options = { 
    create: true, 
    exclusive: false
  }

  console.log("onReady, now get file", this.fileName );

  fileSystem.root.getFile(this.fileName, options, onSuccess.bind(this), onFail.bind(this) );

    function onSuccess(entry){
      
      console.log("FH.FileWriter.prototype.onReady", entry);
      console.log("entry.getMetadata()", entry.getMetadata() )
      this.callBack(entry);
    }

    function onFail(err){
      console.log("get file failed", err);
    }
}

FH.FileWriter.prototype.onFail = function(e) {

  console.log("FileWriter fail", e)
}