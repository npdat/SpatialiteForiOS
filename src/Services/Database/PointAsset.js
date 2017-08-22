import React, { Component } from 'react';

formatPointGeomatry = (objGeom) => {
    let point = JSON.parse(objGeom.Point);
    geom = {coordinates: {
            latitude: point.coordinates[1],
            longitude: point.coordinates[0]
        },
        name: objGeom.Name,
        type: point.type
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