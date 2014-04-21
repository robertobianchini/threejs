/** ----------------------------------------------------------------------------------------
 *  Turtle constructor to draw LSystems
 *
 * @param   object  lsystem     All the LSystems featres are stored here
 */
function Turtle(lsystem) {
	this.lsystem = lsystem;

	// For branching LSystems
	this.turtleStack = [];

	if (this.lsystem.colors.singleColor) {
		this.lineColor = this.lsystem.colors.defaultColor;
	} else {
		this.verticeColor      = [];
		this.verticeColorIndex = 0;
	}

	// This is the actual turtle that will move around to draw things
    var cubeGeometry = new THREE.CubeGeometry(0.1, 0.2, 0.1);
	var cubeMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00, side: THREE.DoubleSide});
    this.turtleMesh  = new THREE.Mesh(cubeGeometry, cubeMaterial);

    // The points for the lsystems will be stored here
	this.turtleGeometry = new THREE.Geometry();

	// How far to go each drawing step
	this.distance = 1;

	// These objects help finding the center of the system
	this.systemCenter        = null;
	this.cameraHeight        = 0;
	this.smallestCoordinates = new THREE.Vector3();
	this.biggestCoordinates  = new THREE.Vector3();

}


// ----------------------------------------------------------------------------------------
Turtle.prototype.cleanSystem = function() {
	this.turtleGeometry = new THREE.Geometry();
	this.turtleStack    = [];

	if (!this.lsystem.colors.singleColor) {
		this.verticeColor      = [];
		this.verticeColorIndex = 0;
	}
};


// ----------------------------------------------------------------------------------------
Turtle.prototype.makeSystem = function() {
	this.smallestCoordinates = new THREE.Vector3();
	this.biggestCoordinates  = new THREE.Vector3();

	this.turtleMesh.position.set(0, 0, 0);
	this.turtleMesh.rotation.set(0, 0, 0);

	var character;
	for (var i = 0, j = this.lsystem.currentState.length; i < j; i++) {
		character = this.lsystem.currentState.charAt(i);
		switch (this.lsystem.interpretation[character]) {
			case "DrawForward":          this.drawForward();              break;
			case "MoveForward":          this.moveForward();              break;
			case "TurnLeft":             this.turnLeft();                 break;
			case "TurnRight":            this.turnRight();                break;
			case "TurnAround":           this.turnAround();               break;
			case "PushValues":           this.pushValues();               break;
			case "PopValues":            this.popValues();                break;
			case "PitchUp":              this.pitchUp();                  break;
			case "PitchDown":            this.pitchDown();                break;
			case "RollLeft":             this.rollLeft();                 break;
			case "RollRight":            this.rollRight();                break;
			case "DrawForwardTurnLeft":  this.forleft();                  break;
			case "DrawForwardTurnRight": this.forright();                 break;
			case "ChangeColor":          this.changeLineColor(character); break;
			default: break;
		}
	}

	this.findSystemCenter();

	var lines;

	if (this.lsystem.colors.singleColor) {
		lines = new THREE.Line(this.turtleGeometry,
                               new THREE.LineBasicMaterial({color: this.lineColor, opacity: 0.5}),
                               THREE.LinePieces);
	} else {
		this.turtleGeometry.colors = this.verticeColor;

		lines = new THREE.Line(this.turtleGeometry,
                               new THREE.LineBasicMaterial({color: 0xFFFFFF, opacity: 1, vertexColors: THREE.VertexColors}),
                               THREE.LinePieces);
	}

	return lines;
};


/** ----------------------------------------------------------------------------------------
 *  This function finds the dyagonal of the smallest rectangle that encapsulates the system.
 *  Camera X and Y coordinates will be placed at the center of the dyagonal and
 *    the hight of the camera will be value of the dyagonal
*/
Turtle.prototype.findSystemCenter = function() {
	// Find the Vector that point from Smallest to the Biggest point on the Geometry
	var vec = new THREE.Vector3();
	vec.subVectors(this.biggestCoordinates, this.smallestCoordinates);

	// Get half of its length
	var halfLength = vec.length() * 0.5;
	vec.normalize();

	// Sum smallest point with half of the direction from smallest to the biggest
	this.systemCenter = new THREE.Vector3();
	this.systemCenter.addVectors(vec.multiplyScalar(halfLength), this.smallestCoordinates);

	// Camera will be move "upwards" the length of the dyagonal
	this.cameraHeight = halfLength * 2 + halfLength;
};


// ----------------------------------------------------------------------------------------
Turtle.prototype.checkBoundaries = function() {
	// Check if current position is smallest or biggest than what's stored in X ...
	if (this.turtleMesh.position.x < this.smallestCoordinates.x)
		this.smallestCoordinates.x = this.turtleMesh.position.x;
	else if (this.turtleMesh.position.x > this.biggestCoordinates.x)
		this.biggestCoordinates.x = this.turtleMesh.position.x;

	// ... Y ...
	if (this.turtleMesh.position.y < this.smallestCoordinates.y)
		this.smallestCoordinates.y = this.turtleMesh.position.y;
	else if (this.turtleMesh.position.y > this.biggestCoordinates.y)
		this.biggestCoordinates.y = this.turtleMesh.position.y;

	// ... and Z
	if (this.turtleMesh.position.z < this.smallestCoordinates.z)
		this.smallestCoordinates.z = this.turtleMesh.position.z;
	else if (this.turtleMesh.position.z > this.biggestCoordinates.z)
		this.biggestCoordinates.z = this.turtleMesh.position.z;
};


// ----------------------------------------------------------------------------------------
Turtle.prototype.drawForward = function() {
	var startPos = new THREE.Vector3();
	startPos.copy(this.turtleMesh.position);

	this.turtleMesh.translateY(this.distance);

	var endPos = new THREE.Vector3();
	endPos.copy(this.turtleMesh.position);

	this.turtleGeometry.vertices.push(startPos);
	this.turtleGeometry.vertices.push(endPos);

	if (!this.lsystem.colors.singleColor) {
		this.verticeColor[this.verticeColorIndex] = this.lineColor;
		this.verticeColorIndex++;
		this.verticeColor[this.verticeColorIndex] = this.lineColor;
		this.verticeColorIndex++;
	}

	this.checkBoundaries();
};


// ----------------------------------------------------------------------------------------
Turtle.prototype.moveForward = function() {
	this.turtleMesh.translateY(this.distance);
	this.checkBoundaries();
};


// ----------------------------------------------------------------------------------------
Turtle.prototype.pushValues = function() {
	var pos = new THREE.Vector3();
	pos.copy(this.turtleMesh.position);

	var rot = new THREE.Euler();
	rot.copy(this.turtleMesh.rotation);

	var c = new THREE.Color();
	c.copy(this.lineColor);

	var state = {"position": pos, "rotation": rot, "color": c};

	this.turtleStack.push(state);
};


// ----------------------------------------------------------------------------------------
Turtle.prototype.popValues = function() {
	var state = this.turtleStack.pop();
	if (state !== undefined) {
		this.turtleMesh.position.copy(state.position);
		this.turtleMesh.rotation.copy(state.rotation);
		this.lineColor = state.color;
	}
};


// ----------------------------------------------------------------------------------------
Turtle.prototype.turnLeft = function() { this.turtleMesh.rotation.z += this.lsystem.angle; };


// ----------------------------------------------------------------------------------------
Turtle.prototype.turnRight = function() { this.turtleMesh.rotation.z -= this.lsystem.angle; };


// ----------------------------------------------------------------------------------------
Turtle.prototype.turnAround = function() { this.turtleMesh.rotation.z += Math.PI; };


// ----------------------------------------------------------------------------------------
Turtle.prototype.pitchDown = function() { this.turtleMesh.rotation.x += this.lsystem.angle; };


// ----------------------------------------------------------------------------------------
Turtle.prototype.pitchUp = function() { this.turtleMesh.rotation.x -= this.lsystem.angle; };


// ----------------------------------------------------------------------------------------
Turtle.prototype.rollLeft = function() { this.turtleMesh.rotation.y += this.lsystem.angle; };


// ----------------------------------------------------------------------------------------
Turtle.prototype.rollRight = function() { this.turtleMesh.rotation.y -= this.lsystem.angle; };


// ----------------------------------------------------------------------------------------
Turtle.prototype.changeLineColor = function(character) { this.lineColor = this.lsystem.getColor(character); };
