// Make sure that properties of the Aria.classDefinition argument are no misspelled

function levenshtein (s1, s2) {
  // http://kevin.vanzonneveld.net
  // +            original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
  // +            bugfixed by: Onno Marsman
  // +             revised by: Andrea Giammarchi (http://webreflection.blogspot.com)
  // + reimplemented by: Brett Zamir (http://brett-zamir.me)
  // + reimplemented by: Alexander M Beedie
  // *                example 1: levenshtein('Kevin van Zonneveld', 'Kevin van Sommeveld');
  // *                returns 1: 3
  if (s1 == s2) {
    return 0;
  }

  var s1_len = s1.length;
  var s2_len = s2.length;
  if (s1_len === 0) {
    return s2_len;
  }
  if (s2_len === 0) {
    return s1_len;
  }

  // BEGIN STATIC
  var split = false;
  try {
    split = !('0')[0];
  } catch (e) {
    split = true; // Earlier IE may not support access by string index
  }
  // END STATIC
  if (split) {
    s1 = s1.split('');
    s2 = s2.split('');
  }

  var v0 = new Array(s1_len + 1);
  var v1 = new Array(s1_len + 1);

  var s1_idx = 0,
    s2_idx = 0,
    cost = 0;
  for (s1_idx = 0; s1_idx < s1_len + 1; s1_idx++) {
    v0[s1_idx] = s1_idx;
  }
  var char_s1 = '',
    char_s2 = '';
  for (s2_idx = 1; s2_idx <= s2_len; s2_idx++) {
    v1[0] = s2_idx;
    char_s2 = s2[s2_idx - 1];

    for (s1_idx = 0; s1_idx < s1_len; s1_idx++) {
      char_s1 = s1[s1_idx];
      cost = (char_s1 == char_s2) ? 0 : 1;
      var m_min = v0[s1_idx + 1] + 1;
      var b = v1[s1_idx] + 1;
      var c = v0[s1_idx] + cost;
      if (b < m_min) {
        m_min = b;
      }
      if (c < m_min) {
        m_min = c;
      }
      v1[s1_idx + 1] = m_min;
    }
    var v_tmp = v0;
    v0 = v1;
    v1 = v_tmp;
  }
  return v0[s1_len];
}


module.exports = function(context) {

    "use strict";

    var THRESHOLD = 2;
    var AT_CLASSES_KEYWORDS = [
    	"$beans",
    	"$classpath",
    	"$constructor",
    	"$css",
    	"$csslibs",
    	"$dependencies",
    	"$destructor",
    	"$events",
    	"$extends",
    	"$implements",
    	"$macrolibs",
    	"$onload",
    	"$prototype",
    	"$resources",
    	"$singleton",
    	"$statics",
    	"$templates",
    	"$texts"
    ];

    return {
        "CallExpression" : function (node) {
        	var c = node.callee;
        	if (c.type === "MemberExpression") {
        		if (c.object.name === "Aria" && (c.property.name === "classDefinition" || c.property.name === "tplScriptDefinition")) {
        			var properties = node.arguments.length ? node.arguments[0].properties : [];

              if(properties) {
          			properties.forEach(function (property) {
          				var name = property.key.name;
          				AT_CLASSES_KEYWORDS.forEach(function (keyword) {
          					var distance = levenshtein(keyword, name);
          					if(distance <= THRESHOLD && distance > 0) {
          						context.report(property, name + " seems to be misspelled, did you mean " + keyword);
          					}
          				});
          			});
              }
        		}
        	}
        }
    };

};
