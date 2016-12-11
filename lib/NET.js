var http = require('http');
var xml2js = require('xml2js');
var fs = require('fs');
let cheerio = require('cheerio')
var db = require("sqlite");

module.exports = {

	GET: function(url) {
		return new Promise((resolve, reject) => {
			console.log('GET', url);
			http.get(url, (httpResult) => {
				if (httpResult.statusCode !== 200) {
					console.error('GET', url, 'failed');
					return reject(httpResult);
				}
				httpResult.setEncoding('utf8');
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