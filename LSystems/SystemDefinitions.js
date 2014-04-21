/////////////////////////////////////////////////////////////////////
// Available Systems
var SYSTEM_INDEX           = 0;
var KOCH_ISLAND            = SYSTEM_INDEX; SYSTEM_INDEX++;
var QUADRATIC_KOCH_ISLAND  = SYSTEM_INDEX; SYSTEM_INDEX++;
var QUADRATIC_SNOW_FLAKE   = SYSTEM_INDEX; SYSTEM_INDEX++;
var ISLAND_LAKE            = SYSTEM_INDEX; SYSTEM_INDEX++;
var RINGS                  = SYSTEM_INDEX; SYSTEM_INDEX++;
var TAPESTRY               = SYSTEM_INDEX; SYSTEM_INDEX++;
var TILES                  = SYSTEM_INDEX; SYSTEM_INDEX++;
var CRYSTAL                = SYSTEM_INDEX; SYSTEM_INDEX++;
var CROSS                  = SYSTEM_INDEX; SYSTEM_INDEX++;
var CROSS_LIGHT            = SYSTEM_INDEX; SYSTEM_INDEX++;
var DRAGON_CURVE           = SYSTEM_INDEX; SYSTEM_INDEX++;
var SIERPINSKI_ARROWHEAD   = SYSTEM_INDEX; SYSTEM_INDEX++;
var HEXAGONAL_GOSPER_CURVE = SYSTEM_INDEX; SYSTEM_INDEX++;
var QUADRATIC_GOSPER_CURVE = SYSTEM_INDEX; SYSTEM_INDEX++;
var TREE1                  = SYSTEM_INDEX; SYSTEM_INDEX++;
var TREE2                  = SYSTEM_INDEX; SYSTEM_INDEX++;
var TREE1                  = SYSTEM_INDEX; SYSTEM_INDEX++;
var TREE2                  = SYSTEM_INDEX; SYSTEM_INDEX++;
var TREE3                  = SYSTEM_INDEX; SYSTEM_INDEX++;
var TREE4                  = SYSTEM_INDEX; SYSTEM_INDEX++;
var TREE5                  = SYSTEM_INDEX; SYSTEM_INDEX++;
var TREE6                  = SYSTEM_INDEX; SYSTEM_INDEX++;
var PEANO_CURVE            = SYSTEM_INDEX; SYSTEM_INDEX++;
var PITHAGORAS_CURVE       = SYSTEM_INDEX; SYSTEM_INDEX++;
var HILBERT_CURVE          = SYSTEM_INDEX; SYSTEM_INDEX++;
var SIERPINSKI_SQUARE      = SYSTEM_INDEX; SYSTEM_INDEX++;
var KOCH_SNOW_FLAKE        = SYSTEM_INDEX; SYSTEM_INDEX++;
var TRIANG                 = SYSTEM_INDEX; SYSTEM_INDEX++;
var SIERPINSKI_GASKET      = SYSTEM_INDEX; SYSTEM_INDEX++;
/////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////
// Visual Parameters
var DEFAULT_SYSTEM_COLOR = new THREE.Color(0x2E6FC9);
/////////////////////////////////////////////////////////////////////

