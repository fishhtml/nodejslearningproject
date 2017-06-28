suite('Global Test',function(){
	test('page has a valid title',function(){
		assert(docoment.title && document.title.match(/\S/)) && doucment.title.toUpperCase()!==='TODO';
	});
});