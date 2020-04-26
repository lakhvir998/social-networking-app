import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity
} from 'react-native';


import Background from '../../components/Background';
import styles from './styles';

import RegisterForm from './RegisterForm'



class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: ''
        }
    }

    componentWillMount() {
        const { params } = this.props.navigation.state;
        const token = params ? params.token : null;
        this.setState({token});
    }


    render() {
        return (
            <Background>
                <View style={ styles.container }>
                    <Text style={ styles.heading }>Sign up</Text>
                    <RegisterForm  token={this.state.token}/>
                </View>
            </Background>
        );
    }
}

Register.propTypes = {
    navigation: PropTypes.object.isRequired
};

export default Register;

