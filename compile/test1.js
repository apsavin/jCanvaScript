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
	//var dX = 150; //delta x: distance between position boxes
	//var c = [[0,0],[-dX,dX],[dX,dX]];  //c = coordinates (relative distance from top position)

	//++++++++++++++++++++++ CREACION GRAFICA +++++++++++++++++++++++++

	jc.start(idCanvas,20);

	// gradiente luz p todos puestos
	var pGradLuz=[[0,'rgba(255,255,255,.75)'],[0.2,pColorLuz],[0.5,'rgba(255,255,255,0)']];
	jc.lGradient(0,pY,2,pY+pH,pGradLuz).id('luz');

	// crear n puestos
	for (var counter=0; counter < 4; counter++) {

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
		jc.text(tNomb, pX+pW/2, pY+pH*.33, tNombColor).align('left').font(tNombEstilo)
			.name('puesto'+counter)
			.layer('layer'+counter);

		// crear posiC (nomb d puesto)
		// HERE MULTI-LINE TEXT WOULD BE HANDY :)
		jc.text(tPos, pX+pW/2, pY+pH*.66, tPosColor).align('right').font(tPosEstilo)
			.name('puesto'+counter)
			.layer('layer'+counter);

		//var iX = c[counter][0]; iY = c[counter][1]
		
		///////////////////  ANIMATION  SECTION - inside a loop /////////////////
		
		//++++++++++++++++++++++ animacion +++++++++++++++++++++++++
		
		switch (counter){
			case 0:
				jc('.puesto'+counter)
					.translateTo(50,50,2000);
				break
			case 1:
				jc('.puesto'+counter)
					.scale(1.5,1.5,2000);
				break
				
			// WITH LAYERS
			case 2:
				jc.layer('layer'+counter)
					.translateTo(50,350,2000);
				break
			case 3:
				jc.layer('layer'+counter)
					.scale(1.5,1.5,2000)
					.translate(100,150); //to be visible
				break
			}
		// FOR ROTATE, USE stop BUTTON !!!
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
	jc('.puesto0')
		.rotate(30,'center');		
	jc('.puesto1')
		.rotate(30,'center');		
	// LAYERS
	jc.layer('layer2')
		.rotate(30,'center');
	jc.layer('layer3')
		.rotate(30,'center');

}