var mainCanvas = document.getElementById("mainCanvas");
var pointCB = document.getElementById("pointCB");
var lineCB = document.getElementById("lineCB");
var curveCB = document.getElementById("curveCB");
var operation = document.getElementById("operation");
var web = "http://www.w3.org/2000/svg";

//informacoes sobre a curva
var selCurve = 0;
var qttCurves = 0;
var beziers = new Array();



//Objeto coordenada
function coord(x, y){
	this.x = x;
	this.y = y;
}



//Funcao para escolher o modo de operacao
function getOp(event){
	var op = operation.options[operation.selectedIndex].value;
	//define qual operacao sera realizada na curva
	if(op == "add"){
		addPoint(event);
	}else if(op == "del"){
		deletePoint(event);
	}else if(op == "edit"){
		editPoint(event);
	}
}



//Funcao para adicionar curva
function addCurve(){
	qttCurves++;
	unselectCurve();
	selCurve = qttCurves-1;

	//A operacao inicial para cada nova curva sera de adicionar pontos
	operation.selectedIndex = 0;

	beziers[qttCurves-1] = new Array();
}



//Funcao para deletar a curva
function deleteCurve(){
	if(qttCurves > 0){
		qttCurves--;
		//Removecao dos pontos e linhas da curva
		var lines = getLines();
		for (var i = lines.length - 1; i >= 0; i--) mainCanvas.removeChild(lines[i]);
		var points = getPoints();
		for (var i = points.length - 1; i >= 0; i--) mainCanvas.removeChild(points[i]);

		//Realocacao da ultima curva
		//Renomeando as linhas
		lineClass = "l" + qttCurves;
		let newLineClass = "l" + selCurve;
		var lines = document.getElementsByClassName(lineClass);
		for (var i = lines.length - 1; i >= 0; i--) lines[i].setAttribute("class", newLineClass);
		//Renomeando os pontos
		let pointClass = "p" + qttCurves;
		let newPointClass = "p" + selCurve;
		var points = document.getElementsByClassName(pointClass);
		for (var i = points.length - 1; i >= 0; i--) points[i].setAttribute("class", newPointClass);

		//Ultima linha substitui a que foi retirada
		beziers[selCurve] = beziers[qttCurves];

		//Ultima linhas se torna a linha selecionada
		selCurve = qttCurves-1;
		selectCurve();

	}else{
		alert("Não há mais curvas para deletar.");
	}
}



//Adiciona um ponto a tela
function addPoint(event){
	//Nao permite adicionar pontos se nao houver linhas
	if(qttCurves == 0){
		alert("Crie uma curva para adicionar pontos.")
		return;
	}

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
		makeLine(beziers[selCurve][beziers[selCurve].length-1].x, beziers[selCurve][beziers[selCurve].length-1].y, mouseX, mouseY);
	}

	//Adicionar novo ponto ao seu objeto bezier
	beziers[selCurve][beziers[selCurve].length] = new coord(mouseX, mouseY);
}



//Funcao para deletar um ponto da que esta selecionada
function deletePoint(event) {
	//Nao permite remover pontos se nao houver linhas
	if(qttCurves == 0){
		alert("Crie uma curva para remover pontos.")
		return;
	}
	var mouseX = event.offsetX, mouseY = event.offsetY;
	//busca os pontos da curva atualmente selecionada
	var points = getPoints();
	var i;
	var cx, cy, r;
	var found = false;
	//busca o primeiro ponto que o mouse encontra
	for (i = 0; i < points.length; i++) {
		cx = parseInt(points[i].getAttribute("cx"));
		cy = parseInt(points[i].getAttribute("cy"));
		r = 6;
		if(inRange(cx, cy, r, mouseX, mouseY)){
			//Remove o ponto selecionado do SVG e do array de pontos
			mainCanvas.removeChild(points[i]);
			beziers[selCurve].splice(i, 1);
			found = true;
			break;
		}
	}
	//Se o ponto clicado for valido
	if(found){
		//Se nao for o ultimo ponto, tire a proxima linha
		var lines = getLines();
		var qtt = 0; //se a quantidade chegar a 2, achou todas as linhas que se conectam ao ponto
		for (var j = lines.length - 1; j >= 0 && qtt < 2; j--) {
			if((lines[j].getAttribute("x1") == cx && lines[j].getAttribute("y1") == cy) || (lines[j].getAttribute("x2") == cx && lines[j].getAttribute("y2") == cy)){
				mainCanvas.removeChild(lines[j]);
				qtt++;
			}
		}
		//Se nao for nem o primeiro ponto e nem o ultimo, conecte o ponto antes e o proximo ponto
		if(i > 0 && i < points.length){
			makeLine(points[i-1].getAttribute("cx"), points[i-1].getAttribute("cy"), points[i].getAttribute("cx"), points[i].getAttribute("cy"));
		}
	}
}



//Funcao para mudar posicao do ponto
function editPoint(event) {
	//Nao permite editar pontos se nao houver linhas
	if(qttCurves == 0){
		alert("Crie uma curva para editar pontos.")
		return;
	}
	var mouseX = event.offsetX, mouseY = event.offsetY;
	//busca os pontos da curva atualmente selecionada
	var points = getPoints();
	var i;
	var cx, cy, r;
	var found = false;
	for (i = 0; i < points.length && !found; i++) {
		cx = parseInt(points[i].getAttribute("cx"));
		cy = parseInt(points[i].getAttribute("cy"));
		r = 6;
		if(inRange(cx, cy, r, mouseX, mouseY)) found = true;;
	}

	if(found){
		
		show();
	}
}



//Funcao para ver se o mouse esta clicando em algum objeto
function inRange(cx, cy, r, mouseX, mouseY){
	//verifica se o mouse esta dentro da area(quadrada) do circulo
	if(cx-r <= mouseX && mouseX <= cx+r && cy-r <= mouseY && mouseY <= cy+r){
		return true;
	}
	return false;
}



//Funcao para gerar a curva de bezier
function makeCurve() {
	
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
	//Busca todos os circulos do SVG
	var points = document.getElementsByTagName("circle");
	if(pointCB.checked){
		//Torna todos os pontos pretos
		for (var i = points.length - 1; i >= 0; i--) {
			points[i].setAttribute("fill", "black");
		}
		selectCurve();
	}else{
		//Torna todos os pontos transparentes
		for (var i = points.length - 1; i >= 0; i--) {
			points[i].setAttribute("fill", "transparent");
		}
	}
}



//Funcao para mostrar/esconder poligonais de controle
function showLines(){
	//Busca todas as linhas do SVG
	var lines = document.getElementsByTagName("line");
	if(lineCB.checked){
		//Torna todas as linhas pretas
		for (var i = lines.length - 1; i >= 0; i--) {
			lines[i].setAttribute("style", 'stroke : #000000; stroke-width : 2');
		}
		selectCurve();
	}else{
		//Torna todas as linhas transparentes
		for (var i = lines.length - 1; i >= 0; i--) {
			lines[i].setAttribute("style", 'stroke : #00000000; stroke-width : 2');

		}
	}
}



//Funcao para mostrar qual a curva selecionada
function selectCurve(){
	//seleciona todos os pontos da curva atual e as torna verde
	if(pointCB.checked){
		var points = getPoints();
		for (var i = points.length - 1; i >= 0; i--) {
			points[i].setAttribute("fill", "green");
		}
	}
	//seleciona todas as linhas da curva atual e as torna roxa
	if(lineCB.checked){
		var lines = getLines();
		for (var i = lines.length - 1; i >= 0; i--) {
			lines[i].setAttribute("style", 'stroke : #a832a0 ; stroke-width : 2');
		}
	}
}



//Funcao para deselecionar a curva
function unselectCurve(){
	//seleciona todos os pontos da curva atual e as torna pretas
	if(pointCB.checked){
		var points = getPoints();
		for (var i = points.length - 1; i >= 0; i--) {
			points[i].setAttribute("fill", "black");
		}
	}
	//seleciona todas as linhas da curva atual e as torna pretas
	if(lineCB.checked){
		var lines = getLines();
		for (var i = lines.length - 1; i >= 0; i--) {
			lines[i].setAttribute("style", 'stroke : #000000 ; stroke-width : 2');
		}
	}
}



//Funcao para produzir uma linha de (x1, y1) ate (x2, y2)
function makeLine(x1, y1, x2, y2){
	let color;
	let lineClass = "l" + selCurve;
	if(lineCB.checked) color = "#a832a0";
	else color = "#00000000";
	var l = document.createElementNS(web, "line");
	l.setAttribute("x1", x1);
	l.setAttribute("y1", y1);
	l.setAttribute('x2', x2);
	l.setAttribute('y2', y2);
	l.setAttribute('style', 'stroke : ' + color + '; stroke-width : 2');
	l.setAttribute("class", lineClass);
	mainCanvas.appendChild(l);
}



//Funcao para pegar os pontos na curva selecionada
function getPoints(){
	let pointClass = "p" + selCurve;
	return document.getElementsByClassName(pointClass);
}



//Funcao para pegar as linhas na curva selecionada
function getLines(){
	let lineClass = "l" + selCurve;
	return document.getElementsByClassName(lineClass);
}



//Funcao de teste
function show(){
	alert("funcionando");
}