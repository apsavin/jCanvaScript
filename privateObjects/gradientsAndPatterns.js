function grdntsnptrn()
{
	var grdntsnptrn={};
	var tmpObj=obj(0,0,true);
	grdntsnptrn.animate=tmpObj.animate;
	grdntsnptrn.layer=tmpObj.layer;
	grdntsnptrn.id=tmpObj.id;
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
	gradients.n=0;
	for (var i=0; i<colors.length;i++)
	{
		gradients['pos'+i] = {val:colors[i][0]};
		var colorKeeper = parseColor(colors[i][1]);
		gradients['colorR'+i] = colorKeeper.colorR;
		gradients['colorG'+i] = colorKeeper.colorG;
		gradients['colorB'+i] = colorKeeper.colorB;
		gradients['alpha'+i] = colorKeeper.alpha;
		gradients.n=i;
	}
	return gradients;
}