// Make sure that declared statics in the $statics object are actually used in the file

module.exports = function(context) {

    "use strict";

    var declaredStatics = [];
    
    function findDeclaredStatics(node) {
        if (node.key.name === "$statics") {
            node.value.properties.forEach(function(st) {
                declaredStatics.push({
                    name : st.key.name,
                    node : st
                });
            });
        }
    }

    function checkStaticsUsage(node) {
        var code = context.getSource();
        declaredStatics.forEach(function(st) {
            // If the static appears 0 or 1 time, indexOf and lastIndexOf are going to be equal
            if(code.indexOf(st.name) === code.lastIndexOf(st.name)) {
                context.report(st.node, "Static {{st}} is not used.", { st: st.name });
            }
        });
    }

    return {
        "Property" : findDeclaredStatics,
        "Program:after" : checkStaticsUsage
    };

};
