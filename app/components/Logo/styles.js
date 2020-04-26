import { StyleSheet } from 'react-native';
import {
    Dimensions,
} from 'react-native';

let { height, width } = Dimensions.get('window');

export default StyleSheet.create({
    logoContainer: {
        flex: 3,
        justifyContent: 'center'
    },
    logo: {
        height: 100,
        width: width - 100,
        alignSelf: 'center'
    }
});