var fetch = require('isomorphic-fetch'); // or another library of choice.
var Dropbox = require('dropbox').Dropbox;
const fs = require('fs'),
  readline = require('readline');
var dbx = new Dropbox({
  accessToken: 'OnfprWveGqkAAAAAAACtgQ1-dd_vyECwE5_BC8ZwJM488SBou-z3cdXCoIhxf7kH',
  fetch: fetch
});

function createObjectDictionary(callback) {
  object_dict = {};
  url_list = [];
  dbx.filesListFolder({
      path: '/files'
    })
    .then(function (response) {
      var counter = 0;
      for (var res of Object.keys(response.entries)) {

        counter += 1;
        // console.log("Iteration: ",counter)
        // if(counter > 400){
        //   return;
        // }
        var file_path = response.entries[res].path_display;
        url_list.push(file_path);
        // fs.appendFile("url_list.txt", file_path + "\n", function (err) {
        //   if (err) throw err;
        // })

        // var locator_path = file_path.slice(7);
        // console.log("PATHS WE GOT: ", file_path)

        // dbx.sharingCreateSharedLink({
        //     path: file_path
        //   })
        //   .then(function (response) {
        //     // console.log(response)
        //     // console.log("There was a response")
        //     var num = response.path.match(/\d*/g);
        //     fs.appendFile("responseFile.txt",num + "\n", function(err){
        //       if(err) throw err;
        //     })
        //     // object_data[file_path.slice(7)] = response;
        //   })
        //   .catch(function (error) {
        //     console.log(error);
        //     fs.appendFile("errorText.txt", '\n' + file_path + error + '\n', function(err){
        //       if(err) throw err;
        //     })
        //   })
      }
      // console.log(url_list);

      return url_list;
    })
    .catch(function (error) {
      console.log(error);
    });
  return url_list;
}

function ArtificialSkyBrightnessWrapper(file_path) {
  dbx.sharingCreateSharedLink({
      path: 'file_path'
    })
    .then(function (response) {
      console.log("WE ARE HERE: ", response);
      // object_dict[locator_path] = response.url;
      console.log("URL WE GOT BACK: ", response.url);

    })
    .catch(function (error) {
      console.log(file_path, error);
    })
}

function myReadFile(path) {
  fs.readFile(path, (err, data) => {
    if (err) throw err;
    console.log(data.toString());
  })
}




function readSomethingElse() {
  url_list = [];
  var rd = readline.createInterface({
    input: fs.createReadStream("url_list.txt"),
    console: false
  });
  counter = 0
  // setInterval(function () {
  rd.on('line', function (line) {
    // console.log()
    url_list.push(line);

    counter += 1;
  });
  // }, 3000)
  return url_list;
}




function main() {
  url_list = readSomethingElse();
  setTimeout(function () {
    "Done Waiting"
    // console.log(url_list.slice(0,100))
    var my_url_slice = url_list;

    for (file_slice of my_url_slice) {
      // console.log(file_slice, " Line 143");

      try{

      dbx.sharingCreateSharedLink({
          path: file_slice
        })
        .then(function (response) {
          // console.log("WE ARE HERE: ", response);
          // // object_dict[locator_path] = response.url;

          console.log("URL WE GOT BACK: ", response.url);
          // firstURLPATH[file_name.slice(1)] = response.url;

          fs.appendFile("working_urls.txt", response.url + "\n", function (err) {
            if (err) throw err;
          })
        })
        .catch(function (error) {
          console.log(error);
        })
      }
      catch{
        console.log("WE tried and no bueno")
        fs.appendFile("error_urls.txt", "Had a problem with: "+ response.url + "\n", function (err) {
          if (err) throw err;
        })
      }
    }

  }, 5000)

  //   var main_object_dict = createObjectDictionary();
  //   firstURLPATH = {};
  //   setTimeout(function(){
  //     console.log("WAITED 5 seconds")
  //     // console.log(main_object_dict);
  //     four_to_five = main_object_dict.slice(0,100);
  //     for(var file_name of four_to_five){
  //       // console.log(file_name)



  //     } //End of for loop

  //     // console.log(four_to_five)
  //   },3000)
  //  console.log("THING WE GOT BACK: ", firstURLPATH)


}




// ArtificialSkyBrightnessWrapper("files/ArtificialSkyBrightness482.JPG");


function processNumbersForMe() {
  url_list = [];
  var rd = readline.createInterface({
    input: fs.createReadStream("actual_url_list.txt"),
    console: false
  });
  counter = 0
  // setInterval(function () {
  rd.on('line', function (line) {
    // console.log(line);
    // console.log(line.match(/s\d+/g))
    console.log(line)
    var imageNum = line.match(/Brightness\d+/g)
    console.log(imageNum)
    var imageCleanedNum = imageNum[0].slice(10)
    console.log(imageCleanedNum)
    url_list.push(imageCleanedNum);

    counter += 1;
  });
  // }, 3000)
  setTimeout(function(){
    console.log("waited for it to load")
    console.log(url_list)
    for(var col_num of url_list){
      console.log(col_num)
    }
  },3000)
  // console.log(url_list);
  // return url_list;
}

// console.log();

// main();
// processNumbersForMe();

function readByLineandWriteToFile(file_to_read, file_string_locator, new_file, object_dict) {
  var rd = readline.createInterface({
    input: fs.createReadStream(file_to_read),
    // output: process.stdout,
    console: false
  });
  counter = 0
  rd.on('line', function (line) {

    if (line.includes(file_string_locator)) {
      //   console.log(line.match(/ArtificialSkyBrightness[0-9]+/g))
      var image_sky_url_objectKey = line.match(/ArtificialSkyBrightness[0-9]+.JPG/g);
      // console.log("The Key: ",image_sky_url_objectKey[0])
      var image_url = object_dict[image_sky_url_objectKey[0]];
      // console.log("The Value: ", image_url);
      var new_href = `<href>${image_url}</href>`;
      console.log(new_href);
      fs.appendFile(new_file, new_href + "\n", function (err) {
        if (err) throw err;
      })
    } else {
      //write the line to the file
      console.log(line)
      fs.appendFile(new_file, line + "\n", function (err) {
        if (err) throw err;
      })
    }
    counter += 1;
  });
}

function createUrlDict(file_to_read){
  url_dict = {};
  var rd = readline.createInterface({
    input: fs.createReadStream(file_to_read),
    console: false
  });

  rd.on('line', function (line) {
    // console.log(line);
    line = line.slice(0,line.length - 1) + "1";
    // console.log(line);
    var relevant_portion = line.match(/ArtificialSkyBrightness\d+.JPG/g);
    // console.log(relevant_portion);
    // relevant_portion = relevant_portion;
    // console.log(relevant_portion);
    url_dict[relevant_portion] = line;
  });
  return url_dict
}

function new_main(){
 


  linkUrlDict = createUrlDict("actual_url_list.txt");
  setTimeout(function(){
    // console.log(linkUrlDict)
    readByLineandWriteToFile("src/assets/doc.kml","files/ArtificialSkyBrightness","test3.kml",linkUrlDict)
  },1500)
  
}

new_main();