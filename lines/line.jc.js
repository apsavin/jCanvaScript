jCanvaScript.addObject('line', function()
{
	this.draw = function(ctx)
	{
		if(this._x0 === undefined)return;
		ctx.moveTo(this._x0, this._y0);
		for(var j = 1; j < this.shapesCount; j++)
		{
			ctx.lineTo(this['_x' + j], this['_y' + j]);
		}
	}

	this._proto = 'line';

	this.pointNames = ['_x', '_y'];

}, 'lines');