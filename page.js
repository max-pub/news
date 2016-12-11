var fs = require('fs');
let lib = require('./lib/NET');

// PUB = process.argv[2];
// INDEX = process.argv[3];
// if (PUB) PUBL = require('./lib/pub/' + PUB);


head = fs.readFileSync('lib/header.html', 'utf-8');
foot = fs.readFileSync('lib/footer.html', 'utf-8');

time = '';
logo2 = '';

lib.getDB((db) => {
	db.get("SELECT * FROM articles WHERE body IS NULL ORDER BY title").then((item) => {
		PUBL = require('./lib/pub/' + item.publisher);
		PUBL.loadPage(item.url, (page) => {
			if (!page) page = {
				body: '-'
			};
			db.run("UPDATE articles SET body=? WHERE ID=?", page.body, item.ID)
				.then((stat) => {
					console.log("UPDATE ", item.ID);
				}).catch((err) => {
					console.error(err)
				});
		});
	});
});



// return;

// let logo = "<img class='logo' src='faz.png'/>" + "\n";
// // let feed = fs.readFileSync('data/achgut.feed.json', 'utf-8');
// // feed = JSON.parse(feed);

// loadFeedItem = (item) => {
// 	// let file = 'data/' + item.url.split('-').slice(-1)[0]; // FAZ
// 	// let file = 'data/' + item.url.split('/').slice(-1)[0] + '.html'; // achgut
// 	let time = '<time datetime="">' + item.gmt + '</time>' + "\n";

// 	achgut.loadPage(item.url, (page) => {
// 		console.log('save:', file);
// 		fs.writeFile(file, head + logo + time + page + foot);
// 	});
// }

// loadFeedItem(feed[index]);