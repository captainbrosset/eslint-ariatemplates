// Make sure all dependencies declared in the $dependencies array are actually used in the code

module.exports = function(context) {

    "use strict";

    var declaredDependencies = [];
    
    function findDeclaredDependencies(node) {
        if (node.key.name === "$dependencies") {
            node.value.elements.forEach(function(dependency) {
                declaredDependencies.push({
                    name : dependency.value,
                    node : dependency
                });
            });
        }
    }

    function checkDependenciesUsage(node) {
        var code = context.getSource();
        declaredDependencies.forEach(function(dependency) {
            // If the dependency appears 0 or 1 time, indexOf and lastIndexOf are going to be equal
            if(code.indexOf(dependency.name) === code.lastIndexOf(dependency.name)) {
                context.report(dependency.node, "Dependency {{dependency}} is not used.", { dependency: dependency.name });
            }
        });
    }

    return {
        "Property" : findDeclaredDependencies,
        "Program:after" : checkDependenciesUsage
    };

};
