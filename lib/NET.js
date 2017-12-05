var http = require('http');
var xml2js = require('xml2js');
var fs = require('fs');
let cheerio = require('cheerio');
var db = require("sqlite");

module.exports = {

	GET: function(url, encoding = 'utf8') {
		return new Promise((resolve, reject) => {
			console.log('GET', url);
			http.get(url, (httpResult) => {
				if (httpResult.statusCode !== 200) {
					console.error('GET', url, 'failed');
					return reject(httpResult);
				}
				httpResult.setEncoding(encoding);
				let content = '';
				httpResult.on('data', (chunk) => content += chunk);
				httpResult.on('end', () => {
					resolve(content);
				});
			}).on('error', (error) => {
				console.log(`Got error: ${error.message}`);
				reject(error);
			});
		});
	},

	loadPage: function(url) {
		return new Promise((resolve, reject) => {
			this.GET(url).then((content) => {
				let $ = cheerio.load(content);
				resolve($);
			});
		});
	},

	removeTags: (HTML) => {
		let $ = cheerio.load(HTML);
		$('script').remove();
		$('style').remove();
		$('meta').remove();
		$('iframe').remove();
		return $.html();
	},
	prettify: HTML => {
		return HTML.split('\n').map(x => x.trim()).filter(x => x != '').join('\n\n');
	},
	removeAttributes: HTML => {
		let $ = cheerio.load(HTML);
		$('*').removeAttr('class');
		$('*').removeAttr('id');
		return $.html();
	},
	removeLinksTo: (HTML, string) => {
		let $ = cheerio.load(HTML);
		$('a[href]').each((i, link) => {
			if ($(link).attr('href').includes(string))
				$(link).replaceWith($(link).text());
		});
		return $.html();
	},
	download: (url, path) => {
		module.exports.GET(url, 'binary').then(data => fs.writeFileSync(path, data, 'binary'));
	},
	downloadImages: (HTML, path) => {
		let $ = cheerio.load(HTML);
		$('img[src]').each((i, img) => {
			let url = $(img).attr('src');
			let ext = url.split('.').slice(-1)[0];
			console.log('download', url, ext);
			module.exports.download(url, `${path}/${i+1}.${ext}`);
			$(img).attr('src', `${i+1}.${ext}`);
		});
		return $.html();
	},

	loadFeed: function(url) {
		return new Promise((resolve, reject) => {
			this.GET(url).then((content) => {
				xml2js.parseString(content, function(error, JSON) {
					if (error) reject(error);
					else resolve(JSON);
				});
			});
		});
	},



	getDB: (callback) => {
		return new Promise((resolve, reject) => {
			var sqlfile = './data/DB.sqlite';
			// if (this.DB) callback(this.DB, 'cache')
			db.open(sqlfile)
				.then((stat) => {
					return db.run("CREATE TABLE articles (ID INTEGER PRIMARY KEY,url varchar(250) UNIQUE, publisher varchar(250), gmt DATETIME, authors varchar(250), title varchar(250), abstract TEXT, body TEXT);");
				})
				.catch((err) => {
					// console.error('tables', err)
				})
				.then((stat) => {
					// this.DB = db;
					resolve(db);
				});
		});
	}
}