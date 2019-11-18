var mainCanvas = document.getElementById("mainCanvas");
var pointCB = document.getElementById("pointCB");
var lineCB = document.getElementById("lineCB");
var curveCB = document.getElementById("curveCB");
var operation = document.getElementById("operation");
var qttAval = document.getElementById("qttAval");
var butChange = document.getElementById("butChange");
var web = "http://www.w3.org/2000/svg";

var isEdit = false;

//informacoes sobre a curva
var selCurve = 0;
var qttCurves = 0;
//avaliacoes por bezier
var apb = new Array();



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
	if(isEdit){
		alert("Termine a edicao antes de criar uma nova curva.");
		return ;
	} 
	qttCurves++;
	unselectCurve();
	selCurve = qttCurves-1;

	apb[qttCurves-1] = 3;

	//A operacao inicial para cada nova curva sera de adicionar pontos
	operation.selectedIndex = 0;
}



//Funcao para deletar a curva
function deleteCurve(){
	if(qttCurves > 0){
		if(isEdit){
			alert("Termine a edicao antes de remover uma curva.");
			return ;
		} 
		qttCurves--;
		//Removecao dos pontos e linhas da curva
		var lines = getLines();
		for (var i = lines.length - 1; i >= 0; i--) mainCanvas.removeChild(lines[i]);
		var points = getPoints();
		for (var i = points.length - 1; i >= 0; i--) mainCanvas.removeChild(points[i]);
		deleteBezier();

		//Realocacao da ultima curva
		//Renomeando as linhas
		let lineClass = "l" + qttCurves;
		let newLineClass = "l" + selCurve;
		var lines = document.getElementsByClassName(lineClass);
		for (var i = lines.length - 1; i >= 0; i--) lines[i].setAttribute("class", newLineClass);
		//Renomeando os pontos
		let pointClass = "p" + qttCurves;
		let newPointClass = "p" + selCurve;
		var points = document.getElementsByClassName(pointClass);
		for (var i = points.length - 1; i >= 0; i--) points[i].setAttribute("class", newPointClass);
		//Renomeando bezier
		let bezierClass = "b" + qttCurves;
		let newBezierClass = "b" + selCurve;
		var beziers = getBeziers();
		for (var i = beziers.length - 1; i >= 0; i--) beziers[i].setAttribute("class", newBezierClas);

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

	var points = getPoints();
	//Criacao de linhas
	if(points.length > 1){
		makeLine(points[points.length-2].getAttribute('cx'), points[points.length-2].getAttribute('cy'), mouseX, mouseY);
	}

	deleteBezier();
	makeBezier(apb[selCurve]);
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
			found = true;
			break;
		}
	}
	//Se o ponto clicado for valido
	if(found){
		//Se nao for o ultimo ponto, tire a proxima linha
		var lines = getLines();
		if(i == 0){
			mainCanvas.removeChild(lines[i]);
		}else if(i-1 == lines.length-1){
			mainCanvas.removeChild(lines[lines.length-1]);
		}else{
			lines[i-1].setAttribute('x2', lines[i].getAttribute('x2'));
			lines[i-1].setAttribute('y2', lines[i].getAttribute('y2'));
			mainCanvas.removeChild(lines[i]);
		}

		deleteBezier();
		makeBezier(apb[selCurve]);
	}
}



//Funcao para detectar se pode haver mudanca na posicao do ponto
function editPoint(event) {
	//Nao permite editar pontos se nao houver linhas
	if(qttCurves == 0){
		alert("Crie uma curva para editar pontos.")
		return;
	}else if(!isEdit){
		var mouseX = event.offsetX, mouseY = event.offsetY;
		//busca os pontos da curva atualmente selecionada
		var points = getPoints();
		var i;
		var cx, cy, r;
		for (i = 0; i < points.length; i++) {
			cx = parseInt(points[i].getAttribute("cx"));
			cy = parseInt(points[i].getAttribute("cy"));
			r = 6;
			//Se tiver sido clicado em um ponto, mude para modo de alteracao de posicao
			if(inRange(cx, cy, r, mouseX, mouseY)){
				isEdit = true;
				index = i;
				break;
			}
		}

	}else if(isEdit){
		//Quando houve um novo clique no modo de edicao, esse sera a nova posicao do ponto
		isEdit = false;
	}
}



