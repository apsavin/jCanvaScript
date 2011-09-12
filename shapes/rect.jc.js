jCanvaScript.addObject('rect', function(){

	this.base = function(x, y, width, height, lineColor, fillColor) {
        var options = x;
        if (typeof options != 'object')
            options = {x:x, y:y, width:width, height:height, lineColor:lineColor, fillColor:fillColor};
        options = jCanvaScript.checkDefaults(options, {width:0, height:0});
        this.protobase(options);
        this._width = options.width;
        this._height = options.height;
        return this;
    };

	this.draw = function(ctx) {
        ctx.rect(this._x, this._y, this._width, this._height);
    };

	this.getRect = function(type) {
        return jCanvaScript.getRect(this, {x:this._x, y:this._y, width:this._width, height:this._height}, type);
    };

	this._proto = 'rect';
});