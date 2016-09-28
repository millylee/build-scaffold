module.exports = {
    src: {
        scss: 'src/**/*.scss',
        html: 'src/**/*.html',
        shtml: 'src/**/*.shtml',
        js: 'src/**/*.js',
    },
    dest: {
        dir: 'dist',
        js: 'dist/**/*.js',
    },
    autoprefixer: {
        browsers: ['last 2 versions']
    },
    domain: {
        name: 'localhost',
        port: '8777',
    },
};
