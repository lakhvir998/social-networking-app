import { StyleSheet } from 'react-native';
import * as commonStyles from "../../styles/common";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: commonStyles.COLOR_PRIMARY,
        paddingHorizontal: 16
    },
    formContainer: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 3,
        alignItems: 'center',
        marginVertical: 7.5
    },
    inputField: {
        flex: 8,
        height: 40
    },
    icons: {
        marginLeft: 10
    },
    listHeading: {
        color: 'white',
        marginVertical: 10,
        fontWeight: 'bold',
        fontSize: 15
    }
})