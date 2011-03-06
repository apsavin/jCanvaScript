/*!
 * jCanvaScript JavaScript Library v 1.1.3
 * http://jcscript.com/
 *
 * Copyright 2010, Alexander Savin
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
(function(){
var canvases = [];
var pi=Math.PI*2;
var lastCanvas=0;
var lastLayer=0;
var underMouse = false;
var FireFox=window.navigator.userAgent.match(/Firefox\/\w+\.\w+/i);
if (FireFox!="" && FireFox!==null)
	var FireFox_lt4=(parseInt(FireFox[0].split(/[ \/\.]/i)[1])<4);
var regHasLetters = /[A-z]+?/;
function findById(i,j,stroke)
{
	var limit=canvases[i].layers[j].objs.length;
	for(var k=0;k<limit;k++)
		if('#'+canvases[i].layers[j].objs[k].id.val==stroke)return canvases[i].layers[j].objs[k];
	limit=canvases[i].layers[j].grdntsnptrns.length;
	for(k=0;k<limit;k++)
		if('#'+canvases[i].layers[j].grdntsnptrns[k].id.val==stroke)return canvases[i].layers[j].grdntsnptrns[k];
	return false;
}
function findByName(i,j,myGroup,stroke)
{
	var limit=canvases[i].layers[j].objs.length;
	for(var k=0;k<limit;k++)
		if(('.'+canvases[i].layers[j].objs[k].name.val)==stroke)myGroup.elements[myGroup.elements.length]=canvases[i].layers[j].objs[k];
	limit=canvases[i].layers[j].grdntsnptrns.length;
	for(k=0;k<limit;k++)
		if(('.'+canvases[i].layers[j].grdntsnptrns[k].name.val)==stroke)myGroup.elements[myGroup.elements.length]=canvases[i].layers[j].grdntsnptrns[k];
	return myGroup;
}
function findByCanvasAndLayer(i,j,myGroup)
{
	var limit=canvases[i].layers[j].objs.length;
	for(var k=0;k<limit;k++)
		myGroup.elements[myGroup.elements.length]=canvases[i].layers[j].objs[k];
	limit=canvases[i].layers[j].grdntsnptrns.length;
	for(k=0;k<limit;k++)
		myGroup.elements[myGroup.elements.length]=canvases[i].layers[j].grdntsnptrns[k];
	return myGroup;
}
var jCanvaScript=function(stroke,map)
{
	if(stroke===undefined)return this;
	if(typeof stroke=='object')
	{
		map=stroke;
		stroke=undefined;
	}
	var canvas=-1;
	var layer=-1;
	var limitC=canvases.length;
	var limitL=0;
	var limit=0;
	if (map===undefined)
	{
		if(stroke.charAt(0)=='#')
		{
			for(i=0;i<limitC;i++)
			{
				limitL=canvases[i].layers.length;
				for (j=0;j<limitL;j++)
				{
					var element=findById(i,j,stroke);
					if(element)return element;
				}
			}
		}
		if(stroke.charAt(0)=='.')
		{
			var myGroup=group();
			for(var i=0;i<limitC;i++)
			{
				limitL=canvases[i].layers.length;
				for (var j=0;j<limitL;j++)
				{
					myGroup=findByName(i,j,myGroup,stroke);
				}
			}
			return myGroup;
		}
	}
	else
	{
		if(map.canvas!==undefined)
		{
			for(i=0;i<limitC;i++)
				if(canvases[i].id.val==map.canvas){canvas=i;break;}
		}
		if(map.layer!==undefined)
		{
			if(canvas!=-1)
			{
				limit=canvases[canvas].layers.length;
				for(i=0;i<limit;i++)
					if(canvases[canvas].layers[i].id.val==map.layer){layer=i;break;}
			}
			else
			{
				for(i=0;i<limitC;i++)
				{
					limit=canvases[i].layers.length;
					for (j=0;j<limit;j++)
					{
						if(canvases[i].layers[j].id.val==map.layer){canvas=i;layer=j;break;}
					}
					if (layer>-1)break;
				}
			}
		}
		if(layer<0 && canvas<0)return false;
		if (layer<0)
		{
			limitL=canvases[canvas].layers.length;
			if (stroke===undefined)
			{
				myGroup=group();
				for (j=0;j<limitL;j++)
				{
					myGroup=findByCanvasAndLayer(canvas,j,myGroup);
				}
				return myGroup;
			}
			if(stroke.charAt(0)=='#')
			{
				for (j=0;j<limitL;j++)
				{
					element=findById(canvas,j,stroke);
					if(element)return element;
				}
			}
			if(stroke.charAt(0)=='.')
			{
				myGroup=group();
				for (j=0;j<limitL;j++)
				{
					myGroup=findByName(canvas,j,myGroup,stroke);
				}
				return myGroup;
			}
		}
		else
		{
			if(stroke===undefined)
			{
				myGroup=group();
				return findByCanvasAndLayer(canvas,layer,myGroup);
			}
			if(stroke.charAt(0)=='#')
			{
				return findById(canvas,layer,stroke);
			}
			if(stroke.charAt(0)=='.')
			{
				myGroup=group();
				return findByName(canvas,layer,myGroup,stroke)
			}
		}
	}
}

<include src="privateFunctions"/>
<include src="privateObjects"/>
<include src="publicFunctions"/>
<include src="objects"/>
<include src="serviceObjects"/>
window.jCanvaScript=window.jc=jCanvaScript;})();