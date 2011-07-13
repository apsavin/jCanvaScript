function init(idCanvas) {

	/////////// ALEX, YOU WILL NORMALLY IGNORE THIS PART, AND GO TO THE ANIMATION SECTION /////////

	//++++++++++++++++++++++ VARS +++++++++++++++++++++++++

	// POSITION-RELATED: appearance, etc.
	//puesto
	var pBisel = 8; // puestoBisel: dist entre orilla d cuadro y luz d cuadro
	var pW = 120, pH = 85, pX = 190, pY = 150;// puestoWidth...
	var pColor = "#E21950";
	var pColorLuz = "#EE9090"; //luz = brillo
	var pColorSombra = "#000000";
	var tNomb = "Name of Person"; //textoNomb
	var tNombEstilo = "bold 11px Arial"; //en ese orden
	var tNombColor = "#000000";
	var tPos = "Name of Position"; //HERE MULTI-LINE TEXT WOULD BE HANDY :)
	var tPosEstilo = "bold 12px Arial";
	var tPosColor = "#ffffff";

	//ORG CHART RELATED
	var dX = 150; //delta x: distance between position boxes
	var c = [[0,0],[-dX,dX],[dX,dX]];  //c = coordinates (relative distance from top position)
	var iX, iY;

	//++++++++++++++++++++++ CREACION GRAFICA +++++++++++++++++++++++++

	jc.start(idCanvas,20);

	// gradiente luz p todos puestos
	var pGradLuz=[[0,'rgba(255,255,255,.75)'],[0.2,pColorLuz],[0.5,'rgba(255,255,255,0)']];
	jc.lGradient(0,pY,2,pY+pH,pGradLuz).id('luz');

	// crear n puestos
	for (var counter=0; counter < 3; counter++) {

		// cuadro puesto
		jc.rect(pX,pY,pW,pH,pColor,1)
			.name('puesto'+counter)
			.layer('layer'+counter)
			.shadow({x:5,y:5,blur:8,color:pColorSombra});

		// cuadro luz puesto
		jc.rect(pX+pBisel/2,pY+pBisel/2,pW-pBisel,pH-pBisel,jc('#luz'),1)
			.name('puesto'+counter)
			.layer('layer'+counter)
			.click( function() {abreDetalle()});
			
		// crear nombre
		jc.text(tNomb, pX+pW/2, pY+pH*.33, tNombColor).align('center').font(tNombEstilo)
			.name('puesto'+counter)
			.layer('layer'+counter);

		// crear posiC (nomb d puesto)
		// HERE MULTI-LINE TEXT WOULD BE HANDY :)
		jc.text(tPos, pX+pW/2, pY+pH*.66, tPosColor).align('center').font(tPosEstilo)
			.name('puesto'+counter)
			.layer('layer'+counter);
		
		///////////////////  ANIMATION  SECTION - inside a loop /////////////////
		
		//++++++++++++++++++++++ animacion +++++++++++++++++++++++++
		
		iX = c[counter][0]; iY = c[counter][1]
		console.log('before queue (iX,iY): '+iX+','+iY);
		
		jc('.puesto'+counter)
			.queue(
				function(){				
					this.fadeTo(0.5,1000)
				},
				
				//maybe I'm missing some programming background here.
				
				function(){  // )(iX, iY){  
					console.log('inside queue (iX,iY): '+iX+','+iY);
					//console.log('inside queue c[,]]: '+c[counter][0]+','+c[counter][1]);
					
					this.translate(iX,iY,1000)  //the 3 groups move to the same place
					//this.translate(c[counter][0],c[counter][1],1000)
				}
			);
	};

}

function abreDetalle() {
	// irrelevant, however, multi-line text is key here :(
}

function start1(idCanvas) {
	jc.clear(idCanvas);
	init(idCanvas);
}

function stop1(idCanvas) {
	
}