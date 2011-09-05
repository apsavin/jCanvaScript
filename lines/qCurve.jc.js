jCanvaScript.addObject('qCurve', function()
{
	this.draw = function(ctx)
	{
		if(this._x0 === undefined) return;
		ctx.moveTo(this._x0, this._y0);
		for(var j = 1; j < this.shapesCount; j++)
		{
			ctx.quadraticCurveTo(this['_cp1x' + j], this['_cp1y' + j], this['_x' + j], this['_y' + j]);
		}
	}

	this._proto = 'qCurve';

	this.pointNames=['_x', '_y', '_cp1x', '_cp1y'];

}, 'lines')