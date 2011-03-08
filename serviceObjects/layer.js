jCanvaScript.layer=function(idLayer)
{
	if(idLayer===undefined)return canvases[0].layers[0];
	var limit=0;
	for(var i=0;i<canvases.length;i++)
	{
		limit=canvases[i].layers.length;
		for (var j=0;j<limit;j++)
			if(canvases[i].layers[j].optns.id==idLayer)return canvases[i].layers[j];
	}
	return layers(idLayer);
}