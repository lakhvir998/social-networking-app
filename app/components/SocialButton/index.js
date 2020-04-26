import React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    TouchableOpacity,
    Image,
    Text
} from 'react-native';
import styles from './styles';

const fbIcon = require('../../assets/images/login/facebook.png');
const googleIcon = require('../../assets/images/login/google-plus.png');
const emailIcon = require('../../assets/images/login/email.png');


const SocialButton = ({ type, text, onPress }) => (
    <TouchableOpacity
        style={[styles.socialBtn, type === 'facebook' ? styles.btnFB : type === 'google' ? styles.btnGoogle : type ===  'email' ? styles.btnEmail : '' ]}
        onPress={ onPress }>
        <View style={ styles.socialIconContainer }>
            <Image
                source={ type === 'facebook' ? fbIcon : type === 'google' ? googleIcon : type === 'email' ? emailIcon : ''}
                style={ styles.socialImage }
            />
        </View>
        <Text style={[styles.socialText, { flex: 8 }]}>{text }</Text>
    </TouchableOpacity>
);

SocialButton.propTypes = {
    type: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired
};

export default SocialButton;