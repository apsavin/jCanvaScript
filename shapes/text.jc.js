jCanvaScript.addObject('text', function()
{
	this.base = function(string, x, y, maxWidth, lineColor, fillColor) {
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
        this.protobase(options);
        this._string = options.string;
        this._maxWidth = options.maxWidth;
        return this;
    };

	this.setOptns = function(ctx) {
        this.proto().setOptns.call(this, ctx);
        ctx.textBaseline = this._baseline;
        ctx.font = this._font;
        ctx.textAlign = this._align;
        return this;
    };

	this.draw = function(ctx) {
        if (this._maxWidth === false) {
            if (this._fillColorA)ctx.fillText(this._string, this._x, this._y);
            if (this._lineColorA)ctx.strokeText(this._string, this._x, this._y);
        }
        else {
            if (this._fillColorA) ctx.fillText(this._string, this._x, this._y, this._maxWidth);
            if (this._lineColorA) ctx.strokeText(this._string, this._x, this._y, this._maxWidth);
        }
    };

	this.getRect = function(type) {
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
        return jCanvaScript.getRect(this, points, type);
    };

	this._proto='text';

	this.position = function() {
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
        return jCanvaScript.getRect(this, points);
    };

	this.font = function(font) {
        return this.attr('font', font);
    };

	this.align = function(align) {
        return this.attr('align', align);
    };

	this.baseline = function(baseline) {
        return this.attr('baseline', baseline);
    };

	this.string = function(string) {
        return this.attr('string', string);
    };

	this._font = "10px sans-serif";

	this._align = "start";

	this._baseline = "alphabetic";
});