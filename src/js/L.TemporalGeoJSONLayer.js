

const TemporalGeoJSONLayer = (L.Layer ? L.Layer : L.Class).extend({

	/*------------------------------------ LEAFLET SPECIFIC ------------------------------------------*/

	_active: false,
	_map: null,
	// the DOM leaflet-pane that contains our layer
	_pane: null,
	_paneName: 'overlayPane',

	// just inherit leaflet defaults?
	_defaultStyle: {},

	// user options
	options: {
		features: [],
		frameKey: null,
	},

	initialize: function (options) {
		L.setOptions(this, options);
	},

	/**
	 * @param map {Object} Leaflet map
	 */
	onAdd: function (map) {
		this._active = true;
		this._map = map;
		this._frameKey = null;
		this._setPane();
		this._createFrames();
		if (this.options.onAdd) this.options.onAdd();
	},

	/**
	 * Remove the pane from DOM, and void pane when layer removed from map
	 */
	onRemove() {
		const currentFrame = this._frameLayers[this._frameKey];
		if (currentFrame) this._map.removeLayer(currentFrame);
		this._active = false;
		if (this.options.onRemove) this.options.onRemove();
	},

	/*------------------------------------ PUBLIC ------------------------------------------*/

	/**
	 * check if the particle layer is currently active on the map
	 * @returns {boolean}
	 */
	isActive() {
		return this._active;
	},

	/**
	 * Get the current frame key
	 * @returns {string} the keyframe time
	 */
	getFrame() {
		if (!this.isActive()) return -1;
		return this._frameKey;
	},

	/**
	 * Get ascending array of available frame keys
	 * @returns {array} the keyframe time ISO strings
	 */
	getFrameKeys() {
		return this._times.slice();
	},

	/**
	 * Display the frame at the given frame key
	 * @param key {string} the keyframe time
	 */
	setFrame(key) {
		if (!this.isActive()) return;

		if (this._frameKey !== null) {
			this._map.removeLayer(this._frameLayers[this._frameKey]);
		}

		this._frameKey = key;
		this._map.addLayer(this._frameLayers[this._frameKey]);
	},

	/*------------------------------------ PRIVATE ------------------------------------------*/

	/**
	 * Build keyframes from geojson features.
	 */
	_createFrames() {
		const features = this.options.features;

		// get sorted list of dates
		const dates = features.map(f => new Date(f.properties[this.options.timeKey])).sort((a,b) => a - b );
		// uniq list of ISO strings
		this._times = [...new Set(dates.map(d => d.toISOString()))]; 

		this._frameLayers = {};
		const that = this;
		const renderer = L.canvas({ pane: this._paneName });

		const circleMarkerOptions = this.options.circleMarkerOptions || {}; 
		circleMarkerOptions.renderer = renderer;

		this._times.forEach(time => {
			const slicedFeatures = features.filter(f => f.properties[this.options.timeKey] === time);
			const featureCollection = {	
				type: 'FeatureCollection',
				features: slicedFeatures
			};
			
			const layer = L.geoJSON(featureCollection, {
				pointToLayer(geoJsonPoint, latlng) {
					return L.circleMarker(latlng, circleMarkerOptions);
				},
				style(feature) {
					if (!that.options.featureStyle) {
						return that._defaultStyle;
					}
					return that.options.featureStyle(feature);
				},
				renderer: renderer
			});

			this._frameLayers[time] = layer;
		});
	},

	/**
	 * Create custom pane if necessary
	 * @private
	 */
	_setPane() {
		// determine where to add the layer
		this._paneName = this.options.paneName || 'overlayPane';

		// fall back to overlayPane for leaflet < 1
		let pane = this._map._panes.overlayPane
		if (this._map.getPane) {
			// attempt to get pane first to preserve parent (createPane voids this)
			pane = this._map.getPane(this._paneName);
			if (!pane) {
				pane = this._map.createPane(this._paneName);
			}
		}

		this._pane = pane;
	},

	/**
	 * Deep merge Objects,
	 * Note that destination arrays will be overwritten where they exist in source.
	 * @param destination
	 * @param source
	 * @returns {*}
	 */
	_extendObject(destination, source) {
		let self = this;
		for (const property in source) {
			// .constructor avoids tripping over prototypes etc.
			// don't traverse the data..
			if (property === 'data') {
				destination[property] = source[property];
			} else if (source[property] && source[property].constructor && source[property].constructor === Object) {
				destination[property] = destination[property] || {};
				self._extendObject(destination[property], source[property]);
			} else {
				destination[property] = source[property];
			}
		}
		return destination;
	}

});

L.temporalGeoJSONLayer = function (options) {
	return new TemporalGeoJSONLayer(options);
};

export default L.temporalGeoJSONLayer;


