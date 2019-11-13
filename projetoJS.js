var mainCanvas = document.getElementById("mainCanvas");

//informacoes sobre a curva
var qttCurves = 0;
var beziers = new Array();

function controlPoint(x, y){
	this.x = x;
	this.y = y;
}

function curve(qttPoints){
	this.qttPoints = qttPoints;
	this.points = new Array();
	for(let i = 0 ; i < qttPoints ; i++){
		points[i] = new controlPoint(0, 0);
	}
}

function addCurve(){
	var qttPoints;
	do{
		qttPoints = prompt("Insira a quantidade inicial de pontos de controle.\n O número deve ser um inteiro maior do que 1.");
	}while(isNaN(qttPoints));
	if(qttPoints == null){
		alert("Criação de curva cancelada.");
	}else{
		qttCurves++;
	}
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
	var web = "http://www.w3.org/2000/svg";
	var mouseX = event.offsetX, mouseY = event.offsetY;
	var c = document.createElementNS(web, "circle");
	c.setAttribute("cx", mouseX);
	c.setAttribute("cy", mouseY);
	c.setAttribute("r", "6");
	c.setAttribute("fill", "green");
	mainCanvas.appendChild(c);
	if(qttPoints > 0){
		var l = document.createElementNS(web, "line");
		l.setAttribute("x1", x);
		l.setAttribute("y1", y);
		l.setAttribute('x2', mouseX);
		l.setAttribute('y2', mouseY);
		l.setAttribute('style', 'stroke : #000000; stroke-width : 2');
		mainCanvas.appendChild(l);
	}
	qttPoints++;
	x = mouseX;
	y = mouseY;
}

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

function show(){
	alert("funcionando");
}