import React, { Component } from "react";
import { GlobalStyles, PlaceholderColor, SignUpColor } from "../../Styles";
import { StyleSheet, View, Text, Pressable } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default class ShowActivities extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        {!this.props.readonly && (
          <View
            style={[
              GlobalStyles.viewSection,
              styles.textInput,
              { alignItems: "flex-end", borderBottomWidth: 0 },
            ]}
          >
            <Text style={styles.textLabel}>Activities</Text>
            <View
              style={[
                styles.comboSelect,
                this.props.error && styles.paddingExtra,
              ]}
            >
              <Pressable
                style={{ flexDirection: "row", padding: 4 }}
                onPress={this.props.press}
              >
                <Icon
                  name="md-create"
                  size={18}
                  style={styles.iconSelect}
                  color={SignUpColor}
                />
                <Text style={{ color: SignUpColor }}>Choose Activities</Text>
              </Pressable>
            </View>
            {this.props.error && (
              <Icon
                name="ios-warning"
                size={16}
                color={SignUpColor}
                style={styles.iconError}
              />
            )}
          </View>
        )}
        <View style={styles.viewActivitiesSelected}>
          {this.props.activities
            .filter((item) => item.selected)
            .sort(function (a, b) {
              if (a.name < b.name) return -1;
              if (a.name > b.name) return 1;
              return 0;
            })
            .map((element) => (
              <View
                style={{
                  borderWidth: 0.5,
                  borderColor: SignUpColor,
                  padding: 5,
                  borderRadius: 20,
                  justifyContent: "center",
                  marginRight: 5,
                  marginBottom: 5,
                }}
                key={element.id}
              >
                <Text
                  style={{
                    color: SignUpColor,
                    textAlign: "center",
                    justifyContent: "center",
                  }}
                >
                  {element.name}
                </Text>
              </View>
            ))}
        </View>
      </View>
    );
  }
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
  inputTextArea: {
    paddingStart: "5%",
    paddingEnd: "5%",
    height: 100,
    marginTop: 30,
  },
  comboSelect: {
    width: 150,
    position: "absolute",
    bottom: 5,
    right: "5%",
    alignItems: "flex-end",
  },
  paddingExtra: {
    paddingRight: "10%",
  },
  iconSelect: {
    marginLeft: 10,
    marginTop: -2,
  },
  viewActivitiesSelected: {
    borderBottomWidth: 0.5,
    borderBottomColor: PlaceholderColor,
    paddingLeft: "5%",
    paddingRight: "5%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  iconError: {
    position: "absolute",
    right: "5%",
    bottom: 10,
  },
});
