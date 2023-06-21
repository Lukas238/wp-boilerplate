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

    nodeSassGlobbing = require('node-sass-globbing'),
    twig = require('gulp-twig'),
    browserSync = require('browser-sync').create();
    livereload = require('gulp-livereload');

    const purgecss = require('@fullhuman/postcss-purgecss');


var cfg = {
    src: './src',
    dev: './dev',
    dist: './dist',
    wp: {
      theme_name: 'untitled-theme',
      theme_author: 'unknown'
    },
    twig_mockupData: null
};

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
    if(doPurgeCss){
      postcss_plugins = [
          ...postcss_plugins,...[
          purgecss({
              content: [
                cfg.wf + '/*.html'
              ]
            })
          ]
        ];
    }


    return src(cfg.src + '/scss/**/*.scss')
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
        .pipe(sourcemaps.write('./'))
        .pipe(dest(cfg.wf + '/css'))
        .pipe(livereload())
        .pipe(refresh());
}


function js() {

    return browserify({
        entries: [cfg.src + '/js/scripts.js']
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
        .pipe(dest(cfg.wf + '/js'))
        .pipe(refresh());
}

const images = function () {
    return src([cfg.src + '/images/**/*'])
        .pipe(dest(cfg.wf + '/images'));
}

// const pdfs = function () {
//     return src([cfg.src + '/pdf/*'])
//         .pipe(dest(cfg.wf + '/pdf'));
// }

const united_assets = function () {
  return src(cfg.src + '/assets/**/*')
      .pipe(dest(cfg.wf + '/assets'));
}


const vendors_css = function () {
    return src([
        'node_modules/slick-carousel/slick/slick.css',
        'node_modules/slick-carousel/slick/slick-theme.css'
    ])
        .pipe(concat('vendors.css'))
        .pipe(dest(cfg.wf + '/css'));
}

const vendors_js = function () {

    return src([
        // 'node_modules/jquery/dist/jquery.min.js',
        'node_modules/slick-carousel/slick/slick.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js'
    ])
        .pipe(concat("vendors.js"))
        .pipe(dest(cfg.wf + '/js'));
}

const vendors_fonts = function () {
    return src([
        'node_modules/slick-carousel/slick/fonts/*',
    ])
        .pipe(dest(cfg.wf + '/css/fonts'));
}

const vendors_css_images = function () {
    return src([
        'node_modules/slick-carousel/slick/ajax-loader.gif',
    ])
        .pipe(dest(cfg.wf + '/css/'));
}

const vendors = parallel(vendors_css, vendors_js, vendors_fonts, vendors_css_images);

function getTwigMockupData(cb) {
    cfg.twig_mockupData = JSON.parse(fs.readFileSync('./mockUpData.json', 'utf8'));
    return cb();
}

function compile_twig() {

    return src(cfg.src + '/markup/pages/**/*.twig')
        .pipe(twig({
            base: cfg.src + '/markup',
            // data: cfg.twig_mockupData
        }))
        .pipe(dest(cfg.wf))
        .pipe(refresh());

}


function refresh(cb) {

    livereload();

    if (cfg.wf == cfg.dev) {
        return browserSync.stream();
    }
    return;
}

function server() {
    browserSync.init({
        server: {
            baseDir: cfg.wf
        }
    });

    livereload.listen();

    watch([cfg.src + '/scss/**/*'], series(scss));
    watch([cfg.src + '/js/**/*'], series(js));

    // watch(['./mockupData.json'], series(getTwigMockupData, compile_twig));
    watch([cfg.src + '/markup/**/*'], series(compile_twig));
};

// exports.twig = series(set_wf_dev, clean_dev, getTwigMockupData, parallel(scss, js, images, pdfs, vendors, compile_twig), server);

exports.default = series(set_wf_dev, clean_dev, compile_twig, parallel(united_assets, vendors, scss, js), server);
