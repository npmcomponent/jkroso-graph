
var toposort = require('toposort')

/**
 * graph
 *
 * @param {Object} graph
 * @return {Function}
 */

module.exports = function(graph){
	var deps = extractDeps(graph)
	deps = toposort(deps)
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
			var params = extractParams(graph[dep]).join()
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

function extractDeps(graph){
	var deps = []
	for (var p in graph) {
		var params = extractParams(graph[p])
		deps.push([p].concat(params))
	}
	return deps
}

function extractParams(fn){
	fn = fn.toString()
	var params = fn.match(/\((.*)\)/)[1]
	return params.split(/ *, */)
}
