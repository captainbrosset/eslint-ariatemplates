// Make sure that declared statics in the $statics object are actually used in the file

module.exports = function(context) {

    "use strict";

    var declaredStatics = [];
    
    function findDeclaredStatics(node) {
        if (node.key.name === "$statics") {
            node.value.properties.forEach(function(st) {
                declaredStatics.push(st.key.name);
            });
        }
    }

    function checkStaticsUsage(node) {
        var code = context.getSource();
        declaredStatics.forEach(function(st) {
            // If the static appears 0 or 1 time, indexOf and lastIndexOf are going to be equal
            if(code.indexOf(st) === code.lastIndexOf(st)) {
                context.report(node, "Static {{st}} is not used.", { st: st });
            }
        });
    }

    return {
        "Property" : findDeclaredStatics,
        "Program:after" : checkStaticsUsage
    };

};
