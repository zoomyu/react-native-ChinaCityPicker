
import React, { Component } from 'react';
import { StyleSheet, AppRegistry, DeviceEventEmitter, View } from 'react-native';

import Colors from './Colors';


export default class CoverView extends Component {
  static add(element) {
    DeviceEventEmitter.emit('addCover', element);
  }

  static remove() {
    DeviceEventEmitter.emit('removeCover');
  }

  constructor(props) {
    super(props);
    this.state = {
      element: null
    };
  }

  componentWillMount() {
    DeviceEventEmitter.addListener('addCover', e => this.add(e));
    DeviceEventEmitter.addListener('removeCover', () => this.remove());
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeAllListeners('addCover');
    DeviceEventEmitter.removeAllListeners('removeCover');
  }

  add(e) {
    this.setState({ element: e });
  }

  remove() {
    this.setState({ element: null });
  }

  render() {
    const { element } = this.state;
    return (
      <View style={styles.container}>
        {this.props.children}
        <View style={styles.cover} pointerEvents="box-none">
          {element}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cover: {
    backgroundColor: Colors.defaultBg,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});

if (!AppRegistry.registerComponentOld) {
  AppRegistry.registerComponentOld = AppRegistry.registerComponent;
}

AppRegistry.registerComponent = (appKey, getComponentFunc) => {
  const SourceComponent = getComponentFunc();
  return AppRegistry.registerComponentOld(appKey, () => React.createClass({
    render: () => (
      <CoverView>
        <SourceComponent {...this.props} />
      </CoverView>
    )
  }));
};
