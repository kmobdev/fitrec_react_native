import React, { Component } from "react";
import { Text, Pressable, View } from "react-native";
import { GlobalTabs } from "../../Styles";

const FollowerTabs = (props) => {
  const { onTabPress, tabStyle, titleStyle, title, leftTab, isActive } = props;

  return (
    <Pressable
      onPress={onTabPress}
      style={[
        leftTab ? GlobalTabs.tabLeft : GlobalTabs.tabRight,
        isActive ? GlobalTabs.tabActive : null,
        tabStyle,
      ]}
    >
      <View>
        <Text
          style={[
            isActive ? GlobalTabs.tabsTextActive : GlobalTabs.tabsText,
            titleStyle,
          ]}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

export default FollowerTabs;
