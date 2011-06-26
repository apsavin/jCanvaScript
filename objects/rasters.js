jCanvaScript.imageData=function(width,height)
{
	var imageData=new proto.imageData;
	return imageData.base(width,height);
}
jCanvaScript.image=function(img,x,y,width,height,sx,sy,swidth,sheight)
{
	var image=new proto.image;
	return image.base(img,x,y,width,height,sx,sy,swidth,sheight);
}