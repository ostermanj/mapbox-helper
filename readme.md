# Mapbox helper

This module will supply some helper functions to help developers working with [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/).

It's very much a work in progress and currently exports one method, `addSourceAndLayers`, which allows you to combine mapbox's native `addSource` and `addLayer` methods into one function, with the ability to add one layer or more at a time (with the same source).

It also Promisifies the adding of the source and the adding of the layer(s). A Promise is resolved within the local scope of the function when the source is successfully added to the map, and the layers are added only after that resolution. The function returns a Promise to the outer scope (your code) which resolves true when all the layers added are ready for further interaction. Visible layers resolve only after `queryRenderedFeatures()` returns truthy for the layer. You can chain your next actions onto the resolution of that Promise.

**Important note:** the module uses ES6 syntax and APIs. It's configured in its package.json and .babelrc file to be transpiled to work in browsers ( "last 2 versions", "> 1%" ) by babelify via Browserify when / if that is part of the buld process of the project that `require`s it. If that's not part of your process, the module, as far as I undestand, will be imported into your code without being transpiled first and so may not work in all browsers / runtime environments without futher doing on your end.

## Why?

With mapbox, adding a source sometimes doesn't take effect quickly enough to immediately support adding a map layer based on it. Similarly, adding a layer sometimes doesn't take effect quickly enough for you to immediately interact with it. You can work around this by listening for the maps render event and checking on render if the source or layer exists before continuing.

That's tedious and repetitive. This method makes it less so.

## How to use

**Install it**

 `npm install mapbox-helper --save-dev`

**Import it**

```javascript
// your code
var mbHelper = require('mapbox-helper');
// your code
``` 

 **Use it**

 Call the `addSourceAndLayers` method with the map as the context and two parameters, the source config object and an array of layer config objects (or just one):

 `mbHelper.addSourceAndLayers.call(<map reference>, <source config object>, <array of layer config objects>);`

Example:

```javascript
var addLayers = mbHelper.addSourceAndLayers.call(map,
    { // source
        "type": "vector",
        "url": "mapbox://mapbox.us_census_states_2015",
        "name": "states"
    }, [ // layers
        { // layer one
            "id": "states-join",
            "type": "fill",
            "source-layer": 'states',
            "paint": {
              "fill-color": 'transparent'
            },
            "beforeLayer": "water" // <== this is different from mapbox native specs
        },
        { // layer two
            "id": "states-join-hover",
            "type": "line",
            "source-layer": 'states',
            "paint": {
                "line-color": '#4D90FE',
                "line-width": 4,
                "line-blur": 2
            },
            "filter": ["==", "name", ""]
        }
    ]);
```

The config object for the source is the same as when using the native mapbox methods; the config objects for the layers are the same, except for the way you specify which map layer the new layer should be placed before (under). Natively, that is specified by passing in the name as an argument after the config object. Here, it is included as a property of the config object. See the note above in the code.

`addSourceAndLayers` returns a Promise that resolves when the layers are ready to be intereactive with, so you can chain `.then()` onto it to handle subsequent actions:

```javascript
addLayers.then(() => {
  // do some stuff
});
```

Or chain it directly onto the function call:

```javascript
mbHelper.addSourceAndLayers.call(map,
    { // source
        "type": "vector",
        "url": "mapbox://mapbox.us_census_states_2015",
        "name": "states"
    }, [ // layers
        { // layer one
            "id": "states-join",
            "type": "fill",
            "source-layer": 'states',
            "paint": {
              "fill-color": 'transparent'
            },
            "beforeLayer": "water" // <== this is different from mapbox native specs
        },
        { // layer two
            "id": "states-join-hover",
            "type": "line",
            "source-layer": 'states',
            "paint": {
                "line-color": '#4D90FE',
                "line-width": 4,
                "line-blur": 2
            },
            "filter": ["==", "name", ""]
        }
    ]).then(() => {
        // do some stuff
        });
```

Thanks. Feedback welcome.