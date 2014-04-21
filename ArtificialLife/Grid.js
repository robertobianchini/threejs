// Global Constants 
var onMaterial  = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
var offMaterial = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.DoubleSide});

/** ----------------------------------------------------------------------------------------
 *
 * @param   Number  width         width of the grid
 * @param   Number  height        height of the grid
 * @param   Number  numberOfTiles number of tiles to fill the grid (filled with THREEJS.Geometry),
                                  tiles are always squared
 * @param   Number  offset        the distance between each tile
 */
function Grid(width, height, numberOfTiles, offset) {
	var biggest  = width > height ? width : height;
	var side     = (biggest / numberOfTiles) + 4 * offset;
	var numCols  = numberOfTiles;
	var numRows  = numberOfTiles;
	var initialX = -width  * 0.25;
	var initialY = -height * 0.4;

	var cubeGeometry = new THREE.Geometry();
	cubeGeometry.vertices.push(new THREE.Vector3(side * 0.5, side * 0.5, 0));
	cubeGeometry.vertices.push(new THREE.Vector3(-side * 0.5, side * 0.5, 0));
	cubeGeometry.vertices.push(new THREE.Vector3(-side * 0.5, -side * 0.5, 0));
	cubeGeometry.vertices.push(new THREE.Vector3(side * 0.5, -side * 0.5, 0));
	cubeGeometry.faces.push(new THREE.Face3(0, 1, 2));
	cubeGeometry.faces.push(new THREE.Face3(2, 3, 0));

	var gridArray = new Array(numRows);
	for (var i = 0; i < numRows; i++) {
		gridArray[i] = new Array(numCols);
		for (var j = 0; j < numCols; j++) {
			gridArray[i][j] = new Cell(cubeGeometry);
			gridArray[i][j].mesh.position.set(initialX + j * (side + offset), initialY + i * (side + offset), 0);
		}
	}

	var px = gridArray[numRows / 2][numCols / 2].mesh.position.x;
	var py = gridArray[numRows / 2][numCols / 2].mesh.position.y;
	var pz = gridArray[numRows / 2][numCols / 2].mesh.position.z;

	var returnedObj = { grid:       gridArray,
						cameraPos:  new THREE.Vector3(px, py, pz + 2700),
						cameraLook: new THREE.Vector3(px, py, pz),
						columns:    numCols,
						rows:       numRows,
						cellSide:   side };

	return returnedObj;
}

function Cell(geo) {
	this.mesh  = new THREE.Mesh(geo, offMaterial);
	this.alive = false;

	this.turnOn = function() {
		this.mesh.material = onMaterial;
		this.alive         = true;
	};

	this.turnOff = function() {
		this.mesh.material = offMaterial;
		this.alive         = false;
	};

	this.setMaterial = function(material) {
		this.mesh.material = material;
	};
}
