var APP_ID = 'oCYDf5kS3bh0N7FPKxvMBmio-gzGzoHsz';
var APP_KEY = 'gFKpg4gQKnuTE3cjSnIoLFte';
var AV = require('leancloud-storage');
var pushNum = 0;
if(pushNum) return false;
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});


var TestObject = AV.Object.extend('TestObject');
var testObject = new TestObject();
testObject.save({
  words: 'Hello World!',
  test: 'yes',
  show: 'ok'
}).then(function(object) {
  console.log('LeanCloud Rocks!');
  pushNum = 1;
});
