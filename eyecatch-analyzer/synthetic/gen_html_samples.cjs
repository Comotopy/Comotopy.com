// 軽貨物ドライバー求人風の検証用画像を HTML→PNG で生成。属性は設計時に決まるので正解ラベルになる。
// 使い方: node gen_html_samples.cjs [出力フォルダ] [枚数] [seed]
const { chromium } = require('playwright');
const fs = require('fs');
const out = process.argv[2] || '../synth_samples', N = +(process.argv[3] || 30);
let s = +(process.argv[4] || 7);
const rnd = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pick = a => a[Math.floor(rnd() * a.length)];
const sample = (a, n) => { const b = [...a], r = []; while (r.length < n && b.length) r.push(b.splice(Math.floor(rnd() * b.length), 1)[0]); return r; };

const PAL = {
  navy:   { bg: '#12285e', bg2: '#1d3d8f', fg: '#fff', ac: '#ffc928', ac2: '#ff7a1a', ink: '#12285e' },
  orange: { bg: '#ff8a1f', bg2: '#ffb347', fg: '#fff', ac: '#fff2a8', ac2: '#c2410c', ink: '#7a2e00' },
  yellow: { bg: '#ffe34d', bg2: '#fff3a0', fg: '#1a1a1a', ac: '#e53935', ac2: '#1e63d6', ink: '#1a1a1a' },
  green:  { bg: '#16a05d', bg2: '#5fd18f', fg: '#fff', ac: '#fff176', ac2: '#0b6b3a', ink: '#0b4d2a' },
  white:  { bg: '#f6f8fb', bg2: '#e4ebf5', fg: '#12285e', ac: '#ff7a1a', ac2: '#1d63d6', ink: '#12285e' },
  red:    { bg: '#d92d2d', bg2: '#ff6b5e', fg: '#fff', ac: '#ffe34d', ac2: '#8a1111', ink: '#7a0d0d' },
};
const APPEAL = {
  salary: ['月収40万円以上可', '日給1.5万円〜'], no_experience: ['未経験大歓迎', '未経験でも安心スタート'],
  license_only: ['普通免許があればOK'], flexible_shift: ['週3日〜シフト自由'], vehicle_support: ['車両貸与あり'],
  side_job: ['副業OK'], no_fee: ['加盟金なし'], direct_commute: ['直行直帰OK'],
};
const HEAD = ['軽貨物ドライバー募集', '軽貨物ドライバー', '軽貨物 配送スタッフ募集'];
const SIZES = [[800, 533], [800, 533], [960, 640], [1080, 1080], [1920, 1080]];

const personSvg = (g, expr, col, cap) => `<svg viewBox="0 0 200 270" width="100%" height="100%">
 <path d="M30 270 C30 190 60 168 100 168 C140 168 170 190 170 270Z" fill="${col}"/>
 <rect x="86" y="140" width="28" height="34" fill="#f1c9a5"/><circle cx="100" cy="102" r="46" fill="#f4d0ae"/>
 ${g === 'female' ? '<path d="M50 105 C40 40 160 40 150 105 L158 190 L138 190 L140 105 C120 80 80 80 60 105 L62 190 L42 190Z" fill="#2b1d16"/>' : '<path d="M52 98 C46 38 154 38 148 98 C135 70 70 70 52 98Z" fill="#2b1d16"/>'}
 ${cap ? `<path d="M52 82 C60 40 140 40 148 82Z" fill="${col}"/><rect x="48" y="78" width="104" height="9" rx="4" fill="${col}"/>` : ''}
 <circle cx="82" cy="106" r="5" fill="#222"/><circle cx="118" cy="106" r="5" fill="#222"/>
 ${expr === 'smile' ? '<path d="M78 126 Q100 150 122 126Z" fill="#fff" stroke="#a33" stroke-width="3"/>' : '<path d="M84 132 H116" stroke="#a33" stroke-width="4" stroke-linecap="round"/>'}
</svg>`;
const vanSvg = (col) => `<svg viewBox="0 0 400 220" width="100%" height="100%">
 <path d="M20 150 L20 80 Q22 60 45 58 L250 58 Q285 58 305 100 L370 112 Q385 115 385 135 L385 160 L20 160Z" fill="${col}"/>
 <path d="M60 72 L150 72 L150 112 L60 112Z M162 72 L248 72 Q270 74 284 108 L162 108Z" fill="#cfe7ff"/>
 <circle cx="105" cy="165" r="30" fill="#222"/><circle cx="105" cy="165" r="14" fill="#aaa"/>
 <circle cx="305" cy="165" r="30" fill="#222"/><circle cx="305" cy="165" r="14" fill="#aaa"/></svg>`;
