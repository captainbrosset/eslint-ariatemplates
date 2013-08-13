// Make sure all events declared in the $events object are actually used in the code

module.exports = function(context) {

    "use strict";

    var isInterface = false;
    var declaredEvents = [];
    
    function checkInterfaceDefinition(node) {
        var c = node.callee;
        if (c.type === "MemberExpression") {
            if (c.object.name === "Aria" && c.property.name === "interfaceDefinition") {
                isInterface = true;
            }
        }
    }

    function findDeclaredEvents(node) {
        if (node.key.name === "$events" && node.value.type === "ObjectExpression") {
            node.value.properties.forEach(function(event) {
                declaredEvents.push({
                    name : event.key.value,
                    node : event
                });
            });
        }
    }

    function checkEventsUsage(node) {
        var code = context.getSource();
        declaredEvents.forEach(function(event) {
            // If the event appears 0 or 1 time, indexOf and lastIndexOf are going to be equal
            if(!isInterface && code.indexOf(event.name) === code.lastIndexOf(event.name)) {
                context.report(event.node, "Event {{event}} is not used.", { event: event.name });
            }
        });
    }

    return {
        "CallExpression" : checkInterfaceDefinition,
        "Property" : findDeclaredEvents,
        "Program:after" : checkEventsUsage
    };

};
