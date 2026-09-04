/* app.js — renders the page from content.js. Nothing to edit in here. */
(function () {
  'use strict';
  var C = window.CONTENT;
  var P = window.PHOTOS || {};
  var $ = function (id) { return document.getElementById(id); };
  var set = function (id, t) { var e = $(id); if (e) e.textContent = t || ''; };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };

  /* stand-in shown until a real photo exists at that path */
  function ph(label) {
    return 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 1200'>" +
      "<rect width='800' height='1200' fill='#232323'/>" +
      "<circle cx='400' cy='520' r='96' fill='none' stroke='#4a4a4a' stroke-width='4'/>" +
      "<polygon points='372,470 372,570 452,520' fill='#4a4a4a'/>" +
      "<text x='400' y='700' font-family='Helvetica,Arial' font-size='34' fill='#6a6a6a' " +
      "text-anchor='middle'>" + (label || 'Photo not added yet') + "</text></svg>");
  }
  var PH = ph();

  if (C.config.hideFromGoogle) {
    var mt = document.createElement('meta');
    mt.name = 'robots'; mt.content = 'noindex, nofollow';
    document.head.appendChild(mt);
  }
  document.title = C.config.name;

  /* ---- which photos belong to a memory ------------------------------- */
  function stamp(src) {
    var t = src.match(/-(\d{6})\.jpg$/);
    return t ? t[1] : null;
  }
  function photosFor(m) {
    var list = P[m.day] || [];
    if (m.from || m.to) {
      list = list.filter(function (src) {
        var t = stamp(src);
        if (!t) return false;
        var hm = t.slice(0, 4);
        return (!m.from || hm >= m.from) && (!m.to || hm <= m.to);
      });
    }
    if (m.skip) {
      list = list.filter(function (src) { return m.skip.indexOf(stamp(src)) === -1; });
    }
    return list;
  }
  C.moments.forEach(function (m) { m._photos = photosFor(m); });

  var byId = {};
  C.moments.forEach(function (m) { byId[m.id] = m; });

  /* every photo on the page, in order, for the full-screen viewer */
  var shots = [];
  function addShot(src, cap) { shots.push({ src: src, cap: cap }); return shots.length - 1; }

  var img = function (src, alt) {
    return '<img src="' + esc(src || PH) + '" alt="' + esc(alt) +
           '" loading="lazy" onerror="this.onerror=null;this.src=\'' + PH + '\'">';
  };

  /* ──────────────────────────────────── opening title card ─────────── */
  var intro = $('intro');
  (function () {
    var word = (C.intro && C.intro.word) || C.config.name.toUpperCase();
    $('i-word').innerHTML = word.split('').map(function (ch, i) {
      return '<span style="animation-delay:' + (i * 0.11).toFixed(2) + 's">' +
             esc(ch) + '</span>';
    }).join('');
    $('i-line').textContent = (C.intro && C.intro.tap) || 'Tap to start';
    var started = false;
    function start() {
      if (started) return;
      started = true;
      chime();
      $('i-line').textContent = (C.intro && C.intro.line) || '';
      intro.classList.add('is-playing');
      setTimeout(function () {
        intro.classList.add('is-gone');
        setTimeout(function () { if (intro) intro.remove(); }, 800);
      }, 2600);
    }
    intro.addEventListener('click', start);
    document.addEventListener('keydown', function k(e) {
      if (e.key === ' ' || e.key === 'Enter') { start(); document.removeEventListener('keydown', k); }
    });
  })();

  /* ───────────────────────────────────────────────── the sound ─────── */
  /* Synthesised in the browser — no audio file, nothing copied. */
  var AC = window.AudioContext || window.webkitAudioContext, ac = null;
  function audio() {
    if (!AC) return null;
    if (!ac) { try { ac = new AC(); } catch (e) { return null; } }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }
  /* one short note */
  function note(freq, at, dur, type, vol, glide) {
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, at);
    if (glide) o.frequency.exponentialRampToValueAtTime(glide, at + dur * 0.8);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(vol, at + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    o.connect(g); g.connect(ac.destination);
    o.start(at); o.stop(at + dur + 0.02);
  }
  var sfx = {
    tick:  function () { if (!audio()) return; note(1180, ac.currentTime, 0.07, 'sine', 0.05); },
    open:  function () { if (!audio()) return; var t = ac.currentTime;
                         note(587, t, 0.16, 'sine', 0.07); note(880, t + 0.05, 0.22, 'sine', 0.05); },
    close: function () { if (!audio()) return; var t = ac.currentTime;
                         note(660, t, 0.14, 'sine', 0.055, 380); },
    enter: function () { if (!audio()) return; var t = ac.currentTime;
                         [523.3, 659.3, 784.0].forEach(function (f, i) {
                           note(f, t + i * 0.055, 0.5, 'triangle', 0.075); }); },
    pop:   function () { if (!audio()) return; var t = ac.currentTime;
                         [523.3, 659.3, 784.0, 1046.5, 1318.5].forEach(function (f, i) {
                           note(f, t + i * 0.07, 0.85, 'triangle', 0.1); }); }
  };

  function chime() {
    if (!audio()) return;
    var out = ac.createGain();
    out.gain.value = 0.9;
    out.connect(ac.destination);
    var t0 = ac.currentTime + 0.05;

    function thump(at, freq) {                       // the two opening hits
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(freq * 2.2, at);
      o.frequency.exponentialRampToValueAtTime(freq, at + 0.09);
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(0.85, at + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.55);
      o.connect(g); g.connect(out);
      o.start(at); o.stop(at + 0.6);
    }
    thump(t0, 62);
    thump(t0 + 0.30, 93);

    /* then a warm major-seventh chord underneath it */
    [392.0, 493.9, 587.3, 784.0].forEach(function (f, i) {
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = 'triangle';
      o.frequency.value = f;
      var at = t0 + 0.62 + i * 0.11;
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(0.13, at + 0.35);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 2.4);
      o.connect(g); g.connect(out);
      o.start(at); o.stop(at + 2.5);
    });
  }

  /* ─────────────────────────────────────────── who's watching ──────── */
  set('pf-brand', C.config.name);
  set('pf-heading', C.profiles.heading);
  $('pf-list').innerHTML = C.profiles.people.map(function (p, i) {
    return '<li class="pf-item"' + (p.enters ? '' : ' data-blocked="1"') + '>' +
             '<button data-profile="' + i + '">' +
               '<span class="pf-avatar" style="background:' + esc(p.color) + '">' +
                 (p.avatar
                   ? '<img src="' + esc(p.avatar) + '" alt="' + esc(p.name) +
                     '" onerror="this.remove()">'
                   : esc(p.name.charAt(0))) + '</span>' +
               '<span class="pf-name">' + esc(p.name) + '</span>' +
             '</button></li>';
  }).join('');
  $('pf-list').addEventListener('click', function (e) {
    var b = e.target.closest('[data-profile]');
    if (!b) return;
    var p = C.profiles.people[+b.dataset.profile];
    if (!p.enters) { set('pf-blocked', p.blocked || 'Not this one.'); return; }
    sfx.enter();
    set('nav-avatar', p.name.charAt(0));
    $('nav-avatar').style.background = p.color;
    $('profiles').classList.add('is-gone');
    document.body.classList.remove('is-locked');
    window.scrollTo(0, 0);                       // always open at the top
    setTimeout(function () { var n = $('profiles'); if (n) n.remove(); }, 600);
  });
  document.body.classList.add('is-locked');
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  /* ───────────────────────────────────────────────── top bar ───────── */
  set('nav-brand', C.config.name);
  $('nav-links').innerHTML = C.rows.map(function (r, i) {
    return '<li><a href="#row-' + i + '">' + esc(r.title) + '</a></li>';
  }).join('');
  window.addEventListener('scroll', function () {
    $('nav').classList.toggle('is-stuck', window.scrollY > 40);
  }, { passive: true });

  /* ─────────────────────────────────────────────── billboard ───────── */
  var feat = byId[C.billboard.id] || C.moments[C.moments.length - 1];
  $('bb-img').src = feat._photos[0] || PH;
  $('bb-img').onerror = function () { this.onerror = null; this.src = PH; };
  $('bb-img').alt = feat.title;
  set('bb-tag', C.billboard.tag);
  set('bb-title', feat.title);
  $('bb-meta').innerHTML =
    '<span class="match">' + esc(feat.match) + '</span>' +
    '<span>' + esc(feat.date) + '</span>' +
    '<span class="pill">' + esc(feat.year) + '</span>' +
    '<span>' + esc(feat.place) + '</span>';
  set('bb-story', feat.story);
  $('bb-play').addEventListener('click', function () { openModal(feat.id); });
  $('bb-info').addEventListener('click', function () { openModal(feat.id); });

  /* ─────────────────────────────────────────────────── rows ────────── */
  function momentCard(m, opts) {
    opts = opts || {};
    var n = m._photos.length;
    var nv = (m.videos || []).length;
    var art =
      '<div class="card-art">' +
        img(m._photos[0], m.title) +
        (m.badge ? '<span class="card-badge">' + esc(m.badge) + '</span>' : '') +
        '<span class="card-shots">' +
          (n ? n + (n === 1 ? ' photo' : ' photos') : 'no photos yet') +
          (nv ? ' · ' + nv + (nv === 1 ? ' video' : ' videos') : '') +
        '</span>' +
      '</div>' +
      (opts.progress
        ? '<div class="card-progress"><i style="width:' +
          (35 + Math.round(Math.random() * 55)) + '%"></i></div>' : '') +
      '<div class="card-cap">' +
        '<span class="card-date">' + esc(m.date) + '</span>' +
        '<p class="card-title">' + esc(m.title) + '</p>' +
      '</div>';

    if (opts.rank) {
      return '<button class="card card-ranked" data-open="' + esc(m.id) + '">' +
               '<span class="card-rank">' + opts.rank + '</span>' +
               '<span class="card-inner">' + art + '</span></button>';
    }
    return '<button class="card" data-open="' + esc(m.id) + '">' + art + '</button>';
  }

  function rowItems(row) {
    if (row.kind === 'moments') {
      return row.ids.map(function (id, i) {
        return momentCard(byId[id], {
          progress: row.progress, rank: row.ranked ? i + 1 : null
        });
      }).join('');
    }
    if (row.kind === 'childhood') {
      var list = P.childhood || [];
      var caps = C.childhood.captions || [];
      if (!list.length) list = [null, null, null, null, null, null];
      return list.map(function (src, j) {
        var cap = caps[j] || '';
        var i = addShot(src || PH, cap);
        return '<button class="card" data-shot="' + i + '">' +
                 '<div class="card-art">' + img(src, 'Childhood') + '</div>' +
                 '<div class="card-cap">' +
                   '<span class="card-date">' + esc(C.childhood.subtitle) + '</span>' +
                   '<p class="card-title">' + esc(cap || ('Episode ' + (j + 1))) + '</p>' +
                 '</div></button>';
      }).join('');
    }
    if (row.kind === 'videocalls') {
      return (P.videocalls || []).map(function (src) {
        var d = (src.match(/(\d{4})-(\d{2})-(\d{2})/) || []);
        var when = d.length ? d[3] + '/' + d[2] : '';
        var i = addShot(src, 'On a call');
        return '<button class="card" data-shot="' + i + '">' +
                 '<div class="card-art">' + img(src, 'Video call') + '</div>' +
                 '<div class="card-cap">' +
                   '<span class="card-date">' + esc(when) + '</span>' +
                   '<p class="card-title">' + esc(C.videocalls.subtitle) + '</p>' +
                 '</div></button>';
      }).join('');
    }
    if (row.kind === 'wishes') {
      return C.wishes.map(function (v) {
        var media = v.file
          ? '<video controls preload="metadata" playsinline>' +
              '<source src="' + esc(v.file) + '"></video>'
          : img(null, v.from) + '<span class="wish-soon">Clip on the way</span>';
        return '<div class="card card-wish">' +
                 '<div class="card-art">' + media + '</div>' +
                 '<div class="card-cap">' +
                   '<p class="card-title">' + esc(v.from) + '</p>' +
                   '<span class="card-date">' + esc(v.note) + '</span>' +
                 '</div></div>';
      }).join('');
    }
    if (row.kind === 'places') {
      return C.places.map(function (p) {
        return '<div class="card-place">' + esc(p) + '</div>';
      }).join('');
    }
    return '';
  }

  $('rows').innerHTML = C.rows.map(function (row, i) {
    var n = row.kind === 'moments' ? row.ids.length
          : row.kind === 'childhood' ? (P.childhood || []).length
          : row.kind === 'videocalls' ? (P.videocalls || []).length
          : row.kind === 'wishes' ? (C.wishes || []).length
          : (C.places || []).length;
    return '<section class="row" id="row-' + i + '">' +
             '<div class="row-head">' +
               '<h2 class="row-title">' + esc(row.title) + '</h2>' +
               '<span class="row-count">' + n + '</span></div>' +
             '<div class="row-scroll">' +
               '<button class="row-arrow prev" data-scroll="-1" aria-label="Scroll left">&#8249;</button>' +
               '<div class="row-track">' + rowItems(row) + '</div>' +
               '<button class="row-arrow next" data-scroll="1" aria-label="Scroll right">&#8250;</button>' +
             '</div></section>';
  }).join('');

  $('rows').addEventListener('click', function (e) {
    var a = e.target.closest('[data-scroll]');
    if (!a) return;
    var track = a.parentNode.querySelector('.row-track');
    track.scrollBy({ left: (+a.dataset.scroll) * track.clientWidth * 0.85, behavior: 'smooth' });
  });

  /* ─────────────────────────────────────────────────── letter ──────── */
  var L = C.letter;
  set('l-label', L.label); set('l-title', L.title);
  $('l-body').innerHTML = L.body.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
  if (L.photos && L.photos.length) {
    $('l-photos').innerHTML = L.photos.map(function (src) {
      var i = addShot(src, 'Us');
      return '<img src="' + esc(src) + '" alt="Us" data-shot="' + i +
             '" loading="lazy" onerror="this.remove()">';
    }).join('');
  }
  set('l-sign', L.signoff);
  var renew = $('l-renew');
  renew.textContent = L.renew.label;
  renew.addEventListener('click', function () {
    sfx.pop();
    if (renew.classList.contains('is-done')) { burst(); return; }
    renew.classList.add('is-done');
    renew.textContent = L.renew.done;
    var msg = $('l-msg');
    msg.textContent = L.renew.message;
    msg.hidden = false;
    burst();
  });

  /* ──────────────────────────────────────────── title detail ───────── */
  var modal = $('modal');
  function openModal(id) {
    var m = byId[id];
    if (!m) return;
    $('m-img').src = m._photos[0] || PH;
    $('m-img').onerror = function () { this.onerror = null; this.src = PH; };
    $('m-img').alt = m.title;
    set('m-title', m.title);
    $('m-meta').innerHTML =
      '<span class="match">' + esc(m.match) + '</span>' +
      '<span>' + esc(m.date) + '</span>' +
      '<span class="pill">' + esc(m.year) + '</span>' +
      '<span>' + esc(m.duration) + '</span>';
    /* the story keeps its paragraph breaks */
    $('m-story').innerHTML = esc(m.story).split('\n\n')
      .map(function (p) { return '<span style="display:block;margin-bottom:.8em">' + p + '</span>'; })
      .join('');
    $('m-tags').innerHTML =
      '<b>Location:</b> ' + esc(m.place) +
      (m.tags && m.tags.length ? ' &nbsp;·&nbsp; <b>Genre:</b> ' + esc(m.tags.join(', ')) : '');

    var n = m._photos.length;
    set('m-shots-label', n ? 'All ' + n + (n === 1 ? ' photo' : ' photos') : 'No photos added yet');
    if (!m._shotIdx) {
      m._shotIdx = m._photos.map(function (src) {
        return addShot(src, m.date + ' — ' + m.title);
      });
    }
    var grid = m._photos.map(function (src, j) {
      return '<img src="' + esc(src) + '" alt="' + esc(m.title) +
             '" data-shot="' + m._shotIdx[j] + '" loading="lazy"' +
             ' onerror="this.onerror=null;this.src=\'' + PH + '\'">';
    }).join('');
    var vids = m.videos || (m.video ? [m.video] : []);
    if (vids.length) {
      grid = vids.map(function (v) {
        return '<video controls preload="metadata" playsinline ' +
               'style="grid-column:1/-1;width:100%;border-radius:3px;background:#000">' +
               '<source src="' + esc(v) + '"></video>';
      }).join('') + grid;
    }
    $('m-shots').innerHTML = grid;

    modal.hidden = false; modal.scrollTop = 0;
    document.body.classList.add('is-locked');
  }
  function closeModal() {
    modal.hidden = true;
    if ($('viewer').hidden) document.body.classList.remove('is-locked');
  }
  $('m-close').addEventListener('click', function () { sfx.close(); closeModal(); });
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

  /* ─────────────────────────────────────── one photo, full screen ──── */
  var viewer = $('viewer'), cur = 0;
  function openViewer(i) {
    if (!shots.length) return;
    cur = (i + shots.length) % shots.length;
    $('v-img').src = shots[cur].src;
    $('v-img').onerror = function () { this.onerror = null; this.src = PH; };
    $('v-img').alt = shots[cur].cap || '';
    set('v-cap', shots[cur].cap);
    viewer.hidden = false;
    document.body.classList.add('is-locked');
  }
  function closeViewer() {
    viewer.hidden = true;
    if (modal.hidden) document.body.classList.remove('is-locked');
  }
  $('v-close').addEventListener('click', function () { sfx.close(); closeViewer(); });
  $('v-prev').addEventListener('click', function () { sfx.tick(); openViewer(cur - 1); });
  $('v-next').addEventListener('click', function () { sfx.tick(); openViewer(cur + 1); });
  viewer.addEventListener('click', function (e) {
    if (e.target === viewer || e.target.id === 'v-img') closeViewer();
  });

  document.addEventListener('click', function (e) {
    var o = e.target.closest('[data-open]');
    if (o) { sfx.open(); openModal(o.dataset.open); return; }
    var s = e.target.closest('[data-shot]');
    if (s) { sfx.open(); openViewer(+s.dataset.shot); return; }
    if (e.target.closest('[data-scroll]') || e.target.closest('.nav-links a')) sfx.tick();
  });

  document.addEventListener('keydown', function (e) {
    if (!viewer.hidden) {
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowLeft') openViewer(cur - 1);
      if (e.key === 'ArrowRight') openViewer(cur + 1);
      return;
    }
    if (!modal.hidden && e.key === 'Escape') closeModal();
  });

  /* ─────────────────────────────────────────────── confetti ────────── */
  var cv = $('confetti'), ctx = cv.getContext('2d'), bits = [], running = false;
  var COLORS = ['#E50914', '#46D369', '#FFFFFF', '#D9A441', '#2E77D0'];
  function burst() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    cv.width = window.innerWidth; cv.height = window.innerHeight;
    for (var i = 0; i < 140; i++) {
      bits.push({
        x: cv.width / 2 + (Math.random() - 0.5) * cv.width * 0.5,
        y: cv.height * 0.72,
        vx: (Math.random() - 0.5) * 11,
        vy: -9 - Math.random() * 11,
        w: 5 + Math.random() * 6, h: 8 + Math.random() * 8,
        r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.3,
        c: COLORS[(Math.random() * COLORS.length) | 0], life: 1
      });
    }
    if (!running) { running = true; requestAnimationFrame(fall); }
  }
  function fall() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (var i = bits.length - 1; i >= 0; i--) {
      var b = bits[i];
      b.vy += 0.32; b.x += b.vx; b.y += b.vy; b.r += b.vr; b.vx *= 0.992;
      b.life -= 0.006;
      if (b.life <= 0 || b.y > cv.height + 40) { bits.splice(i, 1); continue; }
      ctx.save();
      ctx.translate(b.x, b.y); ctx.rotate(b.r);
      ctx.globalAlpha = Math.max(0, Math.min(1, b.life * 1.6));
      ctx.fillStyle = b.c;
      ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
      ctx.restore();
    }
    if (bits.length) { requestAnimationFrame(fall); }
    else { running = false; ctx.clearRect(0, 0, cv.width, cv.height); }
  }

  var x0 = null;
  viewer.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  viewer.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 60) openViewer(cur + (dx < 0 ? 1 : -1));
    x0 = null;
  }, { passive: true });
})();
