// Make sure all aria.* classes used in the code are part of the $dependencies array
// Requires that $dependencies are defined before the rest of the code

module.exports = function(context) {

    "use strict";

    var declaredDependencies = [];
    var usedDependencies = {};
    
    function findDeclaredDependencies(node) {
        if (node.key.name === "$dependencies") {
            node.value.elements.forEach(function(dependency) {
                declaredDependencies.push(dependency.value);
            });
        }
    }

    function findAriaDependenciesUsage(node) {
        var dependency = context.getSource(node);
        if(dependency.indexOf("aria.") === 0) {
            var classNameStartIndex = dependency.search(/[A-Z]{1}/);
            if(classNameStartIndex > -1) {
                var classNameEndIndex = dependency.indexOf(".", classNameStartIndex);
                if(classNameEndIndex > 0) {
                    dependency = dependency.substring(0, classNameEndIndex);
                }
                if(!usedDependencies[dependency] && declaredDependencies.indexOf(dependency) === -1) {
                    context.report(node, "Aria dependency " + dependency + " is not declared in the $dependencies array");
                }
                usedDependencies[dependency] = true;
            }
        }
    }

    return {
        "Property" : findDeclaredDependencies,
        "MemberExpression" : findAriaDependenciesUsage
    };

};
