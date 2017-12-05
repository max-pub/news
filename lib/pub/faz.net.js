let lib = require('../NET')
let cheerio = require('cheerio')

module.exports = {
	loadFeed: () => {
		return new Promise((resolve, reject) => {
			lib.loadFeed('http://www.faz.net/rss/aktuell/').then((FEED) => {
				var items = FEED.rss.channel[0].item;
				var save = [];
				items.forEach((item) => {
					let $ = cheerio.load(item.description[0]);
					let gmt = new Date(Date.parse(item.pubDate[0])).toISOString().replace('T', ' ').split('.')[0];
					save.push({
						title: item.title[0],
						image: $('img').attr('src'),
						abstract: $('p').text(),
						url: item.link[0],
						date: gmt.split(' ')[0],
						time: gmt.split(' ')[1]
					});
				});
				resolve(save);
				// callback(save);
			});
		});
	},

	loadPage: (url) => {
		return new Promise((resolve, reject) => {
			// console.log('this', this);
			if (url.includes('blogs.')) return reject();
			url += '?printPagedArticle=true';
			// ?printPagedArticle=true
			// url = url.replace('www.', 'm.').replace('.html', '.amp.html');
			console.log('load', url);
			lib.GET(url).then(PAGE => {
				// console.log('this', this);
				if (!PAGE) return reject();
				resolve(PAGE);
				// module.exports.parseHTML(PAGE).then((save) => {
				// 	resolve(save);
				// });
			});
		});
	},



	parseHTML: (HTML) => {
		// return new Promise((resolve, reject) => {
		let $ = cheerio.load(HTML);
		$ = cheerio.load($('.FAZArtikelText').html());

		$('.clear').remove();
		$('.clearfix').remove();
		$('#hinweisboxkurz').remove();
		$('.RelatedLinkBox').remove();
		$('.WeitereBeitraege').remove();
		$('.smsharelines').remove();
		$('.LightBoxBgnd').remove();

		$('.MediaLink').each((i, item) => {
			let img = $(item).find('img.media');
			let src = img.attr('data-src');
			let title = img.attr('title');
			$(item).replaceWith(`<figure><img src='${src}'/><figcaption>${title}</figcaption></figure>`);
		});
		$('[itemprop="image"]').each((i, item) => {
			if ($(item).find('figure'))
				$(item).replaceWith($(item).find('figure'))
		});
		$('a[href]').each((i, item) => {
			if ($(item).attr('href').includes('/thema/'))
				$(item).replaceWith($(item).text());
		});

		$('*').removeAttr('class');
		$('*').removeAttr('id');

		// $('[itemprop="image"]').remove();
		return $.html();

		// resolve($.html());
		// });
	},



	parse: HTML => {
		let $ = cheerio.load(HTML);
		$ = cheerio.load($('.FAZArtikelText').html());

		$('.clear').remove();
		$('.clearfix').remove();
		$('#hinweisboxkurz').remove();
		$('.RelatedLinkBox').remove();
		$('.WeitereBeitraege').remove();
		$('.smsharelines').remove();
		$('.LightBoxBgnd').remove();

		$('.MediaLink').each((i, item) => {
			let img = $(item).find('img.media');
			let src = img.attr('data-src');
			let title = img.attr('title');
			$(item).parent().replaceWith(`<figure><img src='${src}'/><figcaption>${title}</figcaption></figure>`);
		});
		$('[itemprop="image"]').remove();

		let html = lib.removeLinksTo($('div').html(), '/thema/');
		html = html.split('</h2>').join('</h2>\n');
		return html;
	},


	loadPage2: (url) => {
		return new Promise((resolve, reject) => {
			if (url.includes('blogs.')) return reject();
			url = url.replace('www.', 'm.').replace('.html', '.amp.html');
			lib.GET(url, (PAGE) => {
				if (!PAGE) return reject();
				this.parseAMP(PAGE).then((save) => {
					resolve(save);
				});
			});
		});
	},

	parseAMP2: (HTML) => {
		return new Promise((resolve, reject) => {
			let $ = cheerio.load(HTML);
			let save = {
				title: $('h1.article_headline').text(),
				image: $('.article_image_full_wrapper [src]').attr('src')
			}
			let body = $('div.article_text');
			body.find('div').remove();
			body.find('hr').remove();
			body.find('h4').remove();
			save.body = body.html();
			resolve(save);
		});
	}

}