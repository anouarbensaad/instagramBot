var mysql = require('mysql')

exports.igapidb = new IGAPIDB()

function IGAPIDB(){
	const self = {}
	var pool  = mysql.createPool({
	  connectionLimit : 10,
	  host: "localhost",
	  user: "instabot",
	  password: "*******",
	  database: "********",
	  charset:  "utf8mb4_unicode_ci"
	});

	self.execute = function($sql, cbk_fn){
		pool.getConnection(function(err, connection) {
			connection.query($sql, (err, result, fields) => {
				connection.release();
				cbk_fn(err, result, fields)
			})
		}) 	
	}

	self.execute_escaped = function($sql, values ,cbk_fn){
		pool.getConnection(function(err, connection) {
			connection.query($sql, values, (err, result, fields) => {
				connection.release();
				cbk_fn(err, result, fields)
			})
		}) 	
	}

	return self
}


