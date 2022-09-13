import { Component } from "react";

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
              let minutes = this.state.minutes;
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
    return (
      <div className="pomodro">
        <span className="time">
          {this.state.minutes} Min {this.state.seconds} Sec
          <br />
          {this.state.isBreak == true ? (
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
