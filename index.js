require("coffee-script");

//process.env.NODE_ENV = "production";

var nconf = require("nconf")
  , http = require("http")
  , server = require("./app")
  , domain = require("domain")
  , serverDomain = domain.create();


serverDomain.run(function(){
  http.createServer(function(req, res){
    var reqd = domain.create();
    reqd.add(req);
    reqd.add(res);
    
    // On error dispose of the domain
    reqd.on('error', function (error) {
      console.log('[ERR]', error.code, error.message, req.url);
      reqd.dispose();
    });

    // Pass the request to express
    server(req, res);
    
  }).listen(nconf.get("PORT"), function(){
    console.log("[OK] Server started");
  });
  
});

serverDomain.on("error", function (err) {
  console.log('[ERR]', "Server level error", err.stack);
});

process.on('uncaughtException', function(err) {
  console.log("[ERR] Uncaught exception: " + err);
});