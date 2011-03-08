jCanvaScript.line=function(points,color,fill)
{
	var line = new proto.line;
	return line.base(points,color,fill);
}
jCanvaScript.qCurve=function(points,color,fill)
{
	var qCurve = new proto.qCurve;
	return qCurve.base(points,color,fill);
}
jCanvaScript.bCurve=function(points,color,fill)
{
	var bCurve = new proto.bCurve;
	return bCurve.base(points,color,fill);
}