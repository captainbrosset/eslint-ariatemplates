// Make sure there's only one Aria.classDefinition or Aria.tplScriptDefinition in the file

module.exports = function(context) {

    "use strict";

    var hasClass = false;

    return {
        "CallExpression" : function (node) {
        	var c = node.callee;
        	if (c.type === "MemberExpression") {
        		if (c.object.name === "Aria" && (c.property.name === "classDefinition" || c.property.name === "tplScriptDefinition")) {
        			if(!hasClass) {
        				hasClass = true;
        			} else {
        				context.report(node, "More than 1 classDefinition or tplScriptDefinition is not allowed.");
        			}
        		}
        	}
        }
    };

};
