import React from "react";

import { StyleSheet, Image, TextInput } from "react-native";

const Input = (props) => {
  const { ref, onSubmitEditing, iconSource, onChangeText, value, textContentType, returnKeyType, secureTextEntry, autoCapitalize, autoCompleteType, placeholder, inputStyle } = props;
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

export default Input;

const styles = StyleSheet.create({
  ImageStyle: {
    height: 30,
    width: 150,
    position: "absolute",
    bottom: 10,
  },
});
