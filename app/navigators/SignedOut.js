import { StackNavigator, TabNavigator } from "react-navigation";

import Login from "../screens/login";
import Register from "../screens/register";

export default SignedOut = StackNavigator({
    Login: {
        screen: Login,
        navigationOptions: {
            header: null
        }
    },
    Register: {
        screen: Register,
        navigationOptions: {
            header: null
        }
    }

});