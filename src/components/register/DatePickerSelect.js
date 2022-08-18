import React, { useRef } from "react";
import { SignUpColor, GlobalStyles, PlaceholderColor } from "../../Styles";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ReactNativePickerModule from "react-native-picker-module";

const DatePickerSelect = (props) => {

  const pickerAge = useRef();

  const calculateAge = () => {
    // Line commented since it will be used later - Leandro Curbelo 01/22/2021
    // return moment().diff(props.value, 'years')
    return props.value;
  };

  const changeDate = (sDate) => {
    props.setDate(sDate);
  };

  const getAgeItems = () => {
    let nCount = 9,
      aAges = [];
    while (nCount < 121) {
      aAges.push("" + nCount);
      nCount++;
    }
    return aAges;
  };

  return (
    <View
      style={[
        GlobalStyles.viewSection,
        styles.textInput,
        { alignItems: "flex-end" },
      ]}
    >
      <Text style={styles.textLabel}>{props.title}</Text>
      <View
        style={[styles.comboSelect, props.error && styles.paddingExtra]}
      >
        <Pressable
          onPress={() => pickerAge.current.show()}
          style={{ flexDirection: "row" }}
        >
          <Text>
            {null !== props.value ? calculateAge() : "Select here"}
          </Text>
          <Icon name="chevron-down" size={22} style={styles.iconSelect} />
        </Pressable>
      </View>
      {props.error ? (
        <Icon
          name="ios-warning"
          size={16}
          color={SignUpColor}
          style={styles.iconError}
        ></Icon>
      ) : null}
      <ReactNativePickerModule
        pickerRef={pickerAge}
        title={"Age"}
        items={getAgeItems()}
        onValueChange={(value) => {
          changeDate(value);
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
                    onDateChange={date => { changeDate(date) }}
                    date={props.value}
                    androidMode='spinner'
                /> */}
    </View>
  );
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

export default DatePickerSelect;