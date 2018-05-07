import {
  Colors,
  Positions,
  Preferences,
  Trade,
} from './views';
import Full from './containers/Full';

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: Full },
  { path: '/positions', name: 'positions', component: Positions },
  { path: '/preferences', name: 'preferences', component: Preferences },
  { path: '/trade', name: 'trade', component: Trade },
];

export default routes;
