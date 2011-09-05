jCanvaScript.addObject('circle', function()
{
	this.base = function(x, y, radius, lineColor, fillColor)
	{
		var options = x;
		if(typeof options != 'object')
			options = {x:x, y:y, radius:radius, lineColor:lineColor, fillColor:fillColor};
		options = jCanvaScript.checkDefaults(options, {radius:0});
		this.protobase(options);
		this._radius = options.radius;
		return this;
	}

	this.draw = function(ctx){
		ctx.arc(this._x, this._y, this._radius, 0, jCanvaScript.constants.PIx2,true);
	}

	this.getRect = function(type){
		var points = {x:this._x-this._radius, y:this._y-this._radius};
		points.width = points.height = this._radius*2;
		return jCanvaScript.getRect(this, points, type);
	}

	this._proto = 'circle';
	
	this.getCenter = function(type){
		return jCanvaScript.getCenter(this, {x:this._x, y:this._y}, type);
	}
});
