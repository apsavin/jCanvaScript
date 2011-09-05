jCanvaScript.addObject('image', function()
{
	this.base = function(image, x, y, width, height, sx, sy, swidth, sheight)
	{
		var options = image;
		if(typeof image != 'object' || image.src !== undefined)
			options = {image:image, x:x, y:y, width:width, height:height, sx:sx, sy:sy, swidth:swidth, sheight:sheight};
		options = jCanvaScript.checkDefaults(options, {width:false, height:false, sx:0, sy:0, swidth:false, sheight:false});
		if(options.width === false)
		{
			options.width  = options.image.width;
			options.height = options.image.height;
		}
		if(options.swidth === false)
		{
			options.swidth  = options.image.width;
			options.sheight = options.image.height;
		}
		this.protobase(options);
		this._img     = options.image;
		this._width   = options.width;
		this._height  = options.height;
		this._sx      = options.sx;
		this._sy      = options.sy;
		this._swidth  = options.swidth;
		this._sheight = options.sheight;
		return this;
	}

	this.draw = function(ctx)
	{
		ctx.drawImage(this._img, this._sx, this._sy, this._swidth, this._sheight, this._x, this._y, this._width, this._height);
	}

	this.getRect = function(type)
	{
		var points = {x:this._x, y:this._y, width:this._width, height:this._height};
		return jCanvaScript.getRect(this, points, type);
	}
	
	this._proto='image';
},'object')