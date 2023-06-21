module.exports = function () {

	var theme_name= 'wun-portfolio'; //Wordpress theme name
	var site_url  = 'http://portfolio.wundermanlab.com.ar/'; // Local proxy domain

	var cfg = {
		src              : 'src/', //Template sources
		dev              : 'dev/', //Template developer folder
		dist             : 'dist/', //Distribution
		comp             : 'components/', //Components developer folder
		directory_listing: false,
		domain           : site_url
	};

	//Default working folder
	cfg.wf = cfg.dev;


	// WP src file paths
	cfg.src_theme   = cfg.src +'theme/';
	cfg.src_plugins = cfg.src + 'plugins/';

	// WP dist folders names
	cfg.dist_theme  = 'wp-content/themes/' + theme_name +'/';
	cfg.dist_plugins= 'wp-content/plugins/';


	//Files relative paths
	cfg.paths = {
		src_vendors: 'node_modules/',

		src_css    : cfg.src_theme + 'css/',
		src_scss   : cfg.src_theme + 'sass/',
		src_js     : cfg.src_theme + 'js/',
		src_img    : cfg.src_theme + 'images/',
		src_fonts  : cfg.src_theme + 'fonts/',

		dest_css   : cfg.dist_theme+ 'css/',
		dest_js    : cfg.dist_theme+ 'js/',
		dest_img   : cfg.dist_theme+ 'images/',
		dest_fonts : cfg.dist_theme+ 'fonts/'
	};


	// SASS include folders path
	cfg.paths.sass_includes = [
		cfg.paths.src_vendors + '/bootstrap-sass/assets/stylesheets'
	];

	// User and Vendors files path
	cfg.files = {
		img: [
			cfg.paths.src_img +'**/*',
			'!' + cfg.paths.src_img +'**/*.psd'
		],
		css: [
			cfg.paths.src_css +'*.css',
			'!' + cfg.paths.src_css +'style.css'
		],
		js: [
			cfg.paths.src_js + '*.js',
			'!' + cfg.paths.src_js + 'scripts.js'
		],
		fonts: [
			cfg.paths.src_fonts + '*'
		],
		vendors: {
			img: [],
			css: [
				cfg.paths.src_vendors + 'bootstrap-select/dist/css/bootstrap-select.css',
				cfg.paths.src_vendors + '@fancyapps/fancybox/dist/jquery.fancybox.css',
				cfg.paths.src_vendors + '@mdi/font/css/materialdesignicons.css'
			],
			js: [
				cfg.paths.src_vendors + 'jquery/dist/jquery.js',
				cfg.paths.src_vendors + 'bootstrap-sass/assets/javascripts/bootstrap.js',
				cfg.paths.src_vendors + 'bootstrap-select/dist/js/bootstrap-select.js',
				cfg.paths.src_vendors + '@fancyapps/fancybox/dist/jquery.fancybox.js',
				cfg.paths.src_vendors + 'vanilla-lazyload/dist/lazyload.js',
				cfg.paths.src_vendors + 'clipboard-js/clipboard.js'
			],
			fonts: [
				cfg.paths.src_vendors + 'bootstrap-sass/assets/fonts/bootstrap/*',
        cfg.paths.src_vendors + '@mdi/font/fonts/*'
			],
			standalone_img: [],
			standalone_css: [],
			standalone_js : []
		}
	};

    return cfg;
};




