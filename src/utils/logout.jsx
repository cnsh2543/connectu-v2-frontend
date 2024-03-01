import Cookies from 'js-cookie';

const logout = () => {

  // Function to remove a specific cookie
    Cookies.remove('tokenConnect');
    window.location.reload();
};

export default logout;