/* BackLog
1. could create isCheck() method for all fix10IndexMovie() methods so this methods only
  return the modified movie
2. Refactor with SOLID Principle of single responsibility 
*/

var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');

var tabletojson = require('./lib/tabletojson');

var parentlist = []
var movieList = []

var newMovieList = []
var newerMovieList = []
var pre_movie = {}
var moviesWithID = []

var json;

convertTableToJson()

function convertTableToJson() {
  tabletojson.convertUrl(
    'https://en.wikipedia.org/wiki/List_of_Bollywood_films_of_2017',
    { useFirstRowForHeadings: true },
    function(response) {
      writeObjectToFile(response, './logs/response.json');
      iterateOverEachTable(response);

      fixMovieOpeningDateAndAddToNewMovieList();
      writeObjectToFile(newMovieList, './logs/newMovieList.json')

      fixDateWithMissingMonth()
      
      moviesWithID = addIdsToMovies(newerMovieList)
      // appendObjectToFile(moviesWithID, './logs/combined.log')

      getWikiPageUrlOfMovies(moviesWithID)
    }
  );
}

function iterateOverEachTable(response) {
  filterUnwantedMoviesTables(response).forEach(function(table) {
    appendObjectToFile(table, './logs/table.json');

    iterateOverEachMovie(table);
  });
  writeObjectToFile(movieList, './logs/test.json');
}

function filterUnwantedMoviesTables(response) {
  var tablelist = []
  loop1:
  for (var list of response) {
  loop2:
    for (var movie of list) {
  loop3:
      for (var key in movie) {
        if(key.search(/Opening/) === 0) {
          tablelist.push(list)
          break loop2
        }
      }
    }
  }
  return tablelist
}

function iterateOverEachMovie(table) {
  table.forEach(function(movie) {
    checkForUniqueConditionsAndEditTheMovie(movie)
  });
}

function checkForUniqueConditionsAndEditTheMovie(movie) {
  if(isMovieOpeningNull(movie)) {
    editTheMovie(fixOctNullMovieOpening(movie))
  } else {
    if(isFirstMovieOfOct(movie)) {
      editTheMovie(fixOctMovie())
    } else {
      editTheMovie(movie)
    }
  }
}

function isMovieOpeningNull(movie) {
  if(movie['Opening_4'] === '') {
    return true
  } else {
    return false
  }
}

function fixOctNullMovieOpening(movie) {
  var temp = {}
  return Object.assign(temp, movie, {'Opening': 'OCT 6'})
  return temp
}

function editTheMovie(movie) {
  appendObjectToFile(movie, './logs/movie.json')
  movie = makeAllMoviesKeysTheSameByRemovingSpeicalCharAndNumber(movie)
  fixMoviesValues(movie)
}

function isFirstMovieOfOct(movie) {
  if(movie['Title_5'] === '6') {
    return true
  } else {
    return false
  }
}

function fixOctMovie() {
  return {
    "Opening": "OCT 6",
    "Title": "Aksar 2",
    "Director": "Anant Mahadevan",
    "Cast": "Zareen Khan, Gautam Rode, Abhinav Shukla, S. Sreesanth, Mohit Madaan, Sofia Hayat",
    "Genre": "Erotic thriller",
    "Studio(Production House)": "Siddhivinayak Creations",
    "Country": "INDIA"
  }
}

function makeAllMoviesKeysTheSameByRemovingSpeicalCharAndNumber(movie) {
  var movieobj = {}
  Object.keys(movie).forEach(function(key) {
    movieobj[key.replace(/_[0-9]/, '')] = movie[key]
  })
  return movieobj
}

function fixMoviesValues(movie) {
  fix10IndexMovie(movie)
  fix9IndexMovie(movie)
  fix8IndexMovie(movie)
}

function fix10IndexMovie(movie) {
  if("9" in movie) {
    var newEle = {
      "Opening": removeNewLineFromStr(movie['Opening'])+' '+movie['Title'],
      "Title": movie['Director'],
      "Director": movie['Cast'],
      "Cast": movie['Genre'],
      "Genre": movie['Studio(Production House)'],
      "Studio(Production House)": movie['Country'],
      "Country": movie['Ref']
    }
    movieList.push(newEle)
  }
}

function fix9IndexMovie(movie) {
  if (movie["Studio(Production House)"] == "INDIA") {
    var newEle = {
      "Opening": "N/A",
      "Title": movie['Opening'],
      "Director": movie['Title'],
      "Cast": movie['Director'],
      "Genre": movie['Cast'],
      "Studio(Production House)": movie['Genre'],
      "Country": movie['Studio(Production House)']
    }
    movieList.push(newEle)
  }
}

function fix8IndexMovie(movie) {
  if (movie["Country"] == "INDIA") {
    var newEle = {
      "Opening": movie['Opening'],
      "Title": movie['Title'],
      "Director": movie['Director'],
      "Cast": movie['Cast'],
      "Genre": movie['Genre'],
      "Studio(Production House)": movie['Studio(Production House)'],
      "Country": movie['Country']
    }
    movieList.push(newEle)
  }
}

