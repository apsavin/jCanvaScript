jCanvaScript.Proto.BCurve = function(points, lineColor, fillColor) {
    this._pointNames = ['_x', '_y', '_cp1x', '_cp1y', '_cp2x', '_cp2y'];
    this._proto = 'BCurve';
    jCanvaScript.Proto.Lines.call(this, points, lineColor, fillColor);
}

jCanvaScript.Proto.BCurve.prototype = Object.create(jCanvaScript.Proto.Lines.prototype);

jCanvaScript.Proto.BCurve.prototype.draw = function(ctx) {
    if (this._x0 === undefined) return;
    ctx.moveTo(this._x0, this._y0);
    for (var j = 1; j < this.shapesCount; j++) {
        ctx.bezierCurveTo(this['_cp1x' + j], this['_cp1y' + j], this['_cp2x' + j], this['_cp2y' + j], this['_x' + j], this['_y' + j]);
    }
};

jCanvaScript.bCurve = function(points, lineColor, fillColor){
    return new jCanvaScript.Proto.BCurve(points, lineColor, fillColor);
}