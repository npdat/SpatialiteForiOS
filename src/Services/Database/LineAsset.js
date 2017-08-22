import React, { Component } from 'react';

formatPointGeomatry = (objGeom) => {
    let line = JSON.parse(objGeom.MultiLineString);
    geom = {coordinates: {
            latitude: line.coordinates[1],
            longitude: line.coordinates[0]
        },
        name: objGeom.Name,
        type: line.type
    }
    return geom;
}
parseJson = (array) => {
    // Point
    if (array[0].Point != null) {
        myPointData = [];
        for (var i = 0; i < array.length; i++) {
            point = this.formatPointGeomatry(array[i]);
            myPointData.push({
                name: point.name,
                type: point.type,
                coordinates: point.coordinates
            });
        }
        return myPointData;
    }
}

export { parseJson }