var tabletojson = require('./lib/tabletojson');
var fs = require('fs');


var parentlist = []
var newObj = []

var json;
tabletojson.convertUrl(
  'https://en.wikipedia.org/wiki/List_of_Bollywood_films_of_2017',
  { useFirstRowForHeadings: true },
  function(tablesAsJson) {
    fs.writeFile('alltables.json', JSON.stringify(tablesAsJson, null, 4))
    
    var tables = tablesAsJson.splice(2)
    fs.writeFile('tables.json', JSON.stringify(tables, null, 4))
    
    tables.forEach(function(list) {
      fs.appendFile('list.json', JSON.stringify(list, null, 4))
      
      list.forEach(function(movie) {
        fs.appendFile('movie.json', JSON.stringify(movie, null, 4))
        movie = modifyMoviesObjectKeys(movie)
        if("9" in movie) {
          var newEle = {
            "Opening": movie['Opening'] + ' : ' +movie['Title'],
            "Title": movie['Director'],
            "Director": movie['Cast'],
            "Cast": movie['Genre'],
            "Genre": movie['Studio(Production House)'],
            "Studio(Production House)": movie['Country'],
            "Country": movie['Ref']
          }
          newObj.push(newEle)
        } else if (movie["Studio(Production House)"] == "INDIA") {
          var newEle = {
            "Opening": "N/A",
            "Title": movie['Opening'],
            "Director": movie['Title'],
            "Cast": movie['Director'],
            "Genre": movie['Cast'],
            "Studio(Production House)": movie['Genre'],
            "Country": movie['Studio(Production House)']
          }
          newObj.push(newEle)
        } else if (movie["Country"] == "INDIA") {
          var newEle = {
            "Opening": movie['Opening'],
            "Title": movie['Title'],
            "Director": movie['Director'],
            "Cast": movie['Cast'],
            "Genre": movie['Genre'],
            "Studio(Production House)": movie['Studio(Production House)'],
            "Country": movie['Country']
          }
          newObj.push(newEle)
        }
      }, this);
    })

    fs.writeFile('test.json', JSON.stringify(newObj, null, 4))
    // fs.writeFile('alltables.json', JSON.stringify(tablesAsJson.splice(2), null, 4))
    // console.log('newObj: ', newObj)
  }
);


function modifyMoviesObjectKeys(movie) {
  newobj = {}
  Object.keys(movie).forEach(function(key) {
    newobj[key.replace(/_[0-9]/, '')] = movie[key]
  })
  return newobj
}
