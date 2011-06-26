proto.grdntsnptrn=function()
{
	this.layer=function(idLayer)
	{
		return layer(idLayer,this,'grdntsnptrns');
	}
	this.canvas=function(idCanvas)
	{
		return canvas(idCanvas,this,'grdntsnptrns');
	}
	var tmpObj=new proto.object;
	this.animate=tmpObj.animate;
	this.attr=tmpObj.attr;
	this.id=tmpObj.id;
	this.name=tmpObj.name;
	this.level=tmpObj.level;
	this.base=function()
	{
		this.animateQueue=[];
		this.optns={
			animated:false,
			name:"",
			layer:{id:canvases[0].optns.id+'Layer_0',number:0},
			canvas:{number:0},
			visible:true
		}
		this.optns.layer.id=canvases[lastCanvas].optns.id+'Layer_0';
		this.optns.layer.number=0
		this.optns.canvas.number=lastCanvas;
		var grdntsnptrnsArray=canvases[lastCanvas].layers[0].grdntsnptrns;
		this._level=grdntsnptrnsArray.length;
		grdntsnptrnsArray[this._level]=this;
		redraw(this);
	}
	return this;
}
proto.gradients=function()
{
	this.colorStopsCount=0;
	this.paramNames=['_pos','_colorR','_colorG','_colorB','_alpha'];
	this.addColorStop=function(pos,color){
		redraw(this);
		var colorKeeper = parseColor(color);
		var i=this.colorStopsCount;
		this['_pos'+i] = pos;
		this['_colorR'+i] = colorKeeper.r;
		this['_colorG'+i] = colorKeeper.g;
		this['_colorB'+i] = colorKeeper.b;
		this['_alpha'+i] = colorKeeper.a;
		this.colorStopsCount++;
		return this;
	}
	this.animate=function(parameters,duration,easing,onstep,fn){
		for(var key in parameters)
		{
			if(key.substr(0,5)=='color')
			{
				var i=key.substring(5);
				var colorKeeper=parseColor(parameters[key]);
				parameters['colorR'+i] = colorKeeper.r;
				parameters['colorG'+i] = colorKeeper.g;
				parameters['colorB'+i] = colorKeeper.b;
				parameters['alpha'+i] = colorKeeper.a;
			}
		}
		proto.gradients.prototype.animate.call(this,parameters,duration,easing,onstep,fn);
	}
	this.delColorStop=function(i)
	{
		redraw(this);
		var colorStops=this.colorStops();
		colorStops.splice(i,1);
		if(colorStops.length>0)this.colorStops(colorStops);
		else this.colorStopsCount=0;
		return this;
	}
	this.colorStops=function(array)
	{
		var names=this.paramNames;
		if(array===undefined){
			array=[];
			for(var j=0;j<this.colorStopsCount;j++)
			{
				array[j]=[];
				for(var i=0;i<names.length;i++)
					array[j][i]=this[names[i]+j];
			}
			return array;
		}
		redraw(this);
		var oldCount=this.colorStopsCount;
		var limit=array.length;
		if(array[0].length==2)
			for(j=0;j<limit;j++)
				this.addColorStop(array[j][0], array[j][1]);
		else
			for(j=0;j<limit;j++)
				for(i=0;i<names.length;i++)
					this[names[i]+j]=array[j][i];
		for(j=limit;j<oldCount;j++)
			for(i=0;i<names.length;i++)
				this[names[i]+j]=undefined;
		this.colorStopsCount=limit;
		return this;
	}
	this.base=function(colors)
	{
		proto.gradients.prototype.base.call(this);
		if (colors==undefined)
			return this;
		else return this.colorStops(colors);
	}
}
proto.gradients.prototype=new proto.grdntsnptrn;