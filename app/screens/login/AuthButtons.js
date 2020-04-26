import React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    TouchableOpacity,
    Text,
    ToastAndroid
} from 'react-native';
import { connect } from 'react-redux';
import {GoogleSignin} from 'react-native-google-signin';
import RNAccountKit from 'react-native-facebook-account-kit';
import {
    LoginManager,
    AccessToken
} from 'react-native-fbsdk';

import styles from './styles';
import SocialButton from '../../components/SocialButton';
import {
    checkGoogleAuth,
    accountkitLoginGoogle,
    userLoggedIn,
    facebookCheck,
    accountkitLoginFB
} from '../../actions/auth';

GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    offlineAccess: true,
    hostedDomain: '',
    forceConsentPrompt: true
});

const AuthButtons = ({ login, register, accountkitLoginGoogle, checkGoogleAuth, facebookCheck, accountkitLoginFB, navigation }) => {
    const googleSignIn = () => {
        GoogleSignin.signIn()
            .then((user) => {
                checkGoogleAuth({ user: { google_id: user.id }})
                    .then(resp => {
                        if(resp.errors) {
                            let k = Object.keys(resp.errors);
                            let error = k[0];
                            ToastAndroid.show(`${resp.errors[k[0]]}`, ToastAndroid.SHORT);
                        } else {
                            if(resp.new_user) {
                                RNAccountKit.loginWithPhone()
                                    .then((token) => {
                                        if (!token) {
                                        } else {
                                            accountkitLoginGoogle({
                                                ak_access_token: token.token,
                                                user: {
                                                    name: user.name,
                                                    email: user.email,
                                                    google_id: user.id,
                                                    avatar: user.photo
                                                }
                                            }).then(resp => {
                                                if(resp.errors) {
                                                    let k = Object.keys(resp.errors);
                                                    let error = k[0];
                                                    ToastAndroid.show(`${resp.errors[k[0]]}`, ToastAndroid.SHORT);
                                                } else {
                                                    navigation.dispatch(userLoggedIn(resp.user, resp.token));
                                                }
                                            })

                                        }
                                    })
                            } else {
                                navigation.dispatch(userLoggedIn(resp.user, resp.token));
                            }


                        }
                    })

            })
            .catch((err) => {
                console.log(err);
            })
            .done();
    };

    const fbSignIn =  () => {
        LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
            function(result) {
                if (result.isCancelled) {
                    alert('Login cancelled');
                } else {
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            facebookCheck({
                                fb_access_token: data.accessToken.toString()
                            }).then(resp => {
                                if(resp.errors) {
                                    let k = Object.keys(resp.errors);
                                    let error = k[0];
                                    ToastAndroid.show(`${error} ${resp.errors[k[0]]}`, ToastAndroid.SHORT);
                                }
                                else {
                                    if(resp.new_user) {
                                        RNAccountKit.loginWithPhone()
                                            .then((token) => {
                                                if (!token) {
                                                } else {
                                                    accountkitLoginFB({
                                                        ak_access_token: token.token,
                                                        fb_access_token: data.accessToken.toString()
                                                    }).then(resp => {
                                                        if(resp.errors) {
                                                            let k = Object.keys(resp.errors);
                                                            let error = k[0];
                                                            ToastAndroid.show(`${resp.errors[k[0]]}`, ToastAndroid.SHORT);
                                                        } else {
                                                            navigation.dispatch(userLoggedIn(resp.user, resp.token));
                                                        }
                                                    })
                                                }

                                            })
                                    } else {
                                        navigation.dispatch(userLoggedIn(resp.user, resp.token));
                                    }

                                }
                            })

                        }
                    )
                }
            },
            function(error) {
                alert('Login fail with error: ' + error);
            }
        );
    };

    return (
        <View style={styles.socialContainer}>
            <SocialButton type='email' text='Email' onPress={ register }/>
            <SocialButton type='facebook' text='Facebook' onPress={ fbSignIn}/>
            <SocialButton type='google' text='Google' onPress={ googleSignIn}/>

            {/*<View style={[ styles.btnAK ]}>*/}
                {/*<TouchableOpacity*/}
                    {/*style={ styles.loginButtonContainer }*/}
                    {/*onPress={() => login()}>*/}
                    {/*<Text style={ styles.socialText }>Sign In</Text>*/}
                {/*</TouchableOpacity>*/}
                {/*<View style={{ width: 10 }} />*/}
                {/*<TouchableOpacity*/}
                    {/*style={ styles.loginButtonContainer }*/}
                    {/*onPress={() => register() }>*/}
                    {/*<Text style={ styles.socialText }>Sign Up</Text>*/}
                {/*</TouchableOpacity>*/}
            {/*</View>*/}
        </View>
    )
};

AuthButtons.propTypes = {
    navigation: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    checkGoogleAuth: PropTypes.func.isRequired,
    accountkitLoginGoogle: PropTypes.func.isRequired,
    facebookCheck: PropTypes.func.isRequired,
    accountkitLoginFB: PropTypes.func.isRequired

};

export default connect(null, { checkGoogleAuth, accountkitLoginGoogle, facebookCheck, accountkitLoginFB })(AuthButtons);