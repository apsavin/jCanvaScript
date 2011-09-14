jCanvaScript.Proto.QCurve = function(points, lineColor, fillColor) {
    this._pointNames = ['_x', '_y', '_cp1x', '_cp1y'];
    this._proto = 'QCurve';
    jCanvaScript.Proto.Lines.call(this, points, lineColor, fillColor);
}

jCanvaScript.Proto.QCurve.prototype = Object.create(jCanvaScript.Proto.Lines.prototype);

jCanvaScript.Proto.QCurve.prototype.draw = function(ctx) {
    if (this._x0 === undefined) return;
    ctx.moveTo(this._x0, this._y0);
    for (var j = 1; j < this.shapesCount; j++) {
        ctx.quadraticCurveTo(this['_cp1x' + j], this['_cp1y' + j], this['_x' + j], this['_y' + j]);
    }
};

jCanvaScript.qCurve = function(points, lineColor, fillColor){
    return new jCanvaScript.Proto.QCurve(points, lineColor, fillColor);
};