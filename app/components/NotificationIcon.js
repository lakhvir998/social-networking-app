import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, Image, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from "react-redux";

class NotificationIcon extends Component {

    render() {
        const { notificationCount, iconColor } = this.props;

        // below is an example notification icon absolutely positioned
        return (
            <View style={{
                zIndex: 0,
                flex: 1,
                alignSelf: 'stretch',
                justifyContent: 'space-around',
                alignItems: 'center'}}>
                <Icon name="bell" size={25} color={iconColor} />

                {  notificationCount > 0 &&
                    (<View style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        borderRadius: 7.5,
                        height: 15,
                        width: 15,
                        backgroundColor: 'red',
                        justifyContent:'center',
                        alignItems: 'center',
                        zIndex: 2}}>
                        <Text style={{color: '#fff', fontSize: 12}}>{notificationCount}</Text>
                        </View>)
                }


            </View>
        );
    }
}

NotificationIcon.propTypes = {
    iconColor: PropTypes.string.isRequired,
};

mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        notificationCount: state.notification.count
    }
};

export default connect(mapStateToProps)(NotificationIcon);