/**
 * In a web worker, the global object is `self`, but in
 * Node (and thus, in running tests), it's `global`.
 *
 * This function can't be tested since it's environment-
 * dependent, but it allows other code to be tested
 * seamlessly.
 */
function getGlobalObject() {
  if (typeof self !== 'undefined') {
    return self
  }
  return global
}
