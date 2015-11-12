import React from 'react';
import SocialButton from './social_button';
import * as l from '../../lock/index';

export default class SocialButtonsPane extends React.Component {

  render() {
    const { lock } = this.props;

    const buttons = l.ui.connections(lock).map(x => (
      <SocialButton key={x} name={x} lock={lock} />
    ));

    return <div>{buttons}</div>;
  }

}

SocialButtonsPane.propTypes = {
  lock: React.PropTypes.object.isRequired
};
