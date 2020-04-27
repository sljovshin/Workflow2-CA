const {dest, src} = require('gulp'),
jsmin = require('gulp-uglify'),
htmlmin = require('gulp-htmlmin'),
cssmin = require('gulp-csso'),
imagemin = require('gulp-imagemin'),
sass = require('gulp-sass'),
watch = require('gulp-watch'),
browserSync = require('browser-sync').create(),
ftp = require( 'vinyl-ftp' );

const data = {
    css: {
        src: 'dev/sass/**/*.scss',
        dest: 'dist/css'
    },
    js: {
        src: 'dev/js/**/*.js',
        dest: 'dist/js'
    },
    index: {
        src: 'dev/index.html',
        dest: 'dist'
    },
    html: {
        src: 'dev/html/**/*.html',
        dest: 'dist/html'
    },
    img: {
        src: 'dev/img/**/*',
        dest: 'dist/img'
    },
    ftp: {
        host: 'change_me_to_your_host',
        username: 'change_me_to_your_username',
        password: 'change_me_to_your_password',
        remote_root: 'remote_root'
    }
}


const css = () => {
    console.log('compiling and minifying css');
    return src(data.css.src) 
    .pipe(sass())
    .pipe(cssmin())
    .pipe(dest(data.css.dest))
    .pipe(browserSync.stream())
};

const index = () => {
    console.log('minifying index file');
    return src(data.index.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(data.index.dest));
};

const html = () => {
    console.log('minifying HTML');
    return src(data.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(data.html.dest));
};

const images = () => {
    console.log('compressing images');
    return src(data.img.src)
    .pipe(imagemin())
    .pipe(dest(data.img.dest));
};

const js = () => {
    console.log('minifying js');
    return src(data.js.src)
    .pipe(jsmin())
    .pipe(dest(data.js.dest));
};

const serve = () => {

    css(); js(); index(); html(); images();

    browserSync.init({
        server: {
          baseDir: 'dist',
        }
      });

    watch(data.css.src, css);
    watch(data.js.src, js);
    watch(data.index.src, index);
    watch(data.html.src, html);
    watch(data.img.src, images);
    watch(data.html.dest).on('change', browserSync.reload);
    watch(data.index.dest).on('change', browserSync.reload);
};

const build = (done) => {
    css(); js(); index(); html(); images();

    done();
};

const deploy = () => {

    css(); js(); index(); html(); images();

    const conn = ftp.create( {
		host:     data.ftp.host,
		user:     data.ftp.username,
		password: data.ftp.password,
		parallel: 10,
		log:      null
    } );
    
    const source = 'dist/**';

    return src( source, { base: '.', buffer: true } )
		.pipe(conn.newer( data.ftp.remote_root )) 
		.pipe(conn.dest( data.ftp.remote_root ));
};

exports.serve = serve;
exports.build = build;
exports.css = css;
exports.js = js;
exports.index = index;
exports.html = html;
exports.images = images;
exports.deploy = deploy;
