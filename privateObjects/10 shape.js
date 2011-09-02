proto.shape=function()
{
	this.fillColor = function(color)
	{
		if (color===undefined)return [this._fillColorR,this._fillColorG,this._fillColorB,this._fillColorA];
		return this.attr('fillColor',color);
	}
	this.lineColor = function(color)
	{
		if (color===undefined)return [this._lineColorR,this._lineColorG,this._lineColorB,this._lineColorA];
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
		var fillColor=updateColor(this,this.optns.fillColor,'fill');
		var lineColor=updateColor(this,this.optns.lineColor,'line');
		ctx.fillStyle = fillColor.val;
		ctx.strokeStyle = lineColor.val;
	}
	this.afterDraw=function(optns)
	{
		optns.ctx.fill();
		optns.ctx.stroke();
		proto.shape.prototype.afterDraw.call(this,optns);
	}
	this.base=function(options)
	{
		if(options===undefined)options={};
		options=checkDefaults(options,{fillColor:'rgba(0,0,0,0)',lineColor:'rgba(0,0,0,0)'});
		proto.shape.prototype.base.call(this,options);
		this.optns.fillColor={val:options.fillColor,notColor:undefined};
		this.optns.lineColor={val:options.lineColor,notColor:undefined};
		this.fillColor(options.fillColor);
		this.lineColor(options.lineColor);
		return this;
	}
	this._fillColorR=0;
	this._fillColorG=0;
	this._fillColorB=0;
	this._fillColorA=0;
	this._lineColorR=0;
	this._lineColorG=0;
	this._lineColorB=0;
	this._lineColorA=0;
	this._lineWidth = 1;
	this._cap = 'butt';
	this._join = 'miter';
	this._miterLimit= 1;
}
proto.shape.prototype=new proto.object;