# leaflet-temporal-geojson [![NPM version][npm-image]][npm-url] [![NPM Downloads][npm-downloads-image]][npm-url]

A leaflet (v1+) plugin animate GeoJSON features using an arbitrary time property.

![Screenshot](/screenshots/keyframes.gif?raw=true)

## how does it work

- features are clustered into layer 'keyframes' using supplied time property
- keyframes are drawn to html canvas depending on time
- features may have custom styles applied using property features

## notes
- to leverage canvas performance, points are rendered as `L.circleMarker` vectors using L.geoJSON's `pointToLayer` function 

## install
```shell
npm install leaflet-temporal-geojson --save
```

## development
```shell
npm install 
npm run build
```

## use and options

See demo for detailed example.

```javascript
const layer = L.temporalGeoJSONLayer({

  // which property to use for time (expects ISO 8601 string)
  timeKey: "time",
  
  // optional function to return style 
  // see path options: https://leafletjs.com/reference-1.6.0.html#path-option
  featureStyle: function(feature) { 
    return {}; 
  },
  
  // array of geojson features
  features: [
    {
      "type": "Feature",
      "properties": {
        "age": 1,
        "time": "2005-08-22T09:01:00Z"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          146.9531,
          -43.5803
        ]
      }
    },
  ],

  // OPTIONAL - supply the name of a custom pane,
  // will be created if doesn't exist, defaults to overlayPane
  // https://leafletjs.com/reference-1.6.0.html#map-pane
  paneName: 'myCustomPane',

  // OPTIONAL - additional options to style point data (e.g. radius)
  // this has lower priority than styles from featureStyle()
  // https://leafletjs.com/reference-1.6.0.html#circlemarker
  circleMarkerOptions: {},

  // OPTIONAL - callbacks when layer is added/removed from map
  onAdd: function(){},
  onRemove: function(){}

});
```

## public methods

|method|params|description|
|---|---|---|
|`getFrame`||Get the current frame time (-1 if not set)|
|`getFrameKeys`||Get an ascending array of all ISO times (can then be used to call `setFrame`)|
|`isActive`||check if the layer is currently active on the map|
|`setFrame`|`time: {String}`|display the features at the given ISO time (if calling from something like a range slider, recommended to throttle - see demo)|
|`onAdd`||optional callback when layer has been added to map|
|`onRemove`||optional callback when layer has been removed from map|


## example data

The included example data is fictional and intended for demonstration purposes only, however - if you're interested in marine connectivity modelling you should check out some of CSIRO's work on connectivity modelling [here](https://connie.csiro.au), and [here](https://www.csiro.au/en/Research/OandA/Areas/Marine-resources-and-industries/Marine-biodiversity/CONNIE).

[npm-image]: https://badge.fury.io/js/leaflet-temporal-geojson.svg
[npm-url]: https://www.npmjs.com/package/leaflet-temporal-geojson
[npm-downloads-image]: https://img.shields.io/npm/dt/leaflet-temporal-geojson.svg