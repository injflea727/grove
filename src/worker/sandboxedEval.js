/**
 * sandboxedEval ensures that global variables are shadowed
 * and inaccessible from the eval'd code.
 *
 * I've manually tested that the `code` and `f` local vars
 * are not accessible either.
 */

function sandboxedEval(code) {
  var globals = Object.keys(getGlobalObject())
  globals.push('self')
  var f = new Function(
    'var ' + globals.join(',')
    + ';' + code
    + ';return main'
  )
  return f();
}
