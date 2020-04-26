import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Vibration,
    ToastAndroid,
    Modal,
    Dimensions,
    TextInput,
    FlatList,
    Alert,
    Linking,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from "../../actions";
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';
import API from '../../lib/api';
import Loader from '../../components/Loader';

import {spinner} from "../../actions/spinner";

let { height, width } = Dimensions.get('window');
let DEFAULT_IMAGE = require('../images/pp.png');
let tempId, timeoutHandler;

class  Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar: DEFAULT_IMAGE,
            avatar_modal: false,
            name_modal: false,
            username_modal: false,
            qr_modal: false,
            platform_modal: false,
            platform_search: '',
            searched_platforms: [],
            add_platform_modal: false,
            platform_params: {
                platform_id: '',
                add_platform_name: '',
                add_platform_image: '',
                platform_name: ''
            },
            name: '',
            username: '',
            qr_code: '',
            edit_id: ''
        }
    }

    componentDidMount() {
        this.props.getNotificationCount(this.props.token);
        this.userImage(this.props.user.avatar);
        API.get(`/users/qr_code?authorization_token=${this.props.token}`).then(resp => {
            if(resp.url) {
                this.setState({
                    qr_code: resp.url
                });
            }
        });
        this.props.getUserPlatforms(this.props.token)
    }
    // TODO make common function for userimage
    userImage = (image = null) => {
        if(image != null) {
            let avatar = {uri: `${API.BASE_URL}/${image}` }
            this.setState({ avatar })
        }
    };

    onChange = text =>
        this.setState({
            name:  text
        });

    validate = (name) => {
        const errors = {};
        if (!name || name.length < 1) errors.name = "Please fill your name";
        return errors;
    };

    showImagePicker = (token) => {
        let options = {
            title: 'Select Avatar',
            customButtons: [
                { name: 'remove', title: 'Remove photo' },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        ImagePicker.showImagePicker(options, (response) => {
            if (response.error) {
                ToastAndroid.show('There was some error', ToastAndroid.SHORT);
            }
            else {
                if (response.didCancel) {
                } else if (response.customButton) {
                    this.props.navigation.dispatch(spinner(true));
                    this.props.removeAvatar(token).then(resp => {
                        this.props.navigation.dispatch(spinner(false));
                        if(resp.status) {
                            ToastAndroid.show('Avatar removed successfully', ToastAndroid.SHORT);
                            this.setState({ avatar: DEFAULT_IMAGE })
                        }
                    })
                } else {
                    this.props.navigation.dispatch(spinner(true));
                    this.props.updateAvatar({
                        avatar: 'data:image/jpeg;base64,' + response.data
                    }, token).then(resp => {
                        this.props.navigation.dispatch(spinner(false));
                        if(resp.status) {
                            ToastAndroid.show('Avatar uploaded successfully', ToastAndroid.SHORT);
                            let userAvatar = { uri: response.uri, isStatic: true };
                            this.setState({ avatar: userAvatar })
                        } else {
                            ToastAndroid.show('There was some error', ToastAndroid.SHORT);
                        }
                    })
                }
            }
        });
    };

    _updateName() {
        const errors = this.validate(this.state.name);
        if (Object.keys(errors).length === 0) {
            this.props.updateName({ name: this.state.name },  this.props.token)
        } else {
            ToastAndroid.show(errors.name, 1000);
        }
    }

    _updateUsername() {
        const errors = this.validate(this.state.username);
        if (Object.keys(errors).length === 0) {
            this.props.updateUsername({user: { username: this.state.username }}, this.props.token)
        } else {
            ToastAndroid.show(errors.name, 1000);
        }

    }

    _fetchPlatforms() {
        this.props.getPlatforms(this.props.token)
            .then((resp) => {
                this.setState({
                    platform_modal: true,
                    searched_platforms: resp
                });
            });

    }

    _addUserPlatform() {

        this.props.addUserPlatform({
            user_platform: {
                platform_id: this.state.platform_params.platform_id,
                url: this.state.platform_params.platform_name
            }
        }, this.props.token).then(resp => {

            if(resp.status === 'success') {
                ToastAndroid.show('Platform Added successfully', 1000);
                this.setState({
                    add_platform_modal: false,
                    platform_params: { platform_name: '' }
                });
            }
        })

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

    _onDoubleClick(item) {
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

    _userPlatform = (item) => {
        let image_url = API.BASE_URL + item.icon.url;
        return (
            <TouchableOpacity
                style={ styles.platformRow }
                onPress={() => {
                    this.setState({
                        platform_modal: !this.state.platform_modal,
                        add_platform_modal: true,
                        platform_params: {
                            platform_id: item.id,
                            add_platform_name: item.name,
                            add_platform_image: image_url,
                            platform_name: ''
                        },
                        platform_search: '',
                        searched_platforms: []
                    });
                }}
            >
                <Image
                    source={{ uri: image_url }}
                    style={{ height: 20, width: 20 }}
                    resizeMode={'contain'}
                />
                <Text style={{ color: 'black', fontSize: 16, flex: 1, marginLeft: 10 }}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        );
    };


    renderPlatform(item) {
        let image_url = API.BASE_URL + item.platform_icons.icon;
        let lock = require('../images/lock.png');
        let newVisibility = true;
        if(item.visibility) {
            lock = require('../images/open.png');
            newVisibility = false;
        }

        return (
            <TouchableWithoutFeedback
                onLongPress={() => {
                    Vibration.vibrate(150);
                    this.setState({
                        edit_id: item.id
                    });
                    Alert.alert('Are you sure?', 'Do you really want to delete this platform?', [
                        { text: 'Cancel' },
                        { text: 'Delete', onPress: () => {
                                this.props.deleteUserPlatform(this.state.edit_id, this.props.token)
                                    .then(resp => {
                                        if(resp.status) {
                                            this.props.getUserPlatforms(this.props.token);
                                            ToastAndroid.show('Platform deleted successfully.', 1000);
                                        } else {
                                            ToastAndroid.show('There was an error in adding platform.', 1000);
                                        }
                                    });
                            }}
                    ]);
                }}
                onPress={() => {
                    this._onDoubleClick(item);
                }}
            >
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.35)', paddingHorizontal: 10, paddingVertical: 5, margin: 10, borderRadius: 10, }}>
                    <Image
                        source={{ uri: image_url }}
                        style={{ height: 40, width: 40 }}
                        resizeMode={'contain'}
                    />
                    <Text style={{ flex: 1, marginHorizontal: 10, color: 'white', fontSize: 16 }}>{item.url}</Text>
                    <TouchableOpacity
                        style={{ margin: -10, padding: 10, paddingLeft: 25 }}
                        onPress={() => {
                            this.props.updateUserPlatform(item, newVisibility, this.props.token)
                                .then(resp => {
                                    if(resp.status === 'success') {
                                        this.props.getUserPlatforms(this.props.token);
                                        ToastAndroid.show(`Privacy changed`, 1000);
                                    }
                                });
                        }}
                    >
                        <Image
                            source={lock}
                            style={{ height: 20, width: 20 }}
                            resizeMode={'contain'}
                        />
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>

        )
    }

    render() {
        const { name, username, platform_params } = this.state;
        const { user, token, loading } = this.props;
        return (
            <View style={styles.container}>
                <Loader loading={loading}/>
                <View style={ styles.top}>
                    <View style={ styles.imageContainer}>
                        <TouchableOpacity
                            onLongPress={() => {
                                Vibration.vibrate(150);
                                this.showImagePicker(token);
                            }
                            }
                            onPress={() => {
                                this.setState({
                                    avatar_modal: true
                                });
                            }}
                        >
                            <Image
                                source={ this.state.avatar }
                                style={{ height: 100, width: 100, borderRadius: 110 / 2 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={ styles.nameContainer }>
                        <TouchableWithoutFeedback
                            onLongPress={() => {
                                Vibration.vibrate(150);
                                this.setState({
                                    name_modal: true,
                                });
                            }}
                        >
                            <View>
                                <Text style={ styles.name }>
                                { user.name }
                            </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={ styles.qrContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    qr_modal: true
                                });
                            }}
                            onLongPress={() => {
                                Vibration.vibrate(150);
                                this.setState({
                                    username_modal: true,
                                });
                            }}>
                            <View style={{ alignItems: 'center' }}>
                                <Image source={require('../images/qr.png')} style={ styles.qrImage } />
                                <Text style={ styles.byteId }>{ user.username }</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={ styles.btnContainer }>
                    <TouchableOpacity
                        onPress={() => {
                            this._fetchPlatforms();
                        }}>
                        <View style={ styles.btnPlatform }>
                            <Text style={ styles.socialText }>Add Social Media</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={ styles.line }/>
                <FlatList
                    data={this.props.user_platforms}
                    renderItem={({item}) => this.renderPlatform(item)}
                    style={{ marginTop: 15 }}
                    keyExtractor={(item, index) => {
                        return item.id.toString()
                    }}
                />
                { /* TODO Make a common modal component*/   }
                <Modal
                    animationType={'slide'}
                    transparent={true}
                    visible={this.state.avatar_modal}
                    onRequestClose={() => {
                        this.setState({
                            avatar_modal: false
                        });
                    }}
                >
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.setState({
                                avatar_modal: false
                            });
                        }}
                    >
                        <View style={ [styles.modalContainer, { alignItems: 'center' }] }>
                            <View style={ styles.avatarBackground }>
                                <Image
                                    source={this.state.avatar}
                                    style={ styles.modalAvatar }
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                <Modal
                    animationType={'slide'}
                    transparent={true}
                    visible={this.state.name_modal}
                    onRequestClose={() => {
                        this.setState({
                            name_modal: false
                        });
                    }}
                >
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.setState({
                                name_modal: false
                            });
                        }}
                    >
                        <View style={ styles.modalContainer }>
                            <View style={ styles.modalBG }>
                                <Text style={ styles.modalH3 }>Change name</Text>
                                <View style={[styles.formContainer, { margin: 10 }]}>
                                    <Icon name="user" size={25} color="#000" style={ styles.icons } />
                                    <TextInput
                                        value={ name }
                                        style={ styles.inputField }
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={true}
                                        onChangeText={ (text) => { this.onChange(text) } }
                                        placeholder={'Full Name'}
                                        underlineColorAndroid={'transparent'}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={ styles.saveBtn }
                                    onPress={ () => { this._updateName() } }
                                >
                                    <Text style={ styles.saveBtnText }>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                <Modal
                    animationType={'slide'}
                    transparent={true}
                    visible={this.state.username_modal}
                    onRequestClose={() => {
                        this.setState({
                            username_modal: false
                        });
                    }}
                >
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.setState({
                                username_modal: false
                            });
                        }}
                    >
                        <View style={ styles.modalContainer }>
                            <View style={ styles.modalBG }>
                                <Text style={ styles.modalH3 }>Change name</Text>
                                <View style={[styles.formContainer, { margin: 10 }]}>
                                    <Icon name="user" size={25} color="#000" style={ styles.icons } />
                                    <TextInput
                                        value={ username }
                                        style={ styles.inputField }
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={true}
                                        onChangeText={ (text) => {
                                            this.setState({ username: text });
                                        } }
                                        placeholder={'New Username'}
                                        underlineColorAndroid={'transparent'}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={ styles.saveBtn }
                                    onPress={ () => { this._updateUsername() } }
                                >
                                    <Text style={ styles.saveBtnText }>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.qr_modal}
                    onRequestClose={() => {
                        this.setState({
                            qr_modal: false
                        });
                    }}
                >
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.setState({
                                qr_modal: false
                            });
                        }}
                    >
                        <View style={[styles.modalContainer, { alignItems: 'center' }]}>
                            <View style={styles.modalBG}>
                                <View style={styles.qrTextWrapper}>
                                    <Text style={ styles.modalH2 }>My QR Code</Text>
                                </View>
                                {this.state.qr_code.length > 0 ?
                                    <Image
                                        style={{ width: (width - 40), height: ( width - 40 ) }}
                                        resizeMode={'contain'}
                                        source={{ uri: API.BASE_URL + this.state.qr_code, cache: true }}
                                    /> : null}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                <Modal
                    animationType={'slide'}
                    transparent={true}
                    visible={this.state.platform_modal}
                    onRequestClose={() => {
                        this.setState({
                            platform_modal: false,
                        });
                    }}
                >
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.setState({
                                platform_modal: false,
                            });
                        }}
                    >
                        <View
                            style={styles.modalContainer }
                        >
                            <View style={ styles.modalBG}>
                                <Text style={styles.modalH2}>Add Social Media</Text>
                                <TextInput
                                    placeholder={'Search...'}
                                    style={ styles.searchField }
                                    underlineColorAndroid={'transparent'}
                                    value={this.state.platform_search}
                                    onChangeText={(platform_search) => {
                                        let p = this.props.platforms;
                                        let sp = p.filter((item) => {
                                            return item.name.toLowerCase().match(`^${platform_search.toLowerCase()}`);
                                        });
                                        this.setState({
                                            platform_search: platform_search,
                                            searched_platforms: sp
                                        });
                                    }}
                                />
                                <FlatList
                                    data={this.state.searched_platforms}
                                    renderItem={({item}) => this._userPlatform(item)}
                                    style={{ height: 210 }}
                                    keyExtractor={(item, index) => item.id.toString()}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                <Modal
                    animationType={'slide'}
                    transparent={true}
                    visible={this.state.add_platform_modal}
                    onRequestClose={() => {
                        this.setState({
                            add_platform_modal: false
                        });
                    }}
                >
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.setState({
                                add_platform_modal: false
                            });
                        }}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalBG}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 10 }}>
                                    <Image
                                        source={{ uri: platform_params.add_platform_image }}
                                        style={{ height: 40, width: 40 }}
                                    />
                                    <Text style={{ flex: 1, marginHorizontal: 10, textAlign: 'center', fontSize: 16, color: 'black' }}>{platform_params.add_platform_name}</Text>
                                </View>
                                <View style={styles.formContainer}>
                                    <TextInput
                                        value={ platform_params.platform_name }
                                        style={ styles.inputField }
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        autoFocus={true}
                                        onChangeText={ (text) => {
                                            this.setState({ platform_params: { ...platform_params, platform_name: text }  });
                                        } }
                                        placeholder={'Platform name'}
                                        underlineColorAndroid={'transparent'}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={{ height: 40, margin: 10, backgroundColor: 'white', borderWidth: 1.5, justifyContent: 'center', borderRadius: 10 }}
                                    onPress={() => {
                                        this._addUserPlatform();
                                    }}
                                >
                                    <Text style={{ textAlign: 'center', color: 'black' }}>Add</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        );
    }
}


Profile.propTypes = {
    navigation: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    removeAvatar: PropTypes.func.isRequired,
    updateName: PropTypes.func.isRequired,
    updateUsername: PropTypes.func.isRequired,
    getPlatforms: PropTypes.func.isRequired,
    getUserPlatforms: PropTypes.func.isRequired,
    addUserPlatform: PropTypes.func.isRequired,
    deleteUserPlatform: PropTypes.func.isRequired,
    updateUserPlatform: PropTypes.func.isRequired,
    platforms: PropTypes.array,
    getNotificationCount: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        navigationState: state.navigation,
        isLoggedIn: state.auth.isLoggedIn,
        user: state.auth.user,
        platforms: state.platform.platforms,
        user_platforms: state.user_platform.user_platforms,
        token: state.auth.token,
        loading: state.spinner.show,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);