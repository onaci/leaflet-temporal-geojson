const gulp = require('gulp');
const babel = require('rollup-plugin-babel');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const rollup = require('rollup');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');

// Concatenate & Minify src and dependencies
gulp.task('scripts', function () {

	return rollup.rollup({
		input: './src/js/L.TemporalGeoJSONLayer.js',
		output: {
			format: 'umd',
			name: 'leaflet-temporal-geojson'
		},
		plugins: [
			babel({
				exclude: 'node_modules/**' // only transpile our source code
			}),
			commonjs({
				include:
					'node_modules/**'
			})
		]
	})

		// and output to ./dist/app.js as normal.
		.then(bundle => {
			return bundle.write({
				file: './dist/leaflet-temporal-geojson.js',
				format: 'umd',
				name: 'leaflet-temporal-geojson',
				sourcemap: true
			});
		});

});

// Watch Files For Changes
gulp.task('watch', function (done) {
	gulp.watch('src/js/*.js', gulp.series('scripts'));
	done();
});

// Default Task
gulp.task('default', gulp.series('scripts', 'watch'));