module.exports = function(context) {

    "use strict";

    var declaredDependencies = [];
    
    function findDeclaredDependencies(node) {
        if (node.key.name === "$dependencies") {
            node.value.elements.forEach(function(dependency) {
                declaredDependencies.push(dependency.value);
            });
        }
    }

    function checkDependenciesUsage(node) {
        var code = "";
        node.tokens.forEach(function(token) {
            code += token.value;
        });
        declaredDependencies.forEach(function(dependency) {
            // If the dependency appears 0 or 1 time, indexOf and lastIndexOf are going to be equal
            if(code.indexOf(dependency) === code.lastIndexOf(dependency)) {
                context.report(node, "Dependency {{dependency}} is not used.", { dependency: dependency });
            }
        });
    }

    return {
        "Property" : findDeclaredDependencies,
        "Program:after" : checkDependenciesUsage
    };

};