/**
 *  Factory to retrieve a LSystem Definition Object
 *
 * @param   Number  desiredSystem  One of the possible LSystem defined in the beginning of this file
 * @return  A SystemDefinition object with the following fields:

            Array    Rules          An Array with Rule objects
            string   Axiom          The first state of the LSystem the turtle should draw
            Number   Angle          The angle the turtle should use when changing direction
            Number   MaxLevel       The maximum level the LSystem should evolve to
            object   Colors         An object with singleColor and defaultColor if only one is presented, or 
                                    a function to retrieve a color based on one of the symbols the LSystem uses to evolve
            object   Interpretation An object with the actions the Turtle should do based on the symbols. Most of the actions
                                    are shared between all the LSystem, but some specific ones can be added before the
                                    returning of the function (basically changes in color and shape)
            function getNextLevel   A function to compute the next level of the LSystem based on the Rules.
                                    For each type of LSystem (D0L, stochastic, Context Dependent, PseudLSystem and Parametric), a
                                    function will be implemented and passed to this property. 
                                    Only D0L and PseudLSystem are implemented so far.
*/
function getSystemDefinition(desiredSystem) {

    var systemDefinition = {};
    var systemColors     = {};
    var interpretation   = {
        "F": "DrawForward",
        "f": "MoveForward",
        "l": "DrawForward",  // For Edge Rewrite
        "r": "DrawForward",  // For Edge Rewrite
        "[": "PushValues",   // Store Turtle's current state: position, orientation, pen color
        "]": "PopValues",    // Retrieve Turtle's state from the stack
        "-": "TurnRight",    // In 3D it's U (Z axis) Matrix
        "+": "TurnLeft",     // In 3D it's U (Z axis) Matrix
        "&": "PitchDown",    // In 3D it's L (X axis) Matrix
        "^": "PitchUp",      // In 3D it's L (X axis) Matrix
        "{": "RollLeft",     // In 3D it's H (Y axis) Matrix. Obs: Original was \
        "}": "RollRight",    // In 3D it's H (Y axis) Matrix. Obs: Original was /
        "|": "TurnAround"    // Move 180 around H axis
    };

    var rules = [];
    var rule0, rule1, rule2;

    switch (desiredSystem) {
        case KOCH_ISLAND:
            rule0    = new Rule("* < F > * --> F-F+F+FF-F-F+F");
            rules[0] = rule0;
            systemDefinition.axiom          = "F-F-F-F";
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 90;
            systemDefinition.maxLevel       = 4;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

        case QUADRATIC_SNOW_FLAKE:
            rule0    = new Rule("* < F > * --> F+F-F-F+F");
            rules[0] = rule0;
            systemDefinition.axiom          = "-F";
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 90;
            systemDefinition.maxLevel       = 6;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

        case QUADRATIC_KOCH_ISLAND:
            rule0    = new Rule("* < F > * --> F-FF+FF+F+F-F-FF+F+F-F-FF-FF+F");
            rules[0] = rule0;
            systemDefinition.axiom          = "F+F+F+F";
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 90;
            systemDefinition.maxLevel       = 3;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

        case ISLAND_LAKE:
            rule0    = new Rule("* < F > * --> F-f+FF-F-FF-Ff-FF+f-FF+F+FF+Ff+FFF");
            rule1    = new Rule("* < f > * --> ffffff");
            rules[0] = rule0;
            rules[1] = rule1;
            systemDefinition.axiom          = "F+F+F+F";
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 90;
            systemDefinition.maxLevel       = 3;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

        case RINGS:
            rule0    = new Rule("* < F > * --> FF-F-F-F-F-F+F");
            rules[0] = rule0;
            systemDefinition.axiom          = "F-F-F-F";
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 90;
            systemDefinition.maxLevel       = 5;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

        case TAPESTRY:
            rule0    = new Rule("* < F > * --> FF-F-F-F-FF");
            rules[0] = rule0;
            systemDefinition.axiom          = "F-F-F-F";
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 90;
            systemDefinition.maxLevel       = 5;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

        case TILES:
            rule0    = new Rule("* < F > * --> FF-F+F-F-FF");
            rules[0] = rule0;
            systemDefinition.axiom          = "F-F-F-F";
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 90;
            systemDefinition.maxLevel       = 5;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

        case CRYSTAL:
            rule0    = new Rule("* < F > * --> FF-F--F-F");
            rules[0] = rule0;
            systemDefinition.axiom          = "F-F-F-F";
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 90;
            systemDefinition.maxLevel       = 5;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

        case CROSS:
            rule0    = new Rule("* < F > * --> F-FF--F-F");
            rules[0] = rule0;
            systemDefinition.axiom          = "F-F-F-F";
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 90;
            systemDefinition.maxLevel       = 5;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

        case CROSS_LIGHT:
            rule0    = new Rule("* < F > * --> F-F+F-F-F");
            rules[0] = rule0;
            systemDefinition.axiom          = "F-F-F-F";
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 90;
            systemDefinition.maxLevel       = 5;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

        case DRAGON_CURVE:
            rule0     = new Rule("* < l > * --> l+rF+");
            rule1     = new Rule("* < r > * --> -Fl-r");
            rules[0] = rule0;
            rules[1] = rule1;
            systemDefinition.axiom          = "Fr";
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 90;
            systemDefinition.maxLevel       = 17;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

        case SIERPINSKI_ARROWHEAD:
            rule0     = new Rule("* < l > * --> rF+l+rF");
            rule1     = new Rule("* < r > * --> Fl-r-Fl");
            rules[0] = rule0;
            rules[1] = rule1;
            systemDefinition.axiom          = "Fl";
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 60;
            systemDefinition.maxLevel       = 9;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

        // This one must start on level 1 ortherwise there will be nothing to draw on the first iteration
        case HEXAGONAL_GOSPER_CURVE:
            rule0    = new Rule("* < XF > * --> XF+YF++YF-XF--XFXF-YF+");
            rule1    = new Rule("* < YF > * --> -XF+YFYF++YF+XF--XF-YF");
            rules[0] = rule0;
            rules[1] = rule1;
            systemDefinition.axiom          = "XF+YF++YF-XF--XFXF-YF+";
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 60;
            systemDefinition.maxLevel       = 4;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = pseudLSystem;
        break;

        case QUADRATIC_GOSPER_CURVE:
            rule0    = new Rule("* < X > * --> XFX-YF-YF+FX+FX-YF-YFFX+YF+FXFXYF-FX+YF+FXFX+YF-FXYF-YF-FX+FX+YFYF-");
            rule1    = new Rule("* < Y > * --> +FXFX-YF-YF+FX+FXYF+FX-YFYF-FX-YF+FXYFYF-FX-YFFX+FX+YF-YF-FX+FX+YFY");
            rules[0] = rule0;
            rules[1] = rule1;
            systemDefinition.axiom          = "-YF";
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 90;
            systemDefinition.maxLevel       = 3;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

        case TREE1:
            rule0    = new Rule("* < F > * --> F[+F]F[-F]F");
            rules[0] = rule0;
            systemDefinition.axiom          = "F[+F]F[-F]F"; // Original was F
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 25.7;
            systemDefinition.maxLevel       = 6;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

        case TREE2:
            rule0    = new Rule("* < F > * --> F[+F]F[-F][F]");
            rules[0] = rule0;
            systemDefinition.axiom          = "F[+F]F[-F][F]"; // Original was F
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 20;
            systemDefinition.maxLevel       = 6;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

        case TREE3:
            rule0    = new Rule("* < F > * --> FF-[-F+F+F]+[+F-F-F]");
            rules[0] = rule0;
            systemDefinition.axiom          = "FF-[-F+F+F]+[+F-F-F]";
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 22.5;
            systemDefinition.maxLevel       = 4;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

        case TREE4:
            rule0    = new Rule("* < X > * --> F[+X]F[-X]+X");
            rule1    = new Rule("* < F > * --> FF");
            rules[0] = rule0;
            rules[1] = rule1;
            systemDefinition.axiom          = "F[+X]F[-X]+X";
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 20;
            systemDefinition.maxLevel       = 7;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

        case TREE5:
            rule0    = new Rule("* < X > * --> F[+X][-X]FX");
            rule1    = new Rule("* < F > * --> FF");
            rules[0] = rule0;
            rules[1] = rule1;
            systemDefinition.axiom          = "F[+X][-X]FX";
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 25.7;
            systemDefinition.maxLevel       = 8;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

        case TREE6:
            rule0    = new Rule("* < X > * --> F-[[X]+X]+F[+FX]-X");
            rule1    = new Rule("* < F > * --> FF");
            rules[0] = rule0;
            rules[1] = rule1;
            systemDefinition.axiom          = "F-[[X]+X]+F[+FX]-X";
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 25.7;
            systemDefinition.maxLevel       = 7;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

        // This one must start on level 1 ortherwise there will be nothing to draw
        case PEANO_CURVE:
            rule0    = new Rule("* < X > * --> RXFYFX+F+GYFXFY-F-BXFYFX");
            rule1    = new Rule("* < Y > * --> BYFXFY-F-RXFYFX+F+GYFXFY");
            rules[0] = rule0;
            rules[1] = rule1;
            systemDefinition.axiom    = "RXFYFX+F+GYFXFY-F-BXFYFX";
            systemDefinition.rules    = rules;
            systemDefinition.angle    = 90;
            systemDefinition.maxLevel = 3;
            systemDefinition.interpretation      = interpretation;
            systemDefinition.interpretation["R"] = "ChangeColor";
            systemDefinition.interpretation["G"] = "ChangeColor";
            systemDefinition.interpretation["B"] = "ChangeColor";
            systemColors.singleColor             = false;
            systemColors.color1                  = new THREE.Color(0xFF0000);
            systemColors.color2                  = new THREE.Color(0x00FF00);
            systemColors.color3                  = new THREE.Color(0x0000FF);
            systemColors.defaultColor            = systemColors.color1;
            systemColors.getColor                = function(character) {
                var c;
                switch (character) {
                    case "R": c = this.color1; break;
                    case "G": c = this.color2; break;
                    case "B": c = this.color3; break;
                }
                return c !== undefined ? c : new THREE.Color(0xFFFFFF);
            };
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

        case PITHAGORAS_CURVE:
            rule0    = new Rule("* < F > * --> F-F++F+F-F-F");
            rules[0] = rule0;
            systemDefinition.axiom          = "F-F-F-F-F";
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 72;
            systemDefinition.maxLevel       = 6;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

        // This one must start on level 1 ortherwise there will be nothing to draw on the first iteration
        case HILBERT_CURVE:
            rule0    = new Rule("* < L > * --> +RF-LFL-FR+");
            rule1    = new Rule("* < R > * --> -LF+RFR+FL-");
            rules[0] = rule0;
            rules[1] = rule1;
            systemDefinition.axiom          = "+RF-LFL-FR+";
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 90;
            systemDefinition.maxLevel       = 6;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

        // This one must start on level 1 ortherwise there will be nothing to draw on the first iteration
        case SIERPINSKI_SQUARE:
            rule0    = new Rule("* < F > * --> XF-F+F-XF+F+XF-F+F-X");
            rules[0] = rule0;
            systemDefinition.axiom          = "F+XF+F+XF";
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 90;
            systemDefinition.maxLevel       = 4;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

        //////////////////////////////////////////////////////////////////////////////
        // These defintions were taken from Paul Bourke's site http://paulbourke.net/

        case KOCH_SNOW_FLAKE:
            rule0    = new Rule("* < F > * --> F-F++F-F");
            rules[0] = rule0;
            systemDefinition.axiom          = "F++F++F";
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 60;
            systemDefinition.maxLevel       = 6;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

       case TRIANG:
            rule0    = new Rule("* < F > * --> F-F+F");
            rules[0] = rule0;
            systemDefinition.axiom          = "F+F+F";
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 120;
            systemDefinition.maxLevel       = 7;
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;

       case SIERPINSKI_GASKET:
            rule0    = new Rule("* < F > * --> F+F-F-F-T+F+F+F-F");
            rule1    = new Rule("* < T > * --> TTT");
            rules[0] = rule0;
            rules[1] = rule1;
            systemDefinition.axiom          = "F+F-F-F-T+F+F+F-F";
            systemDefinition.rules          = rules;
            systemDefinition.angle          = 90;
            systemDefinition.maxLevel       = 4;
            interpretation["T"]             = "DrawForward";
            systemDefinition.interpretation = interpretation;
            systemColors.singleColor        = true;
            systemColors.defaultColor       = DEFAULT_SYSTEM_COLOR;
            systemDefinition.colors         = systemColors;
            systemDefinition.getNextLevel   = d0l;
        break;


        default: console.log("BUG: SystemDefinition should never reach default case. DesiredSystem " + desiredSystem); break;
    }

    return systemDefinition;
}


/////////////////////////////////////////////////////////////////////////////////
// These fuctions are the most important ones of the LSystem Object.
// They will evolves the LSystem, stored on currentState, to the next level.
// One function will be implemente for each LSystem: 
// D0L, Stochastic, Context Dependent, PseudoLSystem and Parametric.
// If the level desired is above the maxLevel, function returns undefined and
// if everything was ok during the computation of next level, it returns true
/////////////////////////////////////////////////////////////////////////////////

// ----------------------------------------------------------------------------------------
function d0l() {
    if (this.level >= this.maxLevel) return undefined;

    var result = "";
    for (var i = 0, j = this.currentState.length; i < j; i++) {
        var foundRule = false;
        innerLoop:
        for (var k = 0, m = this.systemRules.length; k < m; k++) {
            if (this.currentState.charAt(i) === this.systemRules[k].predecessor) {
                result    = result.concat(this.systemRules[k].successor);
                foundRule = true;
                break innerLoop;
            }
        }

        if (!foundRule) result = result.concat(this.currentState.charAt(i));
    }

    this.level++;
    this.currentState = result;

    return true;
}


// ----------------------------------------------------------------------------------------
function pseudLSystem() {
    if (this.level >= this.maxLevel) return undefined;

    var result = "";
    var i      = 0;
    var j      = this.currentState.length;
    while (i < j) {
        var foundRule = false;
        innerLoop:
        for (var k = 0, m = this.systemRules.length; k < m; k++) {
            var predecessorLength = this.systemRules[k].predecessor.length;
            if (i + predecessorLength <= j) {
                var sub = this.currentState.substring(i, i + predecessorLength);
                if (sub === this.systemRules[k].predecessor) {
                    result    = result.concat(this.systemRules[k].successor);
                    foundRule = true;
                    i        += predecessorLength;
                    break innerLoop;
                }
            }
        }

        if (!foundRule) {
            result = result.concat(this.currentState.charAt(i));
            i++;
        }
    }

    this.level++;
    this.currentState = result;

    return true;
}
