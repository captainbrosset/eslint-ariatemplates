module.exports = function(context) {

    "use strict";

    var superClassPath, superClassName,
        constructorFunction, destructorFunction,
        superConstructorCalled = false, superDestructorCalled = false;

    return {
        "Property" : function (node) {
            if (node.key.name === "$extends" && node.value.type === "Literal") {
                superClassPath = node.value.value;
                var classpath = superClassPath.split(".");
                superClassName = "$" + classpath[classpath.length - 1];
            } else if (node.key.name === "$constructor") {
                constructorFunction = node.value;
            } else if (node.key.name === "$destructor") {
                destructorFunction = node.value;
            }
        },

        "FunctionExpression:after": function (node) {
            if (superClassPath && node === constructorFunction && !superConstructorCalled) {
                context.report(node, "Make sure the " + superClassPath + " super constructor is called");
                constructorFunction = false;
            } else if (superClassPath && node === destructorFunction && !superDestructorCalled) {
                context.report(node, "Make sure the " + superClassPath + " super destructor is called");
                destructorFunction = false;
            }
        },

        "MemberExpression" : function (node) {
            if (superClassName && node.object.type === "MemberExpression" && node.object.object.type === "ThisExpression" && node.object.property.name === superClassName) {
                if (node.property.name === "constructor") {
                    superConstructorCalled = true;
                } else if (node.property.name === "$destructor") {
                    superDestructorCalled = true;
                }
            }
        }
    };

};
