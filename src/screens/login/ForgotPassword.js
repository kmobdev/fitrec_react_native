import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import {
  GreenFitrecColor,
  PlaceholderColor,
  SignUpColor,
  WhiteColor,
} from "../../Styles";
import { Toast } from "../../components/shared/Toast";
import { connect } from "react-redux";
import { actionUserForgotPassword } from "../../redux/actions/UserActions";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toastText: "",
      email: "",
      loading: false,
    };
  }

  showToast = async (sText, callback = null) => {
    this.setState({
      toastText: sText,
      loading: false,
    });
    setTimeout(() => {
      this.setState({
        toastText: "",
      });
      if (null !== callback) {
        callback();
      }
    }, 2000);
  };

  forgotPassword = async () => {
    this.props.forgotPassword(this.state.email);
    await this.setState({
      loading: true,
    });
  };

  componentWillReceiveProps = async (nextProps) => {
    if (
      !nextProps.screenProps.success &&
      "" !== nextProps.screenProps.messageError
    ) {
      this.showToast(nextProps.screenProps.messageError);
    } else if (nextProps.screenProps.success) {
      this.showToast(
        "A link has been sent to reset your password to your email",
        () => this.props.navigation.navigate("Login")
      );
    }
    await this.setState({
      loading: false,
    });
  };

  render() {
    return (
      <View style={styles.content}>
        <Text style={{ color: GreenFitrecColor }}>
          Enter your email address you use to sign in to FitRec
        </Text>
        <View style={styles.viewSection}>
          <TextInput
            style={styles.textInput}
            placeholder="Email address"
            placeholderTextColor={PlaceholderColor}
            value={this.state.email}
            onChangeText={(text) => this.setState({ email: text })}
            autoCapitalize="none"
          />
        </View>
        <Pressable
          style={styles.button}
          onPress={() => this.forgotPassword()}
        >
          <Text style={{ color: WhiteColor }}>NEXT</Text>
        </Pressable>
        <Toast toastText={this.state.toastText} />
        <LoadingSpinner visible={this.state.loading} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    padding: 10,
    flex: 1,
  },
  textInput: {
    width: "100%",
    height: 40,
    textAlign: "center",
  },
  viewSection: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: PlaceholderColor,
  },
  button: {
    backgroundColor: SignUpColor,
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 15,
  },
});

const mapStateToProps = (state) => ({
  screenProps: state.reducerForgotPassword,
});

const mapDispatchToProps = (dispatch) => ({
  forgotPassword: (sEmail) => {
    dispatch(actionUserForgotPassword(sEmail));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
