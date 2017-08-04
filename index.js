import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

import Colors from './Colors';
import CoverView from './CoverView';
import CityPicker from './CityPicker';

const screenHeight = Dimensions.get('window').height;

export default class index {
  static show = () => new Promise((resolve, reject) => {
    CoverView.add(
      <View style={styles.container} >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            CoverView.remove();
            reject('cancel');
          }}
        />
        <View style={styles.content} pointerEvents={'box-none'} >
          <CityPicker onSelected={resolve} />
        </View>
      </View>
    );
  })
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.coverBg,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'stretch'
  },
  content: {
    height: screenHeight * 3 / 4,
    backgroundColor: Colors.contentBg
  }
});
