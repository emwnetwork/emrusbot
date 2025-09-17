export const COIN_NAME = 'EMW';
export const COIN_PER_TAP = 1;

export const ls = {
  get n(){ return parseInt(localStorage.getItem('tap_count') || '0', 10); },
  set n(v){ localStorage.setItem('tap_count', String(v)); },
  get balance(){ return parseInt(localStorage.getItem('balance') || '0', 10); },
  set balance(v){ localStorage.setItem('balance', String(v)); },
  pushTx(txt){
    const arr = JSON.parse(localStorage.getItem('tx') || '[]');
    arr.unshift({t: Date.now(), d: txt});
    localStorage.setItem('tx', JSON.stringify(arr.slice(0,20)));
  },
  get tx(){ return JSON.parse(localStorage.getItem('tx') || '[]'); }
};

export const fmt = (n) => new Intl.NumberFormat('tr-TR').format(n);
