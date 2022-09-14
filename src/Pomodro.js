import { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

class Pomodro extends Component {
  constructor() {
    super();
    this.state = {
      seconds: 60,
      minutes: 24,
      isRunning: false,
      isBreak: false,
      isPaused: false,
      msg: "",
      isLoggedIn: false,
      user: null,
      clock: () => {
        if (!this.state.isBreak) {
          if (this.state.minutes >= 0 && this.state.seconds >= 1) {
            if (this.state.seconds === 0) {
              this.setState({ minutes: this.state.minutes - 1 });
              this.setState({ seconds: 60 });
            } else {
              this.setState({ seconds: this.state.seconds - 1 });
            }
          } else {
            this.setState({ ...this.state, isPaused: false, isBreak: true, minutes: 4, seconds: 60 });
          }
        } else {
          if (this.state.minutes >= 0 && this.state.seconds >= 1) {
            if (this.state.seconds === 0) {
              this.setState({ minutes: this.state.minutes - 1 });
              this.setState({ seconds: 60 });
            } else {
              this.setState({ seconds: this.state.seconds - 1 });
            }
            this.state.msg = "Break Time";
          } else {
            this.setState({ ...this.state, isPaused: true, isBreak: false });
            if (this.state.isRunning) {
              this.reset(true);
              clearInterval(this.state.interval);
              this.state.msg = "TimeOut";
            }
          }
        }
      },
      interval: () => {},
    };
    this.tryLogout = this.tryLogout.bind(this);
  }
  componentDidMount() {
    this.checkUserState();
  }
  tryLogin = (user) => {
    let userInfo = user.getBasicProfile();
    let userFirstName = userInfo.getGivenName();
    let userName = userInfo.getName();
    let userEmail = userInfo.getEmail();
    let userPic = userInfo.getImageUrl();

    let userToken = user.tokenObj.access_token.toString();

    let value = {
      userName: userFirstName,
      userFullName: userName,
      userEmail: userEmail,
      userPic: userPic,
      userToken: userToken,
    };
    localStorage.setItem("userInfo", JSON.stringify(value));
    this.checkUserState();
  };
  tryLogout() {
    debugger;
    localStorage.removeItem("userInfo");
    this.setState({
      ...this.state,
      isLoggedIn: false,
      user: {},
    });
    this.checkUserState();
  }
  checkUserState() {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo == null) {
      this.state.isLoggedIn = false;
      this.setState({
        ...this.state,
      });
    } else {
      this.state.isLoggedIn = true;
      this.state.user = userInfo;
      this.setState({ ...this.state });
    }
  }
  reset(isTimeOut) {
    clearInterval(this.state.interval);
    this.setState({
      ...this.state,
      seconds: 60,
      minutes: 25,
      isPaused: false,
      isRunning: false,
      isBreak: false,
      msg: isTimeOut ? "TimeOut" : "",
      interval: () => {},
    });
  }
  render() {
    const clientId = "107513310634-0o17324nu7d7a9jpq6nclcesm66eptrg.apps.googleusercontent.com";

    return (
      <div className="pomodro">
        {this.state.isLoggedIn ? (
          <>
            Hi..{this.state.user.userName}
            <br />
          </>
        ) : (
          <GoogleLogin className="GoogleLogin" clientId={clientId} buttonText="Login" onSuccess={this.tryLogin} cookiePolicy={"single_host_origin"} />
        )}
        {this.state.isLoggedIn ? (
          <>
            <br />
            <GoogleLogout className="GoogleLogout" clientId={clientId} buttonText="LogOut" onLogoutSuccess={this.tryLogout} />
          </>
        ) : null}
        <span className="time">
          {this.state.minutes} Min {this.state.seconds} Sec
          <br />
          {this.state.isBreak === true ? (
            <>
              <span className="breakTitle"> {this.state.msg} </span>
            </>
          ) : (
            <span className="timeOutTitle ">{this.state.msg} </span>
          )}
        </span>
        <span className="utils">
          <input
            type="button"
            className="buttons"
            value="Start"
            onClick={() => {
              this.setState({ isRunning: true, msg: "" });
              clearInterval(this.state.interval);
              this.state.interval = setInterval(() => {
                this.state.clock();
              }, 1000);
            }}
          />
          <input
            type="button"
            className="buttons"
            value="Pause"
            onClick={() => {
              //  below commented code is for toggeling the pause button .. currently combined  with start button..

              // if (this.state.isPaused === true) {
              //   this.setState({ isBreak: false, isPaused: false });
              //   this.state.interval = setInterval(() => {
              //     this.state.clock();
              //   }, 1000);
              // } else {
              clearInterval(this.state.interval);
              this.setState({ ...this.state, isPaused: true });
              // }
            }}
          />

          <input
            type="button"
            className="buttons"
            value="Reset"
            onClick={() => {
              this.reset();
            }}
          />
        </span>
      </div>
    );
  }
}
export default Pomodro;
