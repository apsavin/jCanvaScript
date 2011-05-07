jCanvaScript.layer=function(idLayer)
{
	if(idLayer===undefined)return canvases[0].layers[0];
	var limit=0;
	for(var i=0;i<canvases.length;i++)
	{
		var canvas=canvases[i];
		limit=canvas.layers.length;
		for (var j=0;j<limit;j++)
		{
			var layer=canvas.layers[j];
			if(layer.optns.id==idLayer)return layer;
		}
	}
	return layers(idLayer);
}