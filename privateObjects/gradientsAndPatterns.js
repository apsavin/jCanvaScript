function grdntsnptrn()
{
	var grdntsnptrn={};
	var tmpObj=obj(0,0,true);
	grdntsnptrn.animate=tmpObj.animate;
	grdntsnptrn.animateQueue=tmpObj.animateQueue;
	grdntsnptrn.attr=tmpObj.attr;
	grdntsnptrn.layer=tmpObj.layer;
	grdntsnptrn.id=tmpObj.id;
	grdntsnptrn.name=tmpObj.name;

	grdntsnptrn.level=tmpObj.level;
	grdntsnptrn.layer=function(idLayer)
	{
		return layer(idLayer,this,'grdntsnptrns');
	}
	grdntsnptrn.layer.val=canvases[lastCanvas].id.val+'Layer_0';
	grdntsnptrn.layer.number=0
	grdntsnptrn.canvas=function(idCanvas)
	{
		return canvas(idCanvas,this,'grdntsnptrns');
	}
	grdntsnptrn.canvas.number=lastCanvas;
	grdntsnptrn.level.val=canvases[lastCanvas].layers[0].grdntsnptrns.length;
	canvases[lastCanvas].layers[0].grdntsnptrns[grdntsnptrn.level.val]=grdntsnptrn;
	redraw(grdntsnptrn);
	return grdntsnptrn;
}
function gradients(colors)
{
	var gradients = grdntsnptrn();
	gradients.colorStopsCount=0;
	gradients.paramNames=['pos','colorR','colorG','colorB','alpha'];
	gradients.addColorStop=function(pos,color){
		redraw(this);
		var colorKeeper = parseColor(color);
		var i=this.colorStopsCount;
		gradients['pos'+i] = {val:pos};
		gradients['colorR'+i] = colorKeeper.colorR;
		gradients['colorG'+i] = colorKeeper.colorG;
		gradients['colorB'+i] = colorKeeper.colorB;
		gradients['alpha'+i] = colorKeeper.alpha;
		this.colorStopsCount++;
		return this;
	}
	gradients.animateObj=gradients.animate;
	gradients.animate=function(parameters,duration,easing,onstep,fn){
		for(var key in parameters)
		{
			if(key.substr(0,5)=='color')
			{
				var i=key.substring(5);
				var colorKeeper=parseColor(parameters[key]);
				parameters['colorR'+i] = colorKeeper.colorR.val;
				parameters['colorG'+i] = colorKeeper.colorG.val;
				parameters['colorB'+i] = colorKeeper.colorB.val;
				parameters['alpha'+i] = colorKeeper.alpha.val;
			}
		}
		this.animateObj(parameters,duration,easing,onstep,fn);
	}
	gradients.delColorStop=function(i)
	{
		redraw(this);
		var colorStops=this.colorStops();
		colorStops.splice(i,1);
		if(colorStops.length>0)this.colorStops(colorStops);
		else this.colorStopsCount=0;
		return this;
	}
	gradients.colorStops=function(array)
	{
		var names=this.paramNames;
		if(array===undefined){
			array=[];
			for(var j=0;j<this.colorStopsCount;j++)
			{
				array[j]=[];
				for(var i=0;i<names.length;i++)
					array[j][i]=this[names[i]+j].val;
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
					this[names[i]+j]={val:array[j][i]};
		for(j=limit;j<oldCount;j++)
			for(i=0;i<names.length;i++)
				this[names[i]+j]=undefined;
		this.colorStopsCount=limit;
		return this;
	}
	if (colors==undefined)
		return gradients;
	else return gradients.colorStops(colors);
}