// Make sure that properties of the Aria.classDefinition argument are not duplicated

module.exports = function(context) {

    "use strict";

    var definedKeywords = {};

    return {
        "CallExpression" : function (node) {
        	var c = node.callee;
        	if (c.type === "MemberExpression") {
        		if (c.object.name === "Aria" && (c.property.name === "classDefinition" || c.property.name === "tplScriptDefinition")) {
        			var properties = node.arguments.length ? node.arguments[0].properties : [];

              if(properties) {
          			properties.forEach(function (property) {
          				var name = property.key.name;
          				if (definedKeywords[name]) {
                    context.report(property, "Property " + name + " is duplicated in the class. Already defined line " + definedKeywords[name].loc.start.line);
                  }
                  definedKeywords[name] = property;
          			});
              }
        		}
        	}
        }
    };

};
