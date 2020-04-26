import React from 'react';
import {
    Image,
    View
} from 'react-native';
import styles from "./styles";

const logo = require('../../components/Logo/logo.png');

const Logo = () => (
    <View style={styles.logoContainer}>
        <Image
            source={logo}
            style={styles.logo}
            resizeMode={'contain'}
        />
    </View>
);

export default Logo;