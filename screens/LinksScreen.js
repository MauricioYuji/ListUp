import React from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

export default class LinksScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };
    test() {
    }
    render() {
        return (
            <ScrollView style={styles.container}>
                {/* Go ahead and delete ExpoLinksView and replace it with your
           * content, we just wanted to provide you with some helpful links */}
                <ExpoLinksView />


                <Text style={[styles.textWhite, { fontFamily: 'SourceSansPro-Black' }]}>black</Text>
                <Text style={[styles.textWhite, { fontFamily: 'SourceSansPro-BlackItalic' }]}>blackitalic</Text>
                <Text style={[styles.textWhite, { fontFamily: 'SourceSansPro-Bold' }]}>bold</Text>
                <Text style={[styles.textWhite, { fontFamily: 'SourceSansPro-BoldItalic' }]}>bolditalic</Text>
                <Text style={[styles.textWhite, { fontFamily: 'SourceSansPro-ExtraLightItalic' }]}>extralightitalic</Text>
                <Text style={[styles.textWhite, { fontFamily: 'SourceSansPro-Italic' }]}>italic</Text>
                <Text style={[styles.textWhite, { fontFamily: 'SourceSansPro-Light' }]}>light</Text>
                <Text style={[styles.textWhite, { fontFamily: 'SourceSansPro-LightItalic' }]}>lightitalic</Text>
                <Text style={[styles.textWhite, { fontFamily: 'SourceSansPro-Regular' }]}>regular</Text>
                <Text style={[styles.textWhite, { fontFamily: 'SourceSansPro-SemiBold' }]}>semibold</Text>
                <Text style={[styles.textWhite, { fontFamily: 'SourceSansPro-SemiBoldItalic' }]}>semibolditalic</Text>
                
                <Button
                    onPress={() => {
                        this.test();
                    }}
                    title="Press Me"
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#fff',
    },
    textWhite: {
        fontSize: 26,
        color: '#000'
    }
});
