'use strict';
var htmlparser = require("htmlparser2");
module.exports = function(html, cb){
  var handler = new htmlparser.DomHandler(function (error, dom) {
    if (error){
      console.error(error);
    }
    else{
      //console.log("%o", dom);
      var out = "";
      var compile = function(output, nodes){
        for(var i = 0; i < nodes.length; i++){
          if(nodes[i].parent != null && nodes[i].parent.type == 'tag'){
            if(nodes[i].parent.name == 'u') {
              if (nodes[i].type == 'text') {
                out += "console.log(\"" + nodes[i].data + "\");\n";
              }
            }
            else if(nodes[i].parent.name == 'b'){
              if(nodes[i].type == 'text' && nodes[i].parent.parent.name == 'u'){
                  out += "console.log(" + nodes[i].data + ");\n";
              }
            }
          }
          if(nodes[i].children != null){
            compile(out, nodes[i].children);
          }
        }
      };
      compile(out, dom);
      cb(null, out);
    }
  });
  var parser = new htmlparser.Parser(handler);
  parser.write(html);
  parser.done();
};
