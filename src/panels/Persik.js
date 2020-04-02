import React from 'react';
import PropTypes from 'prop-types';
import * as api from '../services/api';
import { Panel, Gallery, Header, Separator, HorizontalScroll, Div, IS_PLATFORM_IOS, IS_PLATFORM_ANDROID } from '@vkontakte/vkui';


import Icon28Story from '@vkontakte/icons/dist/28/story';
import '../Style.css';


import ModalGame from '../modals/Game';

class Homes extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
		};
	};

	componentDidMount() {
	};

	render() {
		const props = this.props;
		const state = this.state;
		const {apiGames, appnavigator} = this.props;
		return (
			<Panel id={props.id} theme="white">

			<Div>
				<div className="Logo">
					<span style={{color:'#194C9E'}}>Д</span>
					<span style={{color:'#7DAC41'}}>Е</span>
					<span style={{color:'#FF2D1E'}}>Т</span>
					<span style={{color:'#F48520'}}>С</span>
					<span style={{color:'#8C256F'}}>К</span>
					<span style={{color:'#194C9E'}}>И</span>
					<span style={{color:'#7DAC41'}}>Й</span>
				</div>
			</Div>

						<Div style={{paddingBottom:0}}>
							<div className="Title">
								<div className="Title_Title">Собираем слова по буквам</div>
								<div className="Title_Desc">Для детей в возрасте от 4 до 7 лет</div>
							</div>
						</Div>


							<HorizontalScroll>
													<Div>
							<div className="Games_Scroll_Content">


								{apiGames.response.length !== 0 && apiGames.response.map((item, i) => ((item.type === 'collection_letters' &&
														<div className="Games_Scroll" onClick={() => this.ModalGme(item.id)}>
																<div className="Games_Scroll_Image" style={{backgroundImage:'url('+item.image+')'}}>
																</div>
																<div className="Games_Scroll_Title">{item.name}</div>


															{item.game_finish === 1 && <div className="Games_Scroll_Age">Игра завершена</div>}
														{item.game_start === 0 && <div className="Games_Scroll_Age">Играют детей: {item.count_play}</div>}
													{(item.game_start === 1 && item.game_finish === 0) && <div className="Games_Scroll_Age">Выполнено {item.count_tasks} из {item.count_tasks_summ}</div>}


															</div>
								)))}


						</div>
					</Div>
							        </HorizontalScroll>








														<Div style={{paddingBottom:0}}>
															<div className="Title">
																<div className="Title_Title">Решаем математику</div>
																<div className="Title_Desc">Для детей в возрасте от 5 до 9 лет</div>
															</div>
														</Div>


															<HorizontalScroll>
																					<Div>
															<div className="Games_Scroll_Content">


																{apiGames.response.length !== 0 && apiGames.response.map((item, i) => ((item.type === 'mathematics' &&
																						<div className="Games_Scroll">
																								<div className="Games_Scroll_Image" style={{backgroundImage:'url('+item.image+')'}}>
																								</div>
																								<div className="Games_Scroll_Title">{item.name}</div>
																								<div className="Games_Scroll_Soon">Скоро</div>
																							</div>
																)))}


														</div>
													</Div>
															        </HorizontalScroll>


																			<div style={{marginBottom:20}}/>


			</Panel>
		);
	};

	_ContentGet () {
	};


	ModalGme = (game_id) => {
		const {appnavigator} = this.props;
		api.method('gameId', {game_id, url:appnavigator.url})
		.then((response) => {
			const modal_content = <ModalGame game={response} appnavigator={appnavigator}/>;
			this.props.appnavigator.modal('modal_game', {title:'Игра', content:modal_content});
		})
		.catch((error) => {
		});
	};




};
export default Homes;
