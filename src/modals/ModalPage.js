import React from 'react';
import { ModalPage, ModalPageHeader, PanelHeaderButton, Div, IS_PLATFORM_ANDROID, IS_PLATFORM_IOS } from '@vkontakte/vkui';
//Icons
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';

class Modal extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {params} = this.props;
		const header = (
			<ModalPageHeader
				left={IS_PLATFORM_ANDROID ? <PanelHeaderButton onClick={() => this.props.appnavigator.back()}><Icon24Cancel/></PanelHeaderButton> : false}
				right={IS_PLATFORM_IOS ? <PanelHeaderButton onClick={() => this.props.appnavigator.back()}><Icon24Dismiss/></PanelHeaderButton> : false}>
				{params.title ? params.title : this.props.title}
			</ModalPageHeader>
		);
		return (
			<ModalPage id={this.props.id} header={header} settlingHeight={100}>
				<Div>{(params.content) ? params.content : this.props.children}</Div>
			</ModalPage>
		);
	};

};
export default Modal;
