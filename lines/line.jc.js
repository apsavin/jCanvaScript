jCanvaScript.Proto.Line = function(points, lineColor, fillColor){
    this._pointNames = ['_x', '_y'];
    this._proto = 'Line';
    jCanvaScript.Proto.Lines.call(this, points, lineColor, fillColor);
};

jCanvaScript.Proto.Line.prototype = Object.create(jCanvaScript.Proto.Lines.prototype);

jCanvaScript.Proto.Line.prototype.draw = function(ctx) {
    if (this._x0 === undefined)return;
    ctx.moveTo(this._x0, this._y0);
    for (var j = 1; j < this.shapesCount; j++) {
        ctx.lineTo(this['_x' + j], this['_y' + j]);
    }
}

jCanvaScript.line = function(points, lineColor, fillColor){
    return new jCanvaScript.Proto.Line(points, lineColor, fillColor);
}