import fs from 'fs'
import _ from 'lodash'
import gulp from 'gulp'
import twig from 'gulp-twig'
import all from 'gulp-all'
import rename from 'gulp-rename'
import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import concat from 'gulp-concat'
import header from 'gulp-header'
import cleanCss from 'gulp-clean-css'
import ghPages from 'gulp-gh-pages'

gulp.task('default', ['sass'])
gulp.task('gh-build', ['gh:copy-assets', 'gh:twig-other', 'gh:twig-library'])

/* font */
gulp.task('sass', function () {
    let subtasks = [];
    let versions = getVersions()
    let latest = _.head(versions)
    let license = "/*!\n*  XEIcon <%= version %> by @NAVER - http://xpressengine.github.io/XEIcon/ - @XEIcon\n*  License - http://xpressengine.github.io/XEIcon/license.html (Font: SIL OFL 1.1, CSS: MIT License)\n*/\n\n"

    return gulp.src(['./src/versions/' + latest + '/style.css', './src/sass/xeicon.scss'])
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(autoprefixer())
        .pipe(concat('xeicon.css'))
        .pipe(header(license, {version : latest }))
        .pipe(gulp.dest('./'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cleanCss({
            compatibility: 'ie9'
        }))
        .pipe(gulp.dest('./'))
});

gulp.task('gh:deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

/* gh-pages */
gulp.task('gh:copy-assets', function() {
    return gulp.src('./src/template/assets/**/*')
        .pipe(gulp.dest('./dist/assets'))
})
gulp.task('gh:twig-other', function () {
    'use strict';
    let versions = getVersions()

    return gulp.src(['./src/template/*.twig', '!**/library.twig'])
        .pipe(twig({
            data: {
                title: 'XEIcon, 문자를 그리다',
                versions: versions
            }
        }))
        .pipe(gulp.dest('./dist'));
});
gulp.task('gh:twig-library', function () {
    'use strict';
    let versions = getVersions()

    let subtasks = versions.map(function(version){
        let selection = getIcons(version)

        return gulp.src('./src/template/library.twig')
            .pipe(twig({
                data: {
                    title: 'XEIcon, 문자를 그리다',
                    versions: versions,
                    version: selection.version,
                    categories: selection.categories,
                    icons: selection.icons
                }
            }))
            .pipe(rename({
                suffix: "-" + version
            }))
            .pipe(gulp.dest('./dist'));
    })
    return all(subtasks)
});



function getIcons(version) {
  let icons = []
  let result = {
    "version": null,
    "categories": [],
    "icons": null
  }
  let selection = JSON.parse(fs.readFileSync('./src/versions/' + version + '/selection.json').toString()).icons

  // icon을 카테고리별로 분류
  selection.map(function(item, idx) {
    let icon = {}
    let name = _.map(item.properties.name.split(','), _.trim)

    // 필요한 데이터만 선별, 정리
    icon.name = _.head(name)
    icon.alias = _.slice(name, 1)
    icon.category = _.head(item.icon.tags)
    icon.order = item.iconIdx
    icon.code = item.properties.code
    icon.hex = item.properties.code.toString(16)
    icon.keyword = _.uniq(_.concat(name, _.slice(item.icon.tags, 1)))

    icons.push(icon);
  })

  result.version = version
  result.icons = _.groupBy(icons, 'category')
  result.categories = _.keys(result.icons)
  return result;
}

function getVersions() {
    let dirs = fs.readdirSync('./src/versions');
    let versions = [];

    dirs.map(function(ver) {
        if(fs.existsSync('./src/versions/' + ver + '/selection.json')) {
            versions.push(ver)
        }
    })

    return _.reverse(versions)
}