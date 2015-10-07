#!/usr/bin/env node
'use strict';
var meow = require('meow');
var fogWisp = require('./');

var cli = meow({
  help: [
    'Usage',
    '  fog-wisp <input>',
    '',
    'Example',
    '  fog-wisp Unicorn'
  ].join('\n')
});

//fogWisp(cli.input[0]);
var content = '';
process.stdin.resume();
process.stdin.on('data', function(buf) { content += buf.toString(); });
process.stdin.on('end', function() {
  fogWisp(content, function(err, res){
    console.log(res);
  });
});
