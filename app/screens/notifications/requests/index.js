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

class Requests extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.fetchRequests();
    }

    userImage = (image = null) => {
        if(image != null) {
            return {uri: `${API.BASE_URL}/${image}` }
        } else {
            return DEFAULT_IMAGE;
        }
    };

    fetchRequests() {
        this.props.getRequests(this.props.token);

    }

    _acceptRequest(key) {
        this.props.acceptRequest(key, this.props.token)
            .then(resp => {
                if(resp.status) {
                    ToastAndroid.show('Request accepted', ToastAndroid.SHORT);
                    this.fetchRequests();
                }
            });
    }

    _declineRequest(key) {
        this.props.declineRequest(key, this.props.token)
            .then(resp => {
                if(resp.status) {
                    ToastAndroid.show('Request declined', ToastAndroid.SHORT);
                    this.fetchRequests();
                }
            });
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={this.props.requests}
                        renderItem={({item}) => {
                            return <View style={{ flexDirection: 'row', padding: 20,  marginBottom: 1 }}>
                                <TouchableOpacity
                                    style={{  flexDirection: 'row', flex: 9 }}
                                    onPress={() => {
                                        this.props.navigation.dispatch({ type: FRIEND_PROFILE, profile_id: item.byte_id })
                                    }}
                                >
                                    <Image
                                        source={this.userImage(item.avatar)}
                                        style={{ height: 50, width: 50, borderRadius: 25 }}
                                    />
                                    <View style={{flexDirection: 'row', marginLeft: 15, alignItems: 'center'}}>
                                        <Text style={{ color: 'black'}}>{item.message}</Text>
                                    </View>

                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this._acceptRequest(item.key);
                                        }}
                                    >
                                        <Image
                                            source={require('../../images/accept.png')}
                                            style={{ height: 20, width: 20 }}
                                            resizeMode={'contain'}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this._declineRequest(item.key);
                                        }}
                                    >
                                        <Image
                                            source={require('../../images/ignore.png')}
                                            style={{ height: 20, width: 20 }}
                                            resizeMode={'contain'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }}
                    />
                </View>
            </View>
        );
    }
}

Requests.propTypes = {
    navigation: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    getRequests: PropTypes.func.isRequired,
    acceptRequest: PropTypes.func.isRequired,
    declineRequest: PropTypes.func.isRequired,
    getNotifications: PropTypes.func.isRequired,

};

function mapStateToProps(state) {
    return {
        navigationState: state.navigation,
        isLoggedIn: state.auth.isLoggedIn,
        user: state.auth.user,
        token: state.auth.token,
        requests: state.request.requests

    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Requests);