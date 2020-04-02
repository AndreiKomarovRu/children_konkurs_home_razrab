import React from 'react';
import { Checkbox, IS_PLATFORM_ANDROID } from '@vkontakte/vkui';
//Icons
import Icon24Play from '@vkontakte/icons/dist/24/play';
import Icon24Replay from '@vkontakte/icons/dist/24/replay';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon24Error from '@vkontakte/icons/dist/24/error';
//Components
import '../Style.css';

class Modal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		const {game, appnavigator} = this.props;
		return (
			<div>

				<div className="GameStats_Image" style={{backgroundImage:'url('+game.image+')'}}/>

				<div className="GameStats_Name">{game.name}</div>
				<div className="GameStats_Desc">{game.description}</div>

					<div className="GameStats_Button_List">

								{game.game_finish === 0 &&
								<div className="GameStats_Button" onClick={() => appnavigator.go('game_collectletters', {id:game.id, restart:false})}>
									<div className="GameStats_Button_Icon"><Icon24Play fill="#74B143"/></div>
									<div className="GameStats_Button_Name">{(game.game_start === 0) ? 'Начать игру' : 'Продолжить'}</div>
								</div>
							}
															{game.game_start === 1 &&
															<div className="GameStats_Button" onClick={() => appnavigator.go('game_collectletters', {id:game.id, restart:true})}>
																<div className="GameStats_Button_Icon"><Icon24Replay fill="#EF4A3E"/></div>
																<div className="GameStats_Button_Name">Начать заново</div>
															</div>
														}

														</div>







					{game.stats.map((item, i) => (
						<div className="GameTask">
							<div className="GameTask_Title">
								{item.title}
								{item.status === 'error' && <span className="GameTask_Otvet">{item.otvet}</span>}
							</div>
							<div className="GameTask_Right">
								<div className="GameTask_Time">{this.Seconds(item.count_time)}</div>
								{item.status === 'success' && <div className="GameTask_Status success"><Icon24Done/></div>}
								{item.status === 'error' && <div className="GameTask_Status error"><Icon24Error/></div>}
							</div>
						</div>
					))}

					<div style={{marginBottom:20}}/>


			</div>
		);
	};





		Seconds(time) {
			var seconds = parseInt((time / 1) % 60);
			var minutes = parseInt((time / (1 * 60)) % 60);
			var hours = parseInt((time / (1 * 60 * 60)) % 24);
			hours = (hours > 0) ? hours+':' : '';
			seconds = (seconds < 10) ? '0' + seconds : seconds;
			return hours+minutes+':'+seconds;
		}


};
export default Modal;
