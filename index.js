'use strict';
var htmlparser = require("htmlparser2");
function getRichTextContent(node){
  var output = "";
  if(node.type == 'text'){
    return node.data;
  }
  for(var i = 0; i < node.children.length; i++){
    if(node.children[i].type == 'tag') output += "<" + node.children[i].name + ">";
    output += getRichTextContent(node.children[i]);
    if(node.children[i].type == 'tag') output += "</" + node.children[i].name + ">";
  }
  return output;
}
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
          if(nodes[i].type == 'tag' && nodes[i].name == 'pre'){
              nodes[i] = {
                'type': 'text',
                'data': getRichTextContent(nodes[i]),
                'next': nodes[i].next,
                'prev': nodes[i].prev,
                'parent': nodes[i].parent
              };
          }
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
