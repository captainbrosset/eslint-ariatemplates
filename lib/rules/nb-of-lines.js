// Make sure the file has less than the configured number of lines of code

module.exports = function(context) {

    "use strict";

    var THRESHOLD = context.options[0] || 400;

    return {
        "Program:after" : function (node) {
            if(node.loc.end.line > THRESHOLD) {
            	context.report(node, "There are more than {{max}} lines of code : {{value}}.", { value: node.loc.end.line, max: THRESHOLD });
            }
        }
    };

};
