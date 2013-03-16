
var toposort = require('toposort')

/**
 * graph
 *
 * @param {Object} graph
 * @return {Function}
 */

module.exports = function(graph){
	var deps = toposort(makeEdges(graph))
	return compile(graph, deps)
}

function compile(graph, deps){
	var i = deps.length
	var src = ''
	var input = []
	var last = ''
	while (i--) {
		var dep = deps[i]
		if (dep in graph) {
			var params = graph[dep].toString().match(/\((.*)\)/)[1]
			src += '  var '+dep+' = $'+dep+'('+params+')\n'
			last = dep
		} else {
			input.push(dep)
		}
	}
	src += '  return '+last+'\n'
	src = 'function('+input.join()+'){\n'+src+'}'
	return eval(vars(graph) + '('+src+')')
}

function vars(graph){
	var src = ''
	for (var p in graph) {
		src += 'var $'+p+' = graph["'+p+'"];\n'
	}
	return src
}

function makeEdges(graph){
	var edges = []
	for (var p in graph) {
		params(graph[p]).forEach(function(dep){
			edges.push([p, dep])
		})
	}
	return edges
}

function params(fn){
	return fn.toString()
		.match(/\((.*)\)/)[1]
		.split(/ *, */)
}