function removeNewLineFromStr(str) {
  return str.replace(/\n/g, '')
}

function writeObjectToFile(obj, filename) {
  fs.writeFile(filename, JSON.stringify(obj, null, 4), function(error){})  
}

function appendObjectToFile(obj, filename) {
  fs.appendFile(filename, JSON.stringify(obj, null, 4), function(error){})  
}

function fixMovieOpeningDateAndAddToNewMovieList() {  
  for (var movie of movieList) {
    var temp = {}
    if(movie['Opening'] === 'N/A') {
      Object.assign(temp, movie, {'Opening': pre_movie['Opening']})
      pushMovieToList(temp)
    } else {
      pushMovieToList(movie) 
      setPreviousMovie(movie)
    }
  }
}

function getCorrectMovieDate(movie, pre_movie) {
  var date = movie['Opening']
  
  if(isDay(date)) {
    var temp = {}
      Object.assign(temp, movie, {'Opening': getMonth(pre_movie)+' '+getDay(movie)})
      setPreviousMovie(temp)
      return temp
  } else {
    setPreviousMovie(movie)
    return movie
  }
}

function isDay(string) {
  if(string.match(/[A-Z]/g) === null)
    return true
  else {
    return false
  }
}

function getMonth(pre_movie) {
  return pre_movie['Opening'].split(' ')[0]
}

function getDay(movie) {
  return movie['Opening'].match(/\d/g).join('')
}

function setPreviousMovie(movie) {
  pre_movie = movie
}

function pushMovieToList(movie) {
  newMovieList.push(movie)
}

function pushMovieToNewerList(movie) {
  newerMovieList.push(movie)
}

function fixDateWithMissingMonth() {
  for(var movie of newMovieList) {
    pushMovieToNewerList(getCorrectMovieDate(movie, pre_movie))
  }
  writeObjectToFile(newerMovieList, './logs/newerMovieList.json')
}

function addIdsToMovies() {
  var newlist = []
  index = 0
  for (movie of newerMovieList) {
    newlist.push(addIdToMovie(movie, index))
    index += 1
  }
  return newlist
}

function addIdToMovie(movie, index) {
  newmovie = {}
  Object.assign(newmovie, movie, {'id':index})
  return newmovie
}

/************ImageUrl Stuff*************/
function getWikiPageUrlOfMovies(list) {
  for (movie of list) {
    url = createWikiPageUrlfromMovieTitle(movie.Title)
    doGetReqToWikiPage(url, movie.Title)
  }
}

function createWikiPageUrlfromMovieTitle(title) {
  url = 'https://en.wikipedia.org/wiki/'
    + replaceSpaceWithUnderScoreInTitle(title)
  return url
}

function replaceSpaceWithUnderScoreInTitle(title) {
  return title.replace(/ /g, '_')
}

function doGetReqToWikiPage(url, title) {
  request(url, function (error, response, html) {
    imageObj = getTheImageUrlFromResponse(error, response, title, url, html)
    appendObjectToFile(imageObj, './logs/imageobj.json')
    addImageUrlToMovieObjAndWriteItToFile(imageObj)
  });
}

function getTheImageUrlFromResponse(error, response, title, url, html) {
  if(hasWebpage(error, response)) {
    imgtag = getImageTag(html)
    if(hasImgTag(imgtag)) {
      imageurl = getImageSrcFromImgTag(imgtag)
      return {
        'title': title,
        'webpage':url,
        'imgtag':imgtag,
        'imageurl':imageurl
      }
    } else {
      return {
        'title': title,
        'webpage':url,
        'imgtag':'None',
        'imageurl':'None'
      }
    }
  } else {
    return {
      'title': title,
      'webpage':'None',
      'imgtag':'None',
      'imageurl':'None'
    }
  }
}

function hasWebpage(error, response) {
  if(!error && response.statusCode == 200) {
    return true
  } else {
    return false
  }
}

function hasImgTag(imgtag) {
  if(imgtag) {
    return true
  } else {
    return false
  }
}

function getImageTag(html) {
  var $ = cheerio.load(html);
  imgtag = $('#mw-content-text > div > table:nth-child(1) > tbody > tr:nth-child(2) > td > a').html()
  // console.log(imgtag)
  return imgtag
}

function getImageSrcFromImgTag(imgtag) {
  var $ = cheerio.load(imgtag)
  imgurl = $('img').attr('src')
  // console.log(imgurl)
  return imgurl
}

function addImageUrlToMovieObjAndWriteItToFile(imgurl) {
  for (movie of moviesWithID) {
    if(isTitleEquals(movie, imgurl)) {
      newmovie = createNewMovieObj(movie, imgurl)
      appendObjectToFile(newmovie, './logs/finalmovielist.json')
    }
  }
}

function isTitleEquals(movie, imageurl) {
  return movie.Title === imageurl.title
}

function createNewMovieObj(movie, imgurl) {
  newobj = {}
  Object.assign(newobj, movie, {
    'ImageUrl': imgurl.imageurl
  })
  return newobj
}
