import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
}));

/**
 * Component to display the map
 *
 * @param {Object} props
 */
const Map = props => {
  const { zoom, center, pins, className, ...rest } = props;

  const classes = useStyles();

  React.useEffect(() => {
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;

    const markerIcon2x = require('assets/images/leaflet-assets/marker-icon-2x.png');
    const markerIcon = require('assets/images/leaflet-assets/marker-icon.png');
    const markerShadow = require('assets/images/leaflet-assets/marker-shadow.png');

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: typeof markerIcon2x === 'object' ? markerIcon2x.default : markerIcon2x,
      iconUrl: typeof markerIcon === 'object' ? markerIcon.default : markerIcon,
      shadowUrl: typeof markerShadow === 'object' ? markerShadow.default : markerShadow,
    });
  });

  if (typeof window === 'undefined') {
    return null;
  }

  const ReactMap = require('react-leaflet').Map;
  const TileLayer = require('react-leaflet').TileLayer;
  const Marker = require('react-leaflet').Marker;

  return (
    <ReactMap
      zoom={zoom}
      center={center}
      className={clsx('map', classes.root, className)}
      {...rest}
    >
      <TileLayer
        className="map__tile-layer"
        detectRetina={true}
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pins &&
        pins.length &&
        pins.map((item, i) => (
          <Marker
            className="map__marker"
            position={[item.location.y, item.location.x]}
            key={i}
          />
        ))}
    </ReactMap>
  );
};

Map.defaultProps = {
  zoom: 10,
  center: [0, 0],
};

Map.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Map zoom
   */
  zoom: PropTypes.node,
  /**
   * Map center
   */
  center: PropTypes.array.isRequired,
  /**
   * data of the locations. Example: [{ location: { x: number, y: number } }]
   */
  pins: PropTypes.array,
};

export default Map;
