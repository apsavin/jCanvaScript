proto.line=function(){
	this.draw=function(ctx)
	{
		if(this._x0===undefined)return;
		ctx.moveTo(this._x0,this._y0);
		for(var j=1;j<this.shapesCount;j++)
		{
			ctx.lineTo(this['_x'+j],this['_y'+j]);
		}
	}
	this.base=function(points,color,fill)
	{
		proto.line.prototype.base.call(this,points,color,fill);
		return this;
	}
	this._proto='line';
	this.pointNames=['_x','_y'];
}
proto.line.prototype=new proto.lines;
proto.qCurve=function(){
	this.draw=function(ctx)
	{
		if(this._x0===undefined)return;
		ctx.moveTo(this._x0,this._y0);
		for(var j=1;j<this.shapesCount;j++)
		{
			ctx.quadraticCurveTo(this['_cp1x'+j],this['_cp1y'+j],this['_x'+j],this['_y'+j]);
		}
	}
	this.base=function(points,color,fill)
	{
		proto.qCurve.prototype.base.call(this,points,color,fill);
		return this;
	}
	this._proto='qCurve';
	this.pointNames=['_x','_y','_cp1x','_cp1y'];
}
proto.qCurve.prototype=new proto.lines;
proto.bCurve=function(){
	this.draw=function(ctx)
	{
		if(this._x0===undefined)return;
		ctx.moveTo(this._x0,this._y0);
		for(var j=1;j<this.shapesCount;j++)
		{
			ctx.bezierCurveTo(this['_cp1x'+j],this['_cp1y'+j],this['_cp2x'+j],this['_cp2y'+j],this['_x'+j],this['_y'+j]);
		}
	}
	this.base=function(points,color,fill)
	{
		proto.bCurve.prototype.base.call(this,points,color,fill);
		return this;
	}
	this._proto='bCurve';
	this.pointNames=['_x','_y','_cp1x','_cp1y','_cp2x','_cp2y'];
}
proto.bCurve.prototype=new proto.lines;