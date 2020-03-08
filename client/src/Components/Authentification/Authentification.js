import React, { Component } from 'react';
import './instaAuth.css';
import Profile from '../Profile/Profile';

class Authentification extends Component {
  constructor(propos){
    super(propos);
    this.state = {username: '', password: '', message: '', isLoggedIn: true, userdata:
      {
        userid : '',
        username : '',
        fullname : '',
        profile_pic : ''
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event,type) {
    if(type === 'username')
      this.setState({username: event.target.value});
    if(type === 'password')
      this.setState({password: event.target.value});

  }

  componentDidMount()
  {
    this.loadApi((data) =>
    {
        if(data != null){
          if(data.isLoggedIn){
            this.setState({isLoggedIn: true, userdata: data.userdata})
          }
          else
          {
            if(this.state.isLoggedIn)
                this.setState({isLoggedIn: false, userdata: data.userdata})
          }
        }
    })
  }


  loadApi(callback){
    fetch('/localapi',
    {
      method:'GET',
      credentials: 'include',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      }
    }).then(response => response.json())
    .then(json => {
          callback(json)
    }).catch(e =>
    {
        callback(null)
    })
  }

  handleSubmit(event) {
    fetch('/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state)
    }).then(response => response.json())
    .then(json =>
    {
      if(json.success)
        this.setState({message: 'Logged in successfully', userdata: json.userdata, isLoggedIn: true})
      else
      {
        this.setState({message: json.message.message})
      }
    }).catch(e =>
    {
      this.setState({message: "Something went wrong! Try again"})
    })
    event.preventDefault();
  }

  render(){
  var profileComponent = <Profile userdata={this.state.userdata} />
  return (

    <div class="container" id="container">
            <div class="nav-container headers-container">
                <div class="logo">
                    <a href="/" title="Iconosquare Pro" class="logo-icono">
                        <i class="nav-logo-icon icon-iconosquare nav-short-padding"></i>
                        <span>iconosquare</span>
                    </a>
                        <i class="nav-logo-icon icon-iconosquare nav-short-padding"></i>
                    <span>iconosquare</span>
                </div>

                <ul class="nav-menu">
                    <li class="visible-tablet ">
                        <a href="/about" class="nav-link" title="About">
                            About                </a>
                    </li>
                    <li class="visible-tablet ">
                        <a href="/about" class="nav-link" title="About">
                            About                </a>
                    </li>

                    <li class="visible-tablet ">
                        <a href="/about" class="nav-link" title="About">
                            About                </a>
                    </li>
                    <li class="visible-tablet ">
                        <a href="/about" class="nav-link" title="About">
                            About                </a>
                    </li>
                </ul>
                <div id="js-btns" class="btns-wrapper">
                  <i class="fa fa-sun-o" aria-hidden="true"></i>

                    <label> 
                        <input type="checkbox" />
                        <span class="check"> </span>
                    </label>

                    <i class="fa fa-moon-o" aria-hidden="true"></i>

                </div>



                <div class="acc-btn-menu">
                    <img class="AVATAR-ACC-BTN" src="https://instagram.ftun3-1.fna.fbcdn.net/v/t51.2885-19/s320x320/43395549_1638642019569814_4565983791121694720_n.jpg?_nc_ht=instagram.ftun3-1.fna.fbcdn.net&_nc_ohc=qX-Ktqp4srEAX88kMHj&oh=5eaf7a39f16afc04509eba9d447d5fd7&oe=5E84B086" alt="profile card"/>
                  <div class="acc-btn-menu-content">
                    <ul class="avatar-root">
                      <li class="li-avatarroot">
                        <a class="link-li-avatarroot" href="#">Token</a>
                      </li>
                      <li class="li-avatarroot">
                        <a class="link-li-avatarroot" href="#">Logout</a>
                      </li>
                    </ul>
                  </div>
                </div>
            </div>

      <div class=" sss-container">
        <div class=" profile-container">
        {this.state.isLoggedIn ? profileComponent :
          <div class="wrapper1">
            <div class="login-card js-login-card">
              <div class="form-container sign-in-container">
                <form>
                  <h1>Sign in</h1>
                  <span>use your instagram account</span>
                  <div class="isa_error">

                      {this.state.message}
                  </div>
                  <input type="text" value={this.state.value} placeholder="Username" onChange={(e) => this.handleChange(e,'username')} />
                  <input type="password" value={this.state.value} placeholder="Password" onChange={(e) => this.handleChange(e,'password')} />
                  <input type="submit" onClick={this.handleSubmit} value="Sign In" />
                </form>
              </div>
            </div>
          </div>}
      </div>
    </div>
  </div>
  );
  }
}


export default Authentification;
