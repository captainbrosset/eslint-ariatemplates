// Make sure that properties of the $prototype of a class are not duplicated

module.exports = function(context) {

    "use strict";

    var definedProperties = {};

    return {
        "Property" : function (node) {
          if (node.key.name === "$prototype" && node.value.type === "ObjectExpression") {
            node.value.properties.forEach(function (prototypeProp) {
              var name = prototypeProp.key.name;
              if (definedProperties[name]) {
                context.report(prototypeProp, "$prototype property " + name + " is already defined at line " + definedProperties[name].loc.start.line);
              }
              definedProperties[name] = prototypeProp;
            });
          }
        }
    };

};
