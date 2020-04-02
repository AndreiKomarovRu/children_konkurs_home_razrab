import React from 'react';
import { ModalCard } from '@vkontakte/vkui';

class Modal extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {icon, title, caption, actions} = this.props;
		for (var i in actions) if (actions[i].action === 'close') actions[i].action = () => this.props.appnavigator.back();
		return (
			<ModalCard id={this.props.id}
				icon={icon}
				title={title}
				caption={caption}
				actions={actions}
				onClose={() => this.props.appnavigator.back()}
				>
			</ModalCard>
		);
	};


};
export default Modal;
