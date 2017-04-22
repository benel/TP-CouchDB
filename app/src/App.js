import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import jQuery from 'jquery'; 
import moment from 'moment'; 
import uuid from 'uuid';
import logo from './logo.svg';
import './App.css';
import 'moment/locale/fr';

const url = "http://cuicui.local:5984/";

class App extends Component {
  render() {
    const path = this.props.match.url;
    const user = this.props.match.params.user;
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Cuicui ! {user? `– ${user}` : ''}</h2>
        </div>
        <Feed path={path} />
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
        <TweetForm addTweet={this._addTweet.bind(this)} />
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

  _addTweet(user, text) {
    const doc = {
      _id: uuid(),
      user,
      text
    };
    this.setState({tweets: [{doc}].concat(this.state.tweets)});
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
    const user = this.props.user;
    return (
      <div className="tweet">
        <div className="user"><Link to={`/user/${user}`}>{user}</Link></div>
        <div className="timestamp">{timestamp}</div>
        <div className="text">{this.props.text}</div>
      </div>
    );
  }
}

class TweetForm extends React.Component {
  render() {
    return (
      <form className="tweet-form" onSubmit={this._handleSubmit.bind(this)}>
        <div>
          <input placeholder="Qui êtes-vous ?" ref={(x) => this._user = x} />
        </div>
        <div>
          <input className="new-tweet" placeholder="Quoi de neuf ?" ref={(x) => this._text = x} />
          <button type="submit">Publier</button>
        </div>
      </form>
    );
  }

  _handleSubmit(event) {
    event.preventDefault();
    this.props.addTweet(this._user.value, this._text.value);
    this._user.value = null;
    this._text.value = null;
  }
}

export default App;
