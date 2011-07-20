jCanvaScript.layer=function(idLayer)
{
	if(idLayer===undefined)return canvases[0].layers[0];
	for(var i=0;i<canvases.length;i++)
	{
		var layersArray=canvases[i].layers;
		for (var j=0;j<layersArray.length;j++)
			if(layersArray[j].optns.id==idLayer)
				return layersArray[j];
	}
	return layers(idLayer);
}