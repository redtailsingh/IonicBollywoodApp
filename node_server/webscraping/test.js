var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');

var tabletojson = require('./lib/tabletojson');


doGetReqToWikiPage('http://www.imdb.com/list/ls074368935/?start=1&view=detail&sort=release_date_us:desc&defaults=1&scb=0.5479821238284619')

function doGetReqToWikiPage(url) {
  request(url, function (error, response, html) {
    var $ = cheerio.load(html);
    imgtag = $('#main > div > div.list.detail > div:nth-child(8) > div.image > a').html()
    var $ = cheerio.load(imgtag)
    imgurl = $('img').attr('src')
    appendObjectToFile(imgurl, 'test.json')
  });
}

function appendObjectToFile(obj, filename) {
  fs.appendFile(filename, JSON.stringify(obj, null, 4), function(error){})  
}

