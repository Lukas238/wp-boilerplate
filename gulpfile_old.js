/******************************
	SETUP
******************************/

/*	VARIABLES
******************************/
var cfg = require('./gulp.config')();


/*	PLUGINS
******************************/
var gulp        = require('gulp'),
	plumber     = require('gulp-plumber'),
	notify      = require('gulp-notify'),
	run         = require('run-sequence'),
	sassGlob    = require('gulp-sass-glob'),
	sass        = require('gulp-sass')(require('sass')),
	autoprefixer= require('gulp-autoprefixer'),
	rename      = require('gulp-rename'),
	minifyCSS   = require('gulp-minify-css'),
	concat      = require('gulp-concat'),
  livereload = require('gulp-livereload'),
	changed     = require('gulp-changed'),
	uglify      = require('gulp-uglify'),
	imagemin    = require('gulp-imagemin'),
	jshint      = require('gulp-jshint'),
	merge       = require('merge-stream'),
	del         = require('del');


/******************************
	FUNCTIONS
******************************/

//	ERROR HANDLING
var gulp_src = gulp.src;
gulp.src = function() {
	return gulp_src.apply(gulp, arguments)
	.pipe(plumber({ errorHandler: notify.onError({
			title: "<%= error.plugin %>",
			message: "<%= error.message %>"
		})
	}))
};

/******************************
	SUB-TASKS
******************************/

//	CLEAN: DEV
gulp.task('clean:dev', function(){
	return del.sync(cfg.dev + cfg.dist_theme);
});


//	CLEAN: DIST
gulp.task('clean:dist', function(){
	return del.sync(cfg.dist + '*');
});


//	CLEAN: COMP
gulp.task('clean:comp', function(){
	return  del.sync([
		cfg.comp + '*',
		'!'+cfg.comp + '**/*.html'
	]);
});


//	HTML
gulp.task('html', function () {
	return gulp.src(cfg.src + '*.html')
	.pipe(changed(cfg.wf))
	.pipe(gulp.dest(cfg.wf))
	.pipe(livereload());
});


//	SCSS
gulp.task('scss', function () {
	return gulp.src(cfg.paths.src_scss+'/style.scss')
	.pipe(sassGlob())
	.pipe(sass({
		includePaths: cfg.paths.sass_includes,
		errLogToConsole: true
	}))
	.pipe(
		autoprefixer(['last 4 version'])
	)
	.pipe(gulp.dest( cfg.wf + cfg.dist_theme ))
	.pipe(livereload());

	// .pipe(minifyCSS({
		// keepSpecialComments: 1,
		// processImport: false
	// }))
	// .pipe(rename({ suffix: '.min' }))
	// .pipe(gulp.dest( cfg.wf + cfg.paths.dest_css ))
	// .pipe(browserSync.stream({once: true}));

});


// JAVASCRIPT
gulp.task('js', function(){
	return gulp.src(cfg.paths.src_js+'/scripts.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest(cfg.wf + cfg.paths.dest_js))
    /*
	.pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(cfg.wf+cfg.paths.dest_js))
	*/
	.pipe(livereload());
});


//	IMAGES_OPTIMIZE
//	Compressing images. Handle SVG files too.
gulp.task('images_optimize', function(tmp) {
    return gulp.src([
		cfg.paths.img+'*.jpg',
		cfg.paths.img+'*.png'
	])
    .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
	.pipe(gulp.dest(cfg.wf+cfg.paths.dest_img));
});


// IMAGES
gulp.task('images', ['images_optimize'], function() {
    return gulp.src( cfg.files.img )
    .pipe(gulp.dest(cfg.wf + cfg.paths.dest_img))
    .pipe(livereload());
});


// VENDORS
gulp.task('vendors', function(){
	return merge(

		// IMAGES
		gulp.src( cfg.files.vendors.img )
		// .pipe(changed( cfg.wf + cfg.paths.dest_img ))
		.pipe(gulp.dest( cfg.wf + cfg.paths.dest_img )),

		//	SCRIPTS
		gulp.src( cfg.files.vendors.js )
		.pipe(concat('vendors.js', {newLine: ';'}))
		//.pipe(gulp.dest(cfg.wf+cfg.paths.dest_js))
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(cfg.wf + cfg.paths.dest_js)),

		//	CSS
		gulp.src( cfg.files.vendors.css )
		.pipe(concat('vendors.css'))
		//.pipe(gulp.dest(cfg.wf+cfg.paths.dest_css))
		.pipe(minifyCSS({processImport: false}))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(cfg.wf + cfg.paths.dest_css)),

		//	FONTS
		gulp.src(cfg.files.vendors.fonts)
		// .pipe(changed( cfg.wf + cfg.paths.dest_fonts ))
		.pipe(gulp.dest( cfg.wf + cfg.paths.dest_fonts ))

	); //End merge
});

