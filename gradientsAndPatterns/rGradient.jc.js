/*
 * @function
 * @type {jCanvaScript.rGradient}
 */
jCanvaScript.Proto.RGradient = function(x1, y1, r1, x2, y2, r2, colors) {
    var options = x1;
    if (typeof options !== 'object')
        options = {x1: x1, y1: y1, r1: r1, x2: x2, y2: y2, r2: r2, colors: colors};
    options = jCanvaScript.checkDefaults(options, {x1:0,y1:0,r1:0,x2:0,y2:0,r2:0});
    jCanvaScript.Proto.Gradients.call(this, options.colors);
    this._x1 = options.x1;
    this._y1 = options.y1;
    this._r1 = options.r1;
    this._x2 = options.x2;
    this._y2 = options.y2;
    this._r2 = options.r2;
    this._proto='rGradient';
    return this;
};

jCanvaScript.inherite(jCanvaScript.Proto.RGradient, jCanvaScript.Proto.Gradients);
/*
 * @private
 * @param {Object} canvasOptions
 */
jCanvaScript.Proto.RGradient.prototype.draw = function(canvasOptions) {
    if (this.optns.animated)jCanvaScript._helpers.animating.call(this);
    this.val = canvasOptions.ctx.createRadialGradient(this._x1, this._y1, this._r1, this._x2, this._y2, this._r2);
    this._createColorStops();
};

jCanvaScript.rGradient = function(x1, y1, r1, x2, y2, r2, colors){
    return new jCanvaScript.Proto.RGradient(x1, y1, r1, x2, y2, r2, colors);
}