jCanvaScript.ellipse=function(x,y,width,height,lineColor,fillColor)
{
	var ellipse = new proto.ellipse;
	return ellipse.base(x,y,width,height,lineColor,fillColor);
}
jCanvaScript.rect=function(x,y,width,height,lineColor,fillColor)
{
	var rect = new proto.rect;
	return rect.base(x,y,width,height,lineColor,fillColor);
}
jCanvaScript.arc=function(x,y,radius,startAngle,endAngle,anticlockwise,lineColor,fillColor)
{
	var arc=new proto.arc;
	return arc.base(x,y,radius,startAngle,endAngle,anticlockwise,lineColor,fillColor);
}
jCanvaScript.text = function(string,x,y,maxWidth,lineColor,fillColor)
{
	var text=new proto.text;
	return text.base(string,x,y,maxWidth,lineColor,fillColor);
}