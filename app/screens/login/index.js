import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    View,
    Text, ToastAndroid
} from 'react-native';
import RNAccountKit from 'react-native-facebook-account-kit';

import { USER_REGISTER } from '../../actions/types';
import Background from '../../components/Background';

import AuthButtons from './AuthButtons';
import styles from './styles';
import Loader from '../../components/Loader';

import { login } from '../../actions/auth';

class Login extends Component {

    login = () =>
        RNAccountKit.loginWithPhone()
            .then((token) => {
                if (!token) {
                } else {
                    this.props.login({
                        ak_access_token: token.token,
                        app_id: token.appId
                    });

                }
            });

    register = () =>{
        RNAccountKit.loginWithPhone()
            .then((token) => {
                if (!token) {
                } else {
                    this.props.navigation.dispatch({ type: USER_REGISTER, token: token.token })
                }
            })
    };

    render() {
        const { loading, navigation } = this.props;
        return(
            <Background>
                <Loader loading={loading} />
                <View style={ styles.container }>
                    <AuthButtons login={this.login} register={this.register} navigation={navigation}/>
               </View>
            </Background>
        )
    }
}

Login.propTypes = {
    navigation: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        navigationState: state.navigation,
        errorFlag: state.auth.errorFlag,
        errors: state.auth.errors,
        loading: state.spinner.show
    };
}

export default connect(mapStateToProps, { login })(Login);