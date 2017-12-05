var fs = require('fs');
let lib = require('./lib/NET');

PUB = process.argv[2];
let PUBL = require('./lib/pub/' + PUB);

mkdir = path => {
	path = path.split('/');
	let p = path[0];
	for (let i = 0; i < path.length; i++, p += '/' + path[i])
		try {
			fs.mkdirSync(p);
		} catch (e) {}
}

PUBL.loadFeed().then((feed) => {
	feed.forEach(item => {
		console.log(item);
		let d = item.date.split('-');
		let t = item.time.split(':').join('');
		let path = `data/${PUB}/${d[0]}/${d[1]}/${d[2]}/${t}`;
		mkdir(path);
		lib.download(item.image, path + '/feed.jpg');
		delete item.image;
		// fs.writeFileSync(path + '/abstract.txt', item.abstract);
		// delete item.abstract;
		fs.writeFileSync(path + '/meta.json', JSON.stringify(item));
	});
}).catch((error) => {
	console.log('uiui');
});



// PUBL.loadFeed().then((feed) => {
// 	lib.getDB().then((db) => {
// 		var sql = "INSERT INTO articles (publisher,url,gmt,title,abstract) VALUES (?,?,?,?,?)";
// 		feed.forEach((item) => {
// 			db.run(sql, PUB, item.url, item.gmt, item.title, item.abstract).then((stat) => {
// 				console.log("INSERT", stat.lastID, item.url);
// 			}).catch((error) => {
// 				console.error('ERROR:', item.url);
// 			});
// 		});
// 	});
// }).catch((error) => {
// 	console.log('uiui');
// });