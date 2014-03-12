FH.FileReader = function() {

}

FH.FileReader.prototype.init = function() {

}

FH.FileReader.prototype.deleteAllFiles = function(cb) {

	this.callback = cb;

	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, this.onReady.bind(this), this.onFail.bind(this) );
}

  
FH.FileReader.prototype.onReady = function(fileSystem) {
	
	var reader = fileSystem.root.createReader();	

	reader.readEntries( onReadEntries.bind(this), onReadEntriesError.bind(this)	);

		function onReadEntries(entries){

			for(var i = 0; i<entries.length; i++){
				var fileEntry = entries[i];	
				fileEntry.remove();
				console.log("entries[i]:", fileEntry )
			}

			console.log("deleteAllFiles finished");
			this.callback();
		}

		function onReadEntriesError(err){
			console.log('error');
		}
}


FH.FileReader.prototype.onFail = function(err) {

  alert("FileReader fail", err)
}
