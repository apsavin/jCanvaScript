jCanvaScript.Proto.LGradient = function(x1, y1, x2, y2, colors) {
    var options = x1;
    if (typeof options !== 'object')
        options = {x1: x1, y1: y1, x2: x2, y2: y2, colors: colors};
    options = jCanvaScript.checkDefaults(options, {x1: 0, y1:0, x2: 0, y2: 0});
    jCanvaScript.Proto.Gradients.call(this, options.colors);
    this._x1 = options.x1;
    this._y1 = options.y1;
    this._x2 = options.x2;
    this._y2 = options.y2;
    this._proto = 'lGradient';
    return this;
};
jCanvaScript.inherite(jCanvaScript.Proto.LGradient, jCanvaScript.Proto.Gradients);
/*
 * @private
 * @param {Object} canvasOptions
 */
jCanvaScript.Proto.LGradient.prototype.draw = function(canvasOptions) {
    if (this.optns.animated)jCanvaScript._helpers.animating.call(this, canvasOptions);
    this.val = canvasOptions.ctx.createLinearGradient(this._x1, this._y1, this._x2, this._y2);
    this._createColorStops();
};

jCanvaScript.lGradient = function(x1, y1, x2, y2, colors){
    return new jCanvaScript.Proto.LGradient(x1, y1, x2, y2, colors);
}