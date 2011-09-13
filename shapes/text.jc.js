jCanvaScript.Proto.Text = function(string, x, y, maxWidth, lineColor, fillColor) {
    var options = string;
    if (maxWidth !== undefined) {
        if (maxWidth.charAt) {
            fillColor = lineColor;
            lineColor = maxWidth;
            maxWidth = false;
        }
    }
    if (typeof options != 'object')
        options = {string:string, x:x, y:y, maxWidth:maxWidth, lineColor:lineColor, fillColor:fillColor};
    options = jCanvaScript.checkDefaults(options, {string:'', maxWidth:false});
    jCanvaScript.Proto.Shape.call(this,options);
    this._string = options.string;
    this._maxWidth = options.maxWidth;
    this._font = "10px sans-serif";
    this._align = "start";
    this._baseline = "alphabetic";
    this._proto='Text';
    return this;
};

jCanvaScript.Proto.Text.prototype = Object.create(jCanvaScript.Proto.Shape.prototype);

jCanvaScript.Proto.Text.prototype.setOptns = function(ctx) {
    jCanvaScript.Proto.Shape.prototype.setOptns.call(this, ctx);
    ctx.textBaseline = this._baseline;
    ctx.font = this._font;
    ctx.textAlign = this._align;
    return this;
};

jCanvaScript.Proto.Text.prototype.draw = function(ctx) {
    if (this._maxWidth === false) {
        if (this._fillColorA)ctx.fillText(this._string, this._x, this._y);
        if (this._lineColorA)ctx.strokeText(this._string, this._x, this._y);
    }
    else {
        if (this._fillColorA) ctx.fillText(this._string, this._x, this._y, this._maxWidth);
        if (this._lineColorA) ctx.strokeText(this._string, this._x, this._y, this._maxWidth);
    }
};

jCanvaScript.Proto.Text.prototype.getRect = function(type) {
    var
        points = {x:this._x, y:this._y},
        ctx = this.canvas().optns.ctx;
    points.height = parseInt(this._font.match(jCanvaScript.constants.regNumsWithMeasure)[0]);
    points.y -= points.height;
    ctx.save();
    ctx.textBaseline = this._baseline;
    ctx.font = this._font;
    ctx.textAlign = this._align;
    points.width = ctx.measureText(this._string).width;
    if (this._align == 'center')points.x -= points.width / 2;
    if (this._align == 'right')points.x -= points.width;
    ctx.restore();
    return jCanvaScript._helpers.getRect(this, points, type);
};

jCanvaScript.Proto.Text.prototype.position = function() {
    var points = {x:this._x, y:this._y},
        ctx = this.canvas().optns.ctx;
    points.height = parseInt(this._font.match(jCanvaScript.constants.regNumsWithMeasure)[0]);
    points.y -= points.height;
    ctx.save();
    ctx.textBaseline = this._baseline;
    ctx.font = this._font;
    ctx.textAlign = this._align;
    points.width = ctx.measureText(this._string).width;
    ctx.restore();
    return jCanvaScript._helpers.getRect(this, points);
};

jCanvaScript.Proto.Text.prototype.font = function(font) {
    return this.attr('font', font);
};

jCanvaScript.Proto.Text.prototype.align = function(align) {
    return this.attr('align', align);
};

jCanvaScript.Proto.Text.prototype.baseline = function(baseline) {
    return this.attr('baseline', baseline);
};

jCanvaScript.Proto.Text.prototype.string = function(string) {
    return this.attr('string', string);
};

jCanvaScript.text = function(string, x, y, maxWidth, lineColor, fillColor) {
    return new jCanvaScript.Proto.Text(string, x, y, maxWidth, lineColor, fillColor);
}