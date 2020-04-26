import { StyleSheet } from 'react-native';
import {
    Dimensions,
} from 'react-native';

let { height, width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(15, 188, 249, .3)',
        paddingHorizontal: 20,
        alignItems: 'center'
    },
    socialContainer: {
        flex: 7,
        justifyContent: 'center'
    },
    socialIconContainer: {
        flex: 2,
        alignItems: 'center'
    },
    socialImage: {
        height: 25,
        width: 25,
        resizeMode: 'contain'
    },
    socialText: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    },
    socialBtn: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10
    },
    loginButtonContainer: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    btnFB: {
        backgroundColor: '#4267B2',
    },
    btnGoogle: {
        backgroundColor: '#DD4B39',
        marginTop: 15,
    },
    btnAK: {
        flexDirection: 'row',
        height: 60,
        marginTop: 15
    },
    footerContainer: {
        alignItems: 'center',
        marginBottom: 30
    },
    footerText: {
        color: '#E5E5E5'
    }

});