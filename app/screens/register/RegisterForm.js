import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    Text,
    ToastAndroid,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles'
import Loader from '../../components/Loader';
import { registerWithPhone } from '../../actions/users';
import RNAccountKit from "react-native-facebook-account-kit";



class RegisterForm extends Component {
    state = {
            name: '',
            token: '',
    };

    componentDidMount() {
        this.setState({
            token: this.props.token
        });
    }


    onChange = text =>
        this.setState({
            name:  text
        });

    validate = (name) => {
        const errors = {};
        if (!name || name.length < 1) errors.name = "Please fill your name";
        return errors;
    };

    onRegister() {
        const errors = this.validate(this.state.name);

        if (Object.keys(errors).length === 0) {
            this.props.registerWithPhone({ user: { name: this.state.name }, token: this.state.token } )
        } else {
            ToastAndroid.show(errors.name, 1000);
        }
    }

    render() {
        const { name  } = this.state;
        const { loading } = this.props;
        return (
            <KeyboardAvoidingView   behavior="padding">
                <Loader loading={loading} />
                <View style={ styles.formContainer }>
                    <Icon name="user" size={25} color="#000" style={ styles.icons } />
                    <View
                        style={ styles.divider }
                    />
                    <TextInput
                        value={ name }
                        style={ styles.inputField }
                        autoCapitalize='none'
                        autoCorrect={false}
                        autoFocus={true}
                        onChangeText={ this.onChange }
                        placeholder={'Full Name'}
                        underlineColorAndroid={'transparent'}
                    />
                </View>

                <TouchableOpacity
                    style={ styles.registerButton }
                    onPress={ () =>  this.onRegister() }>
                    <Text style={ styles.buttonText }>Continue</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        );
    }
}

RegisterForm.propTypes = {
    registerWithPhone: PropTypes.func.isRequired,
    token: PropTypes.string
};

mapStateToProps = (state) => {
    return {
        errorFlag: state.user.errorFlag,
        errors: state.user.errors,
        loading: state.spinner.show,
    };
};


export default connect(mapStateToProps, { registerWithPhone })(RegisterForm);