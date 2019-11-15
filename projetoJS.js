var mainCanvas = document.getElementById("mainCanvas");
var pointCB = document.getElementById("pointCB");
var lineCB = document.getElementById("lineCB");
var curveCB = document.getElementById("curveCB");

//informacoes sobre a curva
var selCurve = 0;
var qttCurves = 0;
var beziers = new Array();

//Objeto coordenada
function coord(x, y){
	this.x = x;
	this.y = y;
}

//Funcao para adicionar curva
function addCurve(){
	qttCurves++;
	unselectCurve();
	selCurve = qttCurves-1;

	beziers[qttCurves-1] = new Array();
}

function deleteCurve(){
	if(qttCurves > 0){
		qttCurves--;
		//Removecao dos pontos e linhas da curva
		let lineClass = "l" + selCurve;
		var lines = document.getElementsByClassName(lineClass);
		for (var i = lines.length - 1; i >= 0; i--) {
			mainCanvas.removeChild(lines[i]);
		}
		let pointClass = "p" + selCurve;
		var points = document.getElementsByClassName(pointClass);
		for (var i = points.length - 1; i >= 0; i--) {
			mainCanvas.removeChild(points[i]);
		}

		//Realocacao da ultima curva
		lineClass = "l" + qttCurves;
		let newLineClass = "l" + selCurve;
		var lines = document.getElementsByClassName(lineClass);
		for (var i = lines.length - 1; i >= 0; i--) {
			lines[i].setAttribute("class", newLineClass);
		}
		pointClass = "p" + qttCurves;
		let newPointClass = "p" + selCurve;
		var points = document.getElementsByClassName(pointClass);
		for (var i = points.length - 1; i >= 0; i--) {
			points[i].setAttribute("class", newPointClass)
		}

		beziers = beziers.slice(0, selCurve+1).concat(beziers.slice(selCurve + 1));

		selCurve = qttCurves-1;
		selectCurve();

	}else{
		alert("Não há mais curvas para deletar.");
	}
}

//Adiciona um ponto a tela
function addPoint(event){
	//Nao permite adicinoar pontos se nao houver linhas
	if(qttCurves == 0){
		alert("Crie uma curva para adicionar pontos.")
		return;
	}

	var web = "http://www.w3.org/2000/svg";
	var mouseX = event.offsetX, mouseY = event.offsetY;
	let pointClass = "p" + selCurve;

	//Criacao de pontos
	let color;
	if(pointCB.checked) color = "green";
	else color = "transparent";
	var c = document.createElementNS(web, "circle");
	c.setAttribute("cx", mouseX);
	c.setAttribute("cy", mouseY);
	c.setAttribute("r", "6");
	c.setAttribute("fill", color);
	c.setAttribute("class", pointClass);
	mainCanvas.appendChild(c);

	//Criacao de linhas
	if(beziers[selCurve].length > 0){
		let color;
		let lineClass = "l" + selCurve;
		if(lineCB.checked) color = "#a832a0";
		else color = "#00000000"
		var l = document.createElementNS(web, "line");
		l.setAttribute("x1", beziers[selCurve][beziers[selCurve].length-1].x);
		l.setAttribute("y1", beziers[selCurve][beziers[selCurve].length-1].y);
		l.setAttribute('x2', mouseX);
		l.setAttribute('y2', mouseY);
		l.setAttribute('style', 'stroke : ' + color + '; stroke-width : 2');
		l.setAttribute("class", lineClass)
		mainCanvas.appendChild(l);
	}

	//Adicionar novo ponto ao seu objeto bezier
	beziers[selCurve][beziers[selCurve].length] = new coord(mouseX, mouseY);
	//alert(beziers[selCurve].length);
}

//Funcao para ir para a proxima curva
function changeCurve(direction){
	unselectCurve();
	if(direction == 1){
		selCurve = (selCurve+1)%qttCurves;
	}else if(direction == -1){
		selCurve = (selCurve + qttCurves - 1)%qttCurves;
	}
	selectCurve();
}

//Funcao para mostrar/esconder pontos de controle
function showPoints(){
	var points = document.getElementsByTagName("circle");
	if(pointCB.checked){
		for (var i = points.length - 1; i >= 0; i--) {
			points[i].setAttribute("fill", "black");
		}
		selectCurve();
	}else{
		for (var i = points.length - 1; i >= 0; i--) {
			points[i].setAttribute("fill", "transparent");
		}
	}
}


//Funcao para mostrar/esconder poligonais de controle
function showLines(){
	var lines = document.getElementsByTagName("line");
	if(lineCB.checked){
		for (var i = lines.length - 1; i >= 0; i--) {
			lines[i].setAttribute("style", 'stroke : #000000; stroke-width : 2');
		}
		selectCurve();
	}else{
		for (var i = lines.length - 1; i >= 0; i--) {
			lines[i].setAttribute("style", 'stroke : #00000000; stroke-width : 2');

		}
	}
}

//Funcao para mostrar qual a curva selecionada
function selectCurve(){
	//seleciona todos os pontos da curva atual e as torna verde
	if(pointCB.checked){
		let pointClass = "p" + selCurve;
		var points = document.getElementsByClassName(pointClass);
		for (var i = points.length - 1; i >= 0; i--) {
			points[i].setAttribute("fill", "green");
		}
	}
	//seleciona todas as linhas da curva atual e as torna roxa
	if(lineCB.checked){
		let lineClass = "l" + selCurve;
		var lines = document.getElementsByClassName(lineClass);
		for (var i = lines.length - 1; i >= 0; i--) {
			lines[i].setAttribute("style", 'stroke : #a832a0 ; stroke-width : 2');
		}
	}
}

//Funcao para deselecionar a curva
function unselectCurve(){
	//seleciona todos os pontos da curva atual e as torna pretas
	if(pointCB.checked){
		let pointClass = "p" + selCurve;
		var points = document.getElementsByClassName(pointClass);
		for (var i = points.length - 1; i >= 0; i--) {
			points[i].setAttribute("fill", "black");
		}
	}
	//seleciona todas as linhas da curva atual e as torna pretas
	if(lineCB.checked){
		let lineClass = "l" + selCurve;
		var lines = document.getElementsByClassName(lineClass);
		for (var i = lines.length - 1; i >= 0; i--) {
			lines[i].setAttribute("style", 'stroke : #000000 ; stroke-width : 2');
		}
	}
}

function show(){
	alert("funcionando");
}