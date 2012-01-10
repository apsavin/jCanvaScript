proto.circle = function () {
    this.getCenter = function (type) {
        return getCenter(this, {x:this._x, y:this._y}, type);
    }
    this.getRect = function (type) {
        var points = {x:Math.floor(this._x - this._radius), y:Math.floor(this._y - this._radius)};
        points.width = points.height = Math.ceil(this._radius) * 2;
        return getRect(this, points, type);
    }
    this.draw = function (ctx) {
        ctx.arc(this._x, this._y, this._radius, 0, pi2, true);
    }
    this.base = function (x, y, radius, color, fill) {
        if (typeof x != 'object')
            x = {x:x, y:y, radius:radius, color:color, fill:fill};
        x = checkDefaults(x, {radius:0});
        proto.circle.prototype.base.call(this, x);
        this._radius = x.radius;
        return this;
    }
    this._proto = 'circle';
}
proto.circle.prototype = new proto.shape;
proto.rect = function () {
    this.getRect = function (type) {
        return getRect(this, {x:this._x, y:this._y, width:this._width, height:this._height}, type);
    }
    this.draw = function (ctx) {
        ctx.rect(this._x, this._y, this._width, this._height);
    }
    this.base = function (x, y, width, height, color, fill) {
        if (typeof x != 'object')
            x = {x:x, y:y, width:width, height:height, color:color, fill:fill};
        x = checkDefaults(x, {width:0, height:0});
        proto.rect.prototype.base.call(this, x);
        this._width = x.width;
        this._height = x.height;
        return this;
    }
    this._proto = 'rect';
}
proto.rect.prototype = new proto.shape;
proto.arc = function () {
    this.getRect = function (type) {
        var points = {x:this._x, y:this._y},
            startAngle = this._startAngle, endAngle = this._endAngle, radius = this._radius,
            startY = m_floor(m_sin(startAngle / radian) * radius), startX = m_floor(m_cos(startAngle / radian) * radius),
            endY = m_floor(m_sin(endAngle / radian) * radius), endX = m_floor(m_cos(endAngle / radian) * radius),
            positiveXs = startX > 0 && endX > 0, negtiveXs = startX < 0 && endX < 0, positiveYs = startY > 0 && endY > 0, negtiveYs = startY < 0 && endY < 0;
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
        return getRect(this, points, type);
    }
    this.draw = function (ctx) {
        ctx.arc(this._x, this._y, this._radius, this._startAngle / radian, this._endAngle / radian, this._anticlockwise);
    }
    this.base = function (x, y, radius, startAngle, endAngle, anticlockwise, color, fill) {
        if (anticlockwise !== undefined) {
            if (anticlockwise.charAt)color = anticlockwise;
            if (anticlockwise)anticlockwise = true;
            else anticlockwise = false;
        }
        if (typeof x != 'object')
            x = {x:x, y:y, radius:radius, startAngle:startAngle, endAngle:endAngle, anticlockwise:anticlockwise, color:color, fill:fill};
        x = checkDefaults(x, {radius:0, startAngle:0, endAngle:0, anticlockwise:true});
        proto.arc.prototype.base.call(this, x);
        this._radius = x.radius;
        this._startAngle = x.startAngle;
        this._endAngle = x.endAngle;
        this._anticlockwise = x.anticlockwise;
        return this;
    }
    this._proto = 'arc';
}
proto.arc.prototype = new proto.shape;
proto.text = function () {
    this.font = function (font) {
        return this.attr('font', font);
    }
    this._font = "10px sans-serif";
    this.align = function (align) {
        return this.attr('align', align);
    }
    this._align = "start";
    this.baseline = function (baseline) {
        return this.attr('baseline', baseline);
    }
    this._baseline = "alphabetic";
    this.string = function (string) {
        return this.attr('string', string);
    }
    this.position = function () {
        var points = {x:this._x, y:this._y}, ctx = objectCanvas(this).optns.ctx;
        points.height = parseInt(this._font.match(regNumsWithMeasure)[0]);
        points.y -= points.height;
        ctx.save();
        ctx.textBaseline = this._baseline;
        ctx.font = this._font;
        ctx.textAlign = this._align;
        points.width = ctx.measureText(this._string).width;
        ctx.restore();
        return getRect(this, points);
    }
    this.getRect = function (type) {
        var points = {x:this._x, y:this._y}, ctx = objectCanvas(this).optns.ctx;
        points.height = parseInt(this._font.match(regNumsWithMeasure)[0]);
        points.y -= points.height;
        ctx.save();
        ctx.textBaseline = this._baseline;
        ctx.font = this._font;
        ctx.textAlign = this._align;
        points.width = ctx.measureText(this._string).width;
        if (this._align == 'center')points.x -= points.width / 2;
        if (this._align == 'right')points.x -= points.width;
        ctx.restore();
        return getRect(this, points, type);
    }
    this.setOptns = function (ctx) {
        proto.text.prototype.setOptns.call(this, ctx);
        ctx.textBaseline = this._baseline;
        ctx.font = this._font;
        ctx.textAlign = this._align;
    }
    this.draw = function (ctx) {
        if (this._maxWidth === false) {
            if (this._fill)ctx.fillText(this._string, this._x, this._y);
            else ctx.strokeText(this._string, this._x, this._y);
        }
        else {
            if (this._fill) ctx.fillText(this._string, this._x, this._y, this._maxWidth);
            else ctx.strokeText(this._string, this._x, this._y, this._maxWidth);
        }
    }
    this.base = function (string, x, y, maxWidth, color, fill) {
        if (maxWidth !== undefined) {
            if (maxWidth.charAt) {
                if (color !== undefined)fill = color;
                color = maxWidth;
                maxWidth = false;
            }
        }
        if (typeof string != 'object')
            string = {string:string, x:x, y:y, maxWidth:maxWidth, color:color, fill:fill};
        string = checkDefaults(string, {string:'', maxWidth:false, fill:1});
        proto.text.prototype.base.call(this, string);
        this._string = string.string;
        this._maxWidth = string.maxWidth;
        return this;
    }
    this._proto = 'text';
}
proto.text.prototype = new proto.shape;