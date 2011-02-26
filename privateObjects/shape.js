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
		return this.attr('color',color);
	}
	shape.color.val=color;
	shape.color.notColor=undefined;
	shape.colorR={val:0};
	shape.colorG={val:0};
	shape.colorB={val:0};
	shape.alpha={val:0};
	shape.lineWidth = {val:1};
	shape.cap = {val:'butt'};
	shape.join = {val:'miter'};
	shape.miterLimit= {val:1};
	shape.lineStyle = function(options)
	{
		return this.attr(options);
	}
	shape.setObjOptns = shape.setOptns;
	shape.setOptns = function(ctx)
	{
		this.setObjOptns(ctx);
		ctx.lineWidth = this.lineWidth.val;
		ctx.lineCap = this.cap.val;
		ctx.lineJoin = this.join.val;
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