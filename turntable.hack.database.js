turntable.hack.database = {
	dbName        : 'turntable.hack.database',
	dbDisplayName : 'Hack Database',
	dbVersion     : '0.1',
	dbMaxSize     : 10000000,
	dbHandle      : false,

	getDatabase : function () {
		if (this.dbHandle) { return this.dbHandle; }
		this.dbHandle = openDatabase(this.dbName, this.dbVersion, this.dbDisplayName, this.dbMaxSize);
		return this.dbHandle;
	},

  execute : function (query, success, failure) {
    console.log(query);
    this.getDatabase().transaction(  
      function (transaction) {
        transaction.executeSql(query, [], success, failure);
      }
    );
  }
}