
var should = require('chai').should()
  , graph = require('../src')

describe('graph', function () {
	it('should compile a graph with no input', function () {
		var inc = graph({
			a: function(b){
				return b + 1
			},
			b: function(){
				return 1
			}
		})
		inc().should.equal(2)
	})

	it('should compile a graph with one input', function () {
		var inc = graph({
			b: function(a){
				return a + 1
			},
			c: function(b){
				return b + '!'
			}
		})
		inc(1).should.equal('2!')
	})

	describe('with multiple input args', function () {
		it('should work', function () {
			var add = graph({
				c: function(a,b){
					return a + b
				}
			})
			add(1,2).should.equal(3)
		})
	})
})