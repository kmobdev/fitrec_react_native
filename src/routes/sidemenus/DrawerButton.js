import React, { Component } from "react";
import { Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SignUpColor, GlobalMessages } from "../../Styles";
import { View, Text } from "react-native";
import { connect } from "react-redux";

class DrawerButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Pressable
        onPress={() => {
          this.props.navigation.openDrawer();
        }}>
        <View style={{ flexDirection: "row" }}>
          <Icon
            name="ios-menu"
            color={SignUpColor}
            size={30}
            style={styles.icon}
          />
          {this.props.chatProps.messageRead > 0 ||
          this.props.chatProps.messageReadGroup > 0 ||
          (undefined !== this.props.notifications &&
            this.props.notifications.notificationsUnRead > 0) ? (
            <View
              style={[
                GlobalMessages.viewGlobalBubble,
                { marginTop: 0, justifyContent: "center" },
              ]}>
              <View style={GlobalMessages.viewBubble}>
                <Text style={GlobalMessages.text}>
                  {this.props.chatProps.messageRead > 0 &&
                  this.props.chatProps.messageReadGroup > 0 &&
                  this.props.notifications.notificationsUnRead > 0
                    ? this.props.chatProps.messageRead +
                      this.props.chatProps.messageReadGroup +
                      this.props.notifications.notificationsUnRead
                    : this.props.chatProps.messageRead > 0 &&
                      this.props.chatProps.messageReadGroup > 0
                    ? this.props.chatProps.messageRead +
                      this.props.chatProps.messageReadGroup
                    : this.props.chatProps.messageRead > 0 &&
                      this.props.notifications.notificationsUnRead > 0
                    ? this.props.chatProps.messageRead +
                      this.props.notifications.notificationsUnRead
                    : this.props.chatProps.messageReadGroup > 0 &&
                      this.props.notifications.notificationsUnRead > 0
                    ? this.props.chatProps.messageReadGroup +
                      this.props.notifications.notificationsUnRead
                    : this.props.chatProps.messageRead > 0
                    ? this.props.chatProps.messageRead
                    : this.props.chatProps.messageReadGroup > 0
                    ? this.props.chatProps.messageReadGroup
                    : this.props.notifications.notificationsUnRead}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    paddingLeft: 15,
    paddingRight: 5,
  },
});

const mapStateToProps = (state) => ({
  chatProps: state.reducerChat,
  session: state.reducerSession,
  notifications: state.reducerNotification,
});

export default connect(mapStateToProps, null)(DrawerButton);
