//Jimmy Li OCHackerTask Submission
//Imports
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Definitions
const app = express();
app.use(bodyParser.json());

//Function definitions
validateEmail = (email) => {
	const emailReg = /\S+@\S+\.\S+/;
	return emailReg.test(email);
}

//Connect to mongodb
//Configure your own mongodb server HERE
mongoose.connect('');
const mongooseCon = mongoose.connection;
mongooseCon.on('error', console.error);
mongooseCon.once('open', function(){
    console.log("Connected to mongod server");
});

//mongoDb Definitions
const userSchema = mongoose.Schema({
	email: String,
	password: String,
	birth: Date,
	country: String
});

const user = mongoose.model('user', userSchema);


//Routes
//ROUTE: Login Route
app.post('/api/login', function (req, res) {
  const body = req.body;
  if(body.hasOwnProperty('email') && body.hasOwnProperty('password')){
  	//console.log('recieved');
    if(!validateEmail(body.email))
    	return res.send('false');
    //Find a single instance of doccument
    user.findOne({ email: body.email, password: body.password }, function (err, person) {
    	if(err) return res.send('false');
    	if(!person) return res.send('false');
    	return res.send('true');
    })
  }else{
    res.send('false');
  }
})

//Route: Create Account Route
app.post('/api/createAccount', function (req, res) {
  const body = req.body;
  if(body.hasOwnProperty('email') && body.hasOwnProperty('password') && body.hasOwnProperty('birth') && body.hasOwnProperty('country')){
  	//console.log('recieved');
    if(!validateEmail(body.email))
    	res.send('failure not good email')
    //Create new doccument
    const newUser = new user({ email: body.email, password: body.password, birth: new Date(body.birth), country: body.country });
    //Save new doccument
	newUser.save(function (err, user) {
		if(err) return res.send('failure');
		res.status(200).send('success')
	})
  }else{
    res.send('failure');
  }
})

app.listen(3000, function () {
  console.log('Listening on port 3000')
})