import React, { Component } from "react";
import { SignUpColor, GlobalStyles, PlaceholderColor } from "../../Styles";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import DatePicker from "react-native-datepicker";
import moment from "moment/min/moment-with-locales";
import ReactNativePickerModule from "react-native-picker-module";

export default class DatePickerSelect extends Component {
  constructor(props) {
    super(props);
    this.pickerAge = React.createRef();
  }

  calculateAge = () => {
    // Line commented since it will be used later - Leandro Curbelo 01/22/2021
    // return moment().diff(this.props.value, 'years')
    return this.props.value;
  };

  changeDate = (sDate) => {
    this.props.setDate(sDate);
  };

  getAgeItems = () => {
    let nCount = 9,
      aAges = [];
    while (nCount < 121) {
      aAges.push("" + nCount);
      nCount++;
    }
    return aAges;
  };

  render = () => {
    return (
      <View
        style={[
          GlobalStyles.viewSection,
          styles.textInput,
          { alignItems: "flex-end" },
        ]}
      >
        <Text style={styles.textLabel}>{this.props.title}</Text>
        <View
          style={[styles.comboSelect, this.props.error && styles.paddingExtra]}
        >
          <Pressable
            onPress={() => this.pickerAge.current.show()}
            style={{ flexDirection: "row" }}
          >
            <Text>
              {null !== this.props.value ? this.calculateAge() : "Select here"}
            </Text>
            <Icon name="chevron-down" size={22} style={styles.iconSelect} />
          </Pressable>
        </View>
        {this.props.error ? (
          <Icon
            name="ios-warning"
            size={16}
            color={SignUpColor}
            style={styles.iconError}
          ></Icon>
        ) : null}
        <ReactNativePickerModule
          pickerRef={this.pickerAge}
          title={"Age"}
          items={this.getAgeItems()}
          onValueChange={(value) => {
            this.changeDate(value);
          }}
        />
        {/* 
                    Linea comentada ya que se utilizara mas adelante - Leandro Curbelo 22/01/2021
                    <DatePicker
                    style={{ opacity: 0, position: 'absolute' }}
                    customStyles={{
                        btnTextConfirm: {
                            color: SignUpColor
                        }
                    }}
                    format="YYYY-MM-DD"
                    confirmBtnText="Set"
                    cancelBtnText="Close"
                    ref={'datePicker'}
                    onDateChange={date => { this.changeDate(date) }}
                    date={this.props.value}
                    androidMode='spinner'
                /> */}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  textLabel: {
    position: "absolute",
    left: "5%",
    bottom: 10,
    color: PlaceholderColor,
  },
  textInput: {
    width: "100%",
    height: 40,
    textAlign: "right",
    paddingRight: "5%",
    color: "black",
  },
  paddingExtra: {
    paddingRight: "10%",
  },
  iconError: {
    position: "absolute",
    right: "5%",
    bottom: 10,
  },
  comboSelect: {
    width: 150,
    position: "absolute",
    bottom: 5,
    right: "5%",
    alignItems: "flex-end",
  },
  iconSelect: {
    marginLeft: 10,
    marginTop: -2,
  },
});
