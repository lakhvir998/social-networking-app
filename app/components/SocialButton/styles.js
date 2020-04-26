import { StyleSheet } from 'react-native';
import {
    Dimensions,
} from 'react-native';

let { height, width } = Dimensions.get('window');

export default StyleSheet.create({

    socialIconContainer: {
        flex: 2,
        alignItems: 'center',

    },
    socialImage: {
        flex: 1,
        height: 45,
        width: 45,
        resizeMode: 'contain',

    },
    socialText: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
        flex: 8,
        textAlign: 'center',
    },
    socialBtn: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#969ea1',
        width: width/1.5,
        paddingHorizontal: 16
    },
    btnEmail: {
        backgroundColor: 'rgba(249, 182, 77, .5)',
    },
    btnFB: {
        backgroundColor: 'rgba(54, 67, 112, .5)',
        marginTop: 15,
    },
    btnGoogle: {
        backgroundColor: 'rgba(173, 51, 40, .5)',
        marginTop: 15,
    }

});