# Platelet web

This is the web front end for Platelet. It works with an instance of platelet-api. It uses React, Material-UI, Redux, Redux-Saga and other NPM libraries.

## Setup

There is minimal setup required for running this project. On Ubuntu 20.04, install the package `npm`

`sudo apt install npm`

In the project directory run:

`npm install`

and

`npm start`

to run the development server. You can then navigate to http://localhost:3000 to load platelet-web.

## Environment Variables

###### REACT_APP_API_URL

This is the URL for the Platelet API you'd like to connect to. For example if you are running the API on localhost:

`http://localhost:5000/api/v0.1/`

You can use https or http and the full URL must be set including the leading `/`.

###### REACT_APP_SOCKET_API_URL

This is the URL for the socketio websocket server. Platelet API provides a websocket server using Flask-SocketIO, so in most cases this can be the same as `REACT_APP_API_URL`.

###### REACT_APP_THROW_ERRORS

Set this to `true` if Redux should throw errors instead of handling them and showing a notification. This can be helpful when developing.

###### REACT_APP_DISABLE_SOCKETS

Set this to `true` if socket updates should be disabled.

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
