jCanvaScript.addFunction=function(name,fn,prototype)
{
	proto[prototype||'object'].prototype[name]=fn;
	return this;
}
jCanvaScript.addObject=function(name,constructor,parent)
{
	proto[name]=constructor;
	var protoItem=proto[name];
	if(parent===undefined)parent='shape';
	protoItem.prototype=new proto[parent];
	(function(name)
	{
		jCanvaScript[name]=function()
		{
			var object=new proto[name];
			return object.base.apply(object,arguments);
		}
	})(name);
	return this;
}
jCanvaScript.addAnimateFunction=function(name,fn)
{
	animateFunctions[name]=fn;
	return this;
}
jCanvaScript.addImageDataFilter=function(name,properties)
{
	if(imageDataFilters[name]===undefined)imageDataFilters[name]={};
	if(properties.fn!==undefined)imageDataFilters[name].fn=properties.fn;
	if(properties.matrix!==undefined && properties.type===undefined)imageDataFilters[name].matrix=properties.matrix;
	if(properties.type!==undefined)imageDataFilters[name].matrix[type]=properties.matrix;
	return jCanvaScript;
}
jCanvaScript.getCenter = getCenter;
jCanvaScript.getRect = getRect;
jCanvaScript.checkDefaults = checkDefaults;
jCanvaScript.parseColor = parseColor;
jCanvaScript.imageDataFilters = imageDataFilters;
jCanvaScript.constants={
	PIx2:pi2,
	radian:radian,
	regNumsWithMeasure:regNumsWithMeasure
}
jCanvaScript.clear=function(idCanvas)
{
	if(canvases[0]===undefined)return jCanvaScript;
	if(idCanvas===undefined){canvases[0].clear();return jCanvaScript;}
	jCanvaScript.canvas(idCanvas).clear();
	return jCanvaScript;
}
jCanvaScript.pause=function(idCanvas)
{
	if(idCanvas===undefined){canvases[0].pause();return jCanvaScript;}
	jCanvaScript.canvas(idCanvas).pause();
	return jCanvaScript;
}
jCanvaScript.start=function(idCanvas,isAnimated)
{
	jCanvaScript.canvas(idCanvas).start(isAnimated);
	return jCanvaScript;
}