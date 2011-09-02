jCanvaScript.line=function(points,lineColor,fillColor)
{
	var line = new proto.line;
	return line.base(points,lineColor,fillColor);
}
jCanvaScript.qCurve=function(points,lineColor,fillColor)
{
	var qCurve = new proto.qCurve;
	return qCurve.base(points,lineColor,fillColor);
}
jCanvaScript.bCurve=function(points,lineColor,fillColor)
{
	var bCurve = new proto.bCurve;
	return bCurve.base(points,lineColor,fillColor);
}