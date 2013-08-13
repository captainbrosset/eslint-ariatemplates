// Make sure that all instances created with `new` in the constructor, and stored on this. are disposed in the destructor

module.exports = function(context) {

    "use strict";

    var inConstructor = null,
        inDestructor = null,
        instantiated = [];

    function isMemberExpressionOnThis (node) {
        return node.type === "MemberExpression" && node.object.type === "ThisExpression";
    }

    return {
        "Property" : function (node) {
            if (node.key.name === "$constructor") {
                inConstructor = node.value;
            } else if (node.key.name === "$destructor") {
                inDestructor = node.value;
            }
        },

        "AssignmentExpression" : function (node) {
            if (inConstructor) {
                if (node.right.type === "NewExpression" && isMemberExpressionOnThis(node.left)) {
                    instantiated.push({
                        code : context.getSource(node.left),
                        node : node.left
                    });
                }
            }
        },

        "FunctionExpression:after": function (node) {
            if (node === inConstructor) {
                inConstructor = null;
            } else if (node === inDestructor) {
                inDestructor = null;

                instantiated.forEach(function (instance) {
                    if (context.getSource(node).indexOf(instance.code + ".$dispose") === -1) {
                        context.report(instance.node, "Instance " + instance.code + " is created in the $constructor but is not $dispose'd in the $destructor");
                    }
                });
            }
        }
    };

};
