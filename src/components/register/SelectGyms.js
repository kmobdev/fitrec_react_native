import React, { Component } from "react";
import { Text, View, FlatList, Pressable, Image } from "react-native";
import { PlaceholderColor, GlobalModal } from "../../Styles";

export default class SelectGyms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: false,
    };
  }

  clear = () => {
    this.props.gyms.forEach((oGym) => {
      oGym.selected = false;
    });
    this.setState({ refresh: !this.state.refresh });
  };

  selectGym = (item) => {
    if (
      item.selected ||
      undefined === this.props.maxSelect ||
      this.props.gyms.filter((oGym) => oGym.selected === true).length <
        this.props.maxSelect
    ) {
      item.selected = !item.selected;
      this.setState({ refresh: !this.state.refresh });
    } else
      this.props.message(
        "You can only choose a maximum of " + this.props.maxSelect + " gyms"
      );
  };

  selectAll = () => {
    this.props.gyms.forEach((oGym) => {
      oGym.selected = true;
    });
    this.setState({ refresh: !this.state.refresh });
  };

  render() {
    return (
      this.props.visible && (
        <View style={GlobalModal.viewContent}>
          <View style={GlobalModal.viewHead}>
            {this.props.gyms.filter((element) => element.selected).length >
            0 ? (
              <Pressable
                style={GlobalModal.buttonLeft}
                onPress={() => this.clear()}
              >
                <Text style={GlobalModal.titleClose}>Clear</Text>
              </Pressable>
            ) : (
              <Pressable
                style={GlobalModal.buttonLeft}
                onPress={() => this.selectAll()}
              >
                <Text style={GlobalModal.titleClose}>Select All</Text>
              </Pressable>
            )}
            <Text style={GlobalModal.headTitle}>Select Gyms</Text>
            <Pressable
              style={GlobalModal.buttonClose}
              onPress={this.props.close}
            >
              <Text style={GlobalModal.titleClose}>OK</Text>
            </Pressable>
          </View>
          <View>
            <FlatList
              refreshing={this.state.refresh}
              data={this.props.gyms.sort(function (a, b) {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
              })}
              extraData={this.state.refresh}
              keyExtractor={(item, index) => index.toString()}
              contentInsetAdjustmentBehavior="automatic"
              contentContainerStyle={{ paddingBottom: 60 }}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => this.selectGym(item)}
                  style={{
                    padding: 20,
                    borderBottomWidth: 0.5,
                    borderBottomColor: PlaceholderColor,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ height: "100%", fontSize: 20 }}>
                      {item.name}
                    </Text>
                    {item.selected ? (
                      <View
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 5,
                          bottom: 0,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image source={require("../../assets/checked.png")} />
                      </View>
                    ) : null}
                  </View>
                </Pressable>
              )}
            />
          </View>
        </View>
      )
    );
  }
}
