var fs = require('fs');
let lib = require('./lib/NET');

PUB = process.argv[2];
let PUBL = require('./lib/pub/' + PUB);


PUBL.loadFeed().then((feed) => {
	lib.getDB().then((db) => {
		var sql = "INSERT INTO articles (publisher,url,gmt,title,abstract) VALUES (?,?,?,?,?)";
		feed.forEach((item) => {
			db.run(sql, PUB, item.url, item.gmt, item.title, item.abstract).then((stat) => {
				console.log("INSERT", stat.lastID, item.url);
			}).catch((error) => {
				console.error('ERROR:', item.url);
			});
		});
	});
}).catch((error) => {
	console.log('uiui');
});