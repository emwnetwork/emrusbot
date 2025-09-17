export const tg = window.Telegram?.WebApp ?? null;

export function syncThemeFromTelegram(){
  if(!tg) return;
  const p = tg.themeParams || {};
  const css = document.documentElement.style;
  if(p.bg_color) css.setProperty('--bg', p.bg_color);
  if(p.text_color) css.setProperty('--fg', p.text_color);
  if(p.hint_color) css.setProperty('--muted', p.hint_color);
  if(p.button_color) css.setProperty('--button', p.button_color);
  if(p.button_text_color) css.setProperty('--button-text', p.button_text_color);
  if(p.secondary_bg_color) css.setProperty('--card', p.secondary_bg_color);
  try{ tg.setHeaderColor('secondary_bg_color'); }catch(e){}
}

export function ready(){
  if(!tg) return;
  tg.ready(); tg.expand();
  syncThemeFromTelegram();
  tg.onEvent?.('themeChanged', syncThemeFromTelegram);
}

export function vibrate(){
  if(tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
  else if (navigator.vibrate) navigator.vibrate(8);
}

export function share(text){
  const url = 'https://t.me/share/url?text=' + encodeURIComponent(text);
  if(tg) tg.openTelegramLink(url); else window.open(url, '_blank');
}

export function setMainButtonForMining(onReset){
  if(!tg) return;
  tg.MainButton.offClick?.(onReset);
  tg.MainButton.setText('SIFIRLA');
  tg.MainButton.onClick(onReset);
  tg.MainButton.show();
}

export function hideMainButton(){
  if(!tg) return;
  tg.MainButton.hide();
}

export function getUser(){
  return tg?.initDataUnsafe?.user ?? null;
}
