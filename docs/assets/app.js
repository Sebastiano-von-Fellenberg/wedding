/* Public content only. RSVP credentials are entered only on the private Python service. */
"use strict";
(() => {
  const content = JSON.parse(document.getElementById("site-content").textContent);
  const languages = ["de", "en", "el"];
  const travelKeys = ["itineraries", "sitia", "east", "west", "south", "food", "practical"];
  let stored = "";
  try { stored = localStorage.getItem("wedding-language") || ""; } catch (_) {}
  const param = new URLSearchParams(location.search).get("lang");
  let lang = languages.includes(param) ? param : languages.includes(stored) ? stored : "en";
  const main = document.getElementById("main");
  let renderId = 0;
  const escape = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const safeExternalUrl = value => {
    try { const url = new URL(value); return url.protocol === "https:" ? url.href : "#"; }
    catch (_) { return "#"; }
  };
  const resourceLinks = links => links?.length ? `<ul class="resource-links">${links.map(link=>`<li><a href="${escape(safeExternalUrl(link.url))}" target="_blank" rel="noreferrer"><strong>${escape(link.label)}</strong>${link.description ? `<span>${escape(link.description)}</span>` : ""}<span class="resource-arrow" aria-hidden="true">↗</span></a></li>`).join("")}</ul>` : "";
  const text = () => content.languages[lang];
  const card = (href, number, title, description) => `<a class="info-card" href="${href}"><span class="card-number">${number}</span><h3>${escape(title)}</h3><p>${escape(description)}</p><span class="card-arrow" aria-hidden="true">↗</span></a>`;
  const intro = (eyebrow, title, body) => `<section class="page-intro"><p class="eyebrow">${escape(eyebrow)}</p><h1>${escape(title)}</h1><p class="lead">${escape(body)}</p></section>`;

  function render() {
    const current = ++renderId, t = text();
    const hash = location.hash.slice(1) || "home";
    const page = hash.startsWith("rsvp=") ? "rsvp" : hash;
    const showTravelGuide = lang !== "el";
    document.documentElement.lang = lang;
    document.title = `${t.nav[page] || t.travel[page.replace("travel-", "")] || t.brand} · ${t.brand}`;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const value = el.dataset.i18n.split(".").reduce((obj, key) => obj?.[key], t);
      if (value) el.textContent = value;
    });
    document.querySelector(".languages").setAttribute("aria-label", t.language);
    document.querySelectorAll("[data-lang]").forEach(el => el.setAttribute("aria-pressed", String(el.dataset.lang === lang)));
    document.querySelectorAll(".main-nav > a").forEach(el => {
      if (el.hash === "#" + page) el.setAttribute("aria-current", "page"); else el.removeAttribute("aria-current");
    });
    document.querySelector(".travel-dropdown").hidden = !showTravelGuide;
    document.getElementById("travel-menu").innerHTML = `<a href="#travel">${escape(t.nav.travel)}</a>` + travelKeys.map(key => `<a href="#travel-${key}">${escape(t.travel[key])}</a>`).join("");
    if (page === "home") {
      const homeCards = showTravelGuide
        ? card("#celebration","01",t.home.schedule_title,t.home.schedule_desc) + card("#travel","02",t.home.travel_title,t.home.travel_desc) + card("#faq","03",t.home.faq_title,t.home.faq_desc)
        : card("#celebration","01",t.home.schedule_title,t.home.schedule_desc) + card("#faq","02",t.home.faq_title,t.home.faq_desc);
      const travelButton = showTravelGuide ? `<a class="quiet-link" href="#travel">${escape(t.hero.explore)} <span aria-hidden="true">→</span></a>` : "";
      main.innerHTML = `<section class="hero"><span class="frame-corner frame-tl" aria-hidden="true"></span><span class="frame-corner frame-tr" aria-hidden="true"></span><span class="frame-corner frame-bl" aria-hidden="true"></span><span class="frame-corner frame-br" aria-hidden="true"></span><div class="hero-copy"><p class="eyebrow">${escape(t.hero.eyebrow)}</p><h1>${escape(t.hero.line1)}<br><em>${escape(t.hero.line2)}</em></h1><p class="lead">${escape(t.hero.intro)}</p><div class="hero-buttons"><a class="button" href="#rsvp">${escape(t.hero.invitation)} <span aria-hidden="true">↗</span></a>${travelButton}</div><div class="hero-details"><div><span class="small-label">${escape(t.hero.date_label)}</span><p>${escape(t.hero.date)}</p></div><div><span class="small-label">${escape(t.hero.place_label)}</span><p>${escape(t.hero.place)}</p></div></div></div><div class="hero-art" role="img" aria-label="${escape(t.hero.place)}"><div class="art-label">ΚΡΗΤΗ <span>35° N · 26° E</span></div></div></section><section class="home-essentials"><div class="section-heading"><p class="eyebrow">${escape(t.hero.eyebrow)}</p><h2>${escape(t.home.title)}</h2><p>${escape(t.home.intro)}</p></div><div class="card-grid">${homeCards}</div></section>`;
    } else if (page === "celebration") {
      const venue = t.travel_pages.food.sections.find(section => section.links?.some(link => link.url.includes("fotis-seaside")));
      const accommodation = t.travel_pages.practical.sections.find(section => section.links?.some(link => link.url.includes("castrivillage")));
      const sections = [venue, accommodation].filter(Boolean);
      main.innerHTML = intro(t.schedule.eyebrow,t.home.schedule_title,t.schedule.wedding_desc) + `<section class="celebration-details"><div class="article-body">${sections.map(section=>`<article><h2>${escape(section.title)}</h2>${section.paragraphs.map(paragraph=>`<p>${escape(paragraph)}</p>`).join("")}${resourceLinks(section.links)}</article>`).join("")}</div><a class="quiet-link celebration-schedule-link" href="#schedule">${escape(t.nav.schedule)} <span aria-hidden="true">→</span></a></section>`;
    } else if (page === "schedule") {
      main.innerHTML = intro(t.schedule.eyebrow,t.schedule.title,t.schedule.intro) + `<section class="timeline">${["welcome","wedding","goodbye"].map((key,i)=>`<article class="timeline-row"><span class="timeline-number">0${i+1}</span><div><p class="eyebrow">${escape(t.schedule[key+"_meta"] || t.schedule.pending)}</p><h2>${key === "wedding" ? `<a class="timeline-title-link" href="#celebration">${escape(t.schedule[key+"_title"])} <span aria-hidden="true">→</span></a>` : escape(t.schedule[key+"_title"])}</h2><p>${escape(t.schedule[key+"_desc"])}</p></div><span class="timeline-flower branch-${i % 2 ? "left" : "right"}" aria-hidden="true"></span></article>`).join("")}</section>`;
    } else if (page === "travel") {
      main.innerHTML = intro(t.guide.eyebrow,t.guide.title,t.guide.intro) + `<section class="travel-index"><p>${escape(t.guide.note)}</p><div class="travel-grid">${travelKeys.map((key,i)=>card("#travel-"+key,"0"+(i+1),t.travel[key],t.travel_pages[key].intro)).join("")}</div></section>`;
    } else if (page.startsWith("travel-") && travelKeys.includes(page.slice(7))) {
      const key = page.slice(7), data = t.travel_pages[key];
      main.innerHTML = intro(t.nav.travel,t.travel[key],data.intro) + `<section class="travel-article"><aside class="region-nav">${travelKeys.map(k=>`<a href="#travel-${k}" ${k===key?'aria-current="page"':""}>${escape(t.travel[k])}</a>`).join("")}</aside><div class="article-body">${data.sections.length ? data.sections.map(s=>`<article><h2>${escape(s.title)}</h2>${s.paragraphs.map(p=>`<p>${escape(p)}</p>`).join("")}${resourceLinks(s.links)}</article>`).join("") : `<div class="coming-soon"><span class="branch-pair" aria-hidden="true"></span><h2>${escape(t.guide.pending)}</h2><p>${escape(t.guide.note)}</p></div>`}</div></section>`;
    } else if (page === "faq") {
      main.innerHTML = intro(t.faq.eyebrow,t.faq.title,t.faq.intro) + `<section class="faq-list">${t.questions.map((item,i)=>`${item.section ? `<h2 class="faq-section">${escape(item.section)}</h2>` : ""}<details><summary><span class="faq-number">${String(i+1).padStart(2,"0")}</span>${escape(item.q)}<span class="faq-plus" aria-hidden="true">+</span></summary><p>${escape(item.a)}</p></details>`).join("")}</section>`;
    } else if (page === "rsvp") {
      const r = t.rsvp;
      main.innerHTML = intro(r.private,r.entry_title,r.entry_intro) + `<section class="invitation-entry"><div class="form-card"><p class="privacy-note">${escape(r.entry_note)}</p><button id="open-rsvp" class="button" type="button">${escape(r.entry_button)}</button><p id="rsvp-status" role="status" aria-live="polite"></p></div><div class="entry-art" aria-hidden="true">✳</div></section>`;
      document.getElementById("open-rsvp").addEventListener("click", () => openRSVP(current));
    } else {
      location.hash = "home"; return;
    }
    document.getElementById("main-nav").classList.remove("open");
    document.querySelector(".menu-toggle").setAttribute("aria-expanded","false");
    closeTravel();
  }

  async function openRSVP(current) {
    const r = text().rsvp, status = document.getElementById("rsvp-status");
    status.textContent = r.loading;
    try {
      const response = await fetch("backend.json?t=" + Date.now(), {cache:"no-store", signal:AbortSignal.timeout(8000)});
      if (!response.ok) throw new Error("config");
      const config = await response.json();
      if (current !== renderId) return;
      if (!config.url && !config.local) { status.textContent = r.unconfigured; return; }
      const backend = new URL(config.url || location.origin);
      // Never send guests to an arbitrary endpoint in a modified pointer.
      const local = config.local && ["localhost","127.0.0.1"].includes(backend.hostname) && backend.origin === location.origin;
      if (!local && !(backend.protocol === "https:" && backend.hostname.endsWith(".trycloudflare.com"))) throw new Error("host");
      const destination = new URL("/rsvp/access/", backend.origin);
      destination.searchParams.set("lang", lang);
      location.assign(destination.href);
    } catch (_) { if (current === renderId) status.textContent = r.offline; }
  }

  function closeTravel() { document.getElementById("travel-menu").hidden = true; document.getElementById("travel-toggle").setAttribute("aria-expanded","false"); }
  document.getElementById("travel-toggle").addEventListener("click", () => {
    const menu = document.getElementById("travel-menu"), open = menu.hidden;
    menu.hidden = !open; document.getElementById("travel-toggle").setAttribute("aria-expanded",String(open));
  });
  document.addEventListener("click", event => { if (!event.target.closest(".travel-dropdown")) closeTravel(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") {closeTravel(); document.getElementById("main-nav").classList.remove("open"); document.querySelector(".menu-toggle").setAttribute("aria-expanded","false");} });
  document.querySelector(".menu-toggle").addEventListener("click", event => {
    const open = document.getElementById("main-nav").classList.toggle("open"); event.currentTarget.setAttribute("aria-expanded",String(open));
  });
  document.querySelectorAll("[data-lang]").forEach(button => button.addEventListener("click", () => {
    lang = button.dataset.lang;
    try {localStorage.setItem("wedding-language",lang);} catch (_) {}
    const url = new URL(location.href); url.searchParams.set("lang",lang); history.replaceState(null,"",url);
    render();
  }));
  window.addEventListener("hashchange", () => { render(); window.scrollTo({top:0,behavior:"instant"}); main.focus({preventScroll:true}); });
  render();
})();
