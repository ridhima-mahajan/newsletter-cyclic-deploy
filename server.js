//jshint esversion 6

const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));  //this is used to link the static files of the page

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});


app.post("/",function(request,response){
    const firstName=request.body.firstName;
    const lastName=request.body.lastName;
    const email=request.body.email;

    const data={                                                            //object created to be stored on mailchimp
        members:[                                                           //essential parameter or key of this object
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
    };

    const jsonData=JSON.stringify(data);            //a string form of representation of data to be stored in mailchimp


    //Including the API reference of Mailchimp
    const url="https://us11.api.mailchimp.com/3.0/lists/71293f25a2";
    const options={
        method:"POST",
        auth:"ridhima30:e1b15aed9fe19967074f7087a443f136-us11"
    };

    //https.request(url,[options,]callback) method is used to post to the external server.

    const req=https.request(url,options,function(resp){

        if(resp.statusCode===200){
            response.sendFile(__dirname+"/success.html");
        }
        else{
            response.sendFile(__dirname+"/failure.html");
        }

        resp.on("data",function(data){
            console.log(JSON.parse(data));
        })
    });

    req.write(jsonData);
    req.end();
})


app.post("/failure",function(req,res){
    res.redirect("/");
})





app.listen(process.env.PORT||3000,function(){
    console.log("Server is running at port "+process.env.PORT);
})

//e1b15aed9fe19967074f7087a443f136-us11   API KEY
//71293f25a2   ListId