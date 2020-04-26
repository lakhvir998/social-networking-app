import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 50,
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 30
    },
    formContainer: {
        flexDirection: 'row',
        height: 40,
        backgroundColor: '#d5d7d6',
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 7.5
    },
    icons: {
        margin: 7.5
    },
    divider: {
        height: 30,
        width: 1,
        backgroundColor: '#858688'
    },
    inputField: {
        flex: 1,
        height: 40
    },
    registerButton: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 10,
        borderColor: 'white',
        justifyContent: 'center',
        marginTop: 40
    },
    buttonText: {
        color: 'white', fontSize: 20
    }
})