
var graph = require('../src')

var inc = graph({
	b: function(a){
		return a + 1
	},
	c: function(b){
		return b + '!'
	}
})

console.log(inc(1))
