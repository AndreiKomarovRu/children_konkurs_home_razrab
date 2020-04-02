import React from 'react';
import PropTypes from 'prop-types';
import * as api from '../services/api';
import bridge from '@vkontakte/vk-bridge';
import { Panel, IS_PLATFORM_IOS, IS_PLATFORM_ANDROID } from '@vkontakte/vkui';
import '../Style.css';

class Home extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			game_id: this.props.params.id,
			statusStart: '',
			statusTask: '',
			key: '',
			data: {
				word: '',
				letters: [],
				letters_del: [],
				select_letters: [],
				active_letter_i: '',
				image: '',
				audio_success: ''
			},
			message: {
				title: 'Задача',
				text: 'Собрать из букв слово, которое изображено на картинке.',
				button_back: false,
			},
			alphabet: ['','а','б','в','г','д','е','ё','ж','з','и','й','к','л','м','н','о','п','р','с','т','у','ф','х','ц','ч','ш','щ','ъ','ы','ь','э','ю','я']
		};
	};


	componentDidMount() {



		const {params, appnavigator} = this.props;
	api.method('gameStart', {game_id:params.id, restart:(params.restart) ? 1 : 0, url:appnavigator.url})
	.then((response) => {
		if (response === 1) {


				setTimeout(() => {
								this.TaskGet();
				}, 7000);


				this.props.sound.soundPlay('https://mwidget.ru/audios/game_collection_letters/lets_play.wav');

		}
	})
	.catch((error) => {
	});


	};


	render() {
		const props = this.props;
		const state = this.state;
		const {data} = this.state;
		return (
			<Panel id={props.id} theme="white" separator={false}>
				<div className={"Game " + state.statusTask + " " + state.statusStart} style={{width:window.innerWidth, height:window.innerHeight}}>
					{state.statusTask === 'success' && <div className="Game_Background success"></div>}
					{state.statusTask === 'error' && <div className="Game_Background error"></div>}

					<div className="Game_Image" style={{backgroundImage:'url('+data.image+')', width:window.innerWidth*0.7, height:window.innerWidth*0.7}}/>




																						<div className="Window_Content">

																							<div className="Window_Content_Background">
																								{state.statusTask === 'success' && <div className="Window_Content_Word">{data.word}</div>}
																							</div>


																							<div className="Window_Content_Items">
																								{data.letters.map((item, i) => (
																									<div className="Window_Item">
																										{data.select_letters[i] && <div className="Window_Item_Letter">{data.select_letters[i]}</div>}
																									</div>
																								))}
																							</div>
																						</div>



																																							<div className="Game_Test"></div>

																																							{state.message.title && <div className="Game_Test_Message">
																																								<div className="Game_Test_Title">{state.message.title}</div>
																																								<div className="Game_Test_Text">{state.message.text}</div>
																																								{state.message.button_back && <div className="Game_Test_Button" onClick={() => this.props.appnavigator.back()}>Хорошо</div>}
																																							</div>}

																																							<div className="Game_Test2"></div>




					<div className="Game_Bottom">


				{state.statusStart === 'start' && <div className="Letter_Content">
			{data.letters.map((item, i) => (
				<div className={"Letter_Item " + (data.letters_del.indexOf(i) !== -1 ? "select" : "") + " " + (data.active_letter_i === i ? "active" : "")} onClick={() => this.SelectLetter(i)}>
					<div className="Letter_Item_Letter">
						{item}
					</div>
				</div>
			))}
		</div>}

	</div>

				</div>
			</Panel>
		);
	};

	_ContentGet () {
	};



 	SelectLetter = (i) => {
		const {data} = this.state;
		const {sound} = this.props;
		const letter = data.letters[i];
		if (data.letters_del.indexOf(i) === -1) {

		if (i !== data.active_letter_i) {

			this.setState({ data:{...this.state.data, active_letter_i:i} });
			const audio = this.state.alphabet.indexOf(letter);
			sound.soundPlay('https://mwidget.ru/audios/alphabet/'+audio+'.wav');

		} else {



			this.props.sound.soundPlay('https://mwidget.ru/audios/game_collection_letters/effect_select_letter.wav');
			const select_letters = JSON.parse(JSON.stringify(data.select_letters));
			const letters_del = JSON.parse(JSON.stringify(data.letters_del));
			select_letters.push(letter);
			letters_del.push(i);
			this.setState({ data:{...this.state.data, select_letters, letters_del} });

			//Если слово собрано полностью
			setTimeout(() => {
			if (select_letters.length === data.letters.length) {
				if (select_letters.join('') === data.word) {
					//Правильный овтет
					this.TaskResult('success', select_letters.join(''));
				} else {
					//Неправильный ответ
					this.TaskResult('error', select_letters.join(''));
				}
			}
			}, 1000);

		}
	}
	};




	TaskGet = () => {
		const {appnavigator} = this.props;
		api.method('taskGet', {game_id:this.state.game_id, url:appnavigator.url})
		.then((response) => {
			this.setState({
				statusTask: '',
				statusStart: 'start',
				key: response.key,
				data:{
					...this.state.data,
					word: response.data.word,
					letters: response.data.letters,
					letters_del: [],
					select_letters: [],
					active_letter_i: false,
					image: response.data.image,
					audio_success: response.data.audio_success
				},
				message: {
					title: false,
					text: false,
					button_back: false
				},
			});
		})
		.catch((error) => {
		});
	};


	 TaskResult = (status, otvet) => {
		const state = this.state;
		const {appnavigator} = this.props;
		this.setState({ statusTask:status });
		if (status === 'success')this.props.sound.soundPlay('https://mwidget.ru/audios/tasks/'+this.state.data.audio_success+'.wav');
	if (status === 'error')this.props.sound.soundPlay('https://mwidget.ru/audios/task_error_1.wav');


		api.method('taskResult', {key:state.key, status, otvet, url:appnavigator.url})
		.then((response) => {


							setTimeout(() => {
								this.setState({ statusStart:'end' });
								setTimeout(() => {
									if (response === 'next') this.TaskGet();

									if (response === 'finish') {
										this.props.sound.soundPlay('https://mwidget.ru/audios/game_finish.wav');
											this.setState({
												message: {
													title: 'Игра завершена',
													text: 'Возвращайтесь к этой игре завтра, чтобы закрепить знания.',
													button_back: true
												},
											});
									}

								}, 1000);
							}, 3000);








		})
		.catch((error) => {
		});
	};


};
export default Home;
