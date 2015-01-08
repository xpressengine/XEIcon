var fs = require("fs");
var _ = require("underscore");
var data_icons = require("./icons.json");
var data_selection = require("./selection.json");
var icons = [];





module.exports = function(grunt) {
	"use strict";

	grunt.initConfig({
	});

	grunt.registerTask('generate', '', function() {
		var icons_origin = [];
		var icons_current = [];
		var difference, icons_origin_obj = [], icons_current_obj = [];

		_.map(data_selection.icons, function(item) {
			icons_origin.push(item.properties.code.toString(16) + '@' + item.properties.name);
			icons_origin_obj.push({"code": item.properties.code.toString(16), "class": item.properties.name})
		});
		// grunt.log.writeflags(icons);
		_.map(data_icons, function(items, category) {
			_.map(items, function(icon) {
				var tmp = {};
				icon = icon.split('@');
				icons_current_obj.push({"code": icon[0], "class": icon[1]});
			});
			icons_current = icons_current.concat(items);
		});
		// grunt.log.writeflags(icons_current_obj[1]);
		// grunt.log.writeflags(icons_current);

		difference = _.difference(icons_origin, icons_current);

		_.map(difference, function(){

		});

		grunt.log.writeflags(difference);
	});

	grunt.registerTask('build', '', function() {
		var template = fs.readFileSync('template.html').toString();
		var tmpl = _.template(template);
		var prefix = data_selection.preferences.fontPref.prefix;

		if(!grunt.file.isDir('dist')) {
			fs.mkdirSync('dist');
		}

		_.map(data_icons, function(items, category) {
			var list = {};
			list.category = category;
			list.icon = [];

			_.map(items, function(icon, j) {
				var tmp = {};
				icon = icon.split('@');
				tmp.code = icon[0];
				tmp.class = prefix + icon[1];
				list.icon.push(tmp);
			});

			icons.push(list);
		});

		tmpl = tmpl({"list": icons});
		fs.writeFileSync('dist/index.html', tmpl);
	});

	grunt.registerTask('default' ,'build');

};
