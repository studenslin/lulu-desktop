"use strict";
const electron = require("electron");
const IPC_CHANNELS = {
  CURSOR_POS: "cursor-pos",
  SET_IGNORE_MOUSE: "set-ignore-mouse",
  SET_WINDOW_POS: "set-window-pos",
  SET_WINDOW_SIZE: "set-window-size",
  GET_CURSOR_POS: "get-cursor-pos",
  GET_SCREEN_BOUNDS: "get-screen-bounds",
  GET_WINDOW_POS: "get-window-pos",
  QUIT_APP: "quit-app",
  SHOW_CONTEXT_MENU: "show-context-menu",
  TRIGGER_ACTION: "trigger-action",
  TOGGLE_NO_WALK_RUN: "toggle-no-walk-run"
};
const api = {
  /** 设置点击穿透（智能模式：forward=true 仍转发鼠标移动） */
  setIgnoreMouse: (ignore) => electron.ipcRenderer.send(IPC_CHANNELS.SET_IGNORE_MOUSE, ignore),
  /** 设置窗口位置 */
  setWindowPosition: (x, y) => electron.ipcRenderer.send(IPC_CHANNELS.SET_WINDOW_POS, { x, y }),
  /** 设置窗口大小 */
  setWindowSize: (width, height) => electron.ipcRenderer.send(IPC_CHANNELS.SET_WINDOW_SIZE, { width, height }),
  /** 获取光标位置 */
  getCursorPos: () => electron.ipcRenderer.invoke(IPC_CHANNELS.GET_CURSOR_POS),
  /** 获取屏幕边界 */
  getScreenBounds: () => electron.ipcRenderer.invoke(IPC_CHANNELS.GET_SCREEN_BOUNDS),
  /** 获取窗口实际位置（主进程源） */
  getWindowPos: () => electron.ipcRenderer.invoke(IPC_CHANNELS.GET_WINDOW_POS),
  /** 退出应用 */
  quitApp: () => electron.ipcRenderer.send(IPC_CHANNELS.QUIT_APP),
  /** 监听光标位置更新；返回取消订阅函数，避免热重载或重建时累积监听器 */
  onCursorPos: (callback) => {
    const listener = (_event, pos) => callback(pos);
    electron.ipcRenderer.on(IPC_CHANNELS.CURSOR_POS, listener);
    return () => electron.ipcRenderer.removeListener(IPC_CHANNELS.CURSOR_POS, listener);
  },
  /** 弹出右键交互菜单 */
  showContextMenu: () => electron.ipcRenderer.send(IPC_CHANNELS.SHOW_CONTEXT_MENU),
  /** 监听菜单触发的动作；返回取消订阅函数 */
  onTriggerAction: (callback) => {
    const listener = (_event, action) => callback(action);
    electron.ipcRenderer.on(IPC_CHANNELS.TRIGGER_ACTION, listener);
    return () => electron.ipcRenderer.removeListener(IPC_CHANNELS.TRIGGER_ACTION, listener);
  },
  /** 监听禁止走/跑动开关；返回取消订阅函数 */
  onToggleNoWalkRun: (callback) => {
    const listener = (_event, enabled) => callback(enabled);
    electron.ipcRenderer.on(IPC_CHANNELS.TOGGLE_NO_WALK_RUN, listener);
    return () => electron.ipcRenderer.removeListener(IPC_CHANNELS.TOGGLE_NO_WALK_RUN, listener);
  }
};
electron.contextBridge.exposeInMainWorld("petAPI", api);
