# TODO - React client and Electron app
> Originally developed as a take-home test project for Orca.

### System requirements
- Node (v11.3.0)
- npm (v6.4.1)

Tested mainly in Google Chrome (v70) running on MacOS Sierra (v10.12).

### Built and tested with
- Node (v11.3.0)
- npm (v6.4.1)
- React + React DOM (v16.6.3) (using Create React App)
- React scripts (v2.1.1)
- Bootstrap (v4.1.3)
- Font Awesome (v5.5.0)

Dev-only tools:
- Electron (v3.0.10)
- electron-builder (v20.38.2)
- concurrently (v4.1.0)
- wait-on (v3.2.0)

### How to run this locally
1. Clone this repo
2. Run: `npm start`
3. Go to `http://localhost:3000` and play with it
4. Run `npm test` to run test cases

Note that the client will point to the **production** back-end.
If you want to run also the back-end locally, you need to do 2 steps:  
- Check https://www.github.com/jcpmmx/TODO-flask_backend on how to run the Flask server locally
- Change `API_ENDPOINT_URL` (in `src/app/config.js`) to `http://localhost:5000`

### How to run the Electron app locally
1. Clone this repo
2. Run: `node electron-start` (this run a local server for React and launch Electron at the same time) 
3. App will be opened in foreground while webpack runs on terminal

### Optional: create a new version of the Electron app
Run: `node electron-dist` (this will create a new MacOS .dmg in the `dist/` folder) 

---

### About this solution

UI comes with the following sections:
- A text `input` for creating new items
- The list of all current items
- A status text at the bottom

Each of the items can be toggled by clicking on them, or deleted altogether by clicking the trash bin icon.

Internally, the React app is composed of 4 components:  
- `TODOForm`: coordinates the creation of a new item using the text `input`
- `TODOItem`: coordinates the internal data and the available operations of an item
- `TODOList`: coordinates the list of items
- `TODOApp`: the master component that coordinates the main state (list of items and status text) and all API interactions

Once loaded, `TODOApp` hits the API to load the initial list of TODO items and passes them over to `TODOList`.
For each item, `TODOList` relies on `TODOItem` to hook up the internals of a single item.
`TODOForm` communicates directly with `TODOApp` to manage new items.

Since all API interactions are managed by `TODOApp`, child components must handle first the UI interaction and events (e.g. changing an item class once toggle) and then rely on `TODOApp` to manage the API requets/response that will finally modify the main state and re-render the entire UI.

> Global configurations are available at `src/app/config.js` and utility methods at `src/app/utils.js`.

### Limitations
- If you open more than once instance of the client/app and do a change it won't reflect into other instances

### Nice to haves
- Adding suppport for multiple TODO lists (assuming back-end already does)
- Adding real-time support to overcome *Limitations*
- Making sure it works OK on multiple browsers and devices/platforms
