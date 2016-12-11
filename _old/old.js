// ------------ PAGE

http.get('http://m.faz.net/aktuell/wirtschaft/energiepolitik/community-fuer-solaranlagenbesitzer-14557775.amp.html', (httpResult) => {

	if (httpResult.statusCode !== 200) return console.error('fail');

	httpResult.setEncoding('utf8');
	let HTML = '';
	httpResult.on('data', (chunk) => HTML += chunk);

	httpResult.on('end', () => {
		let $ = cheerio.load(HTML);
		let title = $('h1.article_headline').text();
		let image = $('.article_image_full_wrapper [src]').attr('src');
		let text = $('div.article_text');
		text.find('div').remove();
		text.find('hr').remove();
		text.find('h4').remove();
		let save = "<h1>" + title + "</h1>\n<img src='" + image + "'/>\n" + text.html();
		fs.writeFile('faz.html', save);
	});
}).on('error', (e) => {
	console.log(`Got error: ${e.message}`);
});



// --------- FEED
var http = require('http');
var xml2js = require('xml2js');
var fs = require('fs');
let cheerio = require('cheerio')



http.get('http://www.faz.net/rss/aktuell/', (res) => {
	const statusCode = res.statusCode;
	const contentType = res.headers['content-type'];

	let error;
	if (statusCode !== 200) {
		console.error('fail');
		// res.resume();
		return;
	}

	res.setEncoding('utf8');
	let feedXML = '';
	res.on('data', (chunk) => feedXML += chunk);

	res.on('end', () => {
		xml2js.parseString(feedXML, function(err, feedJSON) {
			// console.dir(result.rss.channel[0].item);
			var items = feedJSON.rss.channel[0].item;
			var customFeed = [];
			items.forEach((item) => {
				// console.log(item);
				// console.log(item.description[0]);
				let $ = cheerio.load(item.description[0]);

				customFeed.push({
					title: item.title[0],
					image: $('img').attr('src'),
					abstract: $('p').text(),
					url: item.link[0],
					gmt: new Date(Date.parse(item.pubDate[0])).toISOString().replace('T', ' ').split('.')[0]
				});
				// console.dir(item);
				// xml2js.parseString(item.description[0], (err, xml) => {
				// 	console.log(xml);
				// });
			});
			console.log(customFeed);
			fs.writeFile('feed.json', JSON.stringify(customFeed));
		});
	});
}).on('error', (e) => {
	console.log(`Got error: ${e.message}`);
});