import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    AsyncStorage,
    ToastAndroid,
    NetInfo
} from 'react-native';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import API from '../../../lib/api';

import styles from "../styles";
import { bindActionCreators } from "redux";
import {ActionCreators} from "../../../actions";
import {connect} from "react-redux";
import {FRIEND_PROFILE} from "../../../actions/types";

const DEFAULT_IMAGE = require('../../images/pp.png');

class Notification extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        this.fetchNotifications();
    }

    userImage = (image = null) => {
        if(image != null) {
            return {uri: `${API.BASE_URL}/${image}` }
        } else {
            return DEFAULT_IMAGE;
        }
    };

    fetchNotifications() {
        this.props.getNotifications(this.props.token);

    }

    removeNotification(id) {
        this.props.markNotification(id, this.props.token)
            .then(resp => {
                if(resp.status) {
                    this.fetchNotifications();
                }
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={this.props.notifications}
                        renderItem={({item}) => {
                            return <View style={{ flexDirection: 'row', padding: 20,  marginBottom: 1 }}>
                                <TouchableOpacity
                                    style={{ flex: 1, flexDirection: 'row' }}
                                    onPress={() => {
                                        this.props.navigation.dispatch({ type: FRIEND_PROFILE, profile_id: item.byte_id })
                                    }}
                                >
                                    <Image
                                        source={this.userImage(item.avatar)}
                                        style={{ height: 50, width: 50, borderRadius: 25 }}
                                    />
                                    <View style={{ justifyContent: 'center', flex: 1 }}>
                                        <Text style={{ color: 'black', marginHorizontal: 15 }} numberOfLines={2}>{item.message}</Text>
                                        <Moment fromNow element={Text} style={{ color: 'grey', marginLeft: 15 }}>{item.when}</Moment>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        this.removeNotification(item.key);
                                    }}
                                    style={{ justifyContent: 'center' }}
                                >
                                    <Image
                                        source={require('../../images/ignore.png')}
                                        style={{ height: 20, width: 20 }}
                                    />
                                </TouchableOpacity>
                            </View>
                        }}
                    />
                </View>
            </View>
        );
    }
}

Notification.propTypes = {
    navigation: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    getNotifications: PropTypes.func.isRequired,
    markNotification: PropTypes.func.isRequired,
    getNotificationCount: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        navigationState: state.navigation,
        isLoggedIn: state.auth.isLoggedIn,
        user: state.auth.user,
        token: state.auth.token,
        notifications: state.notification.notifications

    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification);