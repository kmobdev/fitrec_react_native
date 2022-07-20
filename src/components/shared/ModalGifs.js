import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { WhiteColor, SignUpColor, PlaceholderColor } from "../../Styles";
import { SearchUsername } from "../chat/SearchUsername";
import { ListGiphy } from "./ListGiphy";
import Icon from "react-native-vector-icons/Ionicons";

export const ModalGifs = (props) => {
  return (
    props.bShow && (
      <View style={styles.viewContent}>
        <View style={styles.viewHead}>
          {props.bShowStickers ? (
            <View>
              <Pressable
                style={[styles.buttonLeft, { flexDirection: "row" }]}
                onPress={() => props.fChangeType()}
              >
                <Text style={[styles.titleClose, { marginLeft: 2 }]}>GIF</Text>
              </Pressable>
              <Text style={styles.headTitle}>Stickers</Text>
            </View>
          ) : (
            <View>
              <Pressable
                style={[styles.buttonLeft, { flexDirection: "row" }]}
                onPress={props.fChangeType}
              >
                <Text style={[styles.titleClose, { marginLeft: 2 }]}>
                  Stickers
                </Text>
              </Pressable>
              <Text style={styles.headTitle}>GIF</Text>
            </View>
          )}
          <Pressable
            style={[styles.buttonClose, { flexDirection: "row" }]}
            onPress={props.fClose}
          >
            <Icon name="close" color={SignUpColor} size={22} />
            <Text style={[styles.titleClose, { marginLeft: 2 }]}>Close</Text>
          </Pressable>
        </View>
        <ScrollView>
          <SearchUsername
            ph={"Search in GIPHY"}
            value={props.sSearch}
            change={(text) => props.fUpdateSearch(text)}
            blur={props.fSearch}
            clean={props.fClean}
          />
          <ListGiphy
            action={(item) => {
              props.fActionSelect(item);
            }}
            showStickers={props.bShowStickers}
            gifs={props.aGifs}
            stickers={props.aStickers}
            sSearch={props.sSearch}
          />
        </ScrollView>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  viewContent: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: WhiteColor,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    marginTop: 10,
    height: "100%",
  },
  viewHead: {
    borderBottomWidth: 0.5,
    borderBottomColor: PlaceholderColor,
  },
  headTitle: {
    fontWeight: "bold",
    textAlign: "center",
    padding: 15,
    fontSize: 16,
  },
  buttonClose: {
    position: "absolute",
    right: 10,
    padding: 15,
  },
  buttonLeft: {
    zIndex: 1,
    position: "absolute",
    left: 10,
    padding: 15,
  },
  titleClose: {
    fontSize: 18,
    color: SignUpColor,
  },
});
