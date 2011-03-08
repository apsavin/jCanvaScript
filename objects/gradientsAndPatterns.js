
jCanvaScript.pattern = function(img,type)
{
	var pattern = new proto.pattern;
	return pattern.base(img,type);
}

jCanvaScript.lGradient=function(x1,y1,x2,y2,colors)
{
	var lGrad = new proto.lGradient;
	return lGrad.base(x1,y1,x2,y2,colors);
}
jCanvaScript.rGradient=function(x1,y1,r1,x2,y2,r2,colors)
{
	var rGrad = new proto.rGradient;
	return rGrad.base(x1,y1,r1,x2,y2,r2,colors);
}