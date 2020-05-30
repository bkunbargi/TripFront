// // <?xml version="1.0" encoding="UTF-8"?>
// // <kml xmlns="http://www.opengis.net/kml/2.2">
// //   <Placemark>
// //     <name>Simple placemark</name>
// //     <description>Attached to the ground. Intelligently places itself 
// //        at the height of the underlying terrain.</description>
// //     <Point>
// //       <coordinates>-122.0822035425683,37.42228990140251,0</coordinates>
// //     </Point>
// //   </Placemark>
// // </kml>


const https = require('https');
const fs = require('fs'),
  readline = require('readline');
  
const {
  mainModule
} = require('process');

function objectParse(object, keys) {
  var word_list = ['latLong','fullName','states','designation'];
  if (keys.length == 0) {
    return;
  }
  if (typeof(keys[0]) != 'object' && typeof(object[keys[0]]) != 'object'){
    if(word_list.includes(keys[0])){
    console.log(keys[0],':',object[keys[0]]);
    }
    // fs.appendFile('allparkinfo2.txt', keys[0] + ":" + object[keys[0]]+ '\n',function(err){
    //   if(err) throw err;
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
    // fs.appendFile('allparkinfo2.txt',data_list[0] + '\n',function(err){
    //   if(err) throw err;
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

// var state_list = ["MT", "NC", "ND", "NE", "NH", "NJ", "NM",
//   "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"
// ]

var orig_state_list = ["AK", "AL", "AR", "AZ", 'CA', "CO", "CT", "DE", "FL", "GA", "HI", "IA", "ID", "IL",
  "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM",
  "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"
]

var counter = 0;

//Defaults to all keys unless keys are specified?
function build_park_info(data_list) {
  for (dataPiece of data_list) {
    // console.log("State: ", dataPiece)
    var state_park_data = `https://developer.nps.gov/api/v1/parks?parkCode=&stateCode=${dataPiece}&limit=50&api_key=mKxNeBMn7gUywThvzfFc8ppeychugkbUQ9ce060S`
    counter += 1;
    // if (counter >= 2) { return; }
    https.get(state_park_data, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        try{
        var park_info = JSON.parse(data);
        parseListForMe(park_info);
        }
        catch{
          console.log("THIS STATE DID NOT WORK",dataPiece);
        }
        // fs.appendFile("allparkinfo.txt","****************************" + "\n", function(err){
        //   if(err) throw err;
        // });
      });
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    })
  }
}

// var park_info = build_park_info(orig_state_list);
run_counter = 0;
setInterval(function(){
  //run this function with different parts of the list at a time,
  if(run_counter>=50){
    console.log("It's safe to exit");
    return;
  }
  
  build_park_info(orig_state_list.slice(run_counter,run_counter + 1));
  run_counter += 1;
},10000)

// Purpose: To generate a new file, currently only set to KML. 
// function generateNewFile(file_type) {
//   var file_name;
//   if (file_type == 'kml') {
//     file_name = 'newKmlFile.kml';
//     fs.appendFile(file_name,
//       "<?xml version='1.0' encoding='UTF-8'?> \n \
//     <kml xmlns='http://www.opengis.net/kml/2.2'> \n",
//       function (err) {
//         if (err) throw err;
//       })
//   }
//   return file_name;
// }



// Purpose: To read and parse a file
// function readFileByLine(file_to_read) {
//   url_list = [];
//   var rd = readline.createInterface({
//     input: fs.createReadStream(file_to_read),
//     console: false
//   });
//   counter = 0
//   // setInterval(function () {
//   rd.on('line', function (line) {
//     // console.log()
//     url_list.push(line);

//     counter += 1;
//   });
//   // }, 3000)
//   return url_list;
// }

// //How to generalize this?
// function lineProcess(line) {
//   // if(line.match(/\w+/g))
//   var parsed_line = line.split(" ");
//   if (parsed_line[0].match(/\*/g) || parsed_line[0] == " ") {
//     return;
//   }
//   if (parsed_line.length >= 3 && parsed_line[0] != "") {
//     var lat = parsed_line[0].match(/[-]?\d.+/g);
//     var long = parsed_line[1].match(/[-]?\d.+/g);
//     var place_name = "";
//     for (textInfo of parsed_line.slice(2)) {
//       place_name += textInfo + " ";
//     }
//     addToKML(lat[0].slice(0,lat[0].length-1), long[0], place_name);
//     return [lat[0], long[0], place_name];

//   } else {
//     for (textInfo of parsed_line) {
//       place_name += textInfo + " ";
//     }
//     updateToFile(place_name, "cleanUp.txt");
//     return place_name;
//   }
// }



// function updateToFile(line, file) {
//   fs.appendFile(file,
//     line,
//     function (err) {
//       if (err) throw err;
//     });
// }

// function main() {
//   var file_name = generateNewFile('kml');
//   file_read = readFileByLine("siteInfo.txt");
//   // console.log(file_name);
//   setTimeout(function () {
//     for (line of file_read) {
//       console.log(lineProcess(line));
//       // lineProcess(line)

//       // writeToFile(parsed_line[0],parsed_line.place_long,parsed_line.place_name)
//     }

//   }, 1000)

// }

// main();
