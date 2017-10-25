var tabletojson = require('../lib/tabletojson');
var fs = require('fs');

var parentlist = []
var movieList = []

var newMovieList = []
var pre_movie = {}

var json;


tabletojson.convertUrl(
  'https://en.wikipedia.org/wiki/List_of_Bollywood_films_of_2017',
  { useFirstRowForHeadings: true },
  function(response) {
    writeObjectToFile(response, 'response.json');
    iterateOverEachTable(response);

    fixesAllMoviesWithNoOpeningDates(movieList);
    writeObjectToFile(newMovieList, 'newMovieList.json')
  }
);

function iterateOverEachTable(response) {
  filterUnwantedMoviesTables(response).forEach(function(table) {
    appendObjectToFile(table, 'table.json');

    iterateOverEachMovie(table);
  });
  writeObjectToFile(movieList, 'test.json');
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
    appendObjectToFile(movie, 'movie.json')
    movie = makeAllMoviesKeysTheSameByRemovingSpeicalCharAndNumber(movie)
    fixAllMovieObjectAndAddToMovieList(movie)
  });
}

function makeAllMoviesKeysTheSameByRemovingSpeicalCharAndNumber(movie) {
  var movieobj = {}
  Object.keys(movie).forEach(function(key) {
    movieobj[key.replace(/_[0-9]/, '')] = movie[key]
  })
  return movieobj
}

function fixAllMovieObjectAndAddToMovieList(movie) {
  fixMovieObjectWith10Indexes(movie)
  fixMovieObjectWith9Indexes(movie)
  fixMovieObjectWith8Indexes(movie)
}

function fixMovieObjectWith10Indexes(movie) {
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

function fixMovieObjectWith9Indexes(movie) {
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

function fixMovieObjectWith8Indexes(movie) {
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

function fixesAllMoviesWithNoOpeningDates(moviesList) {  
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

function setPreviousMovie(movie) {
  pre_movie = movie
}

function pushMovieToList(movie) {
  newMovieList.push(movie)
}
