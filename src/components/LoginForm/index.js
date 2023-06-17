import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    isUsernameError: false,
    isPasswordError: false,
    submitError: false,
    errorMsg: '',
  }

  // On Successfull Login
  onLoginSuccess = token => {
    const {history} = this.props
    Cookies.set('jwt_token', token, {expires: 2})
    history.replace('/')
  }

  // On Failure Login
  onFailureLogin = errorMsg => {
    this.setState({submitError: true, errorMsg})
  }

  //  OnFormSubmit
  onFormSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userLoginDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userLoginDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    // console.log(data);
    if (response.ok) {
      this.onLoginSuccess(data.jwt_token)
    } else {
      this.onFailureLogin(data.error_msg)
    }
  }

  // Password Container
  getPasswordInput = () => {
    const {password, isPasswordError} = this.state
    const onPasswordVlaue = event => {
      this.setState({password: event.target.value})
    }

    const onBlurPassword = () => {
      if (password === '') {
        this.setState({isPasswordError: true})
      } else {
        this.setState({isPasswordError: false})
      }
    }

    return (
      <div className="inputContainer">
        <label htmlFor="password" className="loginLabel">
          PASSWORD<span className="starError">*</span>
        </label>
        <input
          type="password"
          id="password"
          className="inputBox"
          placeholder="Password"
          value={password}
          onChange={onPasswordVlaue}
          onBlur={onBlurPassword}
        />
        {isPasswordError && <p className="errorMsg">*Required</p>}
      </div>
    )
  }

  //  Username Container
  getUsernameInput = () => {
    const {username, isUsernameError} = this.state
    const onUsernameVlaue = event => {
      this.setState({username: event.target.value})
    }

    const onBlurUsername = () => {
      if (username === '') {
        this.setState({isUsernameError: true})
      } else {
        this.setState({isUsernameError: false})
      }
    }

    return (
      <div className="inputContainer">
        <label htmlFor="username" className="loginLabel">
          USERNAME<span className="starError">*</span>
        </label>
        <input
          type="text"
          id="username"
          className="inputBox"
          placeholder="Username"
          value={username}
          onChange={onUsernameVlaue}
          onBlur={onBlurUsername}
        />
        {isUsernameError && <p className="errorMsg">*Required</p>}
      </div>
    )
  }

  // Website Rendring
  render() {
    const {submitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="main">
        <div className="loginCard">
          <div className="websiteLogoContainer">
            <img
              className="wesiteLogo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </div>
          <div className="formContainer">
            <form onSubmit={this.onFormSubmit}>
              {this.getUsernameInput()}
              {this.getPasswordInput()}
              <div className="loginBtnContanier">
                <button type="submit" className="loginBtn">
                  Login
                </button>
                {submitError && <p className="errorMsg">{errorMsg}</p>}
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginForm
