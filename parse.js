var fs = require('fs');
let lib = require('./lib/NET');


PUBLISHER = process.argv[2];
PAGE = process.argv[3];


parse = (PUBLISHER, PAGE) => {
	let path = `data/${PUBLISHER}/${PAGE}/`;
	let HTML = fs.readFileSync(`${path}/original.html`, 'utf8');

	HTML = lib.removeTags(HTML);
	HTML = require('./lib/pub/' + PUBLISHER).parse(HTML);
	HTML = lib.removeAttributes(HTML);
	HTML = lib.downloadImages(HTML, path);
	HTML = lib.prettify(HTML);

	fs.writeFileSync(`${path}/article.html`, HTML);
}


parse(PUBLISHER, PAGE);

// PUBL.parseHTML(HTML).then(page => {
// 	// console.log(page);
// 	fs.writeFileSync(`data/${PUBLISHER}/${PAGE}/article.html`, page);
// });