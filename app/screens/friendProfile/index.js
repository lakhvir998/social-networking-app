import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Image,
    Text,
    Dimensions,
    FlatList,
    TouchableOpacity,
    ToastAndroid,
    Linking,
    Modal,
    TextInput,
    Vibration,
    TouchableWithoutFeedback,
    Share,
    NetInfo
} from 'react-native';

import IconFA from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome';
let { height, width } = Dimensions.get('window');
import {connect} from "react-redux";
import { bindActionCreators } from 'redux';
import API from '../../lib/api';
import { spinner } from "../../actions/spinner";
import styles from './styles';
import {ActionCreators} from "../../actions";

let  tempId, timeoutHandler;
let DEFAULT_IMAGE = require('../images/pp.png');

class FriendProfile extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            title: params ? `${params.profile_id.toUpperCase()}'s Profile` : 'Friend Profile',
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            avatar: DEFAULT_IMAGE,
            platforms: [],
            status: -1,
            user: {
                name: '',
                id: 0,
                nickname: ''
            },
            nickname: '',
            list_id: null,
            friend_modal: false,
            list_modal: false,
            group_search: '',
            groups: [],
            original_groups: [],
            new_list_modal: false,
            new_list: '',
            loaded: false
        }
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        const profile_id = params ? params.profile_id : null;
        this.props.navigation.dispatch(spinner(true));
        API.get(`/users/${profile_id}?authorization_token=${this.props.token}`)
            .then(resp => {
                let status;
                if(resp.status === 0) {
                    status = 0;
                } else if(resp.status.status === false) {
                    if(resp.status.user_id === this.props.user.id) {
                        status = 2;
                    } else {
                        status = 3;
                    }
                } else if(resp.status.status) {
                    status = 1;
                }
                this.userImage(resp.user.avatar);
                this.setState({
                    status: status,
                    user: resp.user,
                    platforms: resp.user_platforms
                });
            });

        this.props.navigation.dispatch(spinner(false));
    }

    userImage = (image = null) => {

        if(image != null) {
            let avatar = {uri: `${API.BASE_URL}/${image}` };
            this.setState({ avatar })
        }
    };


    parse(str) {
        let args = [].slice.call(arguments, 1),
            i = 0;

        return str.replace(/%s/g, function() {
            return args[i++];
        });
    }

    openAppTemplate(item) {
        return new Promise((resolve, reject) => {
            if (item.app_template && item.app_template.length > 0) {
                Linking.canOpenURL(`${item.app_template}${item.url}`).then(supported => {
                    if (!supported) {
                        reject();
                    } else {
                        resolve();
                        Linking.openURL(`${item.app_template}${item.url}`);
                    }
                }).catch(err => reject());
            } else {
                reject();
            }
        });
    }

    openWebTemplate(item) {
        return new Promise((resolve, reject) => {
            if(item.web_template && item.web_template.length > 0) {
                Linking.canOpenURL(`${item.web_template}${item.url}`).then(supported => {
                    if(!supported) {
                        reject();
                    } else {
                        resolve();
                        Linking.openURL(`${item.web_template}${item.url}`)
                    }
                }).catch(err => reject());
            } else {
                reject();
            }
        })
    }

    checkDoubleClick(item) {
        if (tempId === item.id) {
            this.openAppTemplate(item).then().catch(() => {
                this.openWebTemplate(item);
            }).then().catch(() => {
                ToastAndroid.show('Not supported', ToastAndroid.SHORT);
            });
        } else {
            clearTimeout(timeoutHandler);
            tempId = item.id;
            timeoutHandler = setTimeout(() => {
                tempId = null;
            }, 500);
        }
    }

    requestUserPlatform(user_id, platform_id) {
        this.props.platformPermission({
            user_id: user_id,
            user_platform_id: platform_id
        }, this.props.token).then(resp => {
            if(resp.status) {
                let platforms = this.state.platforms;
                platforms = platforms.map((platform) => {
                    if(platform.id === platform_id) {
                        platform.requested = true;
                    }
                    return platform;
                });

                this.setState({
                    platforms: platforms
                });
            } else {
                ToastAndroid.show(resp.error, ToastAndroid.SHORT);
            }
        })
    }

    cancelUserPlatform(user_id, platform_id) {
        this.props.cancelPlatformPermission({
            user_id: user_id,
            user_platform_id: platform_id
        }, this.props.token).then(resp => {
            if (resp.status) {
                let platforms = this.state.platforms;

                platforms = platforms.map((platform) => {
                    if (platform.id === platform_id) {
                        platform.requested = false;
                    }
                    return platform;
                });

                this.setState({
                    platforms: platforms
                });
            }
        });
    }

    renderPlatform(item) {
        let image_url = API.BASE_URL + item.platform_icons.icon;
        let bg_color = 'rgba(0, 0, 0, 0.4)';
        let content = <View style={{ flex: 1, alignItems: 'center' }}>
            <TouchableOpacity
                style={{ padding: 5, backgroundColor: 'white', borderRadius: 5, borderWidth: 1, borderColor: 'black' }}
                onPress={() => {
                    let { user } = this.state;
                    if(item.requested) {
                        this.cancelUserPlatform(user.id, item.id);
                    } else {
                        this.requestUserPlatform(user.id, item.id);
                    }
                }}
            >
                <Text style={{ color: '#3b3b3b' }}>{item.requested ? "Cancel Request" : "Request Profile"}</Text>
            </TouchableOpacity>
        </View>;
        if(item.url.length > 0) {
            bg_color = '#E8F6F7';
            content = <Text style={{ flex: 1, marginHorizontal: 10, color: 'black', fontSize: 16 }}>{item.url}</Text>;
        }
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    this.checkDoubleClick(item);
                }}
            >
                <View style={{ backgroundColor: bg_color, flexDirection: 'row', alignItems: 'center', flex: 1, padding: 10, margin: 10, borderRadius: 10 }}>
                    <Image
                        source={{ uri: image_url }}
                        style={{ height: 40, width: 40, borderRadius: 20 }}
                        resizeMode={'contain'}
                    />
                    {content}
                </View>
            </TouchableWithoutFeedback>
        )
    }

    addFriend(friend_id, nickname, list_id) {
        this.props.sendFriendRequest({
            friend: {
                friend_id: friend_id,
                nickname: nickname,
                list_id: list_id
            }
        }, this.props.token).then(resp => {
            if(resp.status) {
                this.setState({
                    status: 2
                });
            }
        });
    }
    _cancelFriendRequest(){
        this.props.cancelFriendRequest(this.state.user.id, this.props.token)
            .then(() => {
                this.props.navigation.goBack();
            })

    }

    _onRequestAccept() {
        this.props.acceptFriendRequest(this.state.user.id, this.props.token)
            .then(resp => {
                this.setState({
                    status: 1
                });
            })

    }

    renderButton(status) {
        if(status === 0) {
            return <TouchableOpacity
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', margin: 20, padding: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                onPress={() => {
                    this.setState({
                        friend_modal: true
                    });
                }}
            >
                <IconFA name={'plus'} color={'white'} size={20} />
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center', marginLeft: 10 }}>ADD FRIEND</Text>
            </TouchableOpacity>;
        } else if(status === 2) {
            return <TouchableOpacity
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', margin: 20, padding: 15, borderRadius: 10 }}
                onPress={() => {
                    this._cancelFriendRequest();
                }}
            >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>CANCEL REQUEST</Text>
            </TouchableOpacity>;
        } else if(status === 1) {
            return null;
        } else if(status === 3) {
            return <TouchableOpacity
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', margin: 20, padding: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                onPress={() => {
                    this._onRequestAccept();
                }}
            >
                <IconFA name={'check'} color={'white'} size={20} />
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center', marginLeft: 10 }}>ACCEPT REQUEST</Text>
            </TouchableOpacity>;
        } else {
            return null;
        }
    }

    renderGroupRow(item) {
        return (
            <TouchableOpacity
                onPress={() => {
                    if(this.state.list_id === item.group_id) {
                        this.setState({
                            list_id: null
                        })
                    } else {
                        this.setState({
                            list_id: item.group_id
                        });
                    }
                }}
                style={{ backgroundColor: this.state.list_id === item.group_id ? '#959595' : '#FFF', padding: 10, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1.5, borderColor: 'black' }}
            >
                <Text style={{ color: 'black', fontSize: 16, flex: 1, marginLeft: 10 }}>
                    {item.group_name}
                </Text>
            </TouchableOpacity>
        );
    }

    addToGroup(user_id, group_id) {
        this.props.addGroupMember({
            group_member: {
                group_id: group_id,
                friend_id: user_id
            }
        }, this.props.token);

    }

    changeNickname() {
        this.props.changeNickname({
            friend_id: this.state.user.id,
            nickname: this.state.user.nickname
        }, this.props.token).then(resp => {
            if(resp.status) {
                this.setState({
                    friend_modal: false
                });
            }
        })
    }

    _getGroups(){
        this.props.getGroups(this.props.token)
            .then((resp) => {
                this.setState({
                    list_modal: true,
                    friend_modal: false,
                    groups: resp.groups
                });
            });
    }

    addList() {
        this.props.addGroup({
            group: {
                name: this.state.new_list
            }
        }, this.props.token)
            .then(resp => {
                if(resp.status) {
                    ToastAndroid.show('List added', ToastAndroid.SHORT);
                    this._getGroups();
                    this.setState({
                        new_list_modal: false
                    });
                }

            })
    }
    _onAddListPress() {
        this._getGroups();

    }

    render() {
        let item =  this.renderButton(this.state.status);
        return <View style={styles.container} >
            <View style={{ flex: 1 }}>
                {
                    this.state.status === 1 ?
                        <View>
                            <TouchableOpacity
                                style={ styles.btnLeft }
                                onPress={() => {
                                    this.setState({
                                        list_modal: true
                                    });
                                }}
                            >
                                <Image
                                    source={require('../images/add.png')}
                                    style={ styles.topBtnIcons }
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={ styles.btnRight }
                                onPress={() => {
                                    Share.share({
                                        message: `Check ${this.state.user.name}'s profile on AtDab by searching "${this.state.user.byte_id}". Download now https://play.google.com`,
                                        title: 'Download AtDab'
                                    }, {
                                        dialogTitle: 'Share profile'
                                    });
                                }}
                            >
                                <Image
                                    source={require('../images/action.png')}
                                    style={ styles.topBtnIcons }
                                />
                            </TouchableOpacity>
                        </View>
                        :
                        null
                }
                <View style={ styles.imageContainer }>
                    <Image
                        source={this.state.avatar}
                        style={ styles.userImage }
                    />
                </View>
                <TouchableWithoutFeedback
                    onLongPress={() => {
                        if(this.state.status === 1) {
                            Vibration.vibrate(150);
                            this.setState({
                                friend_modal: true
                            });
                        }
                    }}
                >
                    <View style={ styles.userName }>
                        <Text style={{ color: 'white', fontSize: 22 }}>{this.state.user.name}</Text>
                        <Text style={ styles.nickname }> {(this.state.user.nickname) ? ("(" + this.state.user.nickname + ")") : '' }</Text>
                    </View>
                </TouchableWithoutFeedback>

                <View
                    style={ styles.divider }
                />

                <FlatList
                    data={this.state.platforms}
                    keyExtractor={(item, index) => {
                        return item.id
                    }}
                    renderItem={({item}) => this.renderPlatform(item)}
                />

                {item}
            </View>
            <Modal
                animationType={'slide'}
                transparent={true}
                visible={this.state.friend_modal}
                onRequestClose={() => {
                    this.setState({
                        friend_modal: false,
                    });
                }}
            >
                <View
                    style={ styles.modalContainer }
                >
                    <View style={{ backgroundColor: 'white', borderRadius: 10, margin: 10 }}>
                        <View style={[styles.formContainer, { margin: 10 }]}>
                            <Icon name="user" size={25} color="#000" style={ styles.icons } />
                            <TextInput
                                value={ this.state.status === 0 ? this.state.nickname : this.state.user.nickname }
                                style={ styles.inputField }
                                autoCapitalize='none'
                                autoCorrect={false}
                                autoFocus={true}
                                onChangeText={(nickname) => {
                                    if(this.state.status === 0) {
                                        this.setState({ nickname })
                                    } else if(this.state.status === 1) {
                                        let { user } = this.state;
                                        user.nickname = nickname;
                                        this.setState({
                                            user: user
                                        });
                                    }
                                }}
                                placeholder={'Full Name'}
                                underlineColorAndroid={'transparent'}
                            />
                        </View>

                        { this.state.status === 0 ? <View>
                                <TouchableOpacity
                                    style={{ backgroundColor: 'white', borderWidth: 1.5, justifyContent: 'center', borderRadius: 10, height: 40, margin: 10, marginTop: 0 }}
                                    onPress={() => this._onAddListPress()}
                                >
                                    <Text style={{ textAlign: 'center', color: 'black' }}>Add to list</Text>
                                </TouchableOpacity>

                                <View style={{ height: 40, flexDirection: 'row', marginVertical: 10 }}>
                                    <TouchableOpacity
                                        style={{ flex: 1, marginHorizontal: 10, backgroundColor: 'white', borderWidth: 1.5, justifyContent: 'center', borderRadius: 10 }}
                                        onPress={() => {
                                            this.setState({
                                                friend_modal: false
                                            });
                                            this.addFriend(this.state.user.id, '', null);
                                        }}
                                    >
                                        <Text style={{ textAlign: 'center', color: 'black' }}>Skip</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ flex: 1, marginHorizontal: 10, backgroundColor: 'white', borderWidth: 1.5, justifyContent: 'center', borderRadius: 10 }}
                                        onPress={() => {
                                            this.setState({
                                                friend_modal: false
                                            });
                                            this.addFriend(this.state.user.id, this.state.nickname, null);
                                        }}
                                    >
                                        <Text style={{ textAlign: 'center', color: 'black' }}>Yes</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            : <View>
                                <TouchableOpacity
                                    style={{ backgroundColor: 'white', borderWidth: 1.5, justifyContent: 'center', borderRadius: 10, height: 40, margin: 10, marginTop: 0 }}
                                    onPress={() => {
                                        this.changeNickname();
                                    }}
                                >
                                    <Text style={{ textAlign: 'center', color: 'black' }}>Save</Text>
                                </TouchableOpacity>
                            </View> }
                    </View>
                </View>
            </Modal>

            <Modal
                animationType={'slide'}
                transparent={true}
                visible={this.state.list_modal}
                onRequestClose={() => {
                    this.setState({
                        list_modal: false,
                    });
                }}
            >
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.setState({
                            list_modal: false,
                        });
                    }}
                >
                    <View
                        style={ styles.modalContainer }
                    >
                        <View style={{ backgroundColor: 'white', borderRadius: 10, margin: 10 }}>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#000000', marginTop: 10, fontSize: 18 }}>Add to list</Text>
                            <TextInput
                                placeholder={'Search...'}
                                style={{ height: 40, borderColor: 'black', borderWidth: 1.5, margin: 10 }}
                                underlineColorAndroid={'transparent'}
                                value={this.state.group_search}
                                onChangeText={(group_search) => {
                                    let a = this.props.groups;
                                    let b = a.filter((item) => {
                                        return item.group_name.toLowerCase().match(`^${group_search}`);
                                    });
                                    this.setState({
                                        group_search: group_search,
                                        groups: b
                                    });
                                }}
                            />
                            <FlatList
                                data={this.state.groups}
                                renderItem={({item}) => this.renderGroupRow(item)}
                                keyExtractor={(item, index) => {
                                    return item.group_id.toString()
                                }}
                                style={{ height: 210 }}
                            />

                            <View style={{ height: 40, flexDirection: 'row', marginVertical: 10 }}>
                                <TouchableOpacity
                                    style={{ flex: 1, marginHorizontal: 10, backgroundColor: 'white', borderWidth: 1.5, justifyContent: 'center', borderRadius: 10 }}
                                    onPress={() => {
                                        this.setState({
                                            new_list_modal: true
                                        });
                                    }}
                                >
                                    <Text style={{ color: 'black', textAlign: 'center' }}>New List</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ flex: 1, marginHorizontal: 10, backgroundColor: 'white', borderWidth: 1.5, justifyContent: 'center', borderRadius: 10 }}
                                    onPress={() => {
                                        this.setState({
                                            list_modal: false
                                        });
                                        if(this.state.status === 0) {
                                            this.addFriend(this.state.user.id, this.state.nickname, this.state.list_id);
                                        } else {
                                            this.addToGroup(this.state.user.id, this.state.list_id);
                                        }
                                    }}
                                >
                                    <Text style={{ textAlign: 'center', color: 'black' }}>Add</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            <Modal
                animationType={'slide'}
                transparent={true}
                visible={this.state.new_list_modal}
                onRequestClose={() => {
                    this.setState({
                        new_list_modal: false
                    });
                }}
            >
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.setState({
                            new_list_modal: false
                        });
                    }}
                >
                    <View
                        style={ styles.modalContainer }
                    >
                        <View style={{ backgroundColor: 'white', borderRadius: 10, margin: 10 }}>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#000000', marginTop: 10, fontSize: 18 }}>Add new list</Text>
                            <View style={[styles.formContainer, { margin: 10 }]}>
                                <Icon name="pencil" size={25} color="#000" style={ styles.icons } />
                                <TextInput
                                    value={ this.state.new_list }
                                    style={ styles.inputField }
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    autoFocus={true}
                                    onChangeText={(new_list) => {
                                        this.setState({ new_list });
                                    }}
                                    placeholder={'Name'}
                                    underlineColorAndroid={'transparent'}
                                />
                            </View>


                            <TouchableOpacity
                                style={{ height: 40, margin: 10, backgroundColor: 'white', borderWidth: 1.5, justifyContent: 'center', borderRadius: 10 }}
                                onPress={() => {
                                    this.addList();
                                }}
                            >
                                <Text style={{ textAlign: 'center', color: 'black' }}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>;
    }
}

FriendProfile.propTypes = {
    navigation: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    getGroups: PropTypes.func.isRequired,
    addGroup: PropTypes.func.isRequired,
    getPlatforms: PropTypes.func.isRequired,
    sendFriendRequest: PropTypes.func.isRequired,
    cancelFriendRequest: PropTypes.func.isRequired,
    acceptFriendRequest: PropTypes.func.isRequired,
    changeNickname: PropTypes.func.isRequired,
    platformPermission: PropTypes.func.isRequired,
    cancelPlatformPermission: PropTypes.func.isRequired,
    addGroupMember: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        navigationState: state.navigation,
        isLoggedIn: state.auth.isLoggedIn,
        user: state.auth.user,
        token: state.auth.token,
        groups: state.group.groups
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendProfile);