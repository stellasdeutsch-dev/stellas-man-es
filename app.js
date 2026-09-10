/* ============================================================
   STELLAS — man & es
   ============================================================ */

/* ---- ССЫЛКИ: поменяй здесь, и они подставятся во все кнопки ---- */
const LINKS = {
  checkout : 'https://app.lava.top/801303618?tabId=products&sort=published',
  instagram: 'https://instagram.com/stellas_deutsch'
};

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Reveal-on-scroll only exists when JS + IO are available, so content can
   never get stuck invisible. */
const HAS_IO = 'IntersectionObserver' in window;
if (HAS_IO && !reduce) document.documentElement.classList.add('rv');

/* ---------- ссылки ---------- */
document.querySelectorAll('[data-cta]').forEach(a => {
  a.href = LINKS.checkout; a.target = '_blank'; a.rel = 'noopener';
});
document.querySelectorAll('[data-ig]').forEach(a => {
  a.href = LINKS.instagram; a.target = '_blank'; a.rel = 'noopener';
});
document.getElementById('yr').textContent = new Date().getFullYear();

/* ---------- reading progress ---------- */
const bar = document.getElementById('progress');
const topbar = document.getElementById('topbar');
let ticking = false;

function onScroll(){
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${h > 0 ? Math.min(scrollY / h, 1) : 0})`;

  // topbar color inversion over dark sections
  const probe = topbar.offsetHeight / 2;
  let dark = false;
  document.querySelectorAll('.sec--dark, .marquee--dark').forEach(s => {
    const r = s.getBoundingClientRect();
    if (r.top <= probe && r.bottom >= probe) dark = true;
  });
  topbar.classList.toggle('is-dark', dark);
  ticking = false;
}
addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
}, { passive: true });
onScroll();

/* ---------- hero intro ---------- */
requestAnimationFrame(() => document.getElementById('hero').classList.add('is-in'));

/* ---------- marquee: duplicate for seamless loop ---------- */
document.querySelectorAll('.marquee__track').forEach(t => {
  t.innerHTML += t.innerHTML;
});

/* ---------- reveal + one-shot animations ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    io.unobserve(e.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

if (HAS_IO && !reduce) {
  document.querySelectorAll('[data-rv]').forEach((el, i) => {
    el.style.transitionDelay = (Math.min(i % 5, 4) * 0.06) + 's';
    io.observe(el);
  });
}

/* ---------- counters ---------- */
function animateCount(el){
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  if (reduce) { el.textContent = target.toLocaleString('ru-RU') + suffix; return; }
  const dur = 1500, t0 = performance.now();
  const step = (now) => {
    const p = Math.min((now - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased).toLocaleString('ru-RU') + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const ioCount = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    animateCount(e.target);
    ioCount.unobserve(e.target);
  });
}, { threshold: 0.6 });
if (HAS_IO) document.querySelectorAll('[data-count]').forEach(el => ioCount.observe(el));
else document.querySelectorAll('[data-count]').forEach(animateCount);

/* ---------- bars + donut ---------- */
function fillNow(el){
  if (el.dataset.w) el.style.width = el.dataset.w + '%';
  if (el.dataset.arc) {
    const c = 2 * Math.PI * el.r.baseVal.value;
    el.style.strokeDasharray = `${c * parseFloat(el.dataset.arc)} ${c}`;
  }
}
const ioFill = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    setTimeout(() => fillNow(e.target), 150);
    ioFill.unobserve(e.target);
  });
}, { threshold: 0.4 });
document.querySelectorAll('[data-w],[data-arc]').forEach(el => HAS_IO ? ioFill.observe(el) : fillNow(el));

/* ---------- videos: play only when visible ---------- */
function tryPlay(v){
  if (v.readyState >= 2) { v.play().catch(() => {}); return; }
  v.preload = 'auto';
  v.addEventListener('loadeddata', () => {
    if (v.dataset.visible === '1') v.play().catch(() => {});
  }, { once: true });
  v.load();
}
const ioVid = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) { v.dataset.visible = '1'; tryPlay(v); }
    else { v.dataset.visible = '0'; v.pause(); }
  });
}, { threshold: 0.2, rootMargin: '150px 0px' });
if (HAS_IO) document.querySelectorAll('video[data-autoplay]').forEach(v => ioVid.observe(v));

/* ============================================================
   WORD ORDER MACHINE
   ============================================================ */
const WO = [
  {
    slots: [
      { t: 'Viele Autos', k: '' },
      { t: 'fahren', k: 'v' }
    ],
    verdict: '<b>Работает, но звучит сухо.</b> Подлежащее на первом месте, глагол на втором. Всё правильно — просто плоско, как строчка из учебника.'
  },
  {
    slots: [
      { t: 'Hier', k: '' },
      { t: 'fahren', k: 'v' },
      { t: 'viele Autos', k: '' }
    ],
    verdict: '<b>Инверсия разрешена.</b> Первое место занял <i>hier</i> — обстоятельство. Глагол честно остался вторым, подлежащее уехало назад. Так говорят живые люди.'
  },
  {
    slots: [
      { t: 'Es', k: 'es' },
      { t: 'fahren', k: 'v' },
      { t: 'viele Autos', k: '' }
    ],
    verdict: '<b>А теперь фокус.</b> Обстоятельства нет, а первое место пустовать не может. Ставим <i>es</i>. Оно не переводится и ничего не значит — просто держит место, чтобы глагол остался вторым.'
  }
];

const woSlots = document.getElementById('woSlots');
const woVerdict = document.getElementById('woVerdict');
const woBtns = [...document.querySelectorAll('[data-wo]')];

function renderWO(i){
  const d = WO[i];
  woSlots.innerHTML = '';
  d.slots.forEach((s, idx) => {
    const el = document.createElement('span');
    el.className = 'wo__slot' + (s.k === 'v' ? ' wo__slot--v' : s.k === 'es' ? ' wo__slot--es' : '') + ' is-new';
    el.textContent = s.t;
    el.style.animationDelay = (idx * 0.07) + 's';
    woSlots.appendChild(el);
  });
  woVerdict.innerHTML = d.verdict;
  woBtns.forEach((b, bi) => b.classList.toggle('is-on', bi === i));
}
woBtns.forEach((b, i) => b.addEventListener('click', () => renderWO(i)));
renderWO(0);

/* auto-advance once when scrolled into view */
let woAuto = true;
const ioWo = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting || !woAuto || reduce) return;
    woAuto = false;
    setTimeout(() => renderWO(1), 1400);
    setTimeout(() => renderWO(2), 3200);
  });
}, { threshold: 0.5 });
if (HAS_IO) ioWo.observe(document.getElementById('wo'));

/* ============================================================
   QUIZ
   ============================================================ */
const QUESTIONS = [
  {
    q: '___ sagt, dass das Wetter morgen schön wird.',
    o: ['Man', 'Es', 'Einem'],
    a: 0,
    f: 'Есть действие «говорить», значит нужен деятель — пусть и невидимый. Это <b>man</b>. Es здесь не подойдёт: погода погодой, но говорит всё-таки кто-то.'
  },
  {
    q: '___ regnet den ganzen Tag.',
    o: ['Man', 'Es', 'Einen'],
    a: 1,
    f: 'Дождь никто не делает. Деятеля нет и быть не может — значит безличное <b>es</b>. Дословно: «оно дождит».'
  },
  {
    q: 'Wie spät ist ___?',
    o: ['man', 'einem', 'es'],
    a: 2,
    f: 'Время — классическое безличное предложение. <b>Es ist 7 Uhr.</b> Дословно: «оно есть семь часов».'
  },
  {
    q: 'Man kann nicht nur das tun, was ___ Spaß macht.',
    o: ['man', 'einem', 'einen'],
    a: 1,
    f: 'Вопрос «кому доставляет удовольствие?» — это Dativ. Значит <b>einem</b>. Man в косвенных падежах не выживает.'
  },
  {
    q: 'Wenn man ihn mal braucht, lässt er ___ im Stich.',
    o: ['einen', 'einem', 'man'],
    a: 0,
    f: '«Бросает кого?» — Akkusativ. Значит <b>einen</b>. Цепочка простая: man → einen → einem.'
  },
  {
    q: '___ hier in der Nähe eine Bushaltestelle?',
    o: ['Hat es', 'Gibt es', 'Ist man'],
    a: 1,
    f: 'Оборот <b>es gibt</b> — «здесь есть». В вопросе он переворачивается: Gibt es…? И после него всегда Akkusativ.'
  },
  {
    q: 'Как правильно сказать «Едет много машин» без обстоятельства?',
    o: ['Fahren viele Autos.', 'Es fahren viele Autos.', 'Man fährt viele Autos.'],
    a: 1,
    f: 'Глагол не может стоять первым в повествовательном предложении. Подкладываем <b>es</b> как подпорку — и глагол снова на втором месте.'
  },
  {
    q: 'Wie geht ___ Ihnen?',
    o: ['man', 'es', 'einen'],
    a: 1,
    f: 'Дословно: «как идёт <b>оно</b> Вам?» Самочувствие в немецком описывается безличным es. Ответ тоже с ним: Es geht.'
  }
];

const qText = document.getElementById('qText');
const qOpts = document.getElementById('qOpts');
const qFb = document.getElementById('qFb');
const qCount = document.getElementById('qCount');
const qScore = document.getElementById('qScore');
const qFill = document.getElementById('qFill');
const qLive = document.getElementById('qLive');
const qDone = document.getElementById('qDone');
const qFinal = document.getElementById('qFinal');
const qVerdict = document.getElementById('qVerdict');

let qi = 0, score = 0, locked = false;
const KEYS = ['A', 'B', 'C', 'D'];

function paintQuiz(){
  const d = QUESTIONS[qi];
  locked = false;
  qText.innerHTML = d.q.replace(/___/g, '<code>___</code>');
  qOpts.innerHTML = '';
  d.o.forEach((opt, i) => {
    const b = document.createElement('button');
    b.className = 'opt';
    b.innerHTML = `<span>${opt}</span><span class="opt__k">${KEYS[i]}</span>`;
    b.addEventListener('click', () => answer(i, b));
    qOpts.appendChild(b);
  });
  qFb.innerHTML = '';
  qCount.textContent = `Вопрос ${qi + 1} из ${QUESTIONS.length}`;
  qScore.textContent = `Верно: ${score}`;
  qFill.style.width = (qi / QUESTIONS.length * 100) + '%';
}

function answer(i, btn){
  if (locked) return;
  locked = true;
  const d = QUESTIONS[qi];
  const buttons = [...qOpts.children];
  buttons.forEach((b, bi) => {
    b.disabled = true;
    if (bi === d.a) b.classList.add('is-right');
    else if (bi === i) b.classList.add('is-wrong');
  });
  if (i === d.a) score++;
  qScore.textContent = `Верно: ${score}`;
  qFill.style.width = ((qi + 1) / QUESTIONS.length * 100) + '%';
  qFb.innerHTML = (i === d.a ? '' : '<b>Не то. </b>') + d.f;

  setTimeout(() => {
    qi++;
    if (qi < QUESTIONS.length) paintQuiz();
    else finish();
  }, i === d.a ? 1500 : 3000);
}

function finish(){
  qLive.style.display = 'none';
  qDone.classList.add('is-on');
  qFinal.textContent = `${score}/${QUESTIONS.length}`;
  qCount.textContent = 'Готово';
  const v = score === QUESTIONS.length
    ? 'Идеально. Тема закрыта. Так закрываются и остальные 339.'
    : score >= 6
      ? 'Хорошо. Осталось довести до автоматизма — а это уже вопрос повторений, а не понимания.'
      : score >= 4
        ? 'Нормальный результат для первого раза. Прокрути урок вверх и пройди ещё раз — со второго захода почти всегда 7–8.'
        : 'Не расстраивайся. Именно так выглядит тема, которую на курсах объяснили один раз и поехали дальше. Перечитай урок — он никуда не денется.';
  qVerdict.textContent = v;
}

document.getElementById('qRetry').addEventListener('click', () => {
  qi = 0; score = 0;
  qDone.classList.remove('is-on');
  qLive.style.display = '';
  paintQuiz();
});

paintQuiz();

/* ============================================================
   ACCORDION
   ============================================================ */
document.querySelectorAll('#acc .acc__i').forEach(item => {
  const btn = item.querySelector('.acc__btn');
  const panel = item.querySelector('.acc__panel');
  btn.addEventListener('click', () => {
    const open = item.classList.contains('is-open');
    document.querySelectorAll('#acc .acc__i.is-open').forEach(o => {
      o.classList.remove('is-open');
      o.querySelector('.acc__panel').style.height = '0px';
    });
    if (!open) {
      item.classList.add('is-open');
      panel.style.height = panel.firstElementChild.offsetHeight + 'px';
    }
  });
});
addEventListener('resize', () => {
  const open = document.querySelector('#acc .acc__i.is-open');
  if (open) {
    const p = open.querySelector('.acc__panel');
    p.style.height = p.firstElementChild.offsetHeight + 'px';
  }
});

/* ============================================================
   MAGNETIC BUTTONS (pointer-fine only)
   ============================================================ */
if (matchMedia('(pointer:fine)').matches && !reduce) {
  document.querySelectorAll('.btn').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.16;
      const y = (e.clientY - r.top - r.height / 2) * 0.28;
      b.style.transform = `translate(${x}px, ${y}px)`;
    });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  });
}

/* ---------- smooth anchor with topbar offset ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    const y = t.getBoundingClientRect().top + scrollY - topbar.offsetHeight - 8;
    scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  });
});
