const fs = require('fs'),
  readline = require('readline');


function lineProcessor(line, pattern, packet) {
  //   console.log(line);
  var line_list = line.split(pattern);
  var data_field = line_list[0].trim();
  var data_value = line_list[1];

  if (line_list[1]) {
    data_value = line_list[1].trim();
  }

  if (data_field == 'latLong') {
    var lat = 0;
    var long = 0;
    if (data_value) {
      lat = line_list[2].match(/\d+.?\d+/g)[0];
      long = line_list[3];
    }
    packet['latitude'] = lat;
    packet['longitude'] = long;
  } else {
    packet[data_field] = data_value;

  }
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
  rd.on('line', function (line) {
    packet = lineProcessor(line, ':', packet);
    if (Object.keys(packet).length == 5) {
      // console.log(packet);
      data_in_structureList.push(packet);
      packet = {};
    }
    counter += 1;
  });

  return data_in_structureList;
}

function generateNewFile(file_type) {
  var file_name;
  if (file_type == 'kml') {
    file_name = 'AAKmlFile.kml';
    fs.appendFile(file_name,
      "<?xml version='1.0' encoding='UTF-8'?> \n \
      <kml xmlns='http://www.opengis.net/kml/2.2'> \n",
      function (err) {
        if (err) throw err;
      })
  }
  return file_name;
}


function addToKML(lat, long, place_name, designation, state) {
  fs.appendFile("AAKmlFile.kml",
    `<Placemark>
      <name>${place_name}</name>
      <description>${designation}</description>
      <Point>
       <coordinates>${long},${lat},0</coordinates>
      </Point>
    </Placemark> \n`,
    function (err) {
      if (err) throw err;
    });

}



var parsed_park_info = readFileByLine('ParkSitesLocation.txt');
setTimeout(function () {
  generateNewFile('kml')
  console.log(parsed_park_info.length);
  var designation_list = ["National Park", "National Parks", "National Park & Preserve"];
    for (var park_object of parsed_park_info) {
      if(designation_list.includes(park_object['designation'])){
        //   console.log(park_object);
          addToKML(park_object['latitude'],park_object['longitude'],park_object['fullName'],park_object['designation'],park_object['state']);
      }
    }

}, 3000)


// generateNewFile('kml')