const chartSvg = (c1, c2) => `<svg viewBox="0 0 300 220" width="100%" height="100%"><g fill="${c1}"><rect x="20" y="150" width="40" height="60"/><rect x="80" y="120" width="40" height="90"/><rect x="140" y="85" width="40" height="125"/><rect x="200" y="40" width="40" height="170"/></g><path d="M20 130 L90 100 L150 70 L240 20" stroke="${c2}" stroke-width="10" fill="none" stroke-linecap="round"/></svg>`;
const ICON = ['🚚', '📅', '💴', '🪪'];

function build(i) {
  const [W, H] = pick(SIZES), pal = PAL[pick(Object.keys(PAL))], pn = Object.keys(PAL).find(k => PAL[k] === pal);
  const layout = pick(['text_left_person_right', 'text_top_object_below', 'photo_left_text_right']);
  const nPeople = pick([0, 1, 1, 2]), hasVan = rnd() < 0.55;
  const people = Array.from({ length: nPeople }, () => ({ g: pick(['male', 'female']), e: pick(['smile', 'smile', 'neutral']) }));
  const appeals = sample(Object.keys(APPEAL), pick([2, 3, 4]));
  const emph = sample(['underlay_band', 'checklist', 'number_highlight', 'outline_stroke', 'color_split_headline'], pick([1, 2]));
  if (emph.includes('number_highlight') && !appeals.includes('salary')) appeals[0] = 'salary';
  const elems = new Set(), extra = sample(['badge', 'speech_bubble', 'icon', 'logo', 'decoration_effect', 'chart'], pick([0, 1, 2]));
  extra.forEach(e => elems.add(e));
  if (nPeople) elems.add('illustration_person');
  if (emph.includes('underlay_band')) elems.add('underlay_band');
  if (emph.includes('checklist')) elems.add('checklist');
  if (emph.includes('number_highlight') && rnd() < 0) elems.add('x');
  if (hasVan) elems.add('illustration_vehicle');
  if (!nPeople && !hasVan) elems.add('chart');
  const bubble = elems.has('speech_bubble');
  const sc = W / 800, f = k => Math.round(k * sc * (H > 900 ? 0.9 : 1));
  const head = pick(HEAD), cs = emph.includes('color_split_headline'), os = emph.includes('outline_stroke');
  const headHtml = cs ? head.replace('ドライバー', `<span style="color:${pal.ac}">ドライバー</span>`) : head;
  const lines = appeals.map(a => pick(APPEAL[a]));
  const li = lines.map((t, k) => {
    let txt = t;
    if (appeals[k] === 'salary' && emph.includes('number_highlight')) txt = t.replace(/(\d[\d.]*)/, `<b class="num" style="color:${pal.ac};font-size:1.9em;">$1</b>`);
    const chk = emph.includes('checklist') ? `<i class="ck" style="background:${pal.ac2}"></i>` : '';
    const band = emph.includes('underlay_band');
    return `<div class="row${band ? ' band' : ''}">${chk}<span class="t" style="${band ? `color:${pal.ink}` : ''}">${txt}</span></div>`;
  }).join('');
  const textBlock = `<div class="tb"><div><span class="t h1" style="${os ? `-webkit-text-stroke:${f(9)}px ${pal.ac2};paint-order:stroke fill;` : ''}">${headHtml}</span></div>${li}</div>`;
  const obj = nPeople ? `<div class="people">${people.map(p => `<div class="pp">${personSvg(p.g, p.e, pal.ac2, hasVan || rnd() < .5)}</div>`).join('')}</div>`
    : hasVan ? `<div class="van">${vanSvg(pal.ac)}</div>` : `<div class="van">${chartSvg(pal.ac, pal.fg)}</div>`;
  const vanExtra = nPeople && hasVan ? `<div class="van2">${vanSvg(pal.ac)}</div>` : '';
  const deco = elems.has('decoration_effect') ? `<div class="stripes"></div>` : '';
  const badge = elems.has('badge') ? `<div class="badge"><span class="t">未経験<br>歓迎</span></div>` : '';
  const bub = bubble ? `<div class="bub"><span class="t">副業にも◎</span></div>` : '';
  const icons = elems.has('icon') ? `<div class="icons">${ICON.slice(0, 3).map(x => `<div class="ic">${x}</div>`).join('')}</div>` : '';
  const logo = elems.has('logo') ? `<div class="logo"><span class="t">▲ KEIHAISO CO.</span></div>` : '';
  const chart = elems.has('chart') && (nPeople || hasVan) ? `<div class="chart">${chartSvg(pal.ac, pal.fg)}</div>` : '';
  const L = { text_left_person_right: ['4%', '3%', '58%', 'auto', '60%', '4%', '38%'], text_top_object_below: ['4%', '3%', '92%', 'auto', '38%', '4%', '55%'], photo_left_text_right: ['44%', '3%', '52%', 'auto', '4%', '4%', '38%'] }[layout];
  const objBox = { text_left_person_right: 'right:3%;bottom:0;width:38%;height:78%', text_top_object_below: 'right:6%;bottom:0;width:42%;height:48%', photo_left_text_right: 'left:3%;bottom:0;width:38%;height:78%' }[layout];
  const html = `<!doctype html><meta charset=utf-8><style>
*{box-sizing:border-box;margin:0}body{width:${W}px;height:${H}px;position:relative;overflow:hidden;font-family:'IPAPGothic','IPAGothic',sans-serif;font-weight:900;color:${pal.fg};background:radial-gradient(circle at 70% 60%,${pal.bg2},${pal.bg})}
.t{display:inline-block;line-height:1.15}.tb{position:absolute;left:${L[0]};top:${L[1]};width:${L[2]};}
.h1{font-size:${f(46)}px;margin-bottom:${f(14)}px}.row{font-size:${f(26)}px;margin:${f(8)}px 0;display:flex;align-items:center;gap:${f(10)}px}
.band{background:${pal.fg === '#fff' ? '#fff' : '#fff'};border-radius:${f(8)}px;padding:${f(6)}px ${f(12)}px;width:fit-content}
.ck{display:inline-block;width:${f(24)}px;height:${f(24)}px;border-radius:${f(5)}px;flex:none}
.people{position:absolute;${objBox};display:flex;align-items:flex-end;justify-content:center;gap:2%}.pp{height:100%;flex:1}
.van{position:absolute;${objBox};display:flex;align-items:flex-end}.van2{position:absolute;left:${layout === 'photo_left_text_right' ? '56%' : '3%'};bottom:2%;width:32%;opacity:.95}
.stripes{position:absolute;inset:0;background:repeating-linear-gradient(135deg,transparent 0 22px,rgba(255,255,255,.14) 22px 34px)}
.badge{position:absolute;right:${layout === 'text_left_person_right' ? '41%' : '3%'};top:34%;width:${f(110)}px;height:${f(120)}px;border-radius:50%;background:${pal.ac};color:${pal.ink};display:flex;align-items:center;justify-content:center;text-align:center;font-size:${f(24)}px}
.bub{position:absolute;right:4%;top:${H > 900 ? '22%' : '30%'};background:#fff;color:${pal.ink};padding:${f(10)}px ${f(18)}px;border-radius:${f(22)}px;font-size:${f(26)}px}
.icons{position:absolute;left:4%;bottom:3%;display:flex;gap:${f(12)}px}.ic{width:${f(54)}px;height:${f(54)}px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:${f(28)}px}
.logo{position:absolute;left:3%;bottom:3%;font-size:${f(18)}px;opacity:.95}.chart{position:absolute;left:${layout === 'photo_left_text_right' ? '48%' : '3%'};bottom:3%;width:24%;height:30%;opacity:.9}
</style>${deco}${obj}${vanExtra}${chart}${tb(textBlock)}${badge}${bub}${icons}${logo}`;
  function tb(x) { return x; }
  const truth = {
    file: `synth_${String(i).padStart(3, '0')}.png`, job_type: 'light_cargo', width: W, height: H,
    people_count: 0, genders: [], illustration_people_count: nPeople,
    image_style: (nPeople || hasVan) ? 'illustration_dominant' : 'graphic_dominant', photo_subject: [],
    elements: [...elems].sort(), layout_pattern: layout, text_emphasis: emph.filter(e => e !== 'color_split_headline' || head.includes('ドライバー')).sort(),
    appeals: [...new Set([...appeals, ...(elems.has('badge') ? ['no_experience'] : []), ...(elems.has('speech_bubble') ? ['side_job'] : [])])].sort(), palette: pn,
  };
  return { html, truth };
}
fs.mkdirSync(out, { recursive: true }); fs.mkdirSync(out + '/html', { recursive: true });
(async () => {
const br = await chromium.launch(), pg = await br.newPage(), all = [];
for (let i = 0; i < N; i++) {
  const { html, truth } = build(i);
  fs.writeFileSync(`${out}/html/${truth.file.replace('.png', '.html')}`, html);
  await pg.setViewportSize({ width: truth.width, height: truth.height });
  await pg.setContent(html); await pg.waitForTimeout(50);
  truth.text_area_ratio = await pg.evaluate(() => { const W = innerWidth, H = innerHeight; let a = 0;
    document.querySelectorAll('.t').forEach(e => { const r = e.getBoundingClientRect(); const w = Math.max(0, Math.min(r.right, W) - Math.max(r.left, 0)), h = Math.max(0, Math.min(r.bottom, H) - Math.max(r.top, 0)); a += w * h; });
    return +(a / (W * H)).toFixed(3); });
  await pg.screenshot({ path: `${out}/${truth.file}` }); all.push(truth);
}
fs.writeFileSync(`${out}/ground_truth.json`, JSON.stringify(all, null, 1)); await br.close();
console.log(`generated ${all.length} -> ${out}`);
})();
