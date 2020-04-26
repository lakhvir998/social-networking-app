import { StyleSheet, Dimensions } from 'react-native';
import * as commonStyles from '../../styles/common';

let { height, width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: commonStyles.COLOR_PRIMARY,
    },
    formContainer: {
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#d5d7d6',
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 7.5
    },
    imageContainer: {
        backgroundColor: 'white',
        height: 100,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        alignSelf: 'center',
        marginTop: 20
    },
    icons: {
        margin: 7.5
    },
    inputField: {
        flex: 1,
        height: 40
    },
    topBtnIcons: {
        height: 40,
        width: 40
    },
    btnLeft: {
        position: 'absolute',
        top: 5,
        left: 5
    },
    btnRight: {
        position: 'absolute',
        top: 5,
        right: 5
    },
    userImage: {
        height: 94,
        width: 94,
        borderRadius: 94 / 2
    },
    userName: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    nickname: {
        color: 'white',
        fontSize: 18,
        fontStyle: 'italic',
        fontWeight: 'bold'
    },
    divider: {
        height: 1,
        width: (width - 100),
        backgroundColor: '#EDF3F3',
        marginTop: 30,
        marginBottom: 20,
        alignSelf: 'center'
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center'
    }

})