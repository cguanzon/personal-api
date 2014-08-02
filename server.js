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

//data variables
var name = 'Tyrion Lannister';
var location = 'Essos';
var hobbies = ['reading', 'writing', 'drinking', 'girls'];
var occupations = ['Acting Hand of the King', 'Maester of the Coin', 'Fugitive', 'Second Son'];
var mentions = ['Game of Thrones', 'A Clash of Kings', 'A Storm of Swords', 'A Feast for Crows', 'A Dance with Dragons'];
var friends = ['Bronn', 'Jaime Lannister', 'Oberyn Martell', 'Varys'];
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

//functions
/*
This checks the if the :id exists in the skills collection.
- Returns the position of the skill object in the skills array 
	if the id exists.
- Sets the response status to 404 if the id does not exist
*/
var validateSkillId = function(req, res, paramId){
	var id = parseInt(req.params.id);
	for(var i = 0; i < skills.length; i++){
		var skillId = skills[i].id;
		if(skillId === parseInt(id)){
			return i;
		}
	}
	res.status(404).json(
		{
			message: 'The skill id you provided does not exist.'
		});
};

/*
Filters an array by the filterParam and the filterValue
Returns a filtered version of the array
*/
var filterBy = function(array, filterParam, filterValue){
	var filteredArray = [];
	for(var i = 0; i < array.length; i++){
		if(array[i][filterParam] === filterValue){
			filteredArray.push(array[i]);
		}
	}
	return filteredArray;
};

/*
This accepts an array and an order value. 
It will return a copy of the array in the order
that was specified
*/
var orderArray = function(array, order){
	var mutateableArray = array.slice(0);

	if(order === 'asc'){
		return mutateableArray.sort()
	}else if(order === 'desc'){
		return mutateableArray.sort().reverse();
	}else{
		return mutateableArray;
	}
};

//API methods
//GET's
app.get('/name', function(req, res){
	res.status(200).json({name: name});
});

app.get('/location', function(req, res){
	res.status(200).json({location: location});
});

app.get('/hobbies', function(req, res){
	var order = req.query.order;
	var orderedArray = orderArray(hobbies, order);
	res.status(200).json({hobbies: orderedArray});
});

app.get('/occupations', function(req, res){
	var order = req.query.order;
	var orderedArray = orderArray(occupations, order);
	res.status(200).json({occupations: orderedArray});
});

app.get('/occupations/latest', function(req, res){
	res.status(200).json({
		latestOcuupation: occupations[occupations.length-1]
	});
});

app.get('/mentions', function(req, res){
	var order = req.query.order;
	var orderedArray = orderArray(mentions, order);
	res.status(200).json({mentions: orderedArray});
});

app.get('/friends', function(req, res){
	var order = req.query.order;
	var orderedArray = orderArray(friends, order);
	res.status(200).json({friends: orderedArray});
});

app.get('/skills', function(req, res){
	var filteredArray = skills;
	if(req.query.experience){
		var filteredArray = filterBy(skills, 'experience', req.query.experience);
	}
	var order = req.query.order;
	var orderedArray = orderArray(filteredArray, order);
	res.status(200).json({skills: orderedArray});
});

app.get('/skills/:id', function(req, res){
	var skill = skills[validateSkillId(req,res, req.params.id)];
	if(skill){	
		res.status(200).json(skill);
	}
});

//POST's
app.post('/mentions', function(req, res){
	var mention = req.body.mention;
	mentions.push(mention);
	res.status(201).json(req.body);
});

app.post('/friends', function(req, res){
	var friend = req.body.friend;
	friends.push(friend);
	res.status(201).json(req.body);
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

//PUT's
/*
You cannot change the id. This is on purpose.
You can edit the name and/or experience
Pass only the key(s) that you want to change
*/
app.put('/skills/:id', function(req, res){
	var skill = skills[validateSkillId(req,res, req.params.id)];
	if(skill){	
		if(req.body.name){
			skill.name = req.body.name
		}
		if(req.body.experience){
			skill.experience = req.body.experience;
		}
		res.status(200).json(skill);
	}
});

//DELETE's
app.delete('/skills/:id', function(req, res){
	var position = validateSkillId(req,res, req.params.id);
	if(position+1){
		skills.splice(position,1);
		res.status(200).json({message: 'Successfully deleted.'});
	}
});

// app.options('/', function(req, res) {
// 	res.setHeader('Access-Control-Allow-Origin', '*');
// 	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
// 	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
// 	res.send();
// });

app.listen(8080);