import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  Text,
  Image,
  FlatList,
} from "react-native";
import {
  GlobalStyles,
  GlobalModal,
  GreenFitrecColor,
  PlaceholderColor,
  SignUpColor,
} from "../../Styles";
import CheckEmpty from "../../assets/check/empty.png";
import Icon from "react-native-vector-icons/Ionicons";
import FastImage from "react-native-fast-image";

export default class PeopleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: true,
    };
  }

  selectPal = (oPal) => {
    oPal.selected = undefined === oPal.selected ? true : !oPal.selected;
    this.setState({
      refresh: !this.state.refresh,
    });
  };

  render() {
    return (
      this.props.visible && (
        <View style={GlobalModal.viewContent}>
          <View
            style={
              (GlobalModal.viewHead,
              {
                justifyContent: "center",
                alignContent: "center",
                borderBottomColor: PlaceholderColor,
                borderBottomWidth: 0.5,
              })
            }>
            <Text style={GlobalModal.headTitle}>Your Pals</Text>
            <Pressable
              style={GlobalModal.buttonClose}
              onPress={() => {
                this.props.close();
              }}>
              <Text style={GlobalModal.titleClose}>Close</Text>
            </Pressable>
          </View>
          {this.props.pals !== undefined && this.props.pals.length > 0 ? (
            <ScrollView style={styles.listView}>
              <View style={{ flexDirection: "row", marginTop: 15 }}>
                <Pressable
                  onPress={() => {
                    this.props.close();
                  }}
                  style={{ flex: 6, marginRight: 5 }}>
                  <View style={GlobalStyles.buttonCancel}>
                    <Text style={GlobalStyles.textButton}>Cancel</Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => {
                    this.props.confirm();
                  }}
                  style={{ flex: 6, marginLeft: 5 }}>
                  <View style={GlobalStyles.buttonConfirm}>
                    <Text style={GlobalStyles.textButton}>
                      Confirm
                      {undefined !==
                        this.props.pals.filter(
                          (element) => element.selected === true
                        ).length &&
                      null !==
                        this.props.pals.filter(
                          (element) => element.selected === true
                        ).length &&
                      this.props.pals.filter(
                        (element) => element.selected === true
                      ).length > 0
                        ? " (" +
                          this.props.pals
                            .filter((element) => element.selected === true)
                            .length.toString() +
                          ")"
                        : ""}
                    </Text>
                  </View>
                </Pressable>
              </View>
              <FlatList
                data={this.props.pals}
                keyExtractor={(item, index) => index.toString()}
                extraData={this.state.refresh}
                renderItem={({ item }) => {
                  return (
                    <View style={styles.rowPal}>
                      <Pressable
                        onPress={() => this.selectPal(item)}
                        style={{ flexDirection: "row", width: "100%" }}>
                        {null === item.image ? (
                          <Image
                            style={GlobalStyles.photoProfileCardList}
                            source={require("../../assets/imgGroup.png")}
                          />
                        ) : (
                          <FastImage
                            style={GlobalStyles.photoProfileCardList}
                            source={{
                              uri: item.image,
                              priority: FastImage.priority.high,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        )}
                        <View
                          style={{
                            justifyContent: "center",
                            marginLeft: 10,
                            marginRight: 175,
                          }}>
                          <Text style={styles.textUserReference}>
                            {item.name.length > 25
                              ? item.name.substring(0, 22) + "..."
                              : item.name}
                          </Text>
                          <Text style={{ fontStyle: "italic" }}>
                            {item.username}
                          </Text>
                        </View>
                        <View style={styles.viewIconRight}>
                          {item.selected ? (
                            <Icon
                              name="checkmark-circle"
                              size={24}
                              color={SignUpColor}
                            />
                          ) : (
                            <Image source={CheckEmpty} />
                          )}
                        </View>
                      </Pressable>
                    </View>
                  );
                }}
              />
            </ScrollView>
          ) : (
            <Text style={styles.messageEmpty}>You currently have no pals</Text>
          )}
        </View>
      )
    );
  }
}

const styles = StyleSheet.create({
  messageEmpty: {
    color: SignUpColor,
    fontSize: 24,
    textAlign: "center",
    marginTop: 30,
  },
  rowPal: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: PlaceholderColor,
    padding: 5,
  },
  textUserReference: {
    marginBottom: 5,
    fontSize: 18,
    color: GreenFitrecColor,
  },
  viewIconRight: {
    position: "absolute",
    right: 10,
    height: "100%",
    justifyContent: "center",
  },
  listView: {
    paddingLeft: 10,
    paddingRight: 10,
  },
});
