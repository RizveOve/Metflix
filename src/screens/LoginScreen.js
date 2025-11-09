import { useState } from 'react';
import './LoginScreen.css';

function LoginScreen({ onLogin }) {
  const [signIn, setSignIn] = useState(false);

  return (
    <div className="loginScreen">
      <div className="loginScreen__background">
        <img
          className="loginScreen__logo"
          src="https://assets.stickpng.com/images/580b57fcd9996e24bc43c529.png"
          alt="Netflix Logo"
        />
        <button 
          onClick={() => setSignIn(true)}
          className="loginScreen__button"
        >
          Sign In
        </button>

        <div className="loginScreen__gradient" />
      </div>

      <div className="loginScreen__body">
        {signIn ? (
          <SignInScreen onLogin={onLogin} />
        ) : (
          <>
            <h1>Unlimited movies, TV shows, and more.</h1>
            <h2>Watch anywhere. Cancel anytime.</h2>
            <h3>Ready to watch? Enter your email to create or restart your membership.</h3>

            <div className="loginScreen__input">
              <form>
                <input type="email" placeholder="Email address" />
                <button 
                  onClick={() => setSignIn(true)}
                  className="loginScreen__getStarted"
                >
                  GET STARTED
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SignInScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      onLogin(email);
    }
  };

  return (
    <div className="signupScreen">
      <form onSubmit={handleSubmit}>
        <h1>Sign In</h1>
        <input 
          placeholder="Email" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          placeholder="Password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">
          Sign In
        </button>

        <h4>
          <span className="signupScreen__gray">New to Netflix? </span>
          <span className="signupScreen__link" onClick={handleSubmit}>
            Sign Up now.
          </span>
        </h4>
      </form>
    </div>
  );
}

export default LoginScreen;