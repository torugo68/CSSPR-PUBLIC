# Client setup instructions

## Install

Set up your project using your preferred package manager. Use the corresponding command to install the dependencies:

| Package Manager                                                | Command        |
|---------------------------------------------------------------|----------------|
| [npm](https://docs.npmjs.com/cli/v7/commands/npm-install)     | `npm install`  |

After completing the installation, your environment is ready for Vuetify development.

Usage

This section covers how to start the development server and build your project for production.

### Starting the Development Server

To start the development server with hot-reload, run the following command. The server will be accessible at [http://localhost:3000](http://localhost:3000):

```bash
npm run dev
```

> Add NODE_OPTIONS='--no-warnings' to suppress the JSON import warnings that happen as part of the Vuetify import mapping. If you are on Node [v21.3.0](https://nodejs.org/en/blog/release/v21.3.0) or higher, you can change this to NODE_OPTIONS='--disable-warning=5401'. If you don't mind the warning, you can remove this from your package.json dev script.

### Building for Production

To build your project for production, use:
(config api url in globalState.ts )

Install pm2:
```bash
npm install -g pm2
```
Run with pm2 
```bash
pm2 start npx -- serve -s dist
```
OR  (process will stop when terminal is closed)

```bash
serve -s dist
```

## License

[MIT License](/LICENSE) © Victor Marques
