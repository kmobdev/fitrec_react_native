import React, { Component } from "react";
import { Text, Pressable, View, } from "react-native";
import { GlobalTabs } from "../../Styles";

export default class FollowerTabs extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { onTabPress, tabStyle, titleStyle, title, leftTab, isActive } = this.props;
    return (
      <Pressable
        onPress={onTabPress}
        style={[leftTab ? GlobalTabs.tabLeft : GlobalTabs.tabRight, isActive ? GlobalTabs.tabActive : null, tabStyle]}>
        <View>
          <Text style={[isActive ? GlobalTabs.tabsTextActive : GlobalTabs.tabsText, titleStyle]}>
            {title}
          </Text>
        </View>
      </Pressable>
    )
  }
}