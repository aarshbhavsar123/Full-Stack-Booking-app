import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passwordError, setPasswordError] = useState('');

  async function handleRegister(e) {
    e.preventDefault();
    try{
      if (password !== confirmPass) {
        setPasswordError('Passwords do not match');
      } else {
        await axios.post('http://localhost:4000/register',{
          email,
          name,
          password,
          confirmPass
        });
        setPasswordError('');
        alert("Registration Successful. Now you can log in");
      }
    }
    catch(e){
      alert("Registration failed. Please try again later");
    }
  };

  return (
    <div className="flex-col min-h-screen grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4 font-bold">Register</h1>
        <form className="max-w-md mx-auto my-2 py-2" onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Enter your E-Mail address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            required
          />
          {passwordError && <p className="text-red-500">{passwordError}</p>}
          <button type="submit" className="primary">
            Register
          </button>
          <div className="text-center py-2 text-gray-500">
            Already a member?
            <Link to={'/login'} className="underline text-blue">
              {' '}
              Login Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
