function timeUntilNextFrame(now, fps) {
  var millisPerFrame = 1000 / fps
  var framesSinceEpoch = Math.floor(now / millisPerFrame)
  var lastFrameAt = framesSinceEpoch * millisPerFrame
  var millisSinceLastFrame = now - lastFrameAt
  return millisPerFrame - millisSinceLastFrame
}
