import React from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {GoogleSignin} from 'react-native-google-signin';
import {
    LoginManager,
    AccessToken
} from 'react-native-fbsdk';
import RNAccountKit from 'react-native-facebook-account-kit'
import Loader from '../../components/Loader';
import { USER_LOGGED_IN, USER_LOGGED_OUT } from "../../actions/types";
import API from '../../lib/api';

class AuthLoading extends React.Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        isLoggedIn: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        const userToken = await RNAccountKit.getCurrentAccessToken();
        if(this.props.isLoggedIn) {
            this.props.navigation.navigate('SignedIn')
        } else {
            if(userToken) {
                API.post('/users/authorize', { ak_token: userToken.token})
                    .then(resp => {
                        if(resp.status === 'success') {
                            this.props.navigation.dispatch({ type: USER_LOGGED_IN, user: resp.user, token: resp.token})
                        } else {
                            RNAccountKit.logout();
                            this.props.navigation.dispatch({ type: USER_LOGGED_OUT })
                        }
                    })
            } else {
                RNAccountKit.logout();
                AccessToken.getCurrentAccessToken()
                    .then((data) => {
                            if(data) {
                                API.post('/users/authorize', { fb_id: data.userID })
                                    .then(resp => {
                                        if(resp.status === 'success') {
                                            this.props.navigation.dispatch({ type: USER_LOGGED_IN, user: resp.user, token: resp.token})
                                        } else {
                                            LoginManager.logOut();
                                            this.props.navigation.dispatch({ type: USER_LOGGED_OUT });
                                        }
                                    }).catch(err => {
                                    GoogleSignin.signOut()
                                        .then(() => {
                                            this.props.navigation.dispatch({ type: USER_LOGGED_OUT })
                                        })
                                        .catch((err) => {});
                                })
                            } else {
                                LoginManager.logOut();
                                GoogleSignin.currentUserAsync().then((user) => {
                                    if(user) {
                                        API.post('/users/authorize', { google_id: user.id })
                                            .then(resp => {
                                                if(resp.status === 'success') {
                                                    this.props.navigation.dispatch({ type: USER_LOGGED_IN, user: resp.user, token: resp.token})
                                                } else {
                                                    GoogleSignin.signOut()
                                                        .then(() => {
                                                            this.props.navigation.dispatch({ type: USER_LOGGED_OUT })
                                                        })
                                                        .catch((err) => {});
                                                }
                                            }).catch(err => {
                                            GoogleSignin.signOut()
                                                .then(() => {
                                                    this.props.navigation.dispatch({ type: USER_LOGGED_OUT })
                                                })
                                                .catch((err) => {});
                                        })
                                    } else {
                                        GoogleSignin.signOut()
                                            .then(() => {
                                                this.props.navigation.dispatch({ type: USER_LOGGED_OUT })
                                            })
                                            .catch((err) => {});
                                    }
                                }).done();
                            }

                        }
                    );

            }
        }

    };

    // Render any loading content that you like here
    render() {
        return (
            <View style={styles.container}>
                <Loader loading={true} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

function mapStateToProps(state) {
    return {
        isLoggedIn: state.auth.isLoggedIn,
    };
}

export default  connect(mapStateToProps)(AuthLoading)