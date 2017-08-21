import React from 'react';
import { View, Text, ListView, TouchableOpacity, DeviceEventEmitter, StyleSheet } from 'react-native';

import Colors from './Colors';
import cityData from './city.json';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

export default class CityPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      level: 'province',
      province: { code: 0, name: '省份' },
      city: { code: 0, name: '城市' },
      county: { code: 0, name: '区县' },
      dataSource: ds.cloneWithRows(cityData.prov)
    };
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.titlebar}>
          {this._renderSelectedAddress()}
          {this._renderComplete()}
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderItem}
        />
      </View>
    );
  }

  _renderComplete = () => {
    let disabled = true;
    let color = Colors.disableColor;
    if (this.state.county.name !== '区县') {
      disabled = false;
      color = Colors.defaultColor;
    }
    return (
      <TouchableOpacity
        style={{ position: 'absolute', right: 0, height: 48, marginRight: 8, justifyContent: 'center' }}
        onPress={() => {
          this.props.onSelected({
            province: this.state.province,
            city: this.state.city,
            county: this.state.county
          });
          DeviceEventEmitter.emit('removeCover');
        }}
        disabled={disabled}
      >
        <Text style={[styles.text, { color: color }]}>确定</Text>
      </TouchableOpacity>
    );
  }

  _renderSelectedAddress = () => ['province', 'city', 'county'].map((row, index) => {
    let area;
    let borderBottomWidth = 0;
    let disabled = true;
    let color = Colors.disableColor;
    if (row === 'province') {
      area = this.state.province.name;
      if (this.state.province.name !== '省份') {
        disabled = false;
        color = Colors.defaultColor;
      }
    } else if (row === 'city') {
      area = this.state.city.name;
      if (this.state.city.name !== '城市') {
        disabled = false;
        color = Colors.defaultColor;
      }
    } else if (row === 'county') {
      area = this.state.county.name;
      if (this.state.county.name !== '区县') {
        disabled = false;
        color = Colors.defaultColor;
      }
    }
    if (this.state.level === row) {
      borderBottomWidth = 2;
    }
    return (
      <TouchableOpacity
        key={index}
        style={[styles.title, { borderBottomWidth: borderBottomWidth }]}
        disabled={disabled}
        onPress={() => { this._onClickSelectedAddress(row); }}
      >
        <Text style={[styles.text, { maxWidth: 80, color: color }]} numberOfLines={1} >{area}</Text>
      </TouchableOpacity>
    );
  })

  _onClickSelectedAddress = (row) => {
    if (row === 'province') {
      this.setState({
        level: row,
        dataSource: ds.cloneWithRows(cityData.prov)
      });
    } else if (row === 'city') {
      this.setState({
        level: row,
        dataSource: ds.cloneWithRows(cityData[`prov${this.state.province.code}`])
      });
    } else if (row === 'county') {
      this.setState({
        level: row,
        dataSource: ds.cloneWithRows(cityData[`prov${this.state.province.code}city${this.state.city.code}`])
      });
    }
  }

  _renderItem = (item, arg, index) => {
    let textColor = Colors.defaultColor;
    if (this.state.level === 'province' && item === this.state.province.name) {
      textColor = Colors.selectedColor;
    } else if (this.state.level === 'city' && item === this.state.city.name) {
      textColor = Colors.selectedColor;
    } else if (this.state.level === 'county' && item === this.state.county.name) {
      textColor = Colors.selectedColor;
    }
    return (
      <TouchableOpacity
        key={index}
        style={{ height: 48, padding: 8, justifyContent: 'center' }}
        onPress={() => { this._onClickCity(item, index); }}
      >
        <Text style={[styles.text, { color: textColor }]}>{item}</Text>
      </TouchableOpacity>
    );
  }

  _onClickCity = (item, index) => {
    if (this.state.level === 'province') {
      this.setState({
        level: 'city',
        province: { code: cityData.code[index], name: item },
        city: { code: 0, name: '城市' },
        county: { code: 0, name: '区县' },
        dataSource: ds.cloneWithRows(cityData[`prov${cityData.code[index]}`])
      });
    } else if (this.state.level === 'city') {
      const provCode = this.state.province.code;
      const cityCode = cityData[`code${provCode}`][index];
      this.setState({
        level: 'county',
        city: { code: cityCode, name: item },
        county: { code: 0, name: '区县' },
        dataSource: ds.cloneWithRows(cityData[`prov${provCode}city${cityCode}`])
      });
    } else if (this.state.level === 'county') {
      const countyCode = cityData[`codeprov${this.state.province.code}city${this.state.city.code}`][index];
      this.setState({
        county: { code: countyCode, name: item }
      });
    }
  }
}

const styles = StyleSheet.create({
  titlebar: {
    flexDirection: 'row',
    height: 48,
    paddingLeft: 8,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: Colors.dividingLine
  },
  title: {
    height: 48,
    justifyContent: 'center',
    borderColor: Colors.selectedColor
  },
  text: {
    margin: 8,
    fontSize: 16
  }
});
