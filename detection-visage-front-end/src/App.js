import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkFom";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import './App.css';

// const app = new Clarifai.App({
//   apiKey: 'bbbe93bd21d84b709b5816e577415c34'
// });

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialStat ={
  url: '',
      imageUrl: '',
      box: {},
      //route state afin se verifier nos deplacement sur les differentes page 
      route: 'signin',
      isSignedIn: false,
      user :{
        id:'',
        username:'',
        email:'',
        entries:0,
        joined:'',
      }
}


class App extends Component {
  constructor() {
    super();
    this.state = initialStat;
  }

  calculateFaceLocation = (data) => {
   
    // on selectionne l'image pour obtenir sa taille initial
    const image = document.getElementById("inputimage");
    const width = Number(image.naturalWidth);
    const height = Number(image.naturalHeight);
    const widthSmall = Number(image.width);

    // on calcule le coefficient d'ajustement de la taille 
    const scale = width / widthSmall;

    /*
    pour afficher le portrait ciblant le visage ;on utilise 
    un objet qui affichera les differents points reliés entre-elles 
    à l'aide de CSS
    */

    return {
      left: (data[0].faceRectangle.left / scale)+"px",
      top:(data[0].faceRectangle.top / scale) +"px",
      width: (data[0].faceRectangle.width / scale)+"px",
      height: (data[0].faceRectangle.height / scale)+"px",
      
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box });
  }

  onInputChange = (event) => {

    this.setState({ url: event.target.value });
  }

  onButtonSubmit = () => {
    // renvoit à l'api de face api, afin d'analyser l'image  

    this.setState({imageUrl: this.state.url});
    fetch('http://localhost:8081/api', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        url: this.state.url
      })
    })
    .then(response => response.json())
    .then(response => {
      console.log(response)
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ isSignedIn: false })
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route });
  }

  render() {
    return (
      <div className="App">
        <Particles className="particles"
          params={particlesOptions}
        />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        {this.state.route === 'home'
          ? <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
          </div>

          : (
            this.state.route === 'signin'
              ? <SignIn onRouteChange={this.onRouteChange} />
              : <Register onRouteChange={this.onRouteChange} />

          )


        }
      </div>
    );
  }
}

export default App;
