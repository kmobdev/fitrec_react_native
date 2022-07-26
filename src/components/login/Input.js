import React, { Component } from "react";
import { View, StyleSheet, Platform, Image, TextInput } from "react-native";
import { WhiteColor } from "../../Styles";

export default class Input extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { ref, onSubmitEditing, iconSource, onChangeText, value, textContentType, returnKeyType, secureTextEntry, autoCapitalize, autoCompleteType, placeholder, style } = this.props;
    return (
      <View style={styles.SectionStyle}>
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
          style={[styles.textInput, style]}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    borderBottomWidth: 0.5,
    borderBottomColor: WhiteColor,
    marginTop: "android" === Platform.OS ? 10 : 25,
  },
  textInput: {
    backgroundColor: "transparent",
    fontSize: 20,
    color: WhiteColor,
    width: "95%",
    textAlign: "center",
    paddingBottom: 10,
  },
  ImageStyle: {
    height: 30,
    width: 150,
    position: "absolute",
    bottom: 10,
  },
});
