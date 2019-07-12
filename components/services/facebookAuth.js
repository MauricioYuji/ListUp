//import firebase from 'firebase';
import { Constants, Facebook } from 'expo';

export async function signInWithFacebook() {
    const appId = Constants.manifest.extra.facebook.appId;
    const permissions = ['public_profile', 'email'];

    const {
        type,
        token,
    } = await Facebook.logInWithReadPermissionsAsync(
        appId,
        { permissions }
    );
    switch (type) {
        case 'success': {
            //await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);  // Set persistent auth state
            //const credential = firebase.auth.FacebookAuthProvider.credential(token);
            //const facebookProfileData = await firebase.auth().signInAndRetrieveDataWithCredential(credential);  // Sign in with Facebook credential
            const userdata = facebookProfileData.user.providerData[0];


            return Promise.resolve({ type: 'success' });
        }
        case 'cancel': {
            return Promise.reject({ type: 'cancel' });
        }
    }
}