proto.circle=function(){
	this.draw=function(ctx)
	{
		ctx.arc (this._x, this._y, this._radius, 0,pi,true);
	}
	this.base=function(x,y,radius,color,fill)
	{
		proto.circle.prototype.base.call(this,x,y,color,fill);
		this._radius=radius;
		return this;
	}
	this._proto='circle';
}
proto.circle.prototype=new proto.shape;
proto.rect=function(){
	this.draw=function(ctx)
	{
		ctx.rect(this._x, this._y, this._width, this._height);
	}
	this.base=function(x,y,width,height,color,fill)
	{
		proto.rect.prototype.base.call(this,x,y,color,fill);
		this._width=width;
		this._height=height;
		return this;
	}
	this._proto='rect';
}
proto.rect.prototype=new proto.shape;
proto.arc=function(){
	this.draw=function(ctx)
	{
		ctx.arc (this._x, this._y, this._radius, this._startAngle,this._endAngle,this._anticlockwise);
	}
	this.base=function(x,y,radius,startAngle,endAngle,anticlockwise,color,fill)
	{
		if(anticlockwise!==undefined)
		if(anticlockwise.charAt)color=anticlockwise;
		proto.arc.prototype.base.call(this,x,y,color,fill);
		this._radius=radius;
		this._startAngle=startAngle;
		this._endAngle=endAngle;
		this._anticlockwise=anticlockwise||true;
		return this;
	}
	this._proto='arc';
}
proto.arc.prototype=new proto.shape;
proto.text=function(){
	this.font=function(font)
	{
		return this.attr('font',font);
	}
	this._font="10px sans-serif";
	this.align=function(align)
	{
		return this.attr('align',align);
	}
	this._align="start";
	this.baseline=function(baseline)
	{
		return this.attr('baseline',baseline);
	}
	this._baseline="alphabetic";
	this.setOptns = function(ctx)
	{
		proto.text.prototype.setOptns(ctx);
		ctx.textBaseline=this._baseline;
		ctx.font=this._font;
		ctx.textAlign=this._align;
	}
	this.draw=function(ctx)
	{
		if(this._maxWidth==false)
		{
			if(this._fill){ctx.fillText(this._string,this._x,this._y);}
			else{ctx.strokeText(this._string,this._x,this._y);}
		}
		else
		{
			if(this._fill){ctx.fillText(this._string,this._x,this._y,this._maxWidth);}
			else{ctx.strokeText(this._string,this._x,this._y,this._maxWidth);}
		}
	}
	this.base=function(string,x,y,maxWidth,color,fill)
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
		proto.text.prototype.base.call(this,x,y,color,fill);
		this._string=string;
		this._maxWidth=maxWidth||false;
		return this;
	}
	this._proto='text';
}
proto.text.prototype=new proto.shape;