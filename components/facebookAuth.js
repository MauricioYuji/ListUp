import firebase from 'firebase';
import { Constants, Facebook } from 'expo';
//import { getUserInfo, saveUserInfo } from './Service';

//export const signInWithFacebook = () => {

//};

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
            await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);  // Set persistent auth state
            const credential = firebase.auth.FacebookAuthProvider.credential(token);
            const facebookProfileData = await firebase.auth().signInAndRetrieveDataWithCredential(credential);  // Sign in with Facebook credential
            const userdata = facebookProfileData.user.providerData[0];


            //var user = firebase.auth().currentUser;
            //if (!user.emailVerified) {
            //    user.updateProfile({
            //        photoURL: userdata.photoURL + "?type=large",
            //        emailVerified: true,
            //        test: 'asdasdasdasdasdasdasdasdasd'
            //    }).then(function () {
            //        // Update successful.
            //        console.log("user: ", user);

            //        //user.sendEmailVerification().then(function () {
            //        //    // Email sent.
            //        //    console.log("SEND EMAIL");
            //        //}).catch(function (error) {
            //        //    // An error happened.
            //        //});
            //    }).catch(function (error) {
            //        // An error happened.
            //    });
            //}

            //console.log("firebase.auth(): ", firebase.auth());
            //console.log("firebase.auth(): ", firebase.auth().currentUser.uid);
            //console.log("facebookProfileData: ", facebookProfileData.user.providerData[0]);
            //console.log("facebookProfileData: ", facebookProfileData.user.providerData[0].photoURL);

            //getUserInfo(firebase.auth().currentUser.uid).then((res) => {
            //    if (res === null) {
            //        saveUserInfo(firebase.auth().currentUser.uid, userdata.displayName, userdata.photoURL).then((res) => {
            //            console.log("res: ", res);
            //        });
            //    }
            //});



            // Do something with Facebook profile data
            // OR you have subscribed to auth state change, authStateChange handler will process the profile data

            return Promise.resolve({ type: 'success' });
        }
        case 'cancel': {
            return Promise.reject({ type: 'cancel' });
        }
    }
}