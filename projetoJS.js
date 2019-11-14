var mainCanvas = document.getElementById("mainCanvas");

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
	selCurve = (selCurve+1)%qttCurves;

	beziers[qttCurves-1] = new Array();
}

function deleteCurve(){
	if(qttCurves > 0){
		qttCurves--;
	}else{
		alert("Não há mais curvas para deletar.");
	}
}

var x, y, qttPoints = 0;
function addPoint(event){
	if(qttCurves == 0){
		alert("Criei uma curva par adicionar pontos.")
		return;
	}
	var web = "http://www.w3.org/2000/svg";
	var mouseX = event.offsetX, mouseY = event.offsetY;
	var c = document.createElementNS(web, "circle");
	c.setAttribute("cx", mouseX);
	c.setAttribute("cy", mouseY);
	c.setAttribute("r", "6");
	c.setAttribute("fill", "green");
	mainCanvas.appendChild(c);

	//Criacao de linhas
	if(beziers[selCurve].length > 0){
		var l = document.createElementNS(web, "line");
		l.setAttribute("x1", beziers[selCurve][beziers[selCurve].length-1].x);
		l.setAttribute("y1", beziers[selCurve][beziers[selCurve].length-1].y);
		l.setAttribute('x2', mouseX);
		l.setAttribute('y2', mouseY);
		l.setAttribute('style', 'stroke : #000000; stroke-width : 2');
		mainCanvas.appendChild(l);
	}

	//Adicionar novo ponto ao seu objeto bezier
	beziers[selCurve][beziers[selCurve].length] = new coord(mouseX, mouseY);
	//alert(beziers[selCurve].length);
}

//Funcao para ir para a proxima curva
function changeCurve(direction){
	if(selCurve == qttCurves-1 && direction == 1){
		selCurve = 0;
	}else if(selCurve == 0 && direction == -1){
		selCurve = qttCurves-1;
	}else{
		selCurve = (selCurve + direction);
	}
}

//Funcao para mostrar/esconder pontos de controle
var pointsVisible = true;
function showPoints(){
	var points = document.getElementsByTagName("circle");
	pointsVisible = !pointsVisible;
	if(pointsVisible){
		for (var i = points.length - 1; i >= 0; i--) {
			points[i].setAttribute("fill", "black");
		}
	}else{
		for (var i = points.length - 1; i >= 0; i--) {
			points[i].setAttribute("fill", "white");
		}
	}
}


//Funcao para mostrar/esconder poligonais de controle
var linesVisible = true;
function showLines(){
	var lines = document.getElementsByTagName("line");
	linesVisible = !linesVisible;
	if(linesVisible){
		for (var i = lines.length - 1; i >= 0; i--) {
			lines[i].setAttribute("style", 'stroke : #000000; stroke-width : 2');
		}
	}else{
		for (var i = lines.length - 1; i >= 0; i--) {
			lines[i].removeAttribute("style");

		}
	}
}

//Funcao para mostrar qual a curva selecionada
function selectCurve(){

}

function show(){
	alert("funcionando");
}