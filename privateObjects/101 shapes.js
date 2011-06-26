proto.circle=function(){
	this.getRect=function(type)
	{
		var points={x:this._x-this._radius,y:this._y-this._radius};
		points.width=points.height=this._radius*2;
		return getRect(this,points,type);
	}
	this.draw=function(ctx)
	{
		ctx.arc(this._x, this._y, this._radius, 0,pi,true);
	}
	this.base=function(x,y,radius,color,fill)
	{
		proto.circle.prototype.base.call(this,x,y,color,fill);
		this._radius=radius||0;
		return this;
	}
	this._proto='circle';
}
proto.circle.prototype=new proto.shape;
proto.rect=function(){
	this.getRect=function(type)
	{
		return getRect(this,{x:this._x,y:this._y,width:this._width,height:this._height},type);
	}
	this.draw=function(ctx)
	{
		ctx.rect(this._x, this._y, this._width, this._height);
	}
	this.base=function(x,y,width,height,color,fill)
	{
		proto.rect.prototype.base.call(this,x,y,color,fill);
		this._width=width||0;
		this._height=height||0;
		return this;
	}
	this._proto='rect';
}
proto.rect.prototype=new proto.shape;
proto.arc=function(){
	this.getRect=function(type)
	{
		var points={x:this._x,y:this._y},
		startAngle=this._startAngle, endAngle=this._endAngle, radius=this._radius,
		startY=Math.floor(Math.sin(startAngle/radian)*radius), startX=Math.floor(Math.cos(startAngle/radian)*radius),
		endY=Math.floor(Math.sin(endAngle/radian)*radius), endX=Math.floor(Math.cos(endAngle/radian)*radius),
		positiveXs=startX>0 && endX>0,negtiveXs=startX<0 && endX<0,positiveYs=startY>0 && endY>0,negtiveYs=startY<0 && endY<0;
		points.width=points.height=radius;
		if((this._anticlockwise && startAngle<endAngle) || (!this._anticlockwise && startAngle>endAngle))
		{
			if(((negtiveXs || (positiveXs && (negtiveYs || positiveYs)))) || (startX==0 && endX==0))
			{
				points.y-=radius;
				points.height+=radius;
			}
			else
			{
				if(positiveXs && endY<0 && startY>0)
				{
					points.y+=endY;
					points.height+=endY;
				}
				else
				if(endX>0 && endY<0 && startX<0)
				{
					points.y+=Math.min(endY,startY);
					points.height-=Math.min(endY,startY);
				}
				else
				{
					if(negtiveYs)points.y-=Math.max(endY,startY);
					else points.y-=radius;
					points.height+=Math.max(endY,startY);
				}
			}
			if(((positiveYs || (negtiveYs && (negtiveXs || positiveXs) ))) || (startY==0 && endY==0))
			{
				points.x-=radius;
				points.width+=radius;
			}
			else
			{
				if(endY<0 && startY>0)
				{
					points.x+=Math.min(endX,startX);
					points.width-=Math.min(endX,startX);
				}
				else
				{
					if(negtiveXs)points.x-=Math.max(endX,startX);
					else points.x-=radius;
					points.width+=Math.max(endX,startX);
				}
			}
		}
		else
		{
			positiveXs=startX>=0 && endX>=0;
			positiveYs=startY>=0 && endY>=0;
			negtiveXs=startX<=0 && endX<=0;
			negtiveYs=startY<=0 && endY<=0;
			if(negtiveYs && positiveXs)
			{
				points.x+=Math.min(endX,startX);
				points.width-=Math.min(endX,startX);
				points.y+=Math.min(endY,startY);
				points.height+=Math.max(endY,startY);
			}
			else if (negtiveYs && negtiveXs)
			{
				points.x+=Math.min(endX,startX);
				points.width+=Math.max(endX,startX);
				points.y+=Math.min(endY,startY);
				points.height+=Math.max(endY,startY);
			}
			else if (negtiveYs)
			{
				points.x+=Math.min(endX,startX);
				points.width+=Math.max(endX,startX);
				points.y-=radius;
				points.height+=Math.max(endY,startY);
			}
			else if (positiveXs && positiveYs)
			{
				points.x+=Math.min(endX,startX);
				points.width=Math.abs(endX-startX);
				points.y+=Math.min(endY,startY);
				points.height-=Math.min(endY,startY);
			}
			else if (positiveYs)
			{
				points.x+=Math.min(endX,startX);
				points.width=Math.abs(endX)+Math.abs(startX);
				points.y+=Math.min(endY,startY);
				points.height-=Math.min(endY,startY);
			}
			else if (negtiveXs)
			{
				points.x-=radius;
				points.width+=Math.max(endX,startX);
				points.y-=radius;
				points.height+=Math.max(endY,startY);
			}
			else if (positiveXs)
			{
				points.x-=radius;
				points.width+=Math.max(endX,startX);
				points.y-=radius;
				points.height+=radius;
			}
		}
		return getRect(this,points,type);
	}
	this.draw=function(ctx)
	{
		ctx.arc(this._x, this._y, this._radius, this._startAngle/radian, this._endAngle/radian, this._anticlockwise);
	}
	this.base=function(x,y,radius,startAngle,endAngle,anticlockwise,color,fill)
	{
		if(anticlockwise!==undefined)
		{
			if(anticlockwise.charAt)color=anticlockwise;
			if(anticlockwise)anticlockwise=true;
			else anticlockwise=false;
		}
		else anticlockwise=true;
		proto.arc.prototype.base.call(this,x,y,color,fill);
		this._radius=radius;
		this._startAngle=startAngle;
		this._endAngle=endAngle;
		this._anticlockwise=anticlockwise;
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
	this.string=function(string)
	{
		return this.attr('string',string);
	}
	this.getRect=function(type)
	{
		var points={x:this._x,y:this._y}, ctx=objectCanvas(this).optns.ctx;
		points.height=parseInt(this._font);
		points.y-=points.height;
		ctx.save();
		this.setOptns(ctx);
		points.width=ctx.measureText(this._string).width;
		ctx.restore();
		return getRect(this,points,type);
	}
	this.setOptns = function(ctx)
	{
		proto.text.prototype.setOptns.call(this,ctx);
		ctx.textBaseline=this._baseline;
		ctx.font=this._font;
		ctx.textAlign=this._align;
	}
	this.draw=function(ctx)
	{
			if(this._fill){ctx.fillText(this._string,this._x,this._y,this._maxWidth);}
			else{ctx.strokeText(this._string,this._x,this._y,this._maxWidth);}
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
		proto.text.prototype.base.call(this,x,y,color,fill||1);
		this._string=string;
		this._maxWidth=maxWidth||false;
		return this;
	}
	this._proto='text';
}
proto.text.prototype=new proto.shape;