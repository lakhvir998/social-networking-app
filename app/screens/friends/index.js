import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    InteractionManager,
    FlatList,
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

const DEFAULT_IMAGE = require('../images/pp.png');

class Friends extends Component {

    constructor(props) {
        super(props);
        this.state = {
            friends: [],
            friend_search: '',
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.getFriends(this.props.token)
                .then(resp => {
                    this.setState({
                        friends: resp.friends
                    })
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

    render() {
        let placeholder = `${this.props.friends.length} ${this.props.friends.length > 1 ? 'Contacts' : 'Contact'}`;
        return <View style={styles.container} >
            <View style={{ flex: 1 }}>
                <View style={{ height: 60, marginBottom: 20 }}>
                    <View style={ styles.formContainer }>
                        <IconM name="search" size={25} color="#828282" style={ styles.icons } />
                        <TextInput
                            style={ styles.inputField }
                            autoCapitalize='none'
                            autoCorrect={false}
                            value={this.state.friend_search}
                            onChangeText={friend_search => {
                                this.setState({ friend_search });
                                let friends = this.props.friends;
                                let new_friends = friends.filter((item) => {
                                    return item.name.toLowerCase().indexOf(friend_search) >= 0 || (item.nickname && item.nickname.toLowerCase().indexOf(friend_search) >= 0);
                                });

                                this.setState({
                                    friends: new_friends
                                });
                            }}
                            placeholder={placeholder}
                            placeholderTextColor="#d9dbd0"
                            underlineColorAndroid={'transparent'}
                        />
                    </View>
                </View>

                <FlatList
                    data={this.state.friends}
                    renderItem={({item}) => this.renderFriendRow(item)}
                    keyExtractor={(item, index) => {
                        return item.friend_id.toString()
                    }}
                    style={{ flex: 1 }}
                />
            </View>
        </View>
    }
}

Friends.propTypes = {
    navigation: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    getGroups: PropTypes.func.isRequired,
    addGroup: PropTypes.func.isRequired,
    getFriends: PropTypes.func.isRequired,
    getNotificationCount: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        navigationState: state.navigation,
        isLoggedIn: state.auth.isLoggedIn,
        user: state.auth.user,
        token: state.auth.token,
        groups: state.group.groups,
        friends: state.friend.friends,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Friends);