// STANDALONE FILES
gulp.task('standalone', function(){
	return merge(

		// .htaccess
		gulp.src( cfg.src + '/.htaccess')
    .pipe(changed( cfg.wf ))
		.pipe(rename({ extname: '' }))
		.pipe(gulp.dest( cfg.wf  ))
		.pipe(livereload()),

		// CSS
		gulp.src( cfg.files.css )
		.pipe(changed( cfg.wf + cfg.paths.dest_css ))
		.pipe(gulp.dest( cfg.wf + cfg.paths.dest_css ))
		.pipe(livereload()),

		// SCRIPTS
		gulp.src( cfg.files.js )
		.pipe(changed( cfg.wf + cfg.paths.dest_js ))
		.pipe(gulp.dest( cfg.wf + cfg.paths.dest_js ))
		.pipe(livereload()),

		// FONTS
		gulp.src( cfg.files.fonts )
		.pipe(changed( cfg.wf + cfg.paths.dest_fonts  ))
		.pipe(gulp.dest( cfg.wf + cfg.paths.dest_fonts ))
		.pipe(livereload())

	);
});

// SOURCE FILES
gulp.task('src_files', ['theme_files', 'plugins_files'], function(){
		// THEME ROOT FILES
		return gulp.src([
			cfg.src + '/.htaccess',
			cfg.src + '/*',
			'!'+ cfg.src_theme ,
			'!'+ cfg.src_plugins
			])
		.pipe(changed( cfg.wf  ))
		.pipe(gulp.dest( cfg.wf ))
		.pipe(livereload());
});

// SOURCE THEME FILES
gulp.task('theme_files', function(){
	return gulp.src([
		cfg.src_theme + '**/*.*',
		'!'+ cfg.src_theme + '**/*.ph_',
		'!'+ cfg.src_theme + 'style.css',
		'!'+ cfg.src_theme + 'sass/**/*'
	])
	.pipe(changed(cfg.wf + cfg.dist_theme))
	.pipe(gulp.dest(cfg.wf + cfg.dist_theme))
	.pipe(livereload());
});

// SOURCE PLUGINS FILES
gulp.task('plugins_files', function(){
	return gulp.src(cfg.src_plugins + '**/*')
	.pipe(changed(cfg.wf + cfg.dist_plugins))
	.pipe(gulp.dest(cfg.wf + cfg.dist_plugins));
});


/******************************
	TASKS
******************************/

// DEV
gulp.task('default', ['clean:dev'], function(){
	cfg.wf = cfg.dev;
	cfg.directory_listing = false;
	run(['src_files', 'standalone', 'images', 'vendors', 'js', 'scss'], function(){
    livereload.listen();
		gulp.watch(cfg.src +'/**/*.php', ['src_files']);
		gulp.watch(cfg.paths.src_scss + '/**/*.scss', ['scss']);
		gulp.watch(cfg.paths.src_js   + '/**/*.js', ['js']);
		gulp.watch(cfg.paths.src_img  + '/**/*', ['images']);
	});
});


//COMPONENTS
gulp.task('comp', ['clean:comp'], function () {
	cfg.wf = cfg.comp;
	cfg.directory_listing = true;
	run(['scss', 'js', 'images', 'vendors', 'standalone'], function () {
    livereload.listen();
		gulp.watch(cfg.wf + '/**/*.html', ['html']);
		gulp.watch(cfg.paths.src_scss + '/**/*.scss', ['scss']);
		gulp.watch(cfg.paths.src_js   + '/**/*.js', ['js']);
		gulp.watch(cfg.paths.src_img  + '/**/*', ['images']);
	});
});


// BUILD
gulp.task('build',['clean:dist'], function(){
	cfg.wf = cfg.dist;
	run(['src_files', 'standalone', 'images', 'vendors', 'js', 'scss'])
});

