module.exports = function(context) {

    "use strict";

    var extendsModuleCtrl = false;
    var implementsInterfaces = false;
    var implementedInterfaces = [];
    var declaredPublicInterface = false;

    return {
        "Property" : function (node) {
            if (node.key.name === "$extends" && node.value.type === "Literal" && node.value.value === "aria.templates.ModuleCtrl") {
                extendsModuleCtrl = true;
            } else if (node.key.name === "$prototype" && node.value.type === "ObjectExpression") {
            	node.value.properties.forEach(function (property) {
            		if (property.key.name === "$publicInterfaceName") {
            			declaredPublicInterface = property.value.value;
            		}
            	});
            } else if (node.key.name === "$implements" && node.value.type === "ArrayExpression" && node.value.elements.length) {
                implementsInterfaces = true;
                for (var i = 0; i < node.value.elements.length; i ++) {
                    implementedInterfaces.push(node.value.elements[i].value);
                }
            }
        },

        "Program:after" : function (node) {
            if (extendsModuleCtrl && !implementsInterfaces) {
                context.report(node, "Module controllers must implement at least a public interface in $implements");
            }
            if (extendsModuleCtrl && !declaredPublicInterface) {
                context.report(node, "Module controllers must define a $publicInterfaceName property in their $prototype");
            }
            if (extendsModuleCtrl && implementsInterfaces && declaredPublicInterface && implementedInterfaces.indexOf(declaredPublicInterface) === -1) {
                context.report(node, "The $publicInterfaceName declared must match one of the implemented interfaces in $implements");
            }
        }
    };

};
