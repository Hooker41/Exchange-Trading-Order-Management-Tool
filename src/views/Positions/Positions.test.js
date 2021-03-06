import React from 'react';
import ReactDOM from 'react-dom';
import Positions from './Positions';

jest.mock('react-chartjs-2', () => ({
  Line: () => null,
  Bar: () => null,
}));

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Positions />, div);
  ReactDOM.unmountComponentAtNode(div);
});