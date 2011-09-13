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
        startY = m_floor(m_sin(startAngle / radian) * radius), startX = m_floor(m_cos(startAngle / radian) * radius),
        endY = m_floor(m_sin(endAngle / radian) * radius), endX = m_floor(m_cos(endAngle / radian) * radius),
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
                points.y += m_min(endY, startY);
                points.height -= m_min(endY, startY);
            }
            else {
                if (negtiveYs)points.y -= m_max(endY, startY);
                else points.y -= radius;
                points.height += m_max(endY, startY);
            }
        }
        if (((positiveYs || (negtiveYs && (negtiveXs || positiveXs) ))) || (startY == 0 && endY == 0)) {
            points.x -= radius;
            points.width += radius;
        }
        else {
            if (endY < 0 && startY > 0) {
                points.x += m_min(endX, startX);
                points.width -= m_min(endX, startX);
            }
            else {
                if (negtiveXs)points.x -= m_max(endX, startX);
                else points.x -= radius;
                points.width += m_max(endX, startX);
            }
        }
    }
    else {
        positiveXs = startX >= 0 && endX >= 0;
        positiveYs = startY >= 0 && endY >= 0;
        negtiveXs = startX <= 0 && endX <= 0;
        negtiveYs = startY <= 0 && endY <= 0;
        if (negtiveYs && positiveXs) {
            points.x += m_min(endX, startX);
            points.width -= m_min(endX, startX);
            points.y += m_min(endY, startY);
            points.height += m_max(endY, startY);
        }
        else if (negtiveYs && negtiveXs) {
            points.x += m_min(endX, startX);
            points.width += m_max(endX, startX);
            points.y += m_min(endY, startY);
            points.height += m_max(endY, startY);
        }
        else if (negtiveYs) {
            points.x += m_min(endX, startX);
            points.width += m_max(endX, startX);
            points.y -= radius;
            points.height += m_max(endY, startY);
        }
        else if (positiveXs && positiveYs) {
            points.x += m_min(endX, startX);
            points.width = m_abs(endX - startX);
            points.y += m_min(endY, startY);
            points.height -= m_min(endY, startY);
        }
        else if (positiveYs) {
            points.x += m_min(endX, startX);
            points.width = m_abs(endX) + m_abs(startX);
            points.y += m_min(endY, startY);
            points.height -= m_min(endY, startY);
        }
        else if (negtiveXs) {
            points.x -= radius;
            points.width += m_max(endX, startX);
            points.y -= radius;
            points.height += m_max(endY, startY);
        }
        else if (positiveXs) {
            points.x -= radius;
            points.width += m_max(endX, startX);
            points.y -= radius;
            points.height += radius;
        }
    }
    return jCanvaScript._helpers.getRect(this, points, type);
};

jCanvaScript.arc = function(x, y, radius, startAngle, endAngle, anticlockwise, lineColor, fillColor) {
    return new jCanvaScript.Proto.Arc(x, y, radius, startAngle, endAngle, anticlockwise, lineColor, fillColor);
}