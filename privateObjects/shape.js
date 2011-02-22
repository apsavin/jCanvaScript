function shapes(x,y,color,fill)
{
	if(color===undefined)color='rgba(0,0,0,1)';
	else
	{
		if(!color.charAt && color.id===undefined)
		{
			fill=color;
			color='rgba(0,0,0,1)';
		}
	}
	var shape = obj(x,y);
	shape.fill={val:fill};
	shape.color = function(color)
	{
		if (color===undefined)return [this.colorR.val,this.colorG.val,this.colorB.val,this.alpha.val];
		var colorKeeper = parseColor(color);
		this.color.val = colorKeeper.color.val;
		this.color.notColor = colorKeeper.color.notColor;
		this.colorR = colorKeeper.colorR;
		this.colorG = colorKeeper.colorG;
		this.colorB = colorKeeper.colorB;
		this.alpha = colorKeeper.alpha;
		return this;
	}
	shape.color.val=color;
	shape.color.notColor=undefined;
	shape.colorR={val:0};
	shape.colorG={val:0};
	shape.colorB={val:0};
	shape.alpha={val:0};
	shape.lineWidth = {val:1};
	shape.cap = 'butt';
	shape.join = 'miter';
	shape.miterLimit= {val:1};
	shape.lineStyle = function(options)
	{
		if(options=='lineWidth')return this.lineWidth.val;
		if(options=='cap')return this.cap;
		if(options=='join')return this.join;
		if(options=='miterLimit')return this.miterLimit.val;
		if(options.lineWidth !== undefined)
		{
			this.lineWidth.val=options.lineWidth;
		}
		if(options.cap !== undefined)
		{
			this.cap=options.cap;
		}
		if(options.join !== undefined)
		{
			this.join=options.join;
		}
		if(options.miterLimit !== undefined)
		{
			this.miterLimit.val=options.miterLimit;
		}
		return this;
	}
	shape.setObjOptns = shape.setOptns;
	shape.setOptns = function(ctx)
	{
		this.setObjOptns(ctx);
		ctx.lineWidth = this.lineWidth.val;
		ctx.lineCap = this.cap;
		ctx.lineJoin = this.join;
		ctx.miterLimit = this.miterLimit.val;
		if(this.color.notColor===undefined)
			this.color.val='rgba('+parseInt(this.colorR.val)+','+parseInt(this.colorG.val)+','+parseInt(this.colorB.val)+','+parseInt(this.alpha.val*100)/100+')';
		else
			if(canvases[this.color.notColor.canvas].layers[this.color.notColor.layer].grdntsnptrns[this.color.notColor.level]!==undefined){this.color.val=canvases[this.color.notColor.canvas].layers[this.color.notColor.layer].grdntsnptrns[this.color.notColor.level].val;}
		if(this.fill.val) ctx.fillStyle = this.color.val;
		else ctx.strokeStyle = this.color.val;
	}
	shape.afterDrawObj=shape.afterDraw;
	shape.afterDraw=function(optns)
	{
		if(this.fill.val)
			optns.ctx.fill();
		else
			optns.ctx.stroke();
		this.afterDrawObj(optns);
	}
	if(color===undefined)return shape;
	return shape.color(color);
}