if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return i[e]||(s=new Promise((async s=>{if("document"in self){const i=document.createElement("script");i.src=e,document.head.appendChild(i),i.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!i[e])throw new Error(`Module ${e} didn’t register its module`);return i[e]}))},s=(s,i)=>{Promise.all(s.map(e)).then((e=>i(1===e.length?e[0]:e)))},i={require:Promise.resolve(s)};self.define=(s,r,c)=>{i[s]||(i[s]=Promise.resolve().then((()=>{let i={};const n={uri:location.origin+s.slice(1)};return Promise.all(r.map((s=>{switch(s){case"exports":return i;case"module":return n;default:return e(s)}}))).then((e=>{const s=c(...e);return i.default||(i.default=s),i}))})))}}define("./sw.js",["./workbox-9e257e41"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"asset-manifest.json",revision:"af67fab0503536e5b7bed729afdb4e2b"},{url:"assets/images/icons/clock.feli.page-1024.png",revision:"4505662ff0e2fdcc442561161dbaf561"},{url:"assets/images/icons/clock.feli.page-512.png",revision:"14e44c439ef4ef16163ed04c730f9c92"},{url:"assets/images/icons/clock.feli.page-full.png",revision:"602e4f6726d34ff519882417138397d5"},{url:"index.html",revision:"2560b259cc4c8e8ce9235272d1b1ed2f"},{url:"manifest.json",revision:"97bbac8573886047ce9316a6feb2fb0c"},{url:"static/js/2.3309e204.chunk.js",revision:"c800217aedad7fc80b9db8a4427b0217"},{url:"static/js/3.e5d94aee.chunk.js",revision:"77d519059b2c5913cf419b271f48f0fb"},{url:"static/js/main.016033a1.chunk.js",revision:"c9b347a9be4567dd174eacdebb1ac6cd"},{url:"static/js/runtime-main.e8f01175.js",revision:"a5410648c9be114c04a7e8e7777d39b0"},{url:"swInstall.js",revision:"b20799e415dece6bc05a18b2ecb69fb3"}],{})}));
//# sourceMappingURL=sw.js.map
