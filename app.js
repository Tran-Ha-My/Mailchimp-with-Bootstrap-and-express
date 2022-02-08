const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true }));


app.get("/", function(req, res){
    res.sendFile(__dirname + '/signup.html');

    // res.status(200).sendFile(__dirname + '/success.html');
    // res.status(404).sendFile(__dirname + '/failure.html');
    // res.status(405).sendFile(__dirname + '/failure.html');

});


app.post('/', function(req, res){

    const firstName = req.body.firstName;    //the body. itself is a bodyParser
    const lastName = req.body.lastName;
    const email = req.body.email;
    
    const data = {
    
        members: [
        {
        email_address: email,
        status:  "subscribed",
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName
        }                        //what's a merge feild?See https://mailchimp.com/developer/marketing/docs/merge-fields/#structure

            }
        ]
    }
    var jsonData = JSON.stringify(data);

    //post data to the external resource => https.request
    const url=  "https://us14.api.mailchimp.com/3.0/lists/6459543a3a" //url from main mailchimp endpoint
    const options = {
        method: "POST",
        auth: "anyString:b692ffaad0b1b70d4d48fc66cd4a82c2-us14"  // authenticate using your API key
    }


        /*======POST THE DATA TO THE EXTERNAL RESOURCE: Save "data" in a const, make a const 'request', then call it as a callback function https.request(), pass
             in a parameter 'jsonData' inside the placeHolder "data" we wrote in https.request() and it onto the server using request.write() with request being the function wrapped in a var 'request' ========*/

    const request = https.request(url, options, function(response){
       
        if (response.statusCode === 200){
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});


app.post('/failure', function(req, res){
    res.redirect('/');
})
app.listen(3000, function(){
    console.log("server running on port 3000");
});


// API key
// b692ffaad0b1b70d4d48fc66cd4a82c2-us14

// audience/list id
// 6459543a3a