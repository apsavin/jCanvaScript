jCanvaScript.imageData=function(width,height)
{
	var imageData=new proto.imageData;
	return imageData.base(width,height);
}
jCanvaScript.image=function(img,sx,sy,swidth,sheight,dx,dy,dwidth,dheight)
{
	var image=new proto.image;
	return image.base(img,sx,sy,swidth,sheight,dx,dy,dwidth,dheight);
}