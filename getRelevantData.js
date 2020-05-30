const fs = require('fs'),
  readline = require('readline');


function lineProcessor(line, pattern, packet) {
  var words_to_pickup = ['designation', 'latLong', 'name', 'states'];
  var line_list = line.split(pattern);
//   console.log(line_list,line_list[0],line_list[1]);
  if(line_list[0] && line_list[1]){
  var data_field = line_list[0].trim();
  var data_value = line_list[1].trim();
  }

  if (words_to_pickup.includes(data_field)) {
    //   console.log(data_field,data_value)
    if (data_field == 'latLong' && data_value) {
      var lat = line_list[2].match(/\d+.?\d+/g)[0];
      var long = line_list[3];
      packet['latitude'] = lat;
      packet['longitude'] = long;
    }
    if (data_value && data_field != 'latLong') {
        //   console.log(data_field,data_value);

        packet[data_field] = data_value;
      
    }
    // if(line_list[0] == 'designation'){
    //     console.log(line_list[1])
    // } 
  }
//   console.log(packet)
  return packet;
}



//Purpose: To read a file a return a useful datastructure
function readFileByLine(file_to_read) {
  var packet = {};
  var data_in_structureList = [];
  var rd = readline.createInterface({
    input: fs.createReadStream(file_to_read),
    console: false
  });
  counter = 0
  var seen_list = [];
  rd.on('line', function (line) {
    packet = lineProcessor(line, ':', packet);

    // if (Object.keys(packet).length >= 3 && packet['designation'] == 'National Park'){
    //     if(!seen_list.includes(packet['fullName'])){
    //         // console.log(packet['fullName']);
    //         seen_list.push(packet['fullName']);
    //         console.log("HERE",packet)
    //     }
    //     // console.log(packet)
    // }

    if (Object.keys(packet).length == 5) {
        // console.log(packet);
      data_in_structureList.push(packet);
      packet = {};
    }
    counter += 1;
  });
  
  return data_in_structureList;
}

//In the above function there are ~10 national parks not being added? 

var parsed_park_info = readFileByLine('allparkinfo4beta.txt');
setTimeout(function () {
  console.log(parsed_park_info.length)
  var designation_list = ["National Park", "National Parks", "National Park & Preserve"];
  for (var park_object of parsed_park_info) {
    // console.log(Object.keys(park_object).length);
    console.log(park_object);
    // if (designation_list.includes(park_object['designation'])) {
    // //   console.log("We want this guy");
    // //   console.log(park_object['designation'])
    // }
  }
  //Go through file and write it to a KML file.
}, 10000)

// 
// console.log(parsed_park_info) ---> 
//          [{designation: ...., latLong: {lat,long}, state: ..., fullName: ...},
//          [{designation: ...., latLong: {lat,long}, state: ..., fullName: ...},]
