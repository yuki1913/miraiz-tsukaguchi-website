/* =========================================================
   フリースクール MIRAIZ 阪急塚口校 — main.js
   依存ライブラリなし / defer 読み込み前提
   ========================================================= */
(() => {
  'use strict';

  /* ---------- 送信先メールアドレス -------------------------
     お問い合わせフォームの送信先。
     フォームの data-endpoint（index.html）が空のときは、
     入力内容を差し込んだメール作成画面を開くフォールバックで動作します。
     ------------------------------------------------------- */
  const FALLBACK_MAIL_TO = 'miraiz.tsukaguchi.info@gmail.com';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =======================================================
     1. ハンバーガーメニュー（ドロワー）
     ======================================================= */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  if (hamburger && nav) {
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.hidden = true;
    document.body.appendChild(overlay);

    const setOpen = (open) => {
      hamburger.setAttribute('aria-expanded', String(open));
      hamburger.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
      nav.classList.toggle('is-open', open);
      overlay.hidden = false;
      overlay.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };

    hamburger.addEventListener('click', () => {
      setOpen(hamburger.getAttribute('aria-expanded') !== 'true');
    });
    overlay.addEventListener('click', () => setOpen(false));
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        hamburger.focus();
      }
    });
    // デスクトップ幅に戻したら状態をリセット（CSSのドロワー切替と同じ 1080px）
    window.matchMedia('(min-width: 1081px)').addEventListener('change', (ev) => {
      if (ev.matches) setOpen(false);
    });
  }

  /* =======================================================
     2. スクロールで現れるセクション
     ======================================================= */
  const revealTargets = document.querySelectorAll(`
    .sec-head, .worry-list, .worry-cta, .about, .can-list__item,
    .content-card, .mypro, .table-wrap, .join-list__item, .banner-note,
    .day-col, .hours > *, .feat, .feat-center, .staff-points li,
    .support-list__item, .next-card, .next-figure, .price__card, .price__notes,
    .flow li, .faq details, .contact__direct, .contact__form, .access
  `);

  if (!reduceMotion && 'IntersectionObserver' in window) {
    revealTargets.forEach((el, i) => {
      el.classList.add('reveal');
      // 同じ行に並ぶカードは少しずつ遅らせる
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealTargets.forEach((el) => io.observe(el));
  }

  /* =======================================================
     3. 現在位置に応じたナビのハイライト
     ======================================================= */
  const navLinks = Array.from(document.querySelectorAll('.nav__list a[href^="#"]'));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  /* =======================================================
     4. スマホ下部の固定CTA（ヒーローを過ぎたら出す）
     ======================================================= */
  const ctaBar = document.getElementById('cta-bar');
  const hero = document.querySelector('.hero');
  if (ctaBar && hero && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      ctaBar.classList.toggle('is-visible', !entries[0].isIntersecting);
    }, { threshold: 0, rootMargin: '-40% 0px 0px 0px' });
    io.observe(hero);
  }

  /* =======================================================
     5. お問い合わせフォーム
     ======================================================= */
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');

  if (form && statusEl) {
    const setStatus = (msg, kind) => {
      statusEl.textContent = msg;
      statusEl.className = `form-status${kind ? ` is-${kind}` : ''}`;
    };

    const purposes = () =>
      Array.from(form.querySelectorAll('input[name="purpose"]:checked')).map((c) => c.value);

    const validate = () => {
      const errors = [];
      form.querySelectorAll('[required]').forEach((el) => {
        const ok = el.type === 'checkbox' ? el.checked : el.value.trim() !== '';
        el.setAttribute('aria-invalid', String(!ok));
        if (!ok) errors.push(el);
      });

      const email = form.elements.email;
      if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        email.setAttribute('aria-invalid', 'true');
        errors.push(email);
      }
      if (!purposes().length) {
        errors.push(form.querySelector('input[name="purpose"]'));
      }
      return errors;
    };

    // 入力し直したらエラー表示を解除
    form.addEventListener('input', (e) => {
      const el = e.target;
      if (el.getAttribute('aria-invalid') === 'true') el.removeAttribute('aria-invalid');
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const errors = validate();
      if (errors.length) {
        setStatus('未入力・未選択の項目があります。赤くなっている項目をご確認ください。', 'error');
        const first = errors[0];
        if (first) {
          first.focus({ preventScroll: true });
          first.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
        }
        return;
      }

      const data = {
        お名前: form.elements.name.value.trim(),
        ご記入者: form.elements.role.value,
        学年: form.elements.grade.value || '（未選択）',
        電話番号: form.elements.tel.value.trim(),
        メールアドレス: form.elements.email.value.trim() || '（未入力）',
        ご希望の内容: purposes().join('、'),
        ご相談内容: form.elements.message.value.trim() || '（未入力）',
      };

      const endpoint = form.dataset.endpoint;
      const submitBtn = form.querySelector('button[type="submit"]');

      if (!endpoint) {
        // フォールバック：メール作成画面を開く
        const body = Object.entries(data)
          .map(([k, v]) => `${k}：${v}`)
          .join('\n');
        const url =
          `mailto:${FALLBACK_MAIL_TO}` +
          `?subject=${encodeURIComponent('【MIRAIZ阪急塚口校】お問い合わせ')}` +
          `&body=${encodeURIComponent(`${body}\n\n--\nフリースクール MIRAIZ 阪急塚口校 サイトより送信`)}`;
        window.location.href = url;
        setStatus('メール作成画面を開きました。そのまま送信してください。', 'ok');
        return;
      }

      submitBtn.disabled = true;
      setStatus('送信中です…');
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        form.reset();
        setStatus('送信しました。担当者より2〜3営業日以内にご連絡いたします。', 'ok');
      } catch (err) {
        setStatus('送信に失敗しました。お手数ですが 06-6415-6977 までお電話ください。', 'error');
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  /* =======================================================
     6. スタッフ帯のマーキー（無限ループ用に複製）
     ======================================================= */
  const track = document.querySelector('.staff-strip__track');
  if (track && !reduceMotion) {
    track.innerHTML += track.innerHTML;
    track.querySelectorAll('[role="listitem"]').forEach((el, i, all) => {
      if (i >= all.length / 2) {
        el.setAttribute('aria-hidden', 'true');
        el.removeAttribute('role');
      }
    });
  }
})();
