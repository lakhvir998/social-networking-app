import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StatusBar,
    AsyncStorage,
    FlatList,
    TouchableOpacity,
    Image,
    Text,
} from 'react-native';
import {connect} from "react-redux";
import RNAccountKit from 'react-native-facebook-account-kit';
import {GoogleSignin} from 'react-native-google-signin';
import {
    LoginManager
} from 'react-native-fbsdk';
import { Toolbar } from 'react-native-material-ui';

import {USER_LOGGED_OUT, SCAN_QR, FRIEND_PROFILE} from "../../actions/types";
import {COLOR_SECONDARY} from "../../styles/common";

import { search } from "../../actions/search";
import API from "../../lib/api";
import styles from './styles';
const DEFAULT_IMAGE = require('../../screens/images/pp.png');

let timeoutHandler;


class MyToolbar extends Component {
    userImage = (image = null) => {
            if(image != null) {
                return {uri: `${API.BASE_URL}/${image}` }
            } else {
                return DEFAULT_IMAGE;
            }

    };

    renderSearchRow(row) {
        let name = row.name.split(' ');
        return <TouchableOpacity
            style={ styles.result }
            onPress={() => {
                this.props.navigation.dispatch({ type: FRIEND_PROFILE, profile_id: row.username })
            }}
        >
            <Image
                source={this.userImage(row.avatar)}
                style={ styles.avatar }
            />
            <View style={{ flexDirection: 'row' }}>
                <Text style={ [styles.name, styles.highlight] }>{name[0]}</Text>
                <Text style={ [styles.name, { marginLeft: 5 }] }>{name[1]}</Text>
            </View>

        </TouchableOpacity>
    }

    render() {
        const { navigation } = this.props;
        return(
            <View>
                <StatusBar backgroundColor={COLOR_SECONDARY} />
                <Toolbar
                    centerElement={navigation.state.key === 'FriendsTabs' ? 'Friends & Groups' : navigation.state.key}
                    searchable={{
                        autoFocus: true,
                        placeholder: 'Search',
                        onChangeText: (text) => {
                            clearTimeout(timeoutHandler);
                            timeoutHandler = setTimeout(() => {
                                this.props.search(text, this.props.token)
                            }, 300);
                        },
                    }}
                    rightElement={{
                        actions: ['photo-camera'],
                        menu: {
                            labels: ['Invite', "Deactivate", 'About & Help', 'Logout']
                        }
                    }}
                    onRightElementPress={({action, index}) => {
                        if(action === 'photo-camera') {
                            navigation.dispatch({ type: SCAN_QR })
                        }
                        if(index === 3) {
                            RNAccountKit.logout()
                                .then(() => {
                                    AsyncStorage.clear();
                                });
                            LoginManager.logOut();
                            GoogleSignin.signOut()
                                .then(() => {
                                })
                                .catch((err) => {

                                });
                            navigation.dispatch({ type: USER_LOGGED_OUT});
                        }
                    }
                    }
                />
                <View style={{ position: 'absolute', top: 52, zIndex: 1 }}>
                    <FlatList
                        data={this.props.results}
                        keyExtractor={(item, index) => {
                            return item.id.toString()
                        }}
                        renderItem={({item}) => this.renderSearchRow(item)}
                    />
                </View>
            </View>
        );
    }
}



MyToolbar.propTypes = {
    navigation: PropTypes.object.isRequired,
    search: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        results: state.search.results,
        token: state.auth.token,
    };
}

export default connect(mapStateToProps, { search })(MyToolbar);