//Funcao que movimenta o ponto pela tela
var index;
function movePoint(event){
	if(isEdit){
		var points = getPoints();
		var lines = getLines();

		var posX = event.offsetX, posY = event.offsetY;
		points[index].setAttribute("cx", posX);
		points[index].setAttribute("cy", posY);

		//Se nao for o ponto inicial, muda a linha da frente
		if(index > 0){
			lines[index-1].setAttribute('x1', points[index-1].getAttribute('cx'));
			lines[index-1].setAttribute('y1', points[index-1].getAttribute('cy'));
			lines[index-1].setAttribute("x2", posX);
			lines[index-1].setAttribute("y2", posY);
		}
		//Se nao for o ultimo ponto, muda a linha de tras
		if(index < points.length-1){
			lines[index].setAttribute("x1", posX);
			lines[index].setAttribute("y1", posY);
			lines[index].setAttribute('x2', points[index+1].getAttribute('cx'));
			lines[index].setAttribute('y2', points[index+1].getAttribute('cy'));
		}

		deleteBezier();
		makeBezier(apb[selCurve]);
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
function makeBezier(qttAval) {
	if(qttAval == 0) return;
	var midPoints = new Array();
	var points = getPoints();
	midPoints[0] = new coord(parseInt(points[0].getAttribute('cx')), parseInt(points[0].getAttribute('cy')));
	for(var i = 1 ; i <= qttAval ; i++){
		midPoints[midPoints.length] = deCasteljau(points.length-1 , 0, i/qttAval);
	}

	for(var i = 1 ; i < midPoints.length ; i++){
		let color;
		var bezierClass = "b" + selCurve;
		if(curveCB.checked) color = "#fcba03";
		else color = "#00000000";
		var l = document.createElementNS(web, "line");
		l.setAttribute('x1', parseInt(midPoints[i-1].x));
		l.setAttribute('y1', parseInt(midPoints[i-1].y));
		l.setAttribute('x2', parseInt(midPoints[i].x));
		l.setAttribute('y2', parseInt(midPoints[i].y));
		l.setAttribute('style', 'stroke : ' + color + '; stroke-width : 2');
		l.setAttribute("class", bezierClass);
		mainCanvas.appendChild(l);
	}
}



//Funcao para achar o ponto auxiliar
function deCasteljau(i, j, u){
	var points = getPoints();
	var temp = new Array();
	for(var i = 0 ; i < points.length ; i++){
		temp[i] = new coord(points[i].getAttribute('cx'), points[i].getAttribute('cy'));
	}
	for(var k = 1 ; k < points.length ; k++){
		for(var i = 0 ; i < points.length-k ; i++){
			temp[i].x = temp[i].x*(1-u) + temp[i+1].x*(u);
			temp[i].y = temp[i].y*(1-u) + temp[i+1].y*(u);
		}
	}
	return temp[0];
}



//Funcao para remover a curva de bezier selecionada
function deleteBezier(){
	var curves = getBeziers();
	while(curves.length > 0){
		mainCanvas.removeChild(curves[0]);
	}
}



//Funcao para alterar a quantidade de avaliacoes na curva
function changeQttAval(){
	var newNumb = qttAval.value;
	qttAval.value = 0;
	if(isNaN(newNumb)){
		alert("Insira apenas números.");
	}else{
		newNumb = parseInt(newNumb);
		deleteBezier();
		makeBezier(newNumb);
		apb[selCurve] = newNumb;
	}
}



//Funcao para ir para a proxima curva
function changeCurve(direction){
	if(isEdit){
		alert("Termine a edicao antes de mudar de curva.");
		return ;
	} 
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
	//Para cada curva do SVG, irá iteiras sobre todas as poligonais de controle
	for(var i = 0 ; i < qttCurves ; i++){
		var lineClass = "l" + i;
		var lines = document.getElementsByClassName(lineClass);
		for(var j = 0 ; j < lines.length ; j++){
			if(lineCB.checked){
				//Torna todas as poligonais de controle pretas
				lines[j].setAttribute("style", 'stroke : #000000; stroke-width : 2');
				selectCurve();
			}else{
				//Torna todas as poligonais de controle transparentes
				lines[j].setAttribute("style", 'stroke : #00000000; stroke-width : 2');
			}
		}
	}
}



//Funcao para mostrar/esconder as curvas de bezier
function showCurves(){
	for(var i = 0 ; i < qttCurves ; i++){
		var curveClass = "b" + i;
		var curves = document.getElementsByClassName(curveClass);
		for(var j = 0 ; j < curves.length ; j++){
			if(curveCB.checked){
				curves[j].setAttribute("style", 'stroke : #000000; stroke-width : 2');
				selectCurve();
			}else{
				curves[j].setAttribute("style", 'stroke : #00000000; stroke-width : 2');
			}
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
	if(curveCB.checked){
		var bezier = getBeziers();
		for (var i = bezier.length - 1; i >= 0; i--) {
			bezier[i].setAttribute("style", 'stroke : #fcba03 ; stroke-width : 2');
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
	if(curveCB.checked){
		var bezier = getBeziers();
		for (var i = bezier.length - 1; i >= 0; i--) {
			bezier[i].setAttribute("style", 'stroke : #000000 ; stroke-width : 2');
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



//Funcao para pegar todos os beziers ne curva selecionada
function getBeziers(){
	let bezierClass = "b" + selCurve;
	return document.getElementsByClassName(bezierClass);
}



//Funcao de teste
function show(){
	alert("funcionando");
}