import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import AppVue from 'utils/base';

const requireComponent = require.context(
  // The relative path of the components folder
  './components',
  // Whether or not to look in subfolders
  true,
  // The regular expression used to match base component filenames
  /\w+\.(vue|js|ts)$/,
);

const requireControllers = require.context(
  // The relative path of the components folder
  './controllers',
  // Whether or not to look in subfolders
  true,
  // The regular expression used to match base component filenames
  /Ctrl\w+\.(vue|js|ts)$/,
);

const requireDirectives = require.context(
  // The relative path of the components folder
  './directives',
  // Whether or not to look in subfolders
  true,
  // The regular expression used to match base component filenames
  /Directive\w+\.(vue|js|ts)$/,
);
requireComponent.keys().forEach((fileName: string) => {
  // Get component config
  const componentConfig: object = requireComponent(fileName);

  // Get PascalCase name of component
  const componentName = upperFirst(
    camelCase(
      // Strip the leading `./` and extension from the filename
      fileName.replace(/^\.\/(.*)\.\w+$/, '$1'),
    ),
  );

  // Register component globally
  const configData: object = componentConfig.default || componentConfig;
  AppVue.registerComponent(
    configData.name || componentName,
    // Look for the component options on `.default`, which will
    // exist if the component was exported with `export default`,
    // otherwise fall back to module's root.
    componentConfig.default || componentConfig,
  );
});

const controllers: object[] = [];

requireControllers.keys().forEach((fileName: string) => {
  // Get component config
  const controllerConfig = requireControllers(fileName);
  let controllerName = upperFirst(
    camelCase(
      // Strip the leading `./` and extension from the filename
      fileName.replace(/^\.\/(.*)\.\w+$/, '$1'),
    ),
  );

  // Register controller
  const ctrlCfg = controllerConfig.default || controllerConfig;
  controllerName = ctrlCfg.name || controllerName;
  controllers.push([controllerName, ctrlCfg]);
});

requireDirectives.keys().forEach((fileName: string) => {
  requireDirectives(fileName);
});

// eslint-disable-next-line no-new
controllers.forEach((ctrl: object) => {
  AppVue.register(ctrl[0], ctrl[1]);
}); // just register all components

window.addEventListener('load', () => { // when the DOM is ready
  // after everything is registered, we can run the app that will find the right controller, build instance instance,
  // bind it with components, directives, etc
  AppVue.run();
});
