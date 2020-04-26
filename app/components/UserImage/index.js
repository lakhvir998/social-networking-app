import React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    TouchableOpacity,
    Image,
    Text
} from 'react-native';
import API from "../../lib/api";



let DEFAULT_IMAGE = require('../../screens/images/pp.png');


const UserImage = ({ image }) => {
    if(image != null) {
        DEFAULT_IMAGE = {uri: `${API.BASE_URL}/${image}` }

    }
   return (
       <Image
           source={ DEFAULT_IMAGE }
           style={{ height: 110, width: 110, borderRadius: 110 / 2 }}
       />
   )
};

UserImage.propTypes = {
    image: PropTypes.string.isRequired,
};

export default UserImage;