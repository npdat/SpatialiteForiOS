import React, { Component } from 'react'
import { View, Text } from 'react-native'
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import db from 'react-native-spatialite';

const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;

export default class Point extends Component {
    constructor(props) {
        super(props);
        this.state = {
            markers: [{
                title: 'hello1',
                coordinates: {
                    latitude: 37.78825,
                    longitude: -122.4324
                },
            },
            {
                title: 'hello2',
                coordinates: {
                    latitude: 37.79925,
                    longitude: -123.4324
                },
            }],
            isLoaded: 37.78825,
        };
    }

    getPointAsset = () => {
        db.createConnection('work-asset.sqlite').then(connected => {
            console.log('Database is connected', connected);
        }).then(array => {
            return db.executeQuery('SELECT Astext(Geometry) FROM Towns');
        }).then(rows => {
            this.setState({isLoaded: 37.79925});
            console.log({ rows });
        }).catch(err => {
            throw err;
        });
    }

    render() {
        return (
            <MapView.Marker
                coordinate={{ latitude: this.state.isLoaded, longitude: LONGITUDE }}>
            </MapView.Marker>
        );
    }
}