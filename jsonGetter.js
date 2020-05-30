const fs = require('fs'),
  readline = require('readline');
const {
  parse
} = require('path');


function myReadFile(path) {
  fs.readFile(path, (err, data) => {
    if (err) throw err;
    console.log(data.toString().split('total'));
  })
}


//   myReadFile('ARPark.txt');



/// 
///We can get back nothing in which case return nothing
///Object with one element in it, if its string return
///Could be a field, then a field with another object
//a field with a list
//list we can iterate -- object need to iterate through the keys

///If its an object iterate through the keys, if the key is a list iterate through objects

var sample_data_asObject = {
  phoneNumbers: [{
    phoneNumber: '907459-3730',
    description: '',
    extension: '',
    type: 'Voice'
  }],
  emailAddresses: [{
    description: '',
    emailAddress: 'fair_interpretation@nps.gov'
  }]
}


var sample_data_asArray = [{
    phoneNumber: '907459-3730',
    description: '',
    extension: '',
    type: 'Voice'
  },
  [{
    description: '',
    emailAddress: 'fair_interpretation@nps.gov'
  }]
];

var nestedLists = [
  ["431", "buddy"], "12",
  ['907459-3730', 'test', 'more', 'Voice'],
  ['less', 'fair_interpretation@nps.gov'],
  ["moredata", 12, ["nestedList here", ['deepaf', 7334]], "anotherThing"]
];


var nestedListsWobjects = [
  ["431", "buddy"], "12", {
    a: 1
  }, {
    b: 2,
    c: ["cheese", 7, 9]
  },
  ['907459-3730', {
    greg: "steven",
    "jake": 111
  }, 'test', {
    ada: 1111,
    eaa: 12122
  }, 'more', 'Voice'],
  ['less', 'fair_interpretation@nps.gov'],
  ["moredata", -4, [{
      d: 6,
      c: 7
    },
    ['deepaf', 7334]
  ], "anotherThing"]
];


var sample_dict = {
  a: 1,
  b: 2,
  c: 3,
  e: {
    d: 4,
    f: 7,
    g: {
      q: 1,
      z: 12
    }
  },
  r: 23
};


function objectParse(object, keys) {
  if (keys.length == 0) {
    return;
  }
  if (typeof(keys[0]) != 'object' && typeof(object[keys[0]]) != 'object'){
    console.log('key: ',keys[0],' value: ',object[keys[0]]);
    // fs.appendFile('sampleFile.txt', keys[0] + ":" + object[keys[0]]+ '\n',function(err){
      // if(err) throw err;
    // });
  } 
  if (Object.keys(object[keys[0]]).length >= 1 && typeof (object[keys[0]]) == 'object') {
    objectParse(object[keys[0]], Object.keys(object[keys[0]]));
  }
  objectParse(object, keys.slice(1))
}

// objectParse(sample_dict,Object.keys(sample_dict));

function parseListForMe(data_list) {
  if (data_list.length == 0) {
    return;
  }
  if (typeof (data_list[0]) != 'object' && typeof(data_list[0]) != 'undefined') {
    console.log(data_list[0])
    // fs.appendFile('sampleFile.txt',data_list[0] + '\n',function(err){
      // if(err) throw err;
    // });
  }
  if (typeof(data_list.length) == 'undefined' && typeof(data_list) == 'object') {
    objectParse(data_list, Object.keys(data_list));
    return;
  }
  if (data_list[0].length >= 1 && typeof(data_list[0]) == 'object') {
    parseListForMe(data_list[0])
  }
  if (typeof(data_list[0].length) == 'undefined' && typeof(data_list[0]) == 'object') {
    var keys = Object.keys(data_list[0]);
    objectParse(data_list[0], keys)
  }
  parseListForMe(data_list.slice(1))

}

// parseListForMe(nestedLists);
// parseListForMe(nestedListsWobjects);
// parseListForMe({a:[1,2,3],b:[1,2,6]})
// parseListForMe(sample_data_asArray);
// console.log(sample_data_asObject)
// objectParse(sample_data_asObject,Object.keys(sample_data_asObject))
parseListForMe(sample_data_asObject);



// var dummy_list = [1];
// var dummy_object = {a:1};
// console.log(typeof(dummy_list),typeof(dummy_object));
// console.log(typeof(dummy_list) == typeof(dummy_object));

// function parseJsonForMe(dataSample) {

// }

// parseJsonForMe(sample_data_asArray);
// parseJsonForMe(sample_data_asObject);


//I Want to write a recursive function
//It takes in JSON response -- this can either be a list or an object
//Gives me back ..?


// var nestedLists = [
//   ["431","buddy"],
//   "12",
//   ['907459-3730','','','Voice'],
//   [ '', 'fair_interpretation@nps.gov'],
//   ["moredata",12,["nestedList here",7334],"anotherThing"]
// ];


//
// it needs to be either a list or an element in a list?
// 
// recurFunc(next object whatever is next to *it*)
// 

// if something iterable, call function on it
// if it is not iterable then iterate through list

// if(iterable){
// recurFunc(iterable)
// } else { 
//  for(var of iterable(console.log(iterable)))
// }
