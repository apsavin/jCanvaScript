jCanvaScript.line=function(points,color,fill)
{
	var line = lines(color,fill);
	line.pointNames=['x','y'];
	if(points!==undefined)line.points(points);
	line.draw=function(ctx)
	{
		if(this.x0===undefined)return;
		ctx.moveTo(this.x0.val,this.y0.val);
		for(var j=1;j<this.shapesCount;j++)
		{
			ctx.lineTo(this['x'+j].val,this['y'+j].val);
		}
	}
	return line;
}
jCanvaScript.qCurve=function(points,color,fill)
{
	var qCurve = lines(points,color,fill);
	qCurve.pointNames=['x','y','cp1x','cp1y'];
	if(points!==undefined)qCurve.points(points);
	qCurve.draw=function(ctx)
	{
		if(this.x0===undefined)return;
		ctx.moveTo(this.x0.val,this.y0.val);
		for(var j=1;j<this.shapesCount;j++)
		{
			ctx.quadraticCurveTo(this['cp1x'+j].val,this['cp1y'+j].val,this['x'+j].val,this['y'+j].val);
		}
	}
	return qCurve;
}
jCanvaScript.bCurve=function(points,color,fill)
{
	var bCurve = lines(points,color,fill);
	bCurve.pointNames=['x','y','cp1x','cp1y','cp2x','cp2y'];
	if(points!==undefined)bCurve.points(points);
	bCurve.draw=function(ctx)
	{
		if(this.x0===undefined)return;
		ctx.moveTo(this.x0.val,this.y0.val);
		for(var j=1;j<this.shapesCount;j++)
		{
			ctx.bezierCurveTo(this['cp1x'+j].val,this['cp1y'+j].val,this['cp2x'+j].val,this['cp2y'+j].val,this['x'+j].val,this['y'+j].val);
		}
	}
	return bCurve;
}