let lib = require('../NET')
let cheerio = require('cheerio')

module.exports = {
	loadFeed: function(callback) {
		return new Promise((resolve, reject) => {
			lib.loadFeed('http://www.achgut.com/rss2').then((FEED) => {
				var items = FEED.rss.channel[0].item;
				var save = [];
				items.forEach((item) => {
					save.push({
						title: item.title[0],
						author: item.author[0],
						abstract: item.description[0],
						url: item.link[0],
						gmt: new Date(Date.parse(item['dc:date'][0])).toISOString().replace('T', ' ').split('.')[0]
					});
				});
				resolve(save);
			});
		});
	},

	loadPage: function(url, callback) {
		// console.log('load:', url);
		lib.GET(url, (PAGE) => {
			let $ = cheerio.load(PAGE);
			let save = {};
			save.image = 'http://www.achgut.com/' + $('div.headerpict_half [src]').attr('src');
			let body = $('div.section_beitrag .teaser_blog_text');
			save.title = body.find('h2').text();
			body.find('div').remove();
			body.find('h2').remove();
			save.body = body.html();
			callback(save);
		});
	}

}