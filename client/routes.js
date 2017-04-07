import base from './components/base.js';
import Main from './components/main.js';
import loginPage from './containers/loginPage.js';
import signUpPage from './containers/signUpPage.js';


const routes = {
  // base component (wrapper for the whole application).
  component: base,
  childRoutes: [

    {
      path: '/',
      component: Main
    },

    {
      path: '/login',
      component: loginPage
    },

    {
      path: '/signup',
      component: signUpPage
    }

  ]
};

export default routes;
