import { StyleSheet } from 'react-native';
import * as commonStyles from "../../styles/common";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e1eff0',
    },
    formContainer: {
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 7.5
    },
    inputField: {
        flex: 8,
        height: 40
    },
    icons: {
        margin: 1
    },
})