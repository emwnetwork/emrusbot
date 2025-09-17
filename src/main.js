import { COIN_NAME, COIN_PER_TAP, ls, fmt } from './state.js';
import { tg, ready, vibrate, share, setMainButtonForMining, hideMainButton, getUser } from './tg.js';

// DOM
const $ = (s)=>document.querySelector(s), $$ = (s)=>Array.from(document.querySelectorAll(s));
const screens = {
  wallet: $('#screen-wallet'),
  leaderboard: $('#screen-leaderboard'),
  mining: $('#screen-mining'),
  games: $('#screen-games'),
  profile: $('#screen-profile'),
};
const hdrTitle = $('#hdrTitle'), hdrSub = $('#hdrSub');
const $count = $('#count'), $tap = $('#tapBtn'), $reset = $('#resetBtn'), $share = $('#shareBtn');
const $env = $('#env'), $hint = $('#hint'), $balance = $('#balance'), $txList = $('#txList'), $lbList = $('#lbList');
const $export = $('#exportBtn'), $wipe = $('#wipeBtn');

// RENDER
function renderMining(){ $count.textContent = String(ls.n); }
function renderWallet(){
  $balance.textContent = `${fmt(ls.balance)} ${COIN_NAME}`;
  $txList.innerHTML = '';
  ls.tx.forEach(x=>{
    const d = new Date(x.t);
    const el = document.createElement('div');
    el.className = 'item';
    el.innerHTML = `<span>${x.d}</span><span class="subtitle">${d.toLocaleDateString()} ${d.toLocaleTimeString()}</span>`;
    $txList.appendChild(el);
  });
}
function renderLeaderboard(){
  const demo = [{u:'@alice',s:1234},{u:'@bob',s:888},{u:'@you',s:ls.n}];
  $lbList.innerHTML='';
  demo.forEach((r,i)=>{
    const el=document.createElement('div');
    el.className='item';
    el.innerHTML=`<span>#${i+1} ${r.u}</span><b>${fmt(r.s)}</b>`;
    $lbList.appendChild(el);
  });
}
function initUser(){
  const box = $('#userBox');
  const u = getUser();
  if(u){
    const name = [u.first_name||'', u.last_name||''].join(' ').trim();
    const uname = u.username ? '@'+u.username : '';
    box.textContent = `${name} ${uname}`.trim() || 'Anonim kullanıcı';
  } else {
    box.innerHTML = 'Telegram dışında çalışıyorsun. <span class="warn">(Test Modu)</span>';
  }
}

// ACTIONS
function addCoins(qty, reason){
  ls.balance = ls.balance + qty;
  if(reason) ls.pushTx(`${fmt(qty)} ${COIN_NAME} • ${reason}`);
  renderWallet();
}
function onTap(){ ls.n = ls.n + 1; renderMining(); vibrate(); addCoins(COIN_PER_TAP,'Tap'); }
function onReset(){ ls.n = 0; renderMining(); }
function onShare(){ share(`EMW Mini App'te ${ls.n} kez tıkladım!`); }
function exportData(){
  const payload = {count: ls.n, balance: ls.balance, tx: ls.tx};
  const blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'emw-mini-export.json'; a.click(); URL.revokeObjectURL(a.href);
}
function wipeAll(){
  if(confirm('Tüm yerel veriyi sıfırlamak istiyor musun?')){
    localStorage.removeItem('tap_count'); localStorage.removeItem('balance'); localStorage.removeItem('tx');
    renderMining(); renderWallet();
  }
}

// NAV
function go(tab){
  location.hash = tab;
  Object.entries(screens).forEach(([k,sec])=> sec.classList.toggle('active', k===tab));
  $$('.tab').forEach(b=> b.setAttribute('aria-selected', String(b.dataset.tab===tab)));
  const map = {
    wallet:['Cüzdan','Bakiyeni ve hareketlerini gör.'],
    leaderboard:['Liderlik','Global sıralama yakında.'],
    mining:['Madencilik','Basit tıklama ile coin topla.'],
    games:['Oyunlar','Günlük görevler ve mini oyunlar.'],
    profile:['Profil','Hesap ve uygulama ayarları.'],
  };
  hdrTitle.textContent = map[tab][0]; hdrSub.textContent = map[tab][1];

  if(tab==='mining'){ setMainButtonForMining(onReset); } else { hideMainButton(); }
  if(tab==='wallet') renderWallet();
  if(tab==='leaderboard') renderLeaderboard();
  if(tab==='mining') renderMining();
}

// INIT
(function init(){
  // events
  $tap.addEventListener('click', onTap);
  $reset.addEventListener('click', onReset);
  $share.addEventListener('click', onShare);
  $export?.addEventListener('click', exportData);
  $wipe?.addEventListener('click', wipeAll);
  $$('.tab').forEach(b=> b.addEventListener('click', ()=> go(b.dataset.tab)) );

  // telegram env
  ready();
  if(tg){
    const sp = tg.initDataUnsafe?.start_param;
    if(sp) $hint.innerHTML = `Start param: <code>${sp}</code>`;
    $env.textContent = 'Telegram içinden çalışıyor.';
  } else {
    $env.innerHTML = 'Telegram dışında çalışıyorsun. <span class="warn">(Test Modu)</span>';
    $hint.textContent = 'Bu sayfayı Telegram’da menü butonundan açınca tam özellikler aktif olur.';
  }

  // first render + route
  renderMining(); renderWallet(); renderLeaderboard(); initUser();
  const initial = (location.hash||'#mining').replace('#',''); go(initial);
})();
