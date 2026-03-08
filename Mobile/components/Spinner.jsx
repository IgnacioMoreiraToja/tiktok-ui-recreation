import React from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';

const { height, width } = Dimensions.get('window');

const Spinner = () => {
    return (
        <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color="red" />
        </View>
    );
};

const styles = StyleSheet.create({
    spinnerContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
        height: height,
        width: width,
        marginTop: height/2.5,        
    },
});

export default Spinner;