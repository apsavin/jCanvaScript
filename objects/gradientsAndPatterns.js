
jCanvaScript.pattern = function(img,type)
{
	var pattern = grdntsnptrn();
	pattern.img={val:img};
	pattern.type={val:type||'repeat'};
	pattern.create = function(ctx)
	{
		if(this.animate.val)animating.call(this);
		this.val = ctx.createPattern(this.img.val,this.type.val);
	}
	return pattern;
}

jCanvaScript.lGradient=function(x1,y1,x2,y2,colors)
{
	var lGrad = gradients(colors);
	lGrad.x1 = {val:x1};
	lGrad.y1 = {val:y1};
	lGrad.x2 = {val:x2};
	lGrad.y2 = {val:y2};
	lGrad.create = function(ctx)
	{
		if(this.animate.val)animating.call(this);
		this.val=ctx.createLinearGradient(this.x1.val,this.y1.val,this.x2.val,this.y2.val);
		for(var i=0;i<this.colorStopsCount;i++)
		{
			this.val.addColorStop(this['pos'+i].val,'rgba('+parseInt(this['colorR'+i].val)+','+parseInt(this['colorG'+i].val)+','+parseInt(this['colorB'+i].val)+','+this['alpha'+i].val+')');
		}
	}
	return lGrad;
}
jCanvaScript.rGradient=function(x1,y1,r1,x2,y2,r2,colors)
{
	var rGrad = gradients(colors);
	rGrad.x1 = {val:x1};
	rGrad.y1 = {val:y1};
	rGrad.r1 = {val:r1};
	rGrad.x2 = {val:x2};
	rGrad.y2 = {val:y2};
	rGrad.r2 = {val:r2};
	rGrad.create = function(ctx)
	{
		if(this.animate.val)animating.call(this);
		this.val=ctx.createRadialGradient(this.x1.val,this.y1.val,this.r1.val,this.x2.val,this.y2.val,this.r2.val);  
		for(var i=0;i<this.colorStopsCount;i++)
		{
			this.val.addColorStop(this['pos'+i].val,'rgba('+parseInt(this['colorR'+i].val)+','+parseInt(this['colorG'+i].val)+','+parseInt(this['colorB'+i].val)+','+this['alpha'+i].val+')');
		}
	}
	return rGrad;
}