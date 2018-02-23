var cluster = require('cluster');

function startWorker() {
	var worker = cluster.fork();
	console.log('cluster: worker %d started', worker.id);
}

if (cluster.isMaster) {
	require('os').cpus().forEach(function() {
		startWorker();
	});
	cluster.on('disconnect', function(worker) {
		console.log('cluster: worker $d disconnected from the cluster.')
	});
	cluster.on('exit', function(worker, code, signal){
		console.log('cluster: worker %d died with exit code %d (%s)', worker.id, code, signal);
		startWorker();
	});
} else {
	require('./firstsite.js')();
}

function loadDatebase() {
	let count = 0;
	console.log(count);
	if (count) {
		return false;
	}else{
		require('./public/datebase/leancloud.js');
		count = 1;
	}
}
loadDatebase();