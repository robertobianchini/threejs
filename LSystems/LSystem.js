/** ----------------------------------------------------------------------------------------
 *  LSystem Rule constructor
 *
 * @param   string  rule        The string to match on a character of the LSystem state
 *                              Rules must obey this format: 
 *                              leftcontext < predecessor > rightcontext --> successor
 *                              where each item is a string, (IMPORTANT) separated by one space.
 *                              If left and right contexts are not needed, substring will be "*"       
 *
 * IMPORTANT: If working with stochastic LSystems, there will be an adicional property called probability.
 *            it won't be passed in the constructor, but added after the rule has been created
 */
function Rule(rule) {
	var leftSignIndex = rule.indexOf("<");
	if (leftSignIndex === -1) {
		console.log("ERROR: Missing < Sign in rule descript");
		return undefined;
	}

	var rightSignIndex = rule.indexOf(">", leftSignIndex);
	if (rightSignIndex === -1) {
		console.log("ERROR: Missing > Sign in rule descript");
		return undefined;
	}

	var implySignIndex = rule.indexOf("-->", rightSignIndex);
	if (implySignIndex === -1) {
		console.log("ERROR: Missing --> Sign in rule descript");
		return undefined;
	}

	this.leftContext  = rule.substring(0, leftSignIndex - 1);
	this.predecessor  = rule.substring(leftSignIndex + 2, rightSignIndex - 1);
	this.rightContext = rule.substring(rightSignIndex + 2, implySignIndex - 1);
	this.successor    = rule.substring(implySignIndex + 4);
}


/** ----------------------------------------------------------------------------------------
 *  LSystem constructor. The most important variable is currentState, which defines
 *   the string with the configuration of the LSystem, based on the evolving rules
 *   
 * @param   object  definition An object with the following properties:
 *
 *          object   interpretation An object with the interpretation for each symbol the Turtle reads
 *          string   axiom          The string with the start of the LSystems.
 *          Array    rules          An Array containing Rule objects to evolve (substitute the characters) the system.
 *          Number   angle          The angle in degrees the turtle should turn to when changing direction.
 *                                  (It's converted to radians inside the constructor)
 *          Number   maxLevel       The maximum depth the LSystem should be evolved.
 *          object   systemColors   The colors to be used during turtle drawing.
 *          function getNextLevel   Function with the correct method to compute the next level
 *                                  based on the type of LSystem (D0l, Pseud, Stochastic or Context Dependent)
 */
function LSystem(definition) {
	this.interpretation = definition.interpretation;
	this.level          = 0;
	this.axiom          = definition.axiom;
	this.currentState   = definition.axiom;
	this.systemRules    = definition.rules;
	this.maxLevel       = definition.maxLevel;
	this.angle          = definition.angle * (Math.PI / 180);
	this.colors         = definition.colors;
	this.getNextLevel   = definition.getNextLevel;
}


// ----------------------------------------------------------------------------------------
LSystem.prototype.getDefinition = function () {
	return {axiom : this.axiom, rules : this.rules, angle : this.angle};
};


// ----------------------------------------------------------------------------------------
LSystem.prototype.getPreviousLevel = function() {
	this.level--;
	if (this.level < 0) this.level = 0;
	this.getLevel(this.level);
	return true;
};


// ----------------------------------------------------------------------------------------
LSystem.prototype.getLevel = function(level) {
	if (level < 0) return undefined;

	// Don't go above maxLevel
    if (level >= this.maxLevel) return undefined;

	this.level        = 0;
	this.currentState = this.axiom;
	for (var i = 0; i < level; i++)
		this.getNextLevel();

	return true;
};


// ----------------------------------------------------------------------------------------
LSystem.prototype.getColor = function(character) {
	if (this.colors.singleColor) {
		console.log("ERROR: this LSystem has just one color and it should not be asked for a different one");
		return this.colors.defaultColor;
	}

	return this.colors.getColor(character);
};