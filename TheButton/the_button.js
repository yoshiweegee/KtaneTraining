const MAX_TIME = 5999999; //99:59.999

const indicatorNames = [
    "SND",
    "CLR",
    "CAR",
    "IND",
    "FRQ",
    "SIG",
    "NSA",
    "MSA",
    "TRN",
    "BOB",
    "FRK"
];

const IND_COND_NONE = 0;
const IND_COND_UNLIT = 1;
const IND_COND_LIT = 2;

const portTypes = ["Parallel", "Serial", "DVI-D", "PS/2", "RCA", "RJ-45"];
const VANILLA_PORT_GROUP_SEP_IDX = 2;

//end standard bomb consts

const colorNames = ["RED", "YELLOW", "BLUE", "WHITE"]
const colors = {
    RED: {r: 0.95, g: 0, b: 0, a: 1},
    YELLOW: {r: 0.95, g: 0.95, b: 0, a: 1},
    BLUE: {r: 0, g: 0, b: 0.95, a: 1},
    WHITE: {r: 0.95, g: 0.95, b: 0.95, a: 1}
};

function areColorsEqual(colorA, colorB) {
    return colorA.r == colorB.r
        && colorA.g == colorB.g
        && colorA.b == colorB.b
        && colorA.a == colorB.a;
}

const buttonLabels = ["PRESS", "HOLD", "DETONATE", "ABORT"];

const BUTTON_LEFT_EDGE = -7 / 8;
const BUTTON_BOTTOM_EDGE = -7 / 8;
const BUTTON_DIAMETER = 11 / 8;
const BUTTON_RADIUS = BUTTON_DIAMETER / 2;

const BUTTON_LABEL_LEFT = -13 / 16;
const BUTTON_LABEL_BOTTOM = -13 / 16;
const BUTTON_LABEL_WIDTH = 5 / 4;
const BUTTON_LABEL_HEIGHT = 5 / 4;

const BUTTON_PRESS_SCALE = 10 / 11;

const STRIP_LIGHTUP_TIME = 500;

var lastTime = 0;
var step;

function updateStep(time) {
    step = time - lastTime;
    lastTime = time;
}

function zeroPad(num, minWidth) {
    var numStr = num.toString();
    var padding = "";
    for (var i = numStr.length; i < minWidth; i++) {
        padding += "0";
    }
    return padding + numStr;
}

function randomInt(end) {
    if (!Number.isInteger(end)) {
        console.warn("Function randomInt passed non-int. Argument truncated.");
        end = Math.floor(end);
    }
    return Math.floor(Math.random() * end);
}

function randomIntRange(start, end) {
    if (!Number.isInteger(start)) {
        console.warn("Function randomIntRange passed non-int start. Argument truncated.");
        start = Math.floor(start);
    }
    if (!Number.isInteger(end)) {
        console.warn("Function randomIntRange passed non-int end. Argument truncated.");
        end = Math.floor(end);
    }
    if (start > end) {
        var temp = start;
        start = end;
        end = temp;
    }
    return randomInt(Math.round(end - start)) + start;
}

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return program;
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

/*
function resizeCanvas(canvas) {
    var dispW = canvas.clientWidth;
    var dispH = canvas.clientHeight;
    if (canvas.width !== dispW || canvas.height !== dispH) {
        canvas.width = dispW;
        canvas.height = dispH;
    }
}
*/

/*
function setRectangle(positions, x, y, w, h) {
    var ax = x;
    var ay = y;
    var bx = x + w;
    var by = y;
    var cx = x;
    var cy = y + h;
    var dx = x + w;
    var dy = y + h;
    positions.push(ax, ay, bx, by, cx, cy, bx, by, cx, cy, dx, dy);
}
*/

/*
function selectRandom(array, number, removeEls = false) {
    if (number <= 0) {
        return [];
    }
    //copy the master list
    var arrayCopy = [];
    for (var i = 0; i < array.length; i++) {
        arrayCopy.push(array[i]);
    }
    if (number >= array.length) {
        return arrayCopy;
    }
    
    var choices = new Array(number);
    for (var i = 0; i < number; i++) {
        var idx = Math.floor(Math.random() * arrayCopy.length);
        choices[i] = arrayCopy[idx];
        //remove this name from the list
        arrayCopy.splice(idx, 1);
        if (removeEls) {
            array.splice(idx, 1);
        }
    }
    return choices;
}
*/

function generatePortPlate() {
    var possPorts = [];
    var ports = [];
    
    var groupType = Math.random();
    if (groupType >= 1/8) {
        if (groupType < 9/16) {
            possPorts = [...portTypes];
            possPorts.length = VANILLA_PORT_GROUP_SEP_IDX;
        } else {
            possPorts = portTypes.slice(VANILLA_PORT_GROUP_SEP_IDX, portTypes.length);
        }
    }
    
    for (var i = 0; i < possPorts.length; i++) {
        if (Math.random() >= 0.5) {
            ports.push(possPorts[i]);
        }
    }
    
    //organize
    /*
    result.sort(
        function(a, b) {
            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            } else {
                return 0;
            }
        }
    );
    */
    
    result = {
        ports: ports,
        toString: function() {
            if (this.ports.length == 0) {
                return "[Empty]";
            }
            
            var retStr = `[${this.ports[0]}`;
            for (var i = 1; i < this.ports.length; i++) {
                retStr += `, ${ports[i]}`;
            }
            
            return retStr + "]";
        }
    }
    
    return result;
}

/*
function portPlateToString(portPlate) {
    var retStr = `[`;
    var ports = Object.keys(portPlate);
    var i;
    for (i = 0; i < ports.length; i++) {
        if (portPlate[ports[i]]) {
            retStr += `[${ports[i]}`;
            break;
        }
    }
    
    for (i = i; i < ports.length; i++) {
        if (portPlate[ports[i]]) {
            retStr += `, ${ports[i]}`;
        }
    }
    
    return retStr + "]";
}
*/

function generateUpperLetter() {
    return String.fromCharCode(randomIntRange(65, 91));
}

function generateDigit() {
    return String.fromCharCode(randomIntRange(48, 58));
}

function generateUpperAlphaNum() {
    var choice = randomInt(36);
    if (choice < 10) {
        return String.fromCharCode(choice + 48);
    } else {
        return String.fromCharCode(choice + 55);
    }
}

function generateSerial() {
    return generateUpperAlphaNum()
        + generateUpperAlphaNum()
        + generateDigit()
        + generateUpperLetter()
        + generateUpperLetter()
        + generateDigit();
}

function generateEdgework() {
    var holders = 0;
    var aaBatts = 0;
    var dBatts = 0;
    var indicatorChoices = [...indicatorNames];
    var indicators = [];
    var portPlates = [];
    
    for (var i = 0; i < 5; i ++) {
        var widgetType = Math.random();
        if (widgetType < 1/3) { //battery holder
            holders++;
            if (Math.random() < 0.5) {
                dBatts++;
            } else {
                aaBatts += 2;
            }
        } else if (widgetType < 2/3) { //indicator
            var newInd = {name: "", lit: true};
            newIndNameIdx = randomInt(indicatorChoices.length);
            newInd.name = indicatorChoices[newIndNameIdx];
            indicatorChoices.splice(newIndNameIdx, 1);
            if (Math.random() < 0.5) {
                newInd.lit = false;
            }
            newInd.toString = function() {
                var retStr = "";
                if (this.lit) {
                    retStr += "*";
                }
                return retStr + this.name;
            }
            indicators.push(newInd);
        } else { //port plate
            portPlates.push(generatePortPlate());
        }
    }
    
    var serial = generateSerial();
    
    var edgework = {
        holders: holders,
        dBatts: dBatts,
        aaBatts: aaBatts,
        indicators: indicators,
        portPlates: portPlates,
        serial: serial,
        toContent: function() {
            var retStr = `${this.holders}H ${this.dBatts + this.aaBatts}B`;
            if (this.indicators.length > 0) {
                retStr += `<br/>${this.indicators[0].toString()}`;
                for (var i = 1; i < this.indicators.length; i++) {
                    retStr += ` ${this.indicators[i].toString()}`;
                }
            }
            if (this.portPlates.length > 0) {
                retStr += `<br/>${this.portPlates[0].toString()}`;
                for (var i = 1; i < this.portPlates.length; i++) {
                    retStr += ` ${this.portPlates[i].toString()}`;
                }
            }
            return retStr + `<br/>${this.serial}`;
        },
        
        hasIndicator: function(name, litCond) {
            for (var i = 0; i < this.indicators.length; i++) {
                if (this.indicators[i].name == name
                    && (
                        litCond == IND_COND_NONE
                        || litCond == IND_COND_UNLIT && this.indicators[i].lit == false
                        || litCond == IND_COND_LIT && this.indicators[i].lit == true
                    )
                ) {
                    return true;
                }
            }
            return false;
        }
    };
    
    return edgework;
}

function setHoldDigit(module) {
    if (areColorsEqual(module.stripColor, colors.BLUE)) {
        module.hold = 4;
    } else if (areColorsEqual(module.stripColor, colors.YELLOW)) {
        module.hold = 5;
    } else {
        module.hold = 1;
    }
}

//rename this to generateModule
function generateTheButton() {
    var newButton = {
        //bomb timer
        timer: 0,
        minutes: 0,
        seconds: 0,
        setTime: function(newTime) {
            this.timer = newTime;
            this.minutes = Math.floor(newTime / 60000);
            this.seconds = Math.floor(newTime / 1000 % 60);
        },
        timerHasDigit: function(digit) {
            return Math.floor(this.minutes / 10) == digit
                || this.minutes % 10 == digit
                || Math.floor(this.seconds / 10) == digit
                || this.seconds % 10 == digit;
        },
        
        //bomb edgework
        edgework: generateEdgework(),
        
        //bomb solve state
        strikeTimer: 0,
        solved: false,
        strikeLocked: false,
        setStrike: function() {
            if (!this.strikeLocked) {
                this.strikeTimer = 1000;
            }
        },
        
        //module components
        buttonColor: colors[colorNames[randomInt(colorNames.length)]],
        buttonLabel: buttonLabels[randomInt(buttonLabels.length)],
        stripColor: colors[colorNames[randomInt(colorNames.length)]],
        
        //module interaction states
        buttonHover: false,
        buttonPress: -1,
        
        //module solution
        hold: -1 //-1: press, 0-9: hold & release on countdown digit
    };
    
    newButton.setTime(MAX_TIME);
    
    if (
        //rule 1
        areColorsEqual(newButton.buttonColor, colors.BLUE) && newButton.buttonLabel == "ABORT"
        //rule 2
        || !(
            newButton.edgework.dBatts + newButton.edgework.aaBatts > 1
            && newButton.buttonLabel == "DETONATE"
        )
        && (
            //rule 3
            areColorsEqual(newButton.buttonColor, colors.WHITE)
            && newButton.edgework.hasIndicator("CAR", IND_COND_LIT)
            //rule 4
            || !(
                newButton.edgework.dBatts + newButton.edgework.aaBatts > 2
                && newButton.edgework.hasIndicator("FRK", IND_COND_LIT)
            )
            && (
                //rule 5
                areColorsEqual(newButton.buttonColor, colors.YELLOW)
                //rule 6
                || !(
                    areColorsEqual(newButton.buttonColor, colors.RED)
                    && newButton.buttonLabel == "HOLD"
                )
            )
        )
    ) {
        setHoldDigit(newButton); 
    }
    
    return newButton;
}

function getLabelColor(buttonColor) {
    if (areColorsEqual(buttonColor, colors.RED) || areColorsEqual(buttonColor, colors.BLUE)) {
        return colors.WHITE;
    } else {
        return {r: 0, g: 0, b: 0, a: 1}; //black
    }
}

function runApp(gl, renderEl, timerEl, edgeworkEl) {
    var vs = document.getElementById("vs").innerHTML;
    var fs = document.getElementById("fs").innerHTML;
    var textVs = document.getElementById("text-vs").innerHTML;
    var textFs = document.getElementById("text-fs").innerHTML;
    
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vs);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs);
    var program = createProgram(gl, vertexShader, fragmentShader); //single color vertex
    
    var textVertexShader = createShader(gl, gl.VERTEX_SHADER, textVs);
    var textFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, textFs);
    var textProgram = createProgram(gl, textVertexShader, textFragmentShader); //texture vertex
    
    //get locations
    var positionAttrLoc = gl.getAttribLocation(program, "a_position");
    //var resoUnifLoc = gl.getUniformLocation(program, "u_resolution");
    var colorUnifLoc = gl.getUniformLocation(program, "u_color");
    
    var textPositionAttrLoc = gl.getAttribLocation(textProgram, "a_position");
    var textTexCoordAttrLoc = gl.getAttribLocation(textProgram, "a_texCoord");
    //var textTexUnifLoc = gl.getUniformLocation(textProgram, "u_texture");
    
    //create vertex arrays
    var vao = gl.createVertexArray();
    var textVao = gl.createVertexArray();
    
    //create and bind buffer
    var positionBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuf);
    
    //setup primary
    gl.bindVertexArray(vao);
    
    //setup and enable attrs
    gl.vertexAttribPointer(positionAttrLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttrLoc);
    
    //setup text
    gl.bindVertexArray(textVao);
    
    gl.vertexAttribPointer(textPositionAttrLoc, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(positionAttrLoc);
    gl.vertexAttribPointer(textTexCoordAttrLoc, 2, gl.FLOAT, false, 16, 8);
    gl.enableVertexAttribArray(textTexCoordAttrLoc);
    
    var textTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textTex);
    //gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    //use primary program
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    
    //adjust canvas size and clip space conversion
    //resizeCanvas(gl.canvas);
    gl.viewport(0, 0, gl.canvas.scrollWidth, gl.canvas.scrollHeight);
    
    //clear canvas
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    //set invariant uniforms (don't change in-script, may change from user)
    //gl.uniform2f(resoUnifLoc, gl.canvas.width, gl.canvas.height);
    
    //2d context for text
    var context2d = document.createElement("canvas").getContext("2d");
    context2d.canvas.width = 1024;
    context2d.canvas.height = 1024;
    context2d.textAlign = "center";
    context2d.textBaseline = "middle";
    context2d.font = "bold 256px monospace";
    
    function shouldRemakeLabelTexture(newModule, oldModule) {
        return newModule.buttonLabel != oldModule.buttonLabel
            || !areColorsEqual(
                getLabelColor(newModule.buttonColor),
                getLabelColor(oldModule.buttonColor)
            );
    }

    function makeLabelTexture(text, color) {
        context2d.fillStyle = "rgba("
            + (color.r * 255) + ", "
            + (color.g * 255) + ", "
            + (color.b * 255) + ", "
            + color.a
        + ")";
        context2d.clearRect(0, 0, context2d.canvas.width, context2d.canvas.height);
        context2d.fillText(
            text,
            context2d.canvas.width / 2,
            context2d.canvas.height / 2,
            context2d.canvas.width
        );
        return context2d.canvas;
    }

    function drawEllipse(x, y, w, h, color) {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(4), gl.DYNAMIC_DRAW);
        gl.uniform4f(colorUnifLoc, color.r, color.g, color.b, color.a);
        for (var i = 0; i <= h; i += 1 / gl.canvas.scrollHeight) {
            gl.bufferSubData(
                gl.ARRAY_BUFFER,
                0,
                new Float32Array([
                    x + w / 2 - w / 2 * (1 - ((i - h / 2) / (h / 2))**2)**0.5,
                    y + i,
                    x + w / 2 + w / 2 * (1 - ((i - h / 2) / (h / 2))**2)**0.5,
                    y + i
                ])
            );
            gl.drawArrays(gl.LINES, 0, 2);
        }
    }

    function drawRectangle(x, y, w, h, color) {
        gl.uniform4f(colorUnifLoc, color.r, color.g, color.b, color.a);
        var points = [x, y, x + w, y, x, y + h, x + w, y, x, y + h, x + w, y + h];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    
    function drawButton(module, time) {
        if (module.buttonHover) {
            drawEllipse(
                BUTTON_LEFT_EDGE - 1/16,
                BUTTON_BOTTOM_EDGE - 1/16,
                BUTTON_DIAMETER + 1/8,
                BUTTON_DIAMETER + 1/8,
                {r: 0.95, g: time / 1000 % 1 * 0.475, b: 0, a: 1}
            );
        }
        var buttonLeft = BUTTON_LEFT_EDGE;
        var buttonBottom = BUTTON_BOTTOM_EDGE;
        var buttonDiam = BUTTON_DIAMETER;
        if (module.buttonPress != -1) {
            buttonDiam *= BUTTON_PRESS_SCALE;
            buttonLeft += BUTTON_RADIUS - buttonDiam / 2;
            buttonBottom += BUTTON_RADIUS - buttonDiam / 2;
        }
        drawEllipse(
            buttonLeft,
            buttonBottom,
            buttonDiam,
            buttonDiam,
            module.buttonColor
        );
    }

    function drawModule(module, time) {
        //use primary program
        gl.useProgram(program);
        gl.bindVertexArray(vao);
        
        var metallishColor = {r: 0.75, g: 0.75, b: 0.85, a: 1};
        
        //case
        drawRectangle(
            -1,
            -1,
            2,
            2,
            {r: 0.75, g: 0.75, b: 0.85, a: 1}
        );
        
        var baseColor = {r: 0.15, g: 0.15, b: 0.15, a: 1};
        //base
        drawEllipse(
            9 / 16,
            9 / 16,
            1 / 2,
            1 / 2,
            baseColor
        );
        drawRectangle(
            9 / 16,
            13 / 16,
            7 / 16,
            3 / 16,
            baseColor
        );
        drawRectangle(
            13 / 16,
            9 / 16,
            3 / 16,
            1,
            baseColor
        );
        
        //module light
        drawEllipse(
            19 / 32,
            19 / 32,
            13 / 32,
            13 / 32,
            {
                r: 2 * metallishColor.r / 3,
                g: 2 * metallishColor.g / 3,
                b: 2 * metallishColor.b / 3,
                a: 1
            }
        );
        drawEllipse(
            43 / 64,
            43 / 64,
            1 / 4,
            1 / 4,
            {
                r: 7 * metallishColor.r / 6,
                g: 7 * metallishColor.g / 6,
                b: 7 * metallishColor.b / 6,
                a: 1
            }
        );
        var lightColor;
        if (module.solved) {
            lightColor = {r: 0, g: 0.95, b: 0, a: 1}; //green
        } else if (module.strikeTimer > 0) {
            lightColor = colors.RED;
        } else {
            lightColor = {r: 0.05, g: 0.05, b: 0.05, a: 1};
        }
        drawEllipse(
            45 / 64,
            45 / 64,
            3 / 16,
            3 / 16,
            lightColor
        );
        
        //light strip
        var finalStripColor;
        if (module.buttonPress >= STRIP_LIGHTUP_TIME) {
            var colorScale = Math.min(
                1,
                -Math.cos((moduleInfo.buttonPress - 500) / 1250 % 1 * 2 * Math.PI) * 0.125 + 0.875
            );
            finalStripColor = {
                r: module.stripColor.r * colorScale,
                g: module.stripColor.g * colorScale,
                b: module.stripColor.b * colorScale,
                a: module.stripColor.a
            };
        } else {
            finalStripColor = {r: 0, g: 0, b: 0, a: 1};
        }
        drawRectangle(
            5 / 8,
            -7 / 8,
            1 / 4,
            43 / 40,
            finalStripColor
        );
        
        //button
        drawButton(module, time);
        
        //switch to text program
        gl.useProgram(textProgram);
        gl.bindVertexArray(textVao);
        
        var textLeft = BUTTON_LABEL_LEFT;
        var textBottom = BUTTON_LABEL_BOTTOM;
        var textWidth = BUTTON_LABEL_WIDTH;
        var textHeight = BUTTON_LABEL_WIDTH;
        if (module.buttonPress != -1) {
            textWidth *= BUTTON_PRESS_SCALE;
            textHeight *= BUTTON_PRESS_SCALE;
            textLeft += (BUTTON_LABEL_WIDTH - textWidth) / 2
            textBottom += (BUTTON_LABEL_HEIGHT - textHeight) / 2
        }
        
        //render label texture
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            textLeft,             textBottom, 0, 1,
            textLeft + textWidth, textBottom, 1, 1,
            textLeft,             textBottom + textHeight, 0, 0,
            textLeft + textWidth, textBottom, 1, 1,
            textLeft,             textBottom + textHeight, 0, 0,
            textLeft + textWidth, textBottom + textHeight, 1, 0
        ]), gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    
    var moduleInfo = null;
    
    function prepareNewButtonRenderInfo(newModule, oldModule) {
        //redrawModule(newModuleInfo, moduleInfo);
        //drawModule(newModuleInfo, performance.now(), moduleInfo);
        if (oldModule == null || shouldRemakeLabelTexture(newModule, oldModule)) {
            gl.useProgram(textProgram);
            gl.bindVertexArray(textVao);
            var labelTexture = makeLabelTexture(
                newModule.buttonLabel,
                getLabelColor(newModule.buttonColor)
            );
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, labelTexture);
        }
    }
    
    function loadButton(newModule) {
        prepareNewButtonRenderInfo(newModule, moduleInfo);
        edgeworkEl.innerHTML = newModule.edgework.toContent();
        moduleInfo = newModule;
    }
    
    function loadNewButton() {
        loadButton(generateTheButton());
    }
    
    //button information
    loadNewButton();
    
    //prepareNewButtonRenderInfo(moduleInfo, null);
    function processFrame(time) {
        updateStep(time);
        if (!moduleInfo.solved) {
            moduleInfo.setTime(moduleInfo.timer - step);
            var bombTimerStr = `X${zeroPad(moduleInfo.minutes, 2)}:${zeroPad(moduleInfo.seconds, 2)}`;
            if (bombTimerStr != timerEl.innerHTML) {
                timerEl.innerHTML = bombTimerStr;
            }
            if (moduleInfo.strikeTimer > 0) {
                moduleInfo.strikeTimer -= step;
            }
        }
        
        if (moduleInfo.buttonPress != -1/* && moduleInfo.buttonPress <= STRIP_LIGHTUP_TIME*/) {
            moduleInfo.buttonPress += step;
        }
        if (moduleInfo.buttonPress >= 500 && moduleInfo.hold == -1) {
            moduleInfo.setStrike();
            moduleInfo.strikeLocked = true;
        }
        drawModule(moduleInfo, time);
        
        requestAnimationFrame(processFrame);
    }
    
    requestAnimationFrame(processFrame);
    
    //button interaction
    function updateButtonMotionInteractions(event) {
        var clipSpaceX = event.offsetX / gl.canvas.scrollWidth * 2 - 1;
        var clipSpaceY = event.offsetY / gl.canvas.scrollHeight * -2 + 1;
        
        var buttonCenterX = BUTTON_LEFT_EDGE + BUTTON_RADIUS;
        var buttonCenterY = BUTTON_BOTTOM_EDGE + BUTTON_RADIUS;
        var mouseDistFromButtonCen
            = ((clipSpaceX - buttonCenterX)**2 + (clipSpaceY - buttonCenterY)**2)**0.5;
        if (mouseDistFromButtonCen <= BUTTON_RADIUS) {
            if (!moduleInfo.buttonHover) {
                moduleInfo.buttonHover = true;
            }
        } else if (moduleInfo.buttonHover) {
            moduleInfo.buttonHover = false;
        }
        
        if (moduleInfo.buttonHover) {
            renderEl.style.cursor = "pointer";
        } else {
            renderEl.style.cursor = "default";
        }
    }
    
    function updateButtonPressInteractions(event) {
        //only left click
        if (event.button != 0) {
            return;
        }
        
        if (moduleInfo.buttonHover && moduleInfo.buttonPress == -1) {
            moduleInfo.buttonPress = 0;
        }
    }
    
    function updateButtonReleaseInteractions(event) {
        //only left click
        if (event.button != 0) {
            return;
        }
        
        if (moduleInfo.buttonPress != -1) {
            if (moduleInfo.buttonPress < 500) {
                if (moduleInfo.hold == -1) {
                    moduleInfo.solved = true;
                } else {
                    moduleInfo.setStrike();
                }
            } else if (moduleInfo.timerHasDigit(moduleInfo.hold)) {
                moduleInfo.solved = true
            } else {
                moduleInfo.setStrike();
            }
            moduleInfo.buttonPress = -1;
            moduleInfo.strikeLocked = false;
        }
    }
    
    renderEl.onmousemove = updateButtonMotionInteractions;
    renderEl.onmouseover = updateButtonMotionInteractions;
    renderEl.onmouseout = updateButtonMotionInteractions;
    renderEl.onmousedown = updateButtonPressInteractions;
    renderEl.onmouseup = updateButtonReleaseInteractions;
    
    //generate new button
    var genNewEl = document.getElementById("gen-new");
    genNewEl.onclick = loadNewButton;
}

function run() {
    var mainEl = document.getElementById("main");
    var renderEl = document.getElementById("render");
    var noSupportEl = document.getElementById("no-support");
    var noInitEl = document.getElementById("no-init");
    var lowPerformEl = document.getElementById("low-perform");
    
    if (!window.WebGL2RenderingContext) {
        mainEl.className = "absent";
        noSupportEl.removeAttribute("class");
        return;
    }
    if (!renderEl.getContext("webgl2")) {
        mainEl.className = "absent";
        noInitEl.removeAttribute("class");
        return;
    }
    
    var gl = renderEl.getContext("webgl2", {
        alpha: false,
        antialias: true,
        failIfMajorPerformanceCaveat: true,
        powerPreference: "low-power"
    });
    
    if (!gl) {
        mainEl.className = "absent";
        lowPerformEl.removeAttribute("class");
        return;
    }
    
    runApp(gl, renderEl, document.getElementById("timer"), document.getElementById("edgework"));
}

window.addEventListener("load", run);
