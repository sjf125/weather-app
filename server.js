'use strict';
const express = require('express');
const app = express(); //init Express
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const request = require('request');

const User = require('./models/user.js');
const dburl = 'mongodb://sean:klaviyo@ds151163.mlab.com:51163/weather-app';

mongoose.connect(dburl, function(err){
  if(err) {
    console.log("Error connecting to database: " + err);
  } else {
    console.log("Connected to database");
  }
});

//init bodyParser to extract properties from POST data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//init Express Router
const router = express.Router();
// const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

// POST
app.post('/users', (req, res) => {
  let newUser = new User(req.body);
  let weather = {};

  let loc = req.body.location;

  newUser.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      console.log('User saved to database');
      getWeatherData(loc);    
    }
    res.redirect('/');
  });
})

const getWeatherData = function(loc) {
  request('http://api.wunderground.com/api/2ab605b8e9fefeb2/conditions/q/' + loc + '.json',
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let cityWeather = JSON.parse(body).current_observation;
        weather.condition = cityWeather.weather;
        weather.temp = cityWeather.temp_f;
        weather.icon = cityWeather.icon;
      }
      console.log(weather);
    })
}


// //default/test route
// router.get('/', function(req, res) {
//   res.json({ message: 'App is running!' });
// });
// router.route('/users/:user_id')
//   // retrieve user: GET http://localhost:8080/api/bears/:bear_id)
//   .get(function(req, res) {
//     User.findById(req.params.user_id, function(err, user) {
//       if (err)
//         res.send(err);
//       res.json(user);
//     });
//   })
//   // update user: PUT http://localhost:8080/api/users/{id}
//   .put(function(req, res) {
//     User.findById(req.params.user_id, function(err, user) {
//       if (err) {
//         res.send(err);
//       }
//       else {
//         user.firstName = req.body.firstname;
//         user.lastName = req.body.lastname;
//         user.save(function(err) {
//           if (err)
//             res.send(err);
//           res.json({ message: 'User updated!' });
//         })
//       }
//     });
//   })
//   //delete a user
//   .delete(function(req, res) {
//     User.remove({
//      _id: req.params.user_id
//    }, function(err, user) {
//       if (err)
//         res.send(err);
//       res.json({ message: 'Successfully deleted user' });
//     });
//   });
// router.route('/users')
//   // create user: POST http://localhost:8080/api/users
//   .post(function(req, res) {
//     var user = new User();
//     user.firstName = req.body.firstname;
//     user.lastName = req.body.lastname;
//     user.save(function(err) {
//       if (err)
//         res.send(err);
//       res.json({ message: 'User created!' });
//     });
//   })
//   //GET all users: http://localhost:8080/api/users
//   .get(function(req, res) {
//     User.find(function(err, users) {
//       if (err)
//         res.send(err);
//       res.json(users);
//     });
//   });
// //associate router to url path
// app.use('/api', router);
//start the Express server
app.listen(3000, function() {
  console.log('listening on 3000')
});
