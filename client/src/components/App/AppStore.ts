import { makeAutoObservable } from 'mobx';
import { Player } from '~/types/Player';
import { ServerEvent, ConnectedEvent, RoomStateChangedEvent } from '~/types/ServerEvents';
import { PlayerRoomStore } from './PlayerRoomStore';
import { WebSocketManager } from './WebSocketManager';

type AppPageName =
  | 'game-selection'
  | 'nickname-enter'
  | 'create-or-join'
  | 'join-room'
  | 'error'
  | 'pvp'
  | 'pve';

export class AppStore {
  disabled = false;

  page: AppPageName = 'game-selection';

  direction: 'left' | 'right' = 'right';

  backButtonShown = false;

  player: Player | null = null;

  room = new PlayerRoomStore();

  manager: WebSocketManager;

  constructor() {
    makeAutoObservable(this);

    console.log('AppStore constructor', this);

    this.manager = new WebSocketManager(this.handleManagerMessage);
  }

  handleManagerMessage = (event: ServerEvent) => {
    if (event.type === 'connected') this.handleConnectedEvent(event);
    if (event.type === 'join-room-success') this.handleJoinRoomSuccessEvent();
    if (event.type === 'room-state-changed') this.handleRoomStateChanged(event);
    if (event.type === 'room-created') this.handleRoomCreated();
  };

  handleConnectedEvent = (event: ConnectedEvent) => {
    this.player = { id: event.id, nickname: null };
    this.room.setPlayer(this.player);
  };

  handleJoinRoomSuccessEvent = () => {
    this.page = 'pvp';
  };

  handleRoomStateChanged = (event: RoomStateChangedEvent) => {
    this.room.setRoom(event.room);
  };

  handleRoomCreated = () => {
    this.page = 'pvp';
  };

  handlePanelShowingEnd = () => {
    this.disabled = false;

    if (this.page !== 'game-selection') this.backButtonShown = true;
  };

  handleGameSelectionPlayerClick = () => {
    this.direction = 'right';
    this.page = 'nickname-enter';
    this.disabled = true;
  };

  handleGameSelectionComputerClick = () => {
    console.log('game selection computer click');
  };

  handleNicknameEnterClick = (nickname: string) => {
    this.manager.sendSetNicknameEvent(nickname);
    this.direction = 'right';
    this.page = 'create-or-join';
    this.disabled = true;
  };

  handleCreateRoomClick = () => {
    this.manager.sendCreateRoomEvent();
  };

  handleJoinRoomClick = () => {
    this.direction = 'right';
    this.page = 'join-room';
    this.disabled = true;
  };

  handleJoinRoomEnterClick = (roomID: string) => {
    this.manager.sendJoinRoomEvent(roomID);
    // this.roomID = roomID;
  };

  handleBackButtonClick = () => {
    this.backButtonShown = false;
    this.direction = 'left';
    this.manager.sendPlayerLeaveEvent();

    switch (this.page) {
      case 'nickname-enter':
        this.page = 'game-selection';
        break;
      case 'create-or-join':
        this.page = 'nickname-enter';
        break;
      case 'join-room':
        this.page = 'create-or-join';
        break;
      case 'error':
        this.page = 'join-room';
        break;
      case 'pvp':
        this.page = 'game-selection';
        break;
      case 'pve':
        this.page = 'game-selection';
        break;
      default:
        break;
    }
  };

  handleTicTacToeCellClick = (cell: number) => {
    this.manager.sendPlayerMoveEvent(cell);
  };

  handleReadyClick = () => {
    this.manager.sendPlayerReadyEvent();
  };

  handleExitClick = () => {
    this.backButtonShown = false;
    this.page = 'game-selection';
    this.manager.sendPlayerLeaveEvent();
  };
}
