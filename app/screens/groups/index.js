import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ListView,
    Image,
    AsyncStorage,
    InteractionManager,
    FlatList,
    Modal,
    Vibration,
    Alert,
    ToastAndroid,
    NetInfo,
    TextInput
} from 'react-native';
import PropTypes from 'prop-types';
import API from '../../lib/api';
import IconM from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import { bindActionCreators } from "redux";
import {ActionCreators} from "../../actions";
import {connect} from "react-redux";
import {FRIEND_PROFILE} from "../../actions/types";

import HideableView from '../../components/HideableView';

const DEFAULT_IMAGE = require('../images/pp.png');

class Groups extends Component {

    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            group_search: '',
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.getGroups(this.props.token)
                .then(resp => {
                    this.setState({
                        groups: resp.groups
                    });
                    resp.groups.forEach((group) => {
                        this.setState({
                            [group.group_name]: false
                        });
                    });
                });
        });
    }


    userImage = (image = null) => {
        if(image != null) {
            return {uri: `${API.BASE_URL}/${image}` }
        } else {
            return DEFAULT_IMAGE;
        }
    };

    toggleGroup(name, id) {
        let v = true;
        if(this.state[name]) {
            v = false;
        }

        this.props.getGroupMembers(id, this.props.token).then(resp => {
            if(resp.status) {
                this.setState({
                    [name]: v
                });
            }
        });

    }

    renderFriendRow(friend) {
        return <TouchableOpacity
            style={{ marginLeft: 100, flexDirection: 'row', marginVertical: 5 }}
            onPress={() => {
                this.props.navigation.dispatch({ type: FRIEND_PROFILE, profile_id: friend.username })
            }}
        >
            <Image
                source={this.userImage(friend.avatar)}
                style={{ height: 50, width: 50, borderRadius: 25 }}
            />
            <View style={{ marginLeft: 10, justifyContent: 'center' }}>
                <Text style={{ color: 'white' }}>{friend.name}</Text>
                {friend.nickname ? <Text style={{ color: 'white', fontStyle: 'italic', fontWeight: 'bold' }}>({friend.nickname})</Text> : null}
            </View>
        </TouchableOpacity>
    }

    _deleteGroup(id) {
        this.props.deleteGroup(id, this.props.token)
            .then(resp => {
                if(resp.status) {
                    this.props.getGroups(this.props.token)
                        .then(resp => {
                            this.setState({
                                groups: resp.groups
                            });
                            resp.groups.forEach((group) => {
                                this.setState({
                                    [group.group_name]: false
                                });
                            });
                        });
                }
            })
    }

    renderGroupRow(group) {
        return <View>
            <TouchableOpacity
                onPress={() => this.toggleGroup(group.group_name, group.group_id)}
                onLongPress={() => {
                    Vibration.vibrate(150);
                    Alert.alert('Are you sure?', 'Do you really want to delete this list?', [
                        { text: 'Cancel' },
                        { text: 'Delete', onPress: () => {
                                this._deleteGroup(group.group_id);
                            }}
                    ]);
                }}
                style={ styles.group}
            >
                <View style={styles.groupIcon}>
                    <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>{group.group_name.split('')[0].toUpperCase()}</Text>
                </View>
                <Text style={ [styles.groupName, { fontWeight: 'bold', fontSize: 16 }]}>{group.group_name.toUpperCase()}</Text>
                <Text style={[styles.groupName, {  fontStyle: 'italic', marginLeft: 5 }]}>({group.member_count} {group.member_count > 1 ? 'Friends' : 'Friend'})</Text>
            </TouchableOpacity>

            <HideableView visible={this.state[group.group_name]} removeWhenHidden>
                <FlatList
                    data={this.props.group_members}
                    renderItem={({item}) => this.renderFriendRow(item)}
                    style={{ marginTop: 10 }}
                    keyExtractor={(item, index) => {
                        return item.key.toString()
                    }}
                />
            </HideableView>
        </View>
    }


    render() {
        let placeholder = `${this.props.groups.length} ${this.props.groups.length > 1 ? 'Lists' : 'List'}`;
        return <View style={styles.container} >
            <View style={{ flex: 1 }}>
                <View style={{ height: 60, marginBottom: 20}}>
                    <View style={ styles.formContainer }>
                        <IconM name="search" size={25} color="#828282" style={ styles.icons } />
                        <TextInput
                            style={ styles.inputField }
                            autoCapitalize='none'
                            autoCorrect={false}
                            value={this.state.group_search}
                            onChangeText={group_search => {
                                this.setState({ group_search });
                                let groups = this.props.groups;
                                let new_groups = groups.filter((item) => {
                                    return item.group_name.toLowerCase().match(`^${group_search}`);
                                });

                                this.setState({
                                    groups: new_groups
                                });
                            }}
                            placeholder={placeholder}
                            placeholderTextColor="#d9dbd0"
                            underlineColorAndroid={'transparent'}
                        />
                    </View>
                </View>
                <FlatList
                    data={this.state.groups}
                    renderItem={({item}) => this.renderGroupRow(item)}
                    keyExtractor={(item, index) => {
                        return item.group_id.toString()
                    }}
                    style={{ flex: 1 }}
                />
            </View>
        </View>
    }
}

Groups.propTypes = {
    navigation: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    getGroups: PropTypes.func.isRequired,
    addGroup: PropTypes.func.isRequired,
    getGroupMembers: PropTypes.func.isRequired,
    deleteGroup: PropTypes.func.isRequired,
    getNotificationCount: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        navigationState: state.navigation,
        isLoggedIn: state.auth.isLoggedIn,
        user: state.auth.user,
        token: state.auth.token,
        groups: state.group.groups,
        group_members: state.group.group_members
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Groups);