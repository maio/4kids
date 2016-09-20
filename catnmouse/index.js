var catElement = document.querySelector("#cat");
var catSound = document.querySelector("#catSound");
var mouseElement = document.querySelector("#mouse");

var state = {
  mouse: { x: 10, y: 10 },
  cat: { x: 300, y: 200 },
  sounds: { meow: { ts: 0, play: 1 } }
};

function calcChaseSpeed(from, to) {
  return (to - from) / 75;
}

function distance(from, to) {
  var dx = Math.abs(from.x - to.x);
  var dy = Math.abs(from.y - to.y);

  return Math.sqrt(dx * dx + dy * dy);
}

function shouldMeow(state, now) {
  return distance(state.cat, state.mouse) < 100 &&
    (now - state.sounds.meow.ts) > 2000 &&
    !(state.sounds.meow.position &&
      distance(state.mouse, state.sounds.meow.position) < 5);
}

function setMeow(state, now) {
  state.sounds.meow.ts = now;
  state.sounds.meow.play = true;
  state.sounds.meow.position = {
    x: state.mouse.x,
    y: state.mouse.y
  };
}

function stopMeow(state) {
  state.sounds.meow.play = false;
}

function update(state) {
  state.cat.x = state.cat.x + calcChaseSpeed(state.cat.x, state.mouse.x);
  state.cat.y = state.cat.y + calcChaseSpeed(state.cat.y, state.mouse.y);

  var now = Date.now();

  if (shouldMeow(state, now)) {
    setMeow(state, now);
  }
  else {
    stopMeow(state);
  }
}

function setElementPosition(element, position) {
  var offX = - (element.width / 2);
  var offY = - (element.height / 2);

  element.style.left = position.x + offX;
  element.style.top = position.y + offY;
}

function draw(state) {
  setElementPosition(catElement, state.cat);
  setElementPosition(mouseElement, state.mouse);

  if (state.sounds.meow.play) {
    meow();
  }
}

setInterval(function () {
  update(state);
  draw(state);
}, 1000 / 60);

function meow() {
  catSound.play();
}

document.addEventListener("mousemove", function (event) {
  state.mouse.x = event.clientX;
  state.mouse.y = event.clientY;
});
