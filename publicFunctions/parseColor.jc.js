jCanvaScript.parseColor = function(color)
{
	var colorKeeper={
		color:{
			val:color,
			notColor:undefined
		},
		r:0,
		g:0,
		b:0,
		a:1};
	if(color.id!==undefined)
	{
		colorKeeper.color.notColor = {
            level:color._level,
            canvas:color.optns.canvas.number,
            layer:color.optns.layer.number
        };
		return colorKeeper;
	}
	if(color.r!==undefined)
	{
		colorKeeper=checkDefaults(color,{r:0,g:0,b:0,a:1});
		colorKeeper.color = {
            val:'rgba(' + colorKeeper.r + ',' + colorKeeper.g + ',' + colorKeeper.b + ',' + colorKeeper.a + ')',
            notColor:undefined
        };
		return colorKeeper;
	}
	if(color.charAt(0)=='#')
	{
		colorKeeper.r=parseInt(color.substr(1,2),16);
		colorKeeper.g=parseInt(color.substr(3,2),16);
		colorKeeper.b=parseInt(color.substr(5,2),16);
	}
	else
	{
		var arr=color.split(',');
		if(arr.length==4)
		{
			var colorR = arr[0].split('(');
			var alpha = arr[3].split(')');
			colorKeeper.r=parseInt(colorR[1]);
			colorKeeper.g=parseInt(arr[1]);
			colorKeeper.b=parseInt(arr[2]);
			colorKeeper.a=parseFloat(alpha[0]);
		}
		if(arr.length==3)
		{
			colorR = arr[0].split('(');
			var colorB = arr[2].split(')');
			colorKeeper.r=parseInt(colorR[1]);
			colorKeeper.g=parseInt(arr[1]);
			colorKeeper.b=parseInt(colorB[0]);
		}
	}
	colorKeeper.color.notColor = undefined;
	return colorKeeper;
}