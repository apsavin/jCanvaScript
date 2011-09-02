proto.shape=function()
{
	this.fillColor = function(color)
	{
		if (color===undefined)return [this._fillColorR,this._fillColorG,this._fillColorB,this._fillAlpha];
		return this.attr('fillColor',color);
	}
	this.lineColor = function(color)
	{
		if (color===undefined)return [this._lineColorR,this._lineColorG,this._lineColorB,this._lineAlpha];
		return this.attr('lineColor',color);
	}
	this.lineStyle = function(options)
	{
		return this.attr(options);
	}
	this.setOptns = function(ctx)
	{
		proto.shape.prototype.setOptns.call(this,ctx);
		ctx.lineWidth = this._lineWidth;
		ctx.lineCap = this._cap;
		ctx.lineJoin = this._join;
		ctx.miterLimit = this._miterLimit;
		var fillColor=updateColor(this.optns.fillColor,'fill');
		var lineColor=updateColor(this.optns.lineColor,'line');
		ctx.fillStyle = fillColor.val;
		ctx.strokeStyle = lineColor.val;
	}
	this.afterDraw=function(optns)
	{
		optns.ctx.fill();
		optns.ctx.stroke();
		proto.shape.prototype.afterDraw.call(this,optns);
	}
	this.base=function(x)
	{
		if(x===undefined)x={};
		if(x.color===undefined)x.color='rgba(0,0,0,1)';
		else
		{
			if(!x.color.charAt && x.color.id===undefined && x.color.r===undefined)
			{
				x.fill=x.color;
				x.color='rgba(0,0,0,1)';
			}
		}
		x=checkDefaults(x,{color:'rgba(0,0,0,1)',fill:0});
		proto.shape.prototype.base.call(this,x);
		this._fill=x.fill;
		this.optns.color={val:x.color,notColor:undefined};
		return this.color(x.color);
	}
	this._colorR=0;
	this._colorG=0;
	this._colorB=0;
	this._alpha=0;
	this._lineWidth = 1;
	this._cap = 'butt';
	this._join = 'miter';
	this._miterLimit= 1;
}
proto.shape.prototype=new proto.object;