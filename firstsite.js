var express = require('express');
var app = express();
var fortunes = require('./lib/fortune.js');
//set handlebars view engine
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');
app.set('port',process.env.PORT || 3000);
//create rounter named homepage and about-page
// app.get('',function(req,res){
// 	res.type('text/plain');
// 	res.send('Welcome to my first website');
// });

// app.get('/about',function(req,res){
// 	res.type('text/plain');
// 	res.send('hello, I am a about-page');
// });
app.use(function(req,res,next){
	res.locals.showTests = app.get('env')!== 'production' && req.query.test === '1';
	next();
});
//ROUTERS ARE BELOW
app.use(express.static(__dirname + '/public'));
app.get('',function(req,res){
	res.render('home');
});

app.get('/about',function(req,res){
	res.render('about',{
		fortune:fortunes.getFortune(),
		pageTestScript: '/qa/tests-about.js'
	});
});
//create page of 404 and 500 status,NOT ROUNTER
// app.use(function(req,res){
// 	res.type('text/plain');
// 	res.status(400);
// 	res.send('400-NOT FOUND');
// });

// app.use(function(err,req,res,next){
// 	console.error(err.stack);
// 	res.type('text/plain');
// 	res.status(500);
// 	res.send('500-ERROR SERVER');
// });
app.get('/tours/hood-river',function(req,res){
	res.render('tours/hood-river');
});
app.get('/tours/request-group-rate',function(req,res){
	res.render('tours/request-group-rate');
});

app.use(function(req,res){
	res.status(400);
	res.render('404');
});

app.use(function(err,req,res,next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});


app.listen(app.get('port'),function(){
	console.log('Express  started on http://localhost:'+app.get('port')+';press ctrl + c to terminate');

});

if (app.thing == null) console.log('bleat!');