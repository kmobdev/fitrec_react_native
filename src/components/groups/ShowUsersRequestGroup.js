import React from "react";
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
  WhiteColor,
  PlaceholderColor,
  SignUpColor,
} from "../../Styles";
import Icon from "react-native-vector-icons/Ionicons";

export const ShowUserRequestGroup = (props) =>
  props.visible && (
    <View style={GlobalModal.viewContent}>
      <View
        style={
          (GlobalModal.viewHead,
            { justifyContent: "center", alignContent: "center" })
        }
      >
        {
          //TODO: commented for a future
          // <Pressable style={GlobalModal.buttonLeft}
          //     onPress={props.acceptAll}>
          //     <Text style={GlobalModal.titleClose}>Accept All</Text>
          // </Pressable>
        }
        <Text style={GlobalModal.headTitle}>Group Requests</Text>
        <Pressable style={GlobalModal.buttonClose} onPress={props.close}>
          <Text style={GlobalModal.titleClose}>Close</Text>
        </Pressable>
      </View>
      <ScrollView style={{ padding: 10 }}>
        <FlatList
          data={props.users}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.viewNotificaton}>
                {
                  // TODO: Commented for a next version, you can see the profile that tries to enter the group
                  // <Pressable onPress={() => { props.viewProfile(item) }} style={{ flexDirection: 'row', width: '100%' }}>
                  // </Pressable>
                }
                <View style={{ margin: 10 }}>
                  {null !== item.image ? (
                    <Image
                      style={GlobalStyles.photoProfileCardList}
                      source={{ uri: item.image }}
                    />
                  ) : (
                    <Image
                      style={GlobalStyles.photoProfileCardList}
                      source={require("../../assets/imgGroup.png")}
                    />
                  )}
                </View>
                <View style={{ justifyContent: "center", marginLeft: 10 }}>
                  <Text style={styles.textUserReference}>{item.name}</Text>
                  <Text>@{item.username}</Text>
                </View>
                <Pressable
                  style={styles.viewIconRight}
                  onPress={() => props.acceptRequest(item)}
                >
                  <Icon name="md-checkmark" size={32} color="yellowgreen" />
                </Pressable>
                <Pressable
                  onPress={() => props.cancelRequest(item)}
                  style={[styles.viewIconRight, { right: 60 }]}
                >
                  <Icon name="md-close" size={32} color={SignUpColor} />
                </Pressable>
              </View>
            );
          }}
        />
      </ScrollView>
    </View>
  );

const styles = StyleSheet.create({
  viewNotificaton: {
    flexDirection: "row",
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
});
