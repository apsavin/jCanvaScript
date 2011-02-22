jCanvaScript.addObject=function(name,parameters,drawfn)
{
	jCanvaScript[name]=function()
	{
		var object=shapes(parameters.x||0,parameters.y||0,parameters.color||"rgba(0,0,0,0)",parameters.fill||1);
		var i=0;
		for(var key in parameters)
		{
			if(object[key]===undefined)
				object[key]={val:arguments[i]||parameters[key]};
			else
				object[key].val=arguments[i]||parameters[key];
			if(key=='color')object.color(arguments[i]||parameters[key]);
			i++;
		}
		object.draw=drawfn;
		return object;
	}
}
jCanvaScript.addAnimateFunction=function(name,fn)
{
	animateFunctions[name]=fn;
}
jCanvaScript.clear=function(idCanvas)
{
	if(canvases[0]===undefined)return;
	if(idCanvas===undefined){canvases[0].clear();return;}
	jCanvaScript.canvas(idCanvas).clear();
}
jCanvaScript.pause=function(idCanvas)
{
	if(idCanvas===undefined){canvases[0].pause();return;}
	jCanvaScript.canvas(idCanvas).pause();
}
jCanvaScript.start=function(idCanvas,fps)
{
	lastCanvas=jCanvaScript.canvas(idCanvas).start(fps).layers[0].canvas.number;
}