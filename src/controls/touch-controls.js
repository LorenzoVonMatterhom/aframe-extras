/**
 * Touch-to-move-forward controls for mobile.
 */
 module.exports = AFRAME.registerComponent('touch-controls', {
  schema: {
    enabled: { default: true },
    reverseEnabled: { default: true },
    speed: {default: 0.5}
  },

  init: function init() {
    this.dVelocity = new THREE.Vector3();
    this.bindMethods();
    this.direction = 0;
    this.lateralDirection = 0;
    this.previousPinchDelta = 0;
    this.previousAveragePosition = { x: 0, y: 0};
  },

  play: function play() {
    this.addEventListeners();
  },

  pause: function pause() {
    this.removeEventListeners();
    this.dVelocity.set(0, 0, 0);
  },

  remove: function remove() {
    this.pause();
  },

  addEventListeners: function addEventListeners() {
    var sceneEl = this.el.sceneEl;
    var canvasEl = sceneEl.canvas;

    if (!canvasEl) {
      sceneEl.addEventListener('render-target-loaded', this.addEventListeners.bind(this));
      return;
    }

    canvasEl.addEventListener('touchstart', this.onTouchStart);
    canvasEl.addEventListener('touchmove', this.onTouchMove);
    canvasEl.addEventListener('touchend', this.onTouchEnd);
  },

  removeEventListeners: function removeEventListeners() {
    var canvasEl = this.el.sceneEl && this.el.sceneEl.canvas;
    if (!canvasEl) {
      return;
    }

    canvasEl.removeEventListener('touchstart', this.onTouchStart);
    canvasEl.removeEventListener('touchmove', this.onTouchMove);
    canvasEl.removeEventListener('touchend', this.onTouchEnd);
  },

  isVelocityActive: function isVelocityActive() {
    return this.data.enabled && !!this.direction;
  },

  getVelocityDelta: function getVelocityDelta() {
    this.dVelocity.z = this.direction;
    //this.dVelocity.x = this.lateralDirection;
    return this.dVelocity.clone();
  },

  bindMethods: function bindMethods() {
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
  },

  onTouchStart: function onTouchStart(e) {
    //this.direction = -1;
    if (this.data.reverseEnabled && e.touches.length === 2) {
      //this.direction = 1;
    }
    if (e.touches.length === 2) {
      var pinchDelta = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
      this.previousPinchDelta = pinchDelta;
      this.previousAveragePosition = {x: (e.touches[0].pageX + e.touches[1].pageX)/2, y: (e.touches[0].pageY + e.touches[1].pageY)/2};
    }
    e.preventDefault();
  },

  onTouchMove: function onTouchMove(e) {
    if (e.touches.length === 2) {
      var pinchDelta = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
      var averagePosition = {x: (e.touches[0].pageX + e.touches[1].pageX)/2, y: (e.touches[0].pageY + e.touches[1].pageY)/2};
      this.direction = (this.previousPinchDelta - pinchDelta)*this.data.speed;
      this.lateralDirection = Math.hypot(averagePosition.x - previousAveragePosition.x, averagePosition.y - previousAveragePosition.y)*this.data.speed;
      this.previousPinchDelta = pinchDelta;
      this.previousAveragePosition = averagePosition;
    }
    e.preventDefault();
  },

  onTouchEnd: function onTouchEnd(e) {
    this.direction = 0;
    this.lateralDirection = 0;
    e.preventDefault();
  }
});