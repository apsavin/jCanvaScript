jCanvaScript.circle=function(x,y,radius,color,fill)
{
	var circle = shapes(x,y,color,fill);
	circle.radius={val:radius};
	circle.draw=function(ctx)
	{
		ctx.arc (this.x.val, this.y.val, this.radius.val, 0,pi,true);
	}
	return circle;
}
jCanvaScript.rect=function(x,y,width,height,color,fill)
{
	var rect = shapes(x,y,color,fill);
	rect.width={val:width};
	rect.height={val:height};
	rect.draw=function(ctx)
	{
		ctx.rect(this.x.val, this.y.val, this.width.val, this.height.val);
	}
	return rect;
}
jCanvaScript.arc=function(x,y,radius,startAngle,endAngle,anticlockwise,color,fill)
{
	if(anticlockwise!==undefined)
		if(anticlockwise.charAt)color=anticlockwise;
	var arc = shapes(x,y,color,fill);
	arc.radius={val:radius};
	arc.startAngle={val:startAngle};
	arc.endAngle={val:endAngle};
	arc.anticlockwise={val:anticlockwise||true};
	arc.draw=function(ctx)
	{
		ctx.arc (this.x.val, this.y.val, this.radius.val, this.startAngle.val,this.endAngle.val,this.anticlockwise.val);
	};
	return arc;
}
jCanvaScript.line=function(points,color,fill)
{
	var line = shapes(points[0][0],points[0][1],color,fill);
	for(var j=0;j<points.length;j++)
	{
		line['x'+j]={val:points[j][0]};
		line['y'+j]={val:points[j][1]};
	}
	line.shapesCount=points.length;
	line.draw=function(ctx)
	{
		ctx.moveTo(this.x.val,this.y.val);
		for(var j=1;j<this.shapesCount;j++)
		{
			ctx.lineTo(this['x'+j].val,this['y'+j].val);
		}
	}
	return line;
}
jCanvaScript.qCurve=function(points,color,fill)
{
	var qCurve = shapes(points[0][0],points[0][1],color,fill);
	qCurve.fill={val:fill||0};
	for(var j=0;j<points.length;j++)
	{
		qCurve['x'+j]={val:points[j][0]}
		qCurve['y'+j]={val:points[j][1]}
		qCurve['cp1x'+j]={val:points[j][2]}
		qCurve['cp1y'+j]={val:points[j][3]}
	}
	qCurve.shapesCount=points.length;
	qCurve.draw=function(ctx)
	{
		ctx.moveTo(this.x.val,this.y.val);
		for(var j=1;j<this.shapesCount;j++)
		{
			ctx.quadraticCurveTo(this['cp1x'+j].val,this['cp1y'+j].val,this['x'+j].val,this['y'+j].val);
		}
	}
	return qCurve;
}
jCanvaScript.bCurve=function(points,color,fill)
{
	var bCurve = shapes(points[0][0],points[0][1],color,fill);
	for(var j=0;j<points.length;j++)
	{
		bCurve['x'+j]={val:points[j][0]};
		bCurve['y'+j]={val:points[j][1]};
		bCurve['cp1x'+j]={val:points[j][2]};
		bCurve['cp1y'+j]={val:points[j][3]};
		bCurve['cp2x'+j]={val:points[j][4]};
		bCurve['cp2y'+j]={val:points[j][5]};
	}
	bCurve.shapesCount=points.length;
	bCurve.draw=function(ctx)
	{
		ctx.moveTo(this.x.val,this.y.val);
		for(var j=1;j<this.shapesCount;j++)
		{
			ctx.bezierCurveTo(this['cp1x'+j].val,this['cp1y'+j].val,this['cp2x'+j].val,this['cp2y'+j].val,this['x'+j].val,this['y'+j].val);
		}
	}
	return bCurve;
}
jCanvaScript.text = function(string,x,y,maxWidth,color,fill)
{
	if (maxWidth!==undefined)
	{
		if (maxWidth.charAt)
		{
			if(color!==undefined)fill=color;
			color=maxWidth;
			maxWidth=false;
		}
	}
	var text = shapes(x,y,color,fill||1);
	text.string=string;
	text.maxWidth={val:maxWidth||false};
	text.font=function(font)
	{
		return this.attr('font',font);
	}
	text.font.val="10px sans-serif";
	text.align=function(align)
	{
		return this.attr('align',align);
	}
	text.align.val="start";
	text.baseline=function(baseline)
	{
		return this.attr('baseline',baseline);
	}
	text.baseline.val="alphabetic";
	text.setShapeOptns = text.setOptns;
	text.setOptns = function(ctx)
	{
		this.setShapeOptns(ctx);
		ctx.textBaseline=this.baseline.val;
		ctx.font=this.font.val;
		ctx.textAlign=this.align.val;
	}
	text.draw=function(ctx)
	{
		if(this.maxWidth.val==false)
		{
			if(this.fill.val){ctx.fillText(this.string,this.x.val,this.y.val);}
			else{ctx.strokeText(this.string,this.x.val,this.y.val);}
		}
		else
		{
			if(this.fill.val){ctx.fillText(this.string,this.x.val,this.y.val,this.maxWidth.val);}
			else{ctx.strokeText(this.string,this.x.val,this.y.val,this.maxWidth.val);}
		}
	}
	return text;
}