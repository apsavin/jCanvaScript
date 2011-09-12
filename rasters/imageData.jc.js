jCanvaScript.Proto.ImageData = function(width, height) {
    jCanvaScript.Proto.Object.call(this)
    this._getX = 0;
    this._getY = 0;
    this._putData = false;
    this._proto = 'imageData';
    if (height === undefined) {
        var oldImageData = width;
        if (oldImageData._width !== undefined) {
            width = oldImageData._width;
            height = oldImageData._height;
        }
        else {
            width = jCanvaScript.checkDefaults(width, {width:0, height:0});
            height = width.height;
            width = width.width;
        }
    }
    this._width = width;
    this._height = height;
    this._data = [];
    for (var i = 0; i < this._width; i++)
        for (var j = 0; j < this._height; j++) {
            var index = (i + j * this._width) * 4;
            this._data[index + 0] = 0;
            this._data[index + 1] = 0;
            this._data[index + 2] = 0;
            this._data[index + 3] = 0;
        }
    return this;
};

jCanvaScript.Proto.ImageData.prototype = Object.create(jCanvaScript.Proto.Object.prototype)

jCanvaScript.Proto.ImageData.prototype.draw = function(ctx) {
    if (this._imgData === undefined) {
        this._imgData = ctx.createImageData(this._width, this._height);
        for (var i = 0; i < this._width * this._height * 4; i++)
            this._imgData.data[i] = this._data[i];
        this._data = this._imgData.data;
    }
    if (this._putData)
        ctx.putImageData(this._imgData, this._x, this._y);
};

jCanvaScript.Proto.ImageData.prototype.getRect = function(type) {
    var points = {x:this._x, y:this._y, width:this._width, height:this._height};
    return jCanvaScript.getRect(this, points, type);
};

jCanvaScript.Proto.ImageData.prototype.setPixel = function(x, y, color) {
    var
        colorKeeper,
        index = (x + y * this._width) * 4;
    if (color.r !== undefined) colorKeeper = color;
    else if (color[0] !== undefined)
        if (!color.charAt) colorKeeper = {r:color[0], g:color[1], b:color[2], a:color[3]};
        else colorKeeper = jCanvaScript.parseColor(color);
    this._data[index + 0] = colorKeeper.r;
    this._data[index + 1] = colorKeeper.g;
    this._data[index + 2] = colorKeeper.b;
    this._data[index + 3] = colorKeeper.a * 255;
    this.redraw();
    return this;
};

jCanvaScript.Proto.ImageData.prototype.getPixel = function(x, y) {
    var index = (x + y * this._width) * 4;
    return [this._data[index + 0], this._data[index + 1], this._data[index + 2], this._data[index + 3] / 255];
};

jCanvaScript.Proto.ImageData.prototype.getData = function(x, y, width, height) {
    this._getX = x;
    this._getY = y;
    this._width = width;
    this._height = height;
    var ctx = this.canvas().optns.ctx;
    try {
        this._imgData = ctx.getImageData(this._getX, this._getY, this._width, this._height);
    } catch(e) {
        netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
        this._imgData = ctx.getImageData(this._getX, this._getY, this._width, this._height);
    }
    this._data = this._imgData.data;
    this.redraw();
    return this;
};

jCanvaScript.Proto.ImageData.prototype.putData = function(x, y) {
    if (x !== undefined)this._x = x;
    if (y !== undefined)this._y = y;
    this._putData = true;
    this.redraw();
    return this;
};

jCanvaScript.Proto.ImageData.prototype.clone = function() {
    var clone = this.proto().clone.call(this);
    clone._imgData = undefined;
    return clone;
};

jCanvaScript.Proto.ImageData.prototype.filter = function(filterName, filterType) {
    var filter = jCanvaScript.imageDataFilters[filterName];
    filter.fn.call(this, this._width, this._height, filter.matrix, filterType);
    return this;
};

jCanvaScript.imageData = function(width, height){
    return new jCanvaScript.Proto.ImageData(width, height);
}