import React from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import style from './index.module.scss';
import { AppStore } from './AppStore';
import { GameSelectionPanel } from './GameSelectionPanel';
import { NicknameEnterPanel } from './NicknameEnterPanel';
import { CreateOrJoinPanel } from './CreateOrJoinPanel';
import { BackButton } from './BackButton';
import { JoinRoomPanel } from './JoinRoomPanel';
import { TicTacToePanel } from './TicTacToePanel';

export const App = observer(function App() {
  const store = useLocalObservable(() => new AppStore());

  return (
    <div className={style.main}>
      <BackButton
        shown={store.backButtonShown}
        onClick={!store.disabled && store.backButtonShown ? store.handleBackButtonClick : undefined}
      />
      <GameSelectionPanel
        shown={store.page === 'game-selection'}
        direction={store.direction}
        disabled={store.disabled}
        onPlayerButtonClick={store.handleGameSelectionPlayerClick}
        onComputerButtonClick={store.handleGameSelectionComputerClick}
        onShowingEnd={store.handlePanelShowingEnd}
      />
      <NicknameEnterPanel
        shown={store.page === 'nickname-enter'}
        direction={store.direction}
        disabled={store.disabled}
        onShowingEnd={store.handlePanelShowingEnd}
        onEnterClick={store.handleNicknameEnterClick}
      />
      <CreateOrJoinPanel
        shown={store.page === 'create-or-join'}
        direction={store.direction}
        disabled={store.disabled}
        onShowingEnd={store.handlePanelShowingEnd}
        onCreateRoomClick={store.handleCreateRoomClick}
        onJoinRoomClick={store.handleJoinRoomClick}
      />
      <JoinRoomPanel
        shown={store.page === 'join-room'}
        direction={store.direction}
        disabled={store.disabled}
        onShowingEnd={store.handlePanelShowingEnd}
        onEnterClick={store.handleJoinRoomEnterClick}
      />
      <TicTacToePanel
        shown={store.page === 'pvp'}
        direction={store.direction}
        onShowingEnd={store.handlePanelShowingEnd}
        roomId={store.room.roomId}
        onCellClick={store.handleTicTacToeCellClick}
        selected={store.room.selected}
        disabled={store.room.disabled}
        player1={store.room.player1}
        player2={store.room.player2}
        field={store.room.field}
        readyPopupShown={store.room.readyPopupShown}
        result={store.room.readyPopupResult}
        onReadyClick={store.handleReadyClick}
        onExitClick={store.handleExitClick}
      />
    </div>
  );
});
