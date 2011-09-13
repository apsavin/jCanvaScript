jCanvaScript.Proto.Circle = function(x, y, radius, lineColor, fillColor) {
    var options = x;
    if (typeof options != 'object')
        options = {x:x, y:y, radius:radius, lineColor:lineColor, fillColor:fillColor};
    options = jCanvaScript.checkDefaults(options, {radius:0});
    jCanvaScript.Proto.Shape.call(this, options);
    this._radius = options.radius;
    this._proto = 'Circle';
    return this;
};

jCanvaScript.Proto.Circle.prototype = Object.create(jCanvaScript.Proto.Shape.prototype);

jCanvaScript.Proto.Circle.prototype.draw = function(ctx) {
    ctx.arc(this._x, this._y, this._radius, 0, jCanvaScript.constants.PIx2, true);
};

jCanvaScript.Proto.Circle.prototype.getRect = function(type) {
    var points = {x:this._x - this._radius, y:this._y - this._radius};
    points.width = points.height = this._radius * 2;
    return jCanvaScript._helpers.getRect(this, points, type);
};

jCanvaScript.Proto.Circle.prototype.getCenter = function(type){
    return jCanvaScript._helpers.getCenter(this, {x:this._x, y:this._y}, type);
}

jCanvaScript.circle = function(x, y, radius, lineColor, fillColor){
    return new jCanvaScript.Proto.Circle(x, y, radius, lineColor, fillColor);
}