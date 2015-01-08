var fs = require("fs");
var _ = require("underscore");
var data_icons = require("./icons.json");
var data_selection = require("./selection.json");
var icons = [];

module.exports = function(grunt) {
	"use strict";

	grunt.initConfig({
		'gh-pages': {
			options: {
				base: 'dist',
			},
			src: ['**']
		},
		'copy': {
			dist: {
				files: [
				{expand: true, cwd: 'src/', src: ['**', '!template.html'], dest: 'dist'},
				],
			},
		},
	});

	grunt.registerTask('generate', '', function() {
		var icons_origin = {};
		var icons_current = {};
		var difference, result = {};
		result.added = [];
		result.changed = [];
		result.deleted = [];

		_.map(data_selection.icons, function(item) {
			icons_origin[item.properties.code.toString(16)] = item.properties.name;
		});

		_.map(data_icons, function(items, category) {
			_.map(items, function(icon) {
				icon = icon.split('@');
				icons_current[icon[0]] = icon[1];
			});
		});

		if(!_.isEqual(icons_origin, icons_current)) {
			var a = [], b = [];

			_.map(icons_origin, function(value, key) { a.push(key+'@'+value); });
			_.map(icons_current, function(value, key) { b.push(key+'@'+value); });

			difference = _.difference(a, b);
			grunt.verbose.writeflags(difference, 'difference');

			if(difference) {
				_.map(difference, function(icon) {
					icon = icon.split('@');
					var has_origin = true, has_current = true, status;
					var icon_code = icon[0], icon_class = icon[1];

					has_origin = _.has(icons_origin, icon_code);
					has_current = _.has(icons_current, icon_code);

					if(has_origin && has_current) status = 'changed';
					else if(has_origin && !has_current) status = 'added';
					else if(!has_origin && has_current) status = 'deleted';

					if(status) result[status].push({
						'code': icon_code,
						'class': icon_class,
						'current': icon_code+'@'+icons_current[icon_code],
						'origin': icon_code+'@'+icons_origin[icon_code]
					});
				});

				var sss = _.clone(data_icons);
				sss.unknown = [];

				_.map(result, function(items, status) {
					_.map(items, function(icon) {
						var tmp = icon.code + '@' + icon.class;

						if(status === 'added') sss.unknown.push(icon.origin);
						else {
							_.map(sss, function(c_items, category) {
								var idx = _.indexOf(c_items, icon.current);

								if(idx > -1) {
									if(status === 'changed') sss[category][idx] = tmp;
									else if(status === 'deleted') delete(sss[category][idx]);
								}
							});
						}
					});
				});

				if(!sss.unknown.length) delete(sss.unknown);

				fs.writeFileSync('icons.json', JSON.stringify(sss, null, 4));
			}
		}

		grunt.log.writeflags(result, 'Result');

	});

	grunt.registerTask('build', '', function() {
		var pkg = grunt.file.readJSON('package.json');
		var template = fs.readFileSync('./src/template.html').toString();
		var tmpl = _.template(template);
		var prefix = data_selection.preferences.fontPref.prefix;
		var version = pkg.version;

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

		tmpl = tmpl({"list": icons, "version": version});
		fs.writeFileSync('dist/index.html', tmpl);
		grunt.log.write('Result : dist/index.html');

	});

	grunt.registerTask('default' , ['generate', 'copy:dist', 'build']);
	grunt.registerTask('deploy' , ['gh-pages']);


	grunt.loadNpmTasks('grunt-gh-pages');
	grunt.loadNpmTasks('grunt-contrib-copy');
};
