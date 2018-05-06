import React from 'react';
import ReactDOM from 'react-dom';
import Preferences from './Preferences';

jest.mock('react-chartjs-2', () => ({
  Line: () => null,
  Bar: () => null,
}));

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Preferences />, div);
  ReactDOM.unmountComponentAtNode(div);
});