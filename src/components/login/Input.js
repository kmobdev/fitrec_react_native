import React, { Component } from "react";
import { View, StyleSheet, Platform, Image, TextInput } from "react-native";
import { WhiteColor } from "../../Styles";

export default class Input extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { ref, onSubmitEditing, iconSource, onChangeText, value, textContentType, returnKeyType, secureTextEntry, autoCapitalize, autoCompleteType, placeholder, inputStyle } = this.props;
    return (
      <>
        {iconSource &&
          <Image
            source={iconSource}
            style={styles.ImageStyle}
          />
        }
        <TextInput
          ref={ref}
          placeholder={placeholder}
          onSubmitEditing={onSubmitEditing}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoCompleteType={autoCompleteType}
          returnKeyType={returnKeyType}
          textContentType={textContentType}
          style={inputStyle}
          value={value}
          onChangeText={onChangeText}
        />
      </>
    )
  }
}

const styles = StyleSheet.create({
  ImageStyle: {
    height: 30,
    width: 150,
    position: "absolute",
    bottom: 10,
  },
});
