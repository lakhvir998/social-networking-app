import {Dimensions, StyleSheet} from 'react-native';
let { height, width } = Dimensions.get('window');
export default StyleSheet.create({
    container: {
        flex:1,
        flexDirection: 'row',
        alignContent: 'space-around',
        marginRight: 20,
        width: 80
    },
    button: {
        flex:1,
        alignItems: 'flex-end'
    },
    result: {
        backgroundColor: 'white',
        width: width,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar: {
        height: 40,
        width: 40,
        margin: 5,
        marginLeft: 15,
        borderRadius: 15
    },
    name: {
        fontSize: 16,
        color: 'black'
    },
    highlight: {
        marginLeft: 10,
        color: '#0984e3',
    }
})