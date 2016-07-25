var fs = require('fs');

var path = require('path');


var filepath = path.join(__dirname,'/testfile.txt');
console.log('dirname is '+ filepath);

//fs.writeFileSync(filepath, "Hello Himanshu");

fs.open(filepath,'a+',function(err,fd) {
    fs.write(fd,"Hello Himanshu test1" , false, function() {
        console.log('writing omlee')
    })
})