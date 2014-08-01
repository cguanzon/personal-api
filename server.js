//data variables
var name = 'Caleb Guanzon';
var location = 'Salt Lake City, UT';
var hobbies = ['coding', 'ninja-warrior-training', 'running', 'javascript'];
var occupations = ['QA Engineer', 'Web Developer', 'Ninja Warrior', 'Sasuke Master'];
var mentions = ['http://cguanzon.github.io', 'https://www.linkedin.com/pub/caleb-guanzon/6a/116/405'];
var friends = ['Darth Vader', 'Tywin Lannister', 'Oberyn Martell', 'Iron Man'];
var skills = [
	{
		id: 1,
		name: 'Javascript',
		experience: 'intermediate'
	},
	{
		id: 2,
		name: 'html/css',
		experience: 'intermediate'
	},
	{
		id: 3,
		name: 'Manual Testing',
		experience: 'expert'
	},
	{
		id: 4,
		name: 'OSX Terminal',
		experience: 'expert'
	},
	{
		id: 5,
		name: 'Git',
		experience: 'intermediate'
	}				
];



//server initialization
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//middleware
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

//API methods
app.get('/name', function(req, res){
	res.status(200).json({name: name});
});

app.get('/location', function(req, res){
	res.status(200).json({location: location});
});

app.get('/hobbies', function(req, res){
	var mutateableArray = hobbies.slice(0);

	if(req.query.order === 'asc'){
		res.status(200).json({
			hobbies: mutateableArray.sort()
		});
	}else if(req.query.order === 'desc'){
		res.status(200).json({
			hobbies: mutateableArray.sort().reverse()
		});
	}else{
		res.status(200).json({
			hobbies: mutateableArray
		});
	}
});

app.get('/occupations', function(req, res){
	var mutateableArray = occupations.slice(0);

	if(req.query.order === 'asc'){
		res.status(200).json({
			occupations: mutateableArray.sort()
		});
	}else if(req.query.order === 'desc'){
		res.status(200).json({
			occupations: mutateableArray.sort().reverse()
		});
	}else{
		res.status(200).json({
			occupations: mutateableArray
		});
	}
});

app.get('/occupations/latest', function(req, res){
	res.status(200).json({
		latestOcuupation: occupations.occupations[occupations.occupations.length-1]
	});
});

app.get('/mentions', function(req, res){
	var mutateableArray = mentions.slice(0);

	if(req.query.order === 'asc'){
		res.status(200).json({
			mentions: mutateableArray.sort()
		});
	}else if(req.query.order === 'desc'){
		res.status(200).json({
			mentions: mutateableArray.sort().reverse()
		});
	}else{
		res.status(200).json({
			mentions: mutateableArray
		});
	}
});

app.post('/mentions', function(req, res){
	var mention = req.body.mention;
	mentions.push(mention);
	res.status(201).json(req.body);
});

app.get('/friends', function(req, res){
	var mutateableArray = friends.slice(0);

	if(req.query.order === 'asc'){
		res.status(200).json({
			friends: mutateableArray.sort()
		});
	}else if(req.query.order === 'desc'){
		res.status(200).json({
			friends: mutateableArray.sort().reverse()
		});
	}else{
		res.status(200).json({
			friends: mutateableArray
		});
	}
});

app.post('/friends', function(req, res){
	var friend = req.body.friend;
	friends.push(friend);
	res.status(201).json(req.body);
});

app.get('/skills', function(req, res){
	var mutateableArray = skills.slice(0);

	if(req.query.order === 'asc'){
		res.status(200).json({
			skills: mutateableArray.sort()
		});
	}else if(req.query.order === 'desc'){
		res.status(200).json({
			skills: mutateableArray.sort().reverse()
		});
	}else{
		res.status(200).json({
			skills: mutateableArray
		});
	}
});

app.get('/skills/:id', function(req, res){
	var id = req.params.id;
	for(var i = 0; i < skills.length; i++){
		var skillId = skills[i].id;
		if(skillId === parseInt(id)){
			res.status(201).json({ skill: skills[i] });
		}
	}
});

app.post('/skills', function(req, res){
	var skill = 
		{
			id: parseInt(req.body.id),
			name: req.body.name,
			experience: req.body.experience
		};
	skills.push(skill);
	res.status(201).json(skill);
});

//You cannot change the id. This is on purpose
app.put('/skills/:id', function(req, res){
	var id = req.params.id;
	for(var i = 0; i < skills.length; i++){
		var skill = skills[i];
		var skillId = skills[i].id;
		if(skillId === parseInt(id)){
			if(req.body.name){
				skill.name = req.body.name
			}
			if(req.body.experience){
				skill.experience = req.body.experience;
			}
			res.status(200).json({skill: skills[i]});
		}
	}
});

// app.options('/', function(req, res) {
// 	res.setHeader('Access-Control-Allow-Origin', '*');
// 	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
// 	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
// 	res.send();
// });

app.listen(8080);