/*!
 * jCanvaScript JavaScript Library v 1.3.0
 * http://jcscript.com/
 *
 * Copyright 2011, Alexander Savin
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
(function(window,undefined){
var canvases = [],pi=Math.PI*2,lastCanvas=0,lastLayer=0,underMouse = false,regHasLetters = /[A-z]+?/,FireFox=window.navigator.userAgent.match(/Firefox\/\w+\.\w+/i);
if (FireFox!="" && FireFox!==null)
	var FireFox_lt5=(parseInt(FireFox[0].split(/[ \/\.]/i)[1])<5);

function findById(i,j,stroke)
{
	var objs=canvases[i].layers[j].objs;
	var grdntsnptrns=canvases[i].layers[j].grdntsnptrns;
	var limit=objs.length;
	for(var k=0;k<limit;k++)
		if('#'+objs[k].optns.id==stroke)return objs[k];
	limit=grdntsnptrns.length;
	for(k=0;k<limit;k++)
		if('#'+grdntsnptrns[k].optns.id==stroke)return grdntsnptrns[k];
	return false;
}
function findByName(i,j,myGroup,stroke)
{
	var objs=canvases[i].layers[j].objs;
	var grdntsnptrns=canvases[i].layers[j].grdntsnptrns;
	var limit=objs.length;
	for(var k=0;k<limit;k++)
		if(('.'+objs[k]._name)==stroke)myGroup.elements.push(objs[k]);
	limit=grdntsnptrns.length;
	for(k=0;k<limit;k++)
		if(('.'+grdntsnptrns[k]._name)==stroke)myGroup.elements.push(grdntsnptrns[k]);
	return myGroup;
}
function findByCanvasAndLayer(i,j,myGroup)
{
	var objs=canvases[i].layers[j].objs;
	var grdntsnptrns=canvases[i].layers[j].grdntsnptrns;
	var limit=objs.length;
	for(var k=0;k<limit;k++)
		myGroup.elements.push(objs[k]);
	limit=grdntsnptrns.length;
	for(k=0;k<limit;k++)
		myGroup.elements.push(grdntsnptrns[k]);
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
	var canvas=-1,layer=-1,limitC=canvases.length,limitL=0,limit=0,myGroup=group();
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
				if(canvases[i].optns.id==map.canvas){canvas=i;break;}
		}
		if(map.layer!==undefined)
		{
			if(canvas!=-1)
			{
				limit=canvases[canvas].layers.length;
				for(i=0;i<limit;i++)
					if(canvases[canvas].layers[i].optns.id==map.layer){layer=i;break;}
			}
			else
			{
				for(i=0;i<limitC;i++)
				{
					limit=canvases[i].layers.length;
					for (j=0;j<limit;j++)
					{
						if(canvases[i].layers[j].optns.id==map.layer){canvas=i;layer=j;break;}
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
				return findByCanvasAndLayer(canvas,layer,myGroup);
			}
			if(stroke.charAt(0)=='#')
			{
				return findById(canvas,layer,stroke);
			}
			if(stroke.charAt(0)=='.')
			{
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
window.jCanvaScript=window.jc=jCanvaScript;})(window,undefined);