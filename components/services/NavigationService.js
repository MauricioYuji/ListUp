import { NavigationActions } from 'react-navigation';
import { DeviceEventEmitter } from 'react-native';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

function navigate(routeName, params) {
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params,
        })
    );
}
function goback() {
    console.log("GO BACK");

    DeviceEventEmitter.emit('refresh', true);
    _navigator.dispatch(
        NavigationActions.back()
    );
}

// add other navigation functions that you need and export them

export default {
    navigate,
    setTopLevelNavigator,
    goback
};