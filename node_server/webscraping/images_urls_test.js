var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

var tabletojson = require('./lib/tabletojson');

thelist = [
  {
      "Opening": "JAN 13",
      "Title": "Haraamkhor",
      "Director": "Shlok Sharma",
      "Cast": "Nawazuddin Siddiqui, Shweta Tripathi, Trimala Adhikari, Mohd Samad, Irfan Khan, Harish Khanna, Shreya Shah",
      "Genre": "Comedy, Crime",
      "Studio(Production House)": "",
      "Country": "INDIA",
      "id": 0
  },
  {
      "Opening": "JAN 13",
      "Title": "Ok Jaanu",
      "Director": "Shaad Ali",
      "Cast": "Aditya Roy Kapur, Shraddha Kapoor, Leela Samson, Naseeruddin Shah, Jasmeet Singh, Prahlad Kakkar, Kitu Gidwani, Sanjay Gurbaxani, Sarika Singh, Sharma Vibhoutee, Vijayant Kohli",
      "Genre": "Romance, Drama",
      "Studio(Production House)": "Madras Talkies & Dharma Productions",
      "Country": "INDIA",
      "id": 1
  },
  {
      "Opening": "JAN 20",
      "Title": "Coffee with D",
      "Director": "Vishal Mishra",
      "Cast": "Sunil Grover, Zakir Hussain, Dipannita Sharma, Anjana Sukhani, Rajesh Sharma, Pankaj Tripathi, Vinod Ramani, Guru Singh, Feroze, Saurabh, Manan Sampat, Majid Sheikh, Akhilesh Tiwari",
      "Genre": "Comedy/Crime",
      "Studio(Production House)": "Apex Entertainment",
      "Country": "INDIA",
      "id": 2
  },
  {
      "Opening": "JAN 25",
      "Title": "Kaabil",
      "Director": "Sanjay Gupta",
      "Cast": "Hrithik Roshan, Yami Gautam, Ronit Roy, Narendra Jha, Suresh Menon, Sahidur Rahman, Akhilendra Mishra, Girish Kulkarni, Urvashi Rautela Guest Appearance In A Song",
      "Genre": "Action/Thriller",
      "Studio(Production House)": "Filmkraft Productions Pvt. Ltd",
      "Country": "INDIA",
      "id": 3
  },
  {
      "Opening": "JAN 25",
      "Title": "Raees",
      "Director": "Rahul Dholakia",
      "Cast": "Shah Rukh Khan, Mahira Khan, Nawazuddin Siddiqui, Mohammed Zeeshan Ayyub, Sheeba Chaddha, Shubham Chintamani, Shubham Tukaram, Atul Kulkarni, Narendra Jha, Jaideep Ahlawat, Uday Tikekar, Pramod Pathak, Utkarsh Mazumdar, Kundan Roy, Ashutosh Jha, Sunil Upadhyay, Fareed Arif, Loveleen Mishra, Anil Mange, Sanjay Gurbaxani, Raj Arjun, Bhagwan Tiwari, Sunny Leone Guest Appearance In A Song",
      "Genre": "Crime/Action",
      "Studio(Production House)": "Red Chillies Entertainment & Excel Entertainment",
      "Country": "INDIA",
      "id": 4
  }
]

const myFormat = printf(info => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const log = createLogger({
  format: combine(
    label({ label: 'N/A' }),
    timestamp(),
    myFormat
  ),
  transports: [new winston.transports.File({ filename: './logs/combined.log' })]
});

getWikiPageUrlOfMovies(thelist)

function getWikiPageUrlOfMovies(list) {
  log.info('getWikiPageUrlOfMovies() is called')
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
  log.info('doGetReqToWikiPage() is called    ['+ title+']')
  request(url, function (error, response, html) {
    log.info('')
    imageObj = getTheImageUrlFromResponse(error, response, title, url, html)
    log.info(JSON.stringify(imageObj, null, 4))
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
  log.info('getImageTag() is called')
  var $ = cheerio.load(html);
  imgtag = $('#mw-content-text > div > table:nth-child(1) > tbody > tr:nth-child(2) > td > a').html()
  // console.log(imgtag)
  return imgtag
}

function getImageSrcFromImgTag(imgtag) {
  log.info('getImageSrcFromImgTag() is called')
  var $ = cheerio.load(imgtag)
  imgurl = $('img').attr('src')
  // console.log(imgurl)
  return imgurl
}

noWikiPage = []
function addUrlToNoWikiPagesList(url) {
  noWikiPage.push(url)
}