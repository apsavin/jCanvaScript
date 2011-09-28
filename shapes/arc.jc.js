jCanvaScript.Proto.Arc = function(x, y, radius, startAngle, endAngle, anticlockwise, lineColor, fillColor){
    var options = x;
    if (anticlockwise !== undefined) {
        if (anticlockwise.charAt) {
            fillColor = lineColor;
            lineColor = anticlockwise;
            anticlockwise = true;
        }
    }
    if (typeof options != 'object')
        options = {x:x, y:y, radius:radius, startAngle:startAngle, endAngle:endAngle, anticlockwise:anticlockwise, lineColor:lineColor, fillColor:fillColor};
    options = jCanvaScript.checkDefaults(options, {radius:0, startAngle:0, endAngle:0, anticlockwise:true});
    jCanvaScript.Proto.Shape.call(this, options);
    this._radius = options.radius;
    this._startAngle = options.startAngle;
    this._endAngle = options.endAngle;
    this._anticlockwise = options.anticlockwise;
    this._proto='Arc';
    return this;
};

jCanvaScript.Proto.Arc.prototype = Object.create(jCanvaScript.Proto.Shape.prototype);

jCanvaScript.Proto.Arc.prototype.draw = function(ctx) {
    var radian = jCanvaScript.constants.radian;
    ctx.arc(this._x, this._y, this._radius, this._startAngle / radian, this._endAngle / radian, this._anticlockwise);
};

jCanvaScript.Proto.Arc.prototype.getRect = function(type) {
    var
        radian = jCanvaScript.constants.radian,
        points = {x:this._x, y:this._y},
        startAngle = this._startAngle, endAngle = this._endAngle, radius = this._radius,
        startY = Math.floor(Math.sin(startAngle / radian) * radius), startX = Math.floor(Math.cos(startAngle / radian) * radius),
        endY = Math.floor(Math.sin(endAngle / radian) * radius), endX = Math.floor(Math.cos(endAngle / radian) * radius),
        positiveXs = startX > 0 && endX > 0, negtiveXs = startX < 0 && endX < 0,
        positiveYs = startY > 0 && endY > 0,negtiveYs = startY < 0 && endY < 0;

    points.width = points.height = radius;

    if ((this._anticlockwise && startAngle < endAngle) || (!this._anticlockwise && startAngle > endAngle)) {
        if (((negtiveXs || (positiveXs && (negtiveYs || positiveYs)))) || (startX == 0 && endX == 0)) {
            points.y -= radius;
            points.height += radius;
        }
        else {
            if (positiveXs && endY < 0 && startY > 0) {
                points.y += endY;
                points.height += endY;
            }
            else
            if (endX > 0 && endY < 0 && startX < 0) {
                points.y += Math.min(endY, startY);
                points.height -= Math.min(endY, startY);
            }
            else {
                if (negtiveYs)points.y -= Math.max(endY, startY);
                else points.y -= radius;
                points.height += Math.max(endY, startY);
            }
        }
        if (((positiveYs || (negtiveYs && (negtiveXs || positiveXs) ))) || (startY == 0 && endY == 0)) {
            points.x -= radius;
            points.width += radius;
        }
        else {
            if (endY < 0 && startY > 0) {
                points.x += Math.min(endX, startX);
                points.width -= Math.min(endX, startX);
            }
            else {
                if (negtiveXs)points.x -= Math.max(endX, startX);
                else points.x -= radius;
                points.width += Math.max(endX, startX);
            }
        }
    }
    else {
        positiveXs = startX >= 0 && endX >= 0;
        positiveYs = startY >= 0 && endY >= 0;
        negtiveXs = startX <= 0 && endX <= 0;
        negtiveYs = startY <= 0 && endY <= 0;
        if (negtiveYs && positiveXs) {
            points.x += Math.min(endX, startX);
            points.width -= Math.min(endX, startX);
            points.y += Math.min(endY, startY);
            points.height += Math.max(endY, startY);
        }
        else if (negtiveYs && negtiveXs) {
            points.x += Math.min(endX, startX);
            points.width += Math.max(endX, startX);
            points.y += Math.min(endY, startY);
            points.height += Math.max(endY, startY);
        }
        else if (negtiveYs) {
            points.x += Math.min(endX, startX);
            points.width += Math.max(endX, startX);
            points.y -= radius;
            points.height += Math.max(endY, startY);
        }
        else if (positiveXs && positiveYs) {
            points.x += Math.min(endX, startX);
            points.width = Math.abs(endX - startX);
            points.y += Math.min(endY, startY);
            points.height -= Math.min(endY, startY);
        }
        else if (positiveYs) {
            points.x += Math.min(endX, startX);
            points.width = Math.abs(endX) + Math.abs(startX);
            points.y += Math.min(endY, startY);
            points.height -= Math.min(endY, startY);
        }
        else if (negtiveXs) {
            points.x -= radius;
            points.width += Math.max(endX, startX);
            points.y -= radius;
            points.height += Math.max(endY, startY);
        }
        else if (positiveXs) {
            points.x -= radius;
            points.width += Math.max(endX, startX);
            points.y -= radius;
            points.height += radius;
        }
    }
    return jCanvaScript._helpers.getRect(this, points, type);
};

jCanvaScript.arc = function(x, y, radius, startAngle, endAngle, anticlockwise, lineColor, fillColor) {
    return new jCanvaScript.Proto.Arc(x, y, radius, startAngle, endAngle, anticlockwise, lineColor, fillColor);
}