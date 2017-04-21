import React, { Component } from 'react';
import jQuery from 'jquery'; 
import moment from 'moment'; 
import logo from './logo.svg';
import './App.css';
import 'moment/locale/fr';

const url = "http://cuicui.local:5984/";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Cuicui !</h2>
        </div>
        <Feed />
      </div>
    );
  }
}

class Feed extends React.Component {
  constructor() {
    super();
    this.state = {
      tweets:[]
    };
  }

  render() {
    const tweets = this._getTweets();
    return (
      <div className="feed">
        {tweets}
      </div>
    );
  }

  componentDidMount() {
    this._fetchTweets();
    this._timer = setInterval(
      () => this._fetchTweets(),
      5000
    );
  }

  componentWillUnmount() {
    clearInterval(this._timer);
  }

  _fetchTweets() {
    jQuery.ajax({
      method: "GET",
      url,
      success: (data) => {
        this.setState({tweets: data.rows})
      }
    });
  }

  _getTweets() {
    return this.state.tweets.map((x) =>
      <Tweet key={x.doc._id} user={x.doc.user} text={x.doc.text} created_at={x.doc.created_at} />
    );
  }
}

class Tweet extends React.Component {
  render() {
    const timezone = moment().utcOffset();
    const timestamp = moment(this.props.created_at).utcOffset(timezone).format("LLLL");
    return (
      <div className="tweet">
        <div className="user">{this.props.user}</div>
        <div className="timestamp">{timestamp}</div>
        <div className="text">{this.props.text}</div>
      </div>
    );
  }
}

export default App;
