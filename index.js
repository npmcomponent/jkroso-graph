
var toposort = require('marcelklehr-toposort')

/**
 * graph
 *
 * @param {Object} graph
 * @return {Function}
 */

module.exports = function(graph){
	var deps = toposort(makeEdges(graph))
	return compile(graph, deps.reverse())
}

/**
 * compile to a function that computes each value of 
 * the graph in the order specified by toposort
 * 
 * @param {Object} graph
 * @param {Array} deps
 * @return {Function}
 */

function compile(graph, deps){
	var src = ''
	var input = []
	var last = ''
	deps.forEach(function(dep){
		if (dep in graph) {
			var fn = graph[dep].toString()
			var params = fn.match(/\((.*)\)/)[1]
			if (usesThis(fn)) {
				src += '  var '+dep+' = $'+dep+'.call(this'
				if ((/\w/).test(params)) {
					src += ',' + params
				}
				src += ')\n'
			} else {
				src += '  var '+dep+' = $'+dep+'('+params+')\n'
			}
			last = dep
		} else {
			input.unshift(dep)
		}
	})
	src += '  return '+last+'\n'
	src = 'function('+input.join()+'){\n'+src+'}'
	return eval(vars(graph) + '('+src+')')
}

function usesThis(fn){
	return (/\bthis\b/).test(fn)
}

/**
 * make graph keys accessable as variables
 * 
 * @param {Object} graph
 * @return {String}
 */

function vars(graph){
	var src = ''
	for (var p in graph) {
		src += 'var $'+p+' = graph["'+p+'"];\n'
	}
	return src
}

/**
 * generate edges that toposort understands
 * 
 * @param {Object} graph
 * @return {Array}
 */

function makeEdges(graph){
	var edges = []
	for (var p in graph) {
		params(graph[p]).forEach(function(dep){
			edges.push([p, dep])
		})
	}
	return edges
}

/**
 * extract a functions parameter list
 * 
 * @param {Function} fn
 * @return {Array}
 */

function params(fn){
	return fn.toString()
		.match(/\((.*)\)/)[1]
		.split(/ *, */)
}
