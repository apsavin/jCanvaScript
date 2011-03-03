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