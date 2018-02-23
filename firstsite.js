var express = require('express');
var app = express();//初始化express应用
// 日志处理中间件，必须在前面写出，写在app最后面无效果
switch(app.get('env')) {
	case 'development':
	app.use(require('morgan')('tiny'));
	break;
	case 'production':
	app.use(require('express-logger')({
		path: __dirname + '/log/request.log'
	}));
	break;
}
var fortunes = require('./lib/fortune.js');
//function() {}set handlebars view engine
var handlebars = require('express3-handlebars')
				.create({
					defaultLayout:'main',
					helpers:{
						section:function(name,options){
							if (!this._sections) this._sections = {};
							this._sections[name] = options.fn(this);
							return null;
						}
					}
				});
var formidable = require('formidable');//用于文件上传的中间件
var jqueryload = require('jquery-file-upload-middleware');
var bodyParser = require('body-parser');//处理请求的中间件，是的res.body可用，本项目用来演示表单，ＭＩＭＥ格式为application/x-wwwform-urlencoded
	//参见第3１行，使用方法
var credentials = require('./credentials.js');
var cookieParser = require('cookie-parser');
var session = require('express-session');
//用于显示是那个服务器接收到了请求。一定注意里面的next(),不然服务器会被挂起。
app.use(function(req, res, next) {
	var cluster = require('cluster');
	if(cluster.isWorker) console.log('worker %d received request', cluster.worker.id);
	next();
});
app.use(cookieParser(credentials.cookieSecret));
app.use(session({
	resave : false,
	saveUninitialized: false,
	secret: credentials.cookieSecret,
}));
app.use(express.static(__dirname + '/public'));
app.use('/upload',function(req,res,next){
	var now = new Date();
	jqueryload.fileHandler({
		uploadDir:function(){
			return __dirname + '/public/upload/' + now;
		},
		uploadUrl:function(){
			return '/upload/' + now;
		}
	})(req,res,next);
});
app.use(bodyParser.urlencoded({extended: false}));
app.engine('handlebars',handlebars.engine);//把html引擎设置为默认膜拜引擎
app.set('view engine','handlebars');//设置模板引擎的后缀为　.handlebars
app.set('port',process.env.PORT || 3000);//设置环境变量，如果前者没有，后者后被设置
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

function getWeatherData(){
	return {
		locations:[
			{
				name: 'Portland',
				forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
				weather: 'Overcast',
				temp: '54.1 F (12.3 C)',
			},{
				name: 'Bend',
				forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
				weather: 'Partly Cloudy',
				temp: '55.0 F (12.8 C)',	
			},
			{
				name: 'Manzanita',
				forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
				weather: 'Light Rain',
				temp: '55.0 F (12.8 C)',
			},
		],
	};
}


app.use(function(req,res,next){
	if(!res.locals.partials) res.locals.partials = {};
	res.locals.partials.weather = getWeatherData();
	next();
});

//ROUTERS ARE BELOW
app.use(express.static(__dirname + '/public'));
// app.use(function(req, res, next) {
// 	var domain = require('domain');
// 	domain('on', function(err) {
// 		console.log('DOMAIN ERROR CAUGHT\n', err.stack)
// 		try {
// 			setTimeout(function() {
// 				console.error('Failsafe shutdown.');
// 				process.exit(1);
// 			}, 5000);

// 			var worker = require('cluster').worker;
// 			if (worker) worker.disconnect();

// 			server.close();

// 			try　{
// 				next(err);	
// 			} catch(err) {
// 				console.error('Express error mechanism failed.\n', err.stack);
// 				res.statusCode = 500;
// 				res.setHeader('content-type', 'text/plain');
// 				res.sen('Server error');
// 			}
// 		} catch(err) {
// 			console.error('Unable to send 500 response.\n', err.stack);
// 		};
// 	});

// 	domain.add(req);
// 	domain.add(res);

// 	domain.run(next);

// 	var 
app.get('/',function(req,res){
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
app.get('/jquerytest',function(req,res){
	res.render('jquerytest');
});
app.get('/nursery-rhyme',function(req,res){
	res.render('nursery-rhyme');
});
app.get('/data/nursery-rhyme',function(req,res){
	res.json({
		animal: 'squirrel',
		bodyPart: 'tail',
		adjective: 'bushy',
		noun: 'heck',
	});
});

function NewsletterSignup () {
	//这里可能是把post进来的数据保存起来的操作
}
NewsletterSignup.prototype.save = function (cb) {
	cb();
};
var VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
app.post('/newsletter', function(req, res){
	var name = req.body.name || '', email = req.body.email || '';
	if(!email.match(VALID_EMAIL_REGEX)) {
		if(req.xhr) return res.json({error: 'Invalid name email address.'});
		req.session.flash = {
			type: 'danger',
			intro: 'Validation error!',
			message: 'The email address you entered was not valid.',
		};
		return res.redirect(303, 'newsletter/archive');
	}
	new NewsletterSignup({name: name, email: email}).save(function(err) {
		if (err) {
			if(req.xhr) return res.json({error: 'Database error.'});
			req.session.flash = {
				type: 'danger',
				intro: 'Database error',
				message: 'There was a database error; please try again later.',
			};
			return res.redirect(303, '/newsletter/archive');
		}
		if (req.xhr) return res.json({success: true});
		req.session.flash = {
			type: 'success',
			intro: 'Thank-you',
			message: 'You have now been signed up for the newsletter.'
		};
		return res.redirect(303, 'newsletter/archive');
	});
});
//res.locals是全局对象，无论在哪里都能够访问
//res.locals.flash = req.session.flash;实际上是把render时的上下文传递给全局变量，
//这样渲染的时候不需要传入上下文
app.use(function (req, res, next) {
	res.locals.flash = req.session.flash;
	delete req.session.flash;
	next();
})
app.get('/newsletter/archive', function(req, res) {
	res.render('newsletter/archive');
})
app.get('/newsletter',function(req,res){
	res.render('newsletter',{csrf:'CSRF token goes here'});
});
// app.post('/process', function(req, res){
// 	console.log('Form(from  querystring): ' + req.query.form);
// 	console.log(req.body);
// 	console.log('CSRF token (from hidden form field): ' + req.boby._csrf);
// 	console.log('Name (from visible form field): ' + req.body.name);
// 	console.log('Email (from visible form field): ' + req.body.email);
// 	res.redirect(303, '/thank-you');
// });
app.post('/process',function(req,res){
	if(req.xhr || req.accepts('json,html')==='json'){
		res.send({success:true});
	}else{
		res.redirect(303,'/thank-you');
	}
});
app.get('/contest/vacation-photo',function(req,res){
	var now = new Date();
    res.render('contest/vacation-photo', { year: now.getFullYear(), month: now.getMonth() });
});
app.post('/contest/vacation-photo/:year/:month',function(req,res){
	var form = new formidable.IncomingForm();
	form.parse(req,function(err,fields,files){//其中fields是表单常规数据；files传入的是文件信息
		if(err) return res.redirect(303,'/error');
		console.log('received fields:');
		console.log(fields);
		//fields 打印的内容如下：
		// {
		//  _csrf: 'just a test',
		//   name: 'looyulong',
		//   email: 'looyulong@126.com' 
		// }
		console.log('received files:');
		console.log(files);
		//files 打印如下内容：
		// { photo: 
		//    File {
		//      domain: null,
		//      _events: {},
		//      _eventsCount: 0,
		//      _maxListeners: undefined,
		//      size: 113637,
		//      path: '/tmp/upload_d4831cd59a954d6373105ffe3aa958bb',
		//      name: '1653953489.jpg',
		//      type: 'image/jpeg',
		//      hash: null,
		//      lastModifiedDate: 2018-02-16T05:27:25.177Z,
		//      _writeStream: 
		//       WriteStream {
		//         _writableState: [Object],
		//         writable: false,
		//         domain: null,
		//         _events: {},
		//         _eventsCount: 0,
		//         _maxListeners: undefined,
		//         path: '/tmp/upload_d4831cd59a954d6373105ffe3aa958bb',
		//         fd: null,
		//         flags: 'w',
		//         mode: 438,
		//         start: undefined,
		//         autoClose: true,
		//         pos: undefined,
		//         bytesWritten: 113637,
		//         closed: true 
		//     　　} 
		//     } 
		// }
		res.send('thank-you');
	});
});

app.get('/headers',function(req,res){
	res.set('Content-Type','text/plain');
	var s = '';
	for(var name in req.headers) s += name + ':' + req.headers[name] + '\n';
		res.send(s);
});
app.get('/epic-fail', function(req, res){
	process.nextTick(function() {
		throw new Error('kaboom');
	});
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

// app.listen(app.get('port'), function(){
//   console.log( 'Express started on http://localhost:' + 
//     app.get('port') + '; press Ctrl-C to terminate.' );
// });

// app.use(function(req,res,next){
// 	if(!res.locals.partials) res.locals.partials = {};
// 	res.locals.partials.weather = getWeatherData();
// 	next();
// });
function startServer() {
	app.listen(app.get('port'),function(){
		console.log('Express  started in ' + app.get('env') + ' mode on http://localhost:'+ app.get('port') +';press ctrl + c to terminate');
	});
}

if (require.main === module) {
	startServer();
} else {
	module.exports = startServer;
}
