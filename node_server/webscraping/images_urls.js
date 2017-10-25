var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var tabletojson = require('./lib/tabletojson');

var imageUrlList = []

convertTableToJson()
// testGettingImageUrls()

function convertTableToJson(movielist) {
  console.log('convertTableToJson() is called')
  tabletojson.convertUrl(
    'http://www.bollywoodhungama.com/movie-release-dates/',
    { stripHtmlFromCells: false },
    function(response) {
      writeObjectToFile(response, './logs/images_urls_response.json');
      
      var movie_urllist = parseAllMoviesPageUrl(response)
      appendObjectToFile(movie_urllist, './logs/movie_urllist.json')
      
      getAllImagesUrlsFromMoviesHtmlPage(movie_urllist)

    }
  );
}

function writeObjectToFile(obj, filename) {
  fs.writeFile(filename, JSON.stringify(obj, null, 4), function(error){})  
}

function appendObjectToFile(obj, filename) {
  fs.appendFile(filename, JSON.stringify(obj, null, 4), function(error){})  
}

function parseAllMoviesPageUrl(response) {
  var list = []
  for (movie of response[0]) {
    list.push(turnATagIntoAUrl(movie['Movie Name']))
  }
  return list
}

function turnATagIntoAUrl(atag) {
  return atag.match(/"(.*)"/).pop()
}

function getAllImagesUrlsFromMoviesHtmlPage(movie_url_list) {
  console.log('getAllImagesUrls() is called')
  for (movieurl of movie_url_list) {
    doGetRequestToMovieUrl(movieurl)
  }
}

function doGetRequestToMovieUrl(movieurl) {
  console.log('getMoviePageAsHtml() is called')
  request(movieurl, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      PareseMovieHtmlPageForImageUrls(html, movieurl)

    } else {
      console.log('Error: ', image_url)
    }
  });
}

function PareseMovieHtmlPageForImageUrls(html, movieurl) {
  console.log('PareseHtmlForImageUrl() is called')
  image_url = getSrcFromImgTag(getImageTag(html))

  addImageUrlObjectToList(movieurl, image_url)
  
  logstuff(movieurl, image_url)
}

function getImageTag(html) {
  var $ = cheerio.load(html);
  return $('#movie-main-header > header > div.row > div > div.movie-details-wrapper.clearfix > div.movie-posture > figure').html()
}


function getSrcFromImgTag(imgtag) {
  var $ = cheerio.load(imgtag)
  return $('img').attr('data-lazy-src')  
}

function addImageUrlObjectToList(movieurl, image_url) {
  newobj = {}
  newobj[getMovieNameFromUrl(movieurl)] = image_url 
  imageUrlList.push(newobj)
}

function logstuff(movieurl, image_url) {
  key = getMovieNameFromUrl(movieurl)
  obj = {}
  obj[key] = image_url
  appendObjectToFile(obj, './logs/imageUrlList.json');
}

function getMovieNameFromUrl(imageurl) {
  count = 0
  if(imageurl) {
    var name = imageurl.split('/')[4].replace(/-/g, ' ')
    return name.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
      })
  } else {
    return count += 1
  }
}

function testGettingImageUrls() {
  request('http://www.bollywoodhungama.com/movie/babuji-ek-ticket-bambai/', function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
        // console.log($('#movie-main-header > header > div.row > div.large-12.columns > div > div.movie-posture > figure > noscript').html());
        var html = $('#movie-main-header > header > div.row > div > div.movie-details-wrapper.clearfix > div.movie-posture > figure').html();
        // console.log(html)
        var $ = cheerio.load(html)
        console.log($('img').attr('data-lazy-src'))
        }
      }
  );
}

function addUrlObjectToMovieList(movieList){
  new_list = []
  for (var movie of movieList) {
    new_obj = {}
    console.log(movie.Title)
    object.assign(new_obj, movie, {
      'image_url': movieList[imageUrlList[movie.Title]]
    })
    new_list.push(new_obj)
  }
  return new_list
}
