var sf = require('./../lib/salesforce');

config = {
    "loginUrl": "https://login.salesforce.com",
    "user": "hackthisfastagain@gmail.com",
    "password": "hackerschoice16@9MgJDhUJVGBJcQ8fVRLzvsdK3"
}

sf.init(config,function(res){
    console.log('inside..');
    sf.getSObejctTypes(function(res) {
        console.log(res);
        fetchAttributes(sf, 'Account')
    },function(err) {
        console.log(err)
    })
})

function fetchAttributes(sf,object) {
    console.log('inside..');
    sf.getSObjectAttribs(object,function(res){
        console.log(res);
    },function(err){
        console.log(err)
    })

}


