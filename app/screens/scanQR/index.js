import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ToastAndroid,
    Dimensions,
    Animated,
} from 'react-native';

import { RNCamera } from 'react-native-camera';
import {FRIEND_PROFILE} from "../../actions/types";

let { height } = Dimensions.get('window');

export default class ScanQR extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barCodeFlag: true,
            top: new Animated.Value(0)
        }
    }

    componentDidMount() {
        Animated.loop(
            Animated.sequence(
                [
                    Animated.timing(this.state.top, {
                        toValue: (height - 328),
                        duration: 3000,
                        useNativeDriver: true
                    }),
                    Animated.timing(this.state.top, {
                        toValue: 0,
                        duration: 3000,
                        useNativeDriver: true
                    })
                ]
            )
        ).start();
    }


    componentWillUnmount() {
        this.props.navigation.navigate({
            routeName: 'Profile'
        });
    }

    onBarCodeRead(result) {
        if (this.state.barCodeFlag) {
            this.setState({
                barCodeFlag: false
            });
            ToastAndroid.show('User found ' + result.data, 1000);
            this.props.navigation.dispatch({ type: FRIEND_PROFILE, profile_id: result.data })
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ height: 80, justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', color: 'black', fontSize: 22 }}>Scan QR code to add friend.</Text>
                </View>
                <RNCamera
                    onBarCodeRead={(result) => this.onBarCodeRead(result)}
                    style={styles.camera}
                >
                    <View
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', height: 50 }}
                    />
                    <View style={{ height: height - 330, flexDirection: 'row' }}>
                        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', flex: 1 }} />
                        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0)', flex: 8 }}>
                            <Animated.View style={{ height: 1, borderBottomColor: '#00FF00', borderBottomWidth: 1, transform: [{ translateY: this.state.top }] }} />
                        </View>
                        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', flex: 1 }} />
                    </View>
                    <View
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', height: 150 }}
                    />
                </RNCamera>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    camera: {
        flex: 1,
    }
});