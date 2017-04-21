import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import jQuery from 'jquery'; 
import moment from 'moment'; 
import uuid from 'uuid';
import logo from './logo.svg';
import './App.css';
import 'moment/locale/fr';

const service = "http://cuicui.local:5984/";

class App extends Component {
  render() {
    const path = this.props.match.url;
    const user = this.props.match.params.user;
    const hashtag = this.props.match.params.hashtag;
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Cuicui !
            {(user)? ` – @${user}` : ""}
            {(hashtag)? ` – #${hashtag}` : ""}
          </h2>
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

  componentDidUpdate(prevProps) {
    if (this.props.path !== prevProps.path) {
      this._fetchTweets();
    }
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
    jQuery.ajax({
      method: 'POST',
      url: service,
      contentType: 'application/json',
      data: JSON.stringify(doc)
    });
    this.setState({tweets: [{doc}].concat(this.state.tweets)});
  }

  _fetchTweets() {
    let url = service + this.props.path;
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
        <Text raw={this.props.text} />
      </div>
    );
  }
}

class Text extends React.Component {
  render() {
    let styled = this._getStyled();
    return (
      <div className="text">{styled}</div>
    );
  }

  _getStyled() {
    return this.props.raw.match(/(([^@#]+)|(@\w+)|(#\w+))/g).map((match, i) => {
      switch (match[0]) {
        case "@":
          return <Link key={i} to={`/user/${match.substring(1)}`}>{match}</Link>;
        case "#":
          return <Link key={i} to={`/hashtag/${match.substring(1)}`}>{match}</Link>;
        default:
          return match;
      }
    });
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
