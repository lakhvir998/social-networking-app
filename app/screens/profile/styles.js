import { StyleSheet, Dimensions } from 'react-native';
import * as commonStyles from '../../styles/common';

let { height, width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: commonStyles.COLOR_PRIMARY,
        backgroundColor: commonStyles.COLOR_PRIMARY,
    },
    top: {
        flexDirection: 'row',
        paddingHorizontal: 16,
    },
    imageContainer: {
        backgroundColor: 'white',
        height: 110,
        width: 110,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 60,
        alignSelf: 'center',
        marginTop: 20,
        padding: 5
    },
    nameContainer: {
        justifyContent: 'flex-end',
        marginBottom: 20
    },
    name: {
        textAlignVertical: 'bottom',
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold',
        paddingHorizontal: 10
    },
    line: {
        borderWidth: .5,
        width: (width - (width / 3)),
        borderColor: '#EDF3F3',
        marginVertical: 10,
        alignSelf: 'center'
    },
    qrContainer: {
        flex: 3,
        alignItems: 'flex-end',
    },
    qrImage: {
        height: 45,
        width: 45
    },
    byteId: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 14
    },
    btnContainer: {
        paddingHorizontal: 16,
        alignItems: 'center',
        marginVertical: 30
    },
    btnPlatform: {
        backgroundColor: 'white',
        borderRadius: 10,
        height: 60,
        padding: 10,
        justifyContent: 'center',
        width: width - (width / 2)
    },
    socialText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#484848'
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',

    },
    avatarBackground: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: ( width - 40 ) / 2
    },
    modalAvatar: {
        height: ( width - 40 ),
        width: ( width - 40 ),
        borderRadius: ( width - 40 ) / 2
    },
   modalBG: {
       backgroundColor: 'white',
       borderRadius: 10,
       margin: 10
   },
    modalH3: {
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 10
    },
    modalH2: {
        color: 'black',
        textAlign: 'center',
        fontSize: 24
    },
    saveBtn: {
        height: 40,
        margin: 10,
        backgroundColor: 'white',
        borderWidth: 1.5,
        justifyContent: 'center',
        borderRadius: 10
    },
    saveBtnText: {
        textAlign: 'center',
        color: 'black'
    },
    icons: {
        margin: 7.5
    },
    inputField: {
        flex: 1,
        height: 40
    },
    formContainer: {
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#d5d7d6',
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 7.5
    },
    qrTextWrapper: {
        width: ( width - 40 ),
        paddingTop: 10
    },
    searchField: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1.5,
        margin: 10
    },
    platformRow: {
        backgroundColor: 'white',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1.5,
        borderColor: 'black'
    }
})