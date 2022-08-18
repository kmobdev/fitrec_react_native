import React, { Component, useState } from "react";
import { Text, View, FlatList, Pressable, Image } from "react-native";
import { PlaceholderColor, GlobalModal } from "../../Styles";

const SelectGyms = (props) => {

  const [refresh, setRefresh] = useState(false);

  const clear = () => {
    props.gyms.forEach((oGym) => {
      oGym.selected = false;
    });
    setRefresh(!refresh);
  };

  const selectGym = (item) => {
    if (
      item.selected ||
      undefined === props.maxSelect ||
      props.gyms.filter((oGym) => oGym.selected === true).length <
      props.maxSelect
    ) {
      item.selected = !item.selected;
      setRefresh(!refresh);
    } else
      props.message(
        "You can only choose a maximum of " + props.maxSelect + " gyms"
      );
  };

  const selectAll = () => {
    props.gyms.forEach((oGym) => {
      oGym.selected = true;
    });
    setRefresh(!refresh);
  };

  return (
    props.visible && (
      <View style={GlobalModal.viewContent}>
        <View style={GlobalModal.viewHead}>
          {props.gyms.filter((element) => element.selected).length >
            0 ? (
            <Pressable
              style={GlobalModal.buttonLeft}
              onPress={() => clear()}
            >
              <Text style={GlobalModal.titleClose}>Clear</Text>
            </Pressable>
          ) : (
            <Pressable
              style={GlobalModal.buttonLeft}
              onPress={() => selectAll()}
            >
              <Text style={GlobalModal.titleClose}>Select All</Text>
            </Pressable>
          )}
          <Text style={GlobalModal.headTitle}>Select Gyms</Text>
          <Pressable
            style={GlobalModal.buttonClose}
            onPress={props.close}
          >
            <Text style={GlobalModal.titleClose}>OK</Text>
          </Pressable>
        </View>
        <View>
          <FlatList
            refreshing={refresh}
            data={props.gyms.sort(function (a, b) {
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
                onPress={() => selectGym(item)}
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

export default SelectGyms;