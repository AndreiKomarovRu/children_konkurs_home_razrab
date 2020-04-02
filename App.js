import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player'
import ScrollListener from 'react-scroll-listen'
import * as api from './services/api';
import bridge from '@vkontakte/vk-bridge';
import { ConfigProvider, View, ModalRoot, ScreenSpinner, Alert, IS_PLATFORM_IOS, IS_PLATFORM_ANDROID } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Persik from './panels/Persik';
import PanelGame_CollectLetters from './panels/Game_CollectLetters';
import './Style.css';
import AppModalPage from './modals/ModalPage';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			apiGames: {response:[], isLoad:true, isFailer:false},
			sound: {
				url: '',
				playing: false,
				soundPlay: this.soundPlay,
			},

			activePanel: 'home',
			activeModal: null,
			activePopout: null,
			appnavigator: {
				url: window.location.href,
				historys: [{type:'panel', id:'home', params:false, i:0}],
				historysPanel: ['home'],
				historysModal: [],
				activeParams: {home:false, byid:false, create:false},
				go: this.go,
				back: this.back,
				modal: this.modal,
				modalContentHeight: this.modalContentHeight,
				alert: this.alert,
				popout: this.popout,
				popoutLoad: this.popoutLoad,
				onSwipeBack: this.onSwipeBack,
				scroll: 0
			},
			isSwipeBack: true,
			modalcontentheight: null,
		};
	};

	componentDidMount() {
		this.ApiGames();

				bridge.send("VKWebAppSetViewSettings", {"status_bar_style": "dark", "action_bar_color": "none"});

		//Получаем инфу bridge
		bridge.subscribe((e) => {
			switch (e.detail.type) {
			}
		});
		//History Back
		window.addEventListener("popstate", this.historyBack);
		// Init VK  Mini App
		setTimeout(() => { bridge.send('VKWebAppInit'); }, 1000);
		//Поддержка Story Box
	};

	render() {
		const state = this.state;
		const {appnavigator} = this.state;
		const modal = (
			<ModalRoot activeModal={state.activeModal}>
				<AppModalPage id="modal_game" params={state.appnavigator.activeParams.modal_game} appnavigator={state.appnavigator} title="Статистика" onClose={this.back}/>
			</ModalRoot>
		);
		return (
			<div>
			<ConfigProvider isWebView={true} webviewType="vkapps" scheme={this.props.scheme}>
				<View activePanel={state.activePanel} modal={modal} popout={state.activePopout} header={false} onSwipeBack={this.back} history={state.isSwipeBack ? state.appnavigator.historysPanel : false}>
					<Persik id="home" apiGames={state.apiGames} appnavigator={state.appnavigator}/>
      		<PanelGame_CollectLetters id="game_collectletters" sound={state.sound} appnavigator={appnavigator} params={appnavigator.activeParams.game_collectletters}/>
				</View>
			</ConfigProvider>
			<ScrollListener onScroll={scroll => this.setState({ appnavigator:{...this.state.appnavigator, scroll }})}/>
			<ReactPlayer ref={this.ref} url={state.sound.url} playing={state.sound.playing} width={0} height={0}/>
			</div>
		);
	};

	go = (activePanel, params=false) => {
		window.history.pushState(activePanel, '');
		const historys = [...this.state.appnavigator.historys];
		const historysPanel = [...this.state.appnavigator.historysPanel];
		historys.push({type:'panel', id:activePanel, params});
		historysPanel.push(activePanel);
		this.setState({ activePanel:activePanel, activeModal:null, appnavigator:{...this.state.appnavigator, historys, historysPanel, activeParams:{...this.state.appnavigator.activeParams, [activePanel]:params} } });
	};


	back = () => {
		window.history.back();
	};
	modal = (activeModal, params=false) => {
		window.history.pushState(activeModal, '');
		const historys = [...this.state.appnavigator.historys];
		const historysModal = [...this.state.appnavigator.historysModal];
		historys.push({type:'modal', id:activeModal, params});
		historysModal.push(activeModal);
		this.setState({ activeModal:activeModal, isSwipeBack:false, appnavigator:{...this.state.appnavigator, historys, historysModal, activeParams:{...this.state.appnavigator.activeParams, [activeModal]:params} } });
	};
	popout = (id, activePopout) => {
		window.history.pushState({id:id}, id);
		const historys = [...this.state.appnavigator.historys];
		historys.push({type:'popout', id:id, params:false, i:historys.length});
		this.setState({ activePopout:activePopout, isSwipeBack:false, appnavigator:{...this.state.appnavigator, historys } });
	};
	modalContentHeight = () => {
		this.setState({ modalcontentheight:null });
	};

	historyBack = () => {
		const historys = [...this.state.appnavigator.historys];
		const historysPanel = [...this.state.appnavigator.historysPanel];
		const historysModal = [...this.state.appnavigator.historysModal];
		let back = (historys.length >= 1) ? historys[historys.length-1] : false;
		let go = (historys.length >= 2) ? historys[historys.length-2] : false;


		if (historys.length !== 0 && historys.length !== 1) {
			historys.pop();
			if (back.type === 'modal') {
				historysModal.pop();
				const activeModal = (go.type === 'modal') ? go.id : null;
				this.setState({ activeModal, appnavigator:{...this.state.appnavigator, historys, historysModal, activeParams:{...this.state.appnavigator.activeParams, [go.id]:go.params} } });
				setTimeout(() => {
					this.setState({ isSwipeBack:true });
				}, 500);
			} else if (back.type === 'popout') {
				this.setState({ activePopout:null, appnavigator:{...this.state.appnavigator, historys, activeParams:{...this.state.appnavigator.activeParams, [go.id]:go.params} } });
				setTimeout(() => {
					this.setState({ isSwipeBack:true });
				}, 500);

			} else if (back.type === 'panel') {

				if (go.type === 'modal') {

					var goPanel = (historys.length >= 2) ? historys[historys.length-2] : false;

				}
				const activeModal = (go.type === 'modal') ? go.id : null;
				historysPanel.pop();

				if (goPanel.id === 'home') this.ApiGames();

				this.setState({ activePanel:goPanel.id, activeModal, appnavigator:{...this.state.appnavigator, historys, historysPanel, activeParams:{...this.state.appnavigator.activeParams, [goPanel.id]:goPanel.params} } });
			}

		}
	};



	soundPlay = (url) => {
		this.setState({
			sound:{
				...this.state.sound,
				url:url+'?='+this.random(),
				playing:true
			}
		});
	};

	ApiGames = () => {
		const {appnavigator} = this.state;
		api.method('gameGet', {url:appnavigator.url})
		.then((response) => {
			this.setState({ apiGames:{response, isLoad:false, isFailed:false} });
		})
		.catch((error) => {
			this.setState({ apiGames:{response:[], isLoad:false, isFailed:true} });
		});
	};


	random() {
		return Math.floor(Math.random() * (99999999 - 0 + 1)) + 0;
	};


};
export default App;
