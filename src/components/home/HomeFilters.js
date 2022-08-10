import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SignUpColor, WhiteColor } from "../../Styles";
import ReactNativePickerModule from "react-native-picker-module";

const HomeFilters = (props) => {

  const pickerGender = useRef();
  const pickerRange = useRef();

  const [showActivities, setShowActivities] = useState(false);
  const [showRange, setShowRange] = useState(false);
  const [showGender, setShowGender] = useState(false);
  const [showDefault, setShowDefault] = useState(false);
  const [showDescriptions, setShowDescriptions] = useState(false);
  const [showGym, setShowGym] = useState(false);
  const [filters, setFilters] = useState(null);


  useEffect(() => {
    if (props.visible) {
      setTimeout(() => {
        setShowDefault(true);
        setShowDescriptions(true);
      }, 50);
      setTimeout(() => {
        setShowRange(true);
      }, 115);
      setTimeout(() => {
        setShowGym(true);
      }, 190);
      setTimeout(() => {
        setShowGender(true);
      }, 265);
      setTimeout(() => {
        setShowActivities(true);
      }, 340);
      setFilters(props.filters);
    } else {
      setTimeout(() => {
        setShowDefault(false);
        setShowDescriptions(false);
      }, 30);
      setTimeout(() => {
        setShowGender(false);
      }, 50);
      setTimeout(() => {
        setShowGym(false);
      }, 70);
      setTimeout(() => {
        setShowRange(false);
      }, 90);
      setTimeout(() => {
        setShowActivities(false);
      }, 110);
    }
  }, [props])

  const applyFilterRange = (value) => {
    switch (value) {
      case "Less than 1 miles":
        setFilters({
          ...filters,
          range: "1",
        });
        break;
      case "Less than 3 miles":
        setFilters({
          ...filters,
          range: "3",
        });
        break;
      case "Less than 5 miles":
        setFilters({
          ...filters,
          range: "5",
        });
        break;
      case "Less than 10 miles":
        setFilters({
          ...filters,
          range: "10",
        });
        break;
      case "Less than 20 miles":
        setFilters({
          ...filters,
          range: "20",
        });
        break;
    }
    props.setFilter(filters);
  };

  const applyFilterGender = (value) => {
    switch (value) {
      case "Female":
        setFilters({
          ...filters,
          gender: "F",
        });
        break;
      case "Male":
        setFilters({
          ...filters,
          gender: "M",
        });
        break;
    }
    props.setFilter(filters);
  };

  const applyFilterDefault = () => {
    setFilters({
      gender: "",
      range: "",
      activity: [],
      gyms: [],
    });
    props.setFilter(filters, true);
  };

  return (
    <View style={styles.viewContent}>
      {showActivities && (
        <View style={[styles.viewBubble, styles.viewBubbleSmall]}>
          <Pressable
            style={styles.touchable}
            onPress={props.showActivities}
          >
            {showDescriptions && (
              <View style={styles.viewBubbleSmallDescription}>
                <View style={styles.bubbleSmallDescription}>
                  <Text style={styles.text}>Activities</Text>
                </View>
              </View>
            )}
            <Icon name="bicycle" size={38} color={WhiteColor} />
          </Pressable>
        </View>
      )}
      {showGender && (
        <View style={[styles.viewBubble, styles.viewBubbleSmall]}>
          <Pressable
            style={styles.touchable}
            onPress={() => pickerGender.current.show()}
          >
            {showDescriptions && (
              <View style={styles.viewBubbleSmallDescription}>
                <View style={styles.bubbleSmallDescription}>
                  <Text style={styles.text}>Gender</Text>
                </View>
              </View>
            )}
            <Icon name="people" size={38} color={WhiteColor} />
          </Pressable>
          <ReactNativePickerModule
            pickerRef={pickerGender}
            title={"Gender"}
            items={["Male", "Female"]}
            onValueChange={(value) => applyFilterGender(value)}
          />
        </View>
      )}
      {showGym && (
        <View style={[styles.viewBubble, styles.viewBubbleSmall]}>
          <Pressable
            style={styles.touchable}
            onPress={() => props.showGyms()}
          >
            {showDescriptions && (
              <View style={styles.viewBubbleSmallDescription}>
                <View style={styles.bubbleSmallDescription}>
                  <Text style={styles.text}>Gym</Text>
                </View>
              </View>
            )}
            <Icon name="barbell-outline" size={38} color={WhiteColor} />
          </Pressable>
        </View>
      )}
      {showRange && (
        <View style={[styles.viewBubble, styles.viewBubbleSmall]}>
          <Pressable
            style={styles.touchable}
            onPress={() => pickerRange.current.show()}
          >
            {showDescriptions && (
              <View style={styles.viewBubbleSmallDescription}>
                <View style={styles.bubbleSmallDescription}>
                  <Text style={styles.text}>Range</Text>
                </View>
              </View>
            )}
            <Icon name="map-sharp" size={38} color={WhiteColor} />
          </Pressable>
          <ReactNativePickerModule
            pickerRef={pickerRange}
            title={"Range"}
            items={[
              "Less than 1 miles",
              "Less than 3 miles",
              "Less than 5 miles",
              "Less than 10 miles",
              "Less than 20 miles",
            ]}
            onValueChange={(value) => applyFilterRange(value)}
          />
        </View>
      )}
      {showDefault && (
        <View style={[styles.viewBubble, styles.viewBubbleSmall]}>
          <Pressable
            style={styles.touchable}
            onPress={() => applyFilterDefault()}
          >
            {showDescriptions && (
              <View style={styles.viewBubbleSmallDescription}>
                <View style={styles.bubbleSmallDescription}>
                  <Text style={styles.text}>Default</Text>
                </View>
              </View>
            )}
            <Icon name="options" size={38} color={WhiteColor} />
          </Pressable>
        </View>
      )}
      <View style={[styles.viewBubble, styles.viewBubbleBig]}>
        <Pressable style={styles.touchable} onPress={props.press}>
          <Text style={[styles.text, styles.bold]}>FILTER</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default HomeFilters;

const styles = StyleSheet.create({
  viewContent: {
    position: "absolute",
    right: 20,
    bottom: 10,
    alignItems: "center",
  },
  viewBubble: {
    backgroundColor: SignUpColor,
    borderRadius: 50,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    marginBottom: 15,
  },
  viewBubbleSmall: {
    height: 50,
    width: 50,
  },
  viewBubbleBig: {
    height: 65,
    width: 65,
  },
  touchable: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: WhiteColor,
  },
  bold: {
    fontWeight: "bold",
  },
  bubbleSmallDescription: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 6,
    borderRadius: 10,
  },
  viewBubbleSmallDescription: {
    position: "absolute",
    right: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
  },
});
