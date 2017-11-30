exports.mbHelper = {
    promises: {},
    addSourceAndLayers(sourceOptions,layerOptionsArray){ // this = map
        var sourceName = sourceOptions.name;
        mbHelper.promises[sourceOptions.name] = new Promise((resolve) => { // TO DO: figure out reject?
            delete sourceOptions.name;
            function checkDataLoaded(){
                if ( this.getSource(sourceName) ){ // if addSource has taken effect
                    resolve(true);
                    this.off('render', checkDataLoaded); // turn off the listener for render
                }
            }
            this.on('render', checkDataLoaded);
            this.addSource(sourceName, sourceOptions);
        });
        var layerPromises = [];
        return mbHelper.promises[sourceName].then(() => { 
            layerOptionsArray.forEach((each) => {
                layerPromises.push(
                    new Promise((resolve) => { // TO DO: figure out reject?
                        var beforeLayer = each.beforeLayer ? each.beforeLayer : '';
                        delete each.beforeLayer;
                        each.source = sourceName;
                        function checkLayerLoaded(){
                            if ( this.getLayer(each.id) ){ // if addLayer  has taken effect
                                resolve(true);
                                this.off('render', checkLayerLoaded); // turn off the listener for render
                            }
                        }
                        this.on('render', checkLayerLoaded);
                        this.addLayer(each, beforeLayer);
                    })
                );
            });
            return Promise.all(layerPromises);
        });
    }
};