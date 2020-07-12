# Bézier Curves
Project to the Graphic Processing discipline(IF680)

## How it works
The project consists on making [Bézier curves](https://en.wikipedia.org/wiki/B%C3%A9zier_curve), that is, smooth curves modeled from their control nodes.
The non-selected curves will be on color black.

## Possible Actions
#### Add a new curve:
Press the "Adicionar Curva" button, then click inside the canvas to position the control nodes of the new Bézier curve.

#### Delete a curve:
Press the "Remover Curva" button to delete the selected curve.

#### Change selected curve:
Press the "Próxima Curva" or "Curva Anterior" button to change the selected curve.

#### Add new control node:
On the drop down menu select the "Adicionar" option, and click on the canvas to add a new control node to the end of the selected curve.

#### Remove control node:
On the drop down menu select the "Remover" option, and click on the control node of the selected curve that you wish to remove.

#### Move control node:
On the drop down menu select the "Modificar" option, and click on the control node of the selected curve that you wish to move. The node will be selected and wou shall be able to move it across the canvas. Inside the canvas, click again to set the control node new position.

#### Curve's evaluation number :
By default, a curve will have 3(three) as its evaluation number. This can be changed at the text input area beneath the drop down menu, where you can insert the new quantity(as long as it is a integer number higher or equal to zero). When inserted, press the "change Qtt Aval" button to effect the desired change.

The higher the value, smoother will be the curve, in contrast it will also become more laggy.(Obs.: 500 is  value which profits the best from both worlds).
