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
    group: {
        backgroundColor: '#E9F7F8',
        paddingVertical: 5,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        height: 40
    },
    groupIcon: {
        marginRight: 10,
        backgroundColor: '#68C4DD',
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    groupName: {
        color: commonStyles.COLOR_SECONDARY,
    }
})