import React from 'react';
import ReactDOM from 'react-dom';
import Trade from './Trade';

jest.mock('react-chartjs-2', () => ({
  Line: () => null,
  Bar: () => null,
}));

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Trade />, div);
  ReactDOM.unmountComponentAtNode(div);
});