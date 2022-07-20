import React, { Component } from "react";
import { Text, View, FlatList, Pressable, Image } from "react-native";
import { PlaceholderColor, GlobalModal } from "../../Styles";
import { lActivitiesIcon } from "../../Constants";

export default class SelectActivities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: false,
    };
  }

  getIcon(sActivityName) {
    var lActivityIcon = lActivitiesIcon.find(
      (lActivity) => lActivity.name === sActivityName
    );
    if (undefined !== lActivityIcon) {
      return lActivityIcon.icon;
    }
  }

  selectAll = () => {
    this.props.activities.forEach((oActivity) => {
      oActivity.selected = true;
    });
    this.setState({ refresh: !this.state.refresh });
  };

  clear = () => {
    this.props.activities.forEach((oActivity) => {
      oActivity.selected = false;
    });
    this.setState({ refresh: !this.state.refresh });
  };

  render() {
    return (
      this.props.visible && (
        <View style={GlobalModal.viewContent}>
          <View style={GlobalModal.viewHead}>
            {this.props.activities.filter((element) => element.selected)
              .length > 0 ? (
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
            <Text style={GlobalModal.headTitle}>Select Activities</Text>
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
              data={this.props.activities.sort(function (a, b) {
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
                  onPress={() => {
                    item.selected = !item.selected;
                    this.setState({ refresh: !this.state.refresh });
                  }}
                  style={{
                    padding: 20,
                    borderBottomWidth: 0.5,
                    borderBottomColor: PlaceholderColor,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={this.getIcon(item.name)}
                      style={{ height: 25, width: 25, marginRight: 15 }}
                    />
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
