
import React, { Component } from 'react';
import { StyleSheet, AppRegistry, DeviceEventEmitter, View } from 'react-native';

import Colors from './Colors';

export default class CoverView extends Component {
  static add(element) {
    DeviceEventEmitter.emit('addCover', { element });
  }

  static remove() {
    DeviceEventEmitter.emit('removeCover');
  }

  constructor(props) {
    super(props);
    this.state = {
      elements: []
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
    const { elements } = this.state;
    elements.push(e);
    this.setState({ elements });
  }

  remove() {
    this.setState({ elements: [] });
  }

  render() {
    const { elements } = this.state;
    return (
      <View style={styles.container}>
        {this.props.children}
        {elements.map((item, i) => (
          <View key={i} style={styles.cover} pointerEvents="box-none">
            {item.element}
          </View>
        ))}
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

AppRegistry.registerComponent = (appKey, componentProvider) => {
  class RootElement extends Component {
    render() {
      const SourceComponent = componentProvider();
      return (
        <CoverView>
          <SourceComponent {...this.props} />
        </CoverView>
      );
    }
  }

  return AppRegistry.registerComponentOld(appKey, () => RootElement);
};
