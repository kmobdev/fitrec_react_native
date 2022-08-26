import React, { Component, useState } from "react";
import { Text, View, FlatList, Pressable, Image } from "react-native";
import { PlaceholderColor, GlobalModal } from "../../Styles";
import { lActivitiesIcon } from "../../Constants";

const SelectActivities = (props) => {
  const [refresh, setRefresh] = useState(false);

  const getIcon = (sActivityName) => {
    var lActivityIcon = lActivitiesIcon.find(
      (lActivity) => lActivity.name === sActivityName
    );
    if (undefined !== lActivityIcon) {
      return lActivityIcon.icon;
    }
  };

  const selectAll = () => {
    props.activities.forEach((oActivity) => {
      oActivity.selected = true;
    });
    setRefresh(!refresh);
  };

  const clear = () => {
    props.activities.forEach((oActivity) => {
      oActivity.selected = false;
    });
    setRefresh(!refresh);
  };

  return (
    props.visible && (
      <View style={GlobalModal.viewContent}>
        <View style={GlobalModal.viewHead}>
          {props.activities.filter((element) => element.selected).length > 0 ? (
            <Pressable style={GlobalModal.buttonLeft} onPress={clear}>
              <Text style={GlobalModal.titleClose}>Clear</Text>
            </Pressable>
          ) : (
            <Pressable style={GlobalModal.buttonLeft} onPress={selectAll}>
              <Text style={GlobalModal.titleClose}>Select All</Text>
            </Pressable>
          )}
          <Text style={GlobalModal.headTitle}>Select Activities</Text>
          <Pressable style={GlobalModal.buttonClose} onPress={props.close}>
            <Text style={GlobalModal.titleClose}>OK</Text>
          </Pressable>
        </View>
        <View>
          <FlatList
            refreshing={refresh}
            data={props.activities.sort(function (a, b) {
              if (a.name < b.name) return -1;
              if (a.name > b.name) return 1;
              return 0;
            })}
            extraData={refresh}
            keyExtractor={(item, index) => index.toString()}
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{ paddingBottom: 60 }}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => {
                  item.selected = !item.selected;
                  setRefresh(!refresh);
                }}
                style={{
                  padding: 20,
                  borderBottomWidth: 0.5,
                  borderBottomColor: PlaceholderColor,
                }}>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={getIcon(item.name)}
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
                      }}>
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
};

export default SelectActivities;
