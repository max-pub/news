let lib = require('../NET')
let cheerio = require('cheerio')
var fs = require('fs');

module.exports = {

	loadFeed: () => {
		return new Promise((resolve, reject) => {
			lib.loadFeed('http://rss.sueddeutsche.de/rss/Topthemen').then((FEED) => {
				// fs.writeFile('sz.feed.json', JSON.stringify(FEED));

				var items = FEED.rss.channel[0].item;
				var save = [];
				items.forEach((item) => {
					// let $ = cheerio.load(item.description[0]);
					save.push({
						title: item.title[0],
						// image: $('img').attr('src'),
						abstract: item['dc:abstract'][0],
						url: item.link[0],
						gmt: new Date(Date.parse(item.pubDate[0])).toISOString().replace('T', ' ').split('.')[0]
					});
				});
				// console.log(save);
				resolve(save);
			});
		});
	},


	loadPage: (url) => {
		// return new Promise((resolve, reject) => {
		// 	if (url.includes('blogs.')) return reject();
		// 	url = url.replace('www.', 'm.').replace('.html', '.amp.html');
		// 	lib.GET(url, (PAGE) => {
		// 		if (!PAGE) return reject();
		// 		this.parseAMP(PAGE).then((save) {
		// 			resolve(save);
		// 		});
		// 	});
		// });
	},

	parseAMP: (HTML) => {
		// return new Promise((resolve, reject) => {
		// 	let $ = cheerio.load(HTML);
		// 	let save = {
		// 		title: $('h1.article_headline').text(),
		// 		image: $('.article_image_full_wrapper [src]').attr('src')
		// 	}
		// 	let body = $('div.article_text');
		// 	body.find('div').remove();
		// 	body.find('hr').remove();
		// 	body.find('h4').remove();
		// 	save.body = body.html();
		// 	resolve(save);
		// });
	}



}