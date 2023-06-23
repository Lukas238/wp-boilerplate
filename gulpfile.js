var fs = require('fs'); // new
const
	{ src, dest, series, parallel, watch } = require('gulp'),

	autoprefixer = require('autoprefixer'),
	cssnano = require('cssnano'),
	postcss = require('gulp-postcss'),
	sass = require('gulp-sass')(require('sass')),
	sassGlob = require('gulp-sass-glob'),

	browserify = require('browserify'),
	babelify = require('babelify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	uglify = require('gulp-uglify'),

	concat = require('gulp-concat'),
	del = require('del'),
	log = require('fancy-log'),
	plumber = require('gulp-plumber'),
	sourcemaps = require('gulp-sourcemaps'),
	changed = require('gulp-changed'),

	nodeSassGlobbing = require('node-sass-globbing'),
	livereload = require('gulp-livereload');

const purgecss = require('@fullhuman/postcss-purgecss');


var cfg = {
	src: './src',
	dev: './dev',
	dist: './dist',
	wp: {
		theme_name: 'untitled-theme',
		theme_author: 'unknown',
		theme_path: null,
	}
};

cfg.wp.theme_path = '/wp-content/themes/' + cfg.wp.theme_name;

cfg.wf = cfg.dev;

var onError = function (error) {
	log.error(error.message);
	this.emit('end');
};


function set_wf_dev(cb) {
	cfg.wf = cfg.dev;
	return cb();
}

function set_wf_dist(cb) {
	cfg.wf = cfg.dist;
	return cb();
}

// CLEAN DEV Folder
function clean_dev(done) {
	return del([cfg.dev], {
		read: false,
	});
}

// CLEAN Working Folder
function clean_dist(done) {
	return del([
		cfg.dist + '/css',
		cfg.dist + '/js',
		cfg.dist + '/images',
		cfg.dist + '/pdf',
		cfg.dist + '/*.html'
	], {
		read: false,
	});
}

function wp_root_files() {
	return src([
		cfg.src + '/*',
		'!' + cfg.src + '/wp-config.local.example.php',
		'!' + cfg.src + '/plugins',
		'!' + cfg.src + '/theme',
	])
		.pipe(changed(cfg.wf))
		.pipe(dest(cfg.wf));
}

function wp_theme_files() {
	return src([
		cfg.src + '/theme/**/*',
		'!' + cfg.src + '/theme/scss/**',
		'!' + cfg.src + '/theme/js/**',
		'!' + cfg.src + '/theme/bin/**',
		'!' + cfg.src + '/theme/composer*',
	])
		.pipe(changed(cfg.wf + cfg.wp.theme_path))
		.pipe(dest(cfg.wf + cfg.wp.theme_path));
}


function wp_plugin_files() {
	return src(cfg.src + '/plugins/**/*')
		.pipe(changed(cfg.wf + '/wp-content/plugins'))
		.pipe(dest(cfg.wf + '/wp-content/plugins'));
}

function wp_core_files() {
	return src([
			'./wordpress/**/*',
			'!./wordpress/wp-config-sample.php',
			'!./wordpress/composer.json'
		])
		.pipe(dest(cfg.wf));
}


function scss() {
	let doSourceMap = cfg.wf == cfg.dev;
	let doPurgeCss = cfg.wf == cfg.dist;


	var postcss_plugins = [
		autoprefixer({
			overrideBrowserslist: ['last 2 version']
		}),
		cssnano({
			sourceMap: doSourceMap,
			compatibility: 'ie11',
			format: 'beautify'
		})
	];
	if (doPurgeCss) {
		postcss_plugins = [
			...postcss_plugins, ...[
				purgecss({
					content: [
						cfg.wf + cfg.wp.theme_path + '/**/*.twig'
					]
				})
			]
		];
	}


	return src(cfg.src + '/theme/scss/**/*.scss')
		.pipe(
			plumber({
				errorHandler: onError,
			})
		)
		.pipe(sourcemaps.init())
		.pipe(sassGlob())
		.pipe(
			sass({
				quietDeps: true,
				importer: nodeSassGlobbing,
				includePaths: [
					// './node_modules/bootstrap'
				],
				errLogToConsole: true,
			})
		)
		.pipe(postcss(postcss_plugins))
		.pipe(concat('style.css'))
		.pipe(sourcemaps.write('./'))
		.pipe(dest(cfg.wf + cfg.wp.theme_path))
		.pipe(livereload());
}


function js() {

	return browserify({
		entries: [cfg.src + '/theme/js/scripts.js']
	})
		.transform(babelify.configure({
			presets: ["@babel/preset-env"]
		}))
		.bundle()
		.pipe(
			plumber({
				errorHandler: onError,
			})
		)
		.pipe(source('scripts.js'))
		.pipe(buffer())
		.pipe(uglify({
			mangle: false
		}))
		.pipe(dest(cfg.wf + cfg.wp.theme_path + '/js'))
		.pipe(livereload());
}

// const images = function () {
//     return src([cfg.src + '/images/**/*'])
//         .pipe(dest(cfg.wf + '/images'));
// }

const vendors_css = function () {
	return src([
		'node_modules/slick-carousel/slick/slick.css',
		'node_modules/slick-carousel/slick/slick-theme.css'
	])
		.pipe(concat('vendors.css'))
		.pipe(dest(cfg.wf + cfg.wp.theme_path + '/css'))
}

const vendors_js = function () {

	return src([
		// 'node_modules/jquery/dist/jquery.min.js',
		'node_modules/slick-carousel/slick/slick.min.js',
		'node_modules/bootstrap/dist/js/bootstrap.min.js'
	])
		.pipe(concat("vendors.js"))
		.pipe(dest(cfg.wf + cfg.wp.theme_path + '/js'))
}

const vendors_fonts = function () {
	return src([
		'node_modules/slick-carousel/slick/fonts/*',
	])
		.pipe(dest(cfg.wf + cfg.wp.theme_path + '/css/fonts'))
}

const vendors_css_images = function () {
	return src([
		'node_modules/slick-carousel/slick/ajax-loader.gif',
	])
		.pipe(dest(cfg.wf + cfg.wp.theme_path + '/css'))
}

const vendors = parallel(vendors_css, vendors_js, vendors_fonts, vendors_css_images);

function watchers() {

	livereload.listen();

	watch([cfg.src + '/*'], series(wp_root_files));
	watch([cfg.src + '/wp-content/plugins/**/*'], series(wp_plugin_files));
	watch([
		cfg.src + '/theme/**/*',
		'!' + cfg.src + '/theme/scss/**/*',
		'!' + cfg.src + '/theme/js/**/*',
	], series(wp_theme_files));

	watch([cfg.src + '/theme/scss/**/*'], series(scss));
	watch([cfg.src + '/theme/js/**/*'], series(js));
};

exports.default = series(set_wf_dev, clean_dev, parallel(wp_core_files, wp_root_files, wp_plugin_files, wp_theme_files), parallel(vendors, scss, js), watchers);


exports.test = series(set_wf_dev, clean_dev, wp_theme_files);
