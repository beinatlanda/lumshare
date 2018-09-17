import React, { Component } from 'react';
import firebase from 'firebase';

import './App.css';
import FileUpload from './FileUpload';


class App extends Component {
  constructor () {
    super();
    this.state = {
      user: null,
      pictures: []
    };

    this.handleAuth = this.handleAuth.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentWillMount () {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
    });

    firebase.database().ref('pictures').on('child_added', snapshot => {
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      });
    });
  }

  handleAuth () {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
      .then(result => console.log(`${result.user.email} has loggded in`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleLogout () {
    firebase.auth().signOut()
      .then(result => console.log(`${result.user.email} has logged out`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }
  //Upload to firebase cloud storage
  handleUpload (event) {
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(`photos/${file.name}`);
    const task = storageRef.put(file);

    task.on('state_changed', snapshot => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.setState({
        uploadValue: percentage
      })
    }, error => {
      console.error(error.message);
    }, () => {
      // Upload complete
      const record = {
        photoURL: this.state.user.photoURL,
        displayName: this.state.user.displayName,
        image: task.snapshot.downloadURL
      }
      const dbRef = firebase.database().ref('pictures');
      const newPicture = dbRef.push();
      newPicture.set(record);
    });
  }
  //Login button jsx
  renderLoginButton () {
    if (!this.state.user) {
      return (
        <button onClick={this.handleAuth} className="App-btn LogIn-btn">
          Log in with Google
        </button>
      );
    } else  {
      return (
        <div className="App-intro">
          <h2 className="App-intro">¡Hi, { this.state.user.displayName }!</h2>

          <button onClick={this.handleLogout} className="App-btn LogOut-btn">
            Log out
          </button>

          <FileUpload onUpload={ this.handleUpload }/>

          {
            this.state.pictures.map(picture => (
              <div className="App-card">
                <figure className="App-card-image">
                  <img width="320" src={picture.image} />
                  <figCaption className="App-card-footer">
                    <img className="App-card-avatar" src={picture.photoURL} alt={picture.displayName} />
                    <span className="App-card-name">{picture.displayName}</span>
                  </figCaption>
                </figure>
              </div>
            )).reverse()
          }

        </div>

      );
    }
  }
  //header render
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1 className="App-branding">Lumshare</h1>
        </div>
        { this.renderLoginButton() }
      </div>
    );
  }
}

export default App;
