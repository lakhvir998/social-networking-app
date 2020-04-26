import React from 'react';
import PropTypes from 'prop-types';
import {
    ImageBackground,
    Dimensions,
} from 'react-native';

let { height, width } = Dimensions.get('window');
const backgroundImage = require('./backgroundImg.jpg');

const Background = (props) => (
    <ImageBackground
        source={backgroundImage}
        style={{ height: height, width: width }}
    >
        {props.children}
    </ImageBackground>
);

BackgrpropspropTypes = {
    children: PropTypes.element.isRequired
};

export default Background;