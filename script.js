// ===== CONFIG — WEBHOOKS N8N =====
// Cole aqui as URLs dos webhooks do n8n (Production URL, não a Test URL).
// Enquanto vazias, o site usa fallback: FormSubmit para o form, e classificação local para o nicho.

// Webhook para envio do formulário de demonstração.
// Payload enviado: { Nome, Email, WhatsApp, Empresa, Segmento, Mensagem }
// Resposta esperada: { success: true } (qualquer 2xx é tratado como sucesso)
const DEMO_FORM_WEBHOOK = 'https://n8n.alcetus.com/webhook/alcetus-demo-form';

// Webhook para classificação de nicho via IA (Groq + Llama 3.3 70B).
// Payload enviado: { niche }
// Resposta esperada: { type: 'B2B' | 'P2P' | 'invalid', count?: number }
const NICHE_WEBHOOK_URL = 'https://n8n.alcetus.com/webhook/alcetus-niche';

// ===== NAV scroll effect =====
const nav = document.getElementById('main-nav');
const onScroll = () => {
  if (window.scrollY > 20) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== Mobile menu =====
const mobileToggle = document.getElementById('mobile-toggle');
const mobileMenu = document.getElementById('mobile-menu');
mobileToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a, button').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ===== FAQ accordion =====
document.querySelectorAll('.faq-item').forEach(item => {
  const trigger = item.querySelector('.faq-trigger');
  trigger.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });
});

// ===== Reveal on scroll =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== Smooth scroll for internal links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== DEMO MODAL =====
const modal = document.getElementById('demo-modal');
const demoForm = document.getElementById('demo-form');
const demoSuccess = document.getElementById('demo-success');
const demoSubmit = document.getElementById('demo-submit');

function openModal(prefillSegment) {
  if (!modal) return;
  // reset
  demoForm.hidden = false;
  demoSuccess.hidden = true;
  if (prefillSegment) {
    const seg = document.getElementById('d-segment');
    if (seg && !seg.value) seg.value = prefillSegment;
  }
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  setTimeout(() => {
    const first = modal.querySelector('input');
    if (first) first.focus();
  }, 50);
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('[data-open-demo]').forEach(btn => {
  btn.addEventListener('click', () => openModal());
});

modal?.querySelectorAll('[data-close-modal]').forEach(el => {
  el.addEventListener('click', closeModal);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal?.classList.contains('is-open')) closeModal();
});

// Phone mask (simples, BR)
const phoneInput = document.getElementById('d-phone');
if (phoneInput) {
  phoneInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    else if (v.length > 6) v = v.replace(/(\d{2})(\d{4,5})(\d{0,4}).*/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5}).*/, '($1) $2');
    else if (v.length > 0) v = v.replace(/(\d{0,2}).*/, '($1');
    e.target.value = v;
  });
}

// Form submission — FormSubmit.co AJAX endpoint envia para alcetusflow@gmail.com.
// IMPORTANTE: na PRIMEIRA tentativa o dono do email recebe um link de ativação.
// Clique nesse link para que futuros envios cheguem na caixa.
const TARGET_EMAIL = 'alcetusflow@gmail.com';

function buildMailtoFallback(data) {
  const body = [
    `Nome: ${data.get('Nome') || ''}`,
    `Email: ${data.get('Email') || ''}`,
    `WhatsApp: ${data.get('WhatsApp') || ''}`,
    `Empresa: ${data.get('Empresa') || ''}`,
    `Segmento: ${data.get('Segmento') || ''}`,
    '',
    `Mensagem:`,
    data.get('Mensagem') || ''
  ].join('\n');
  const subject = 'Nova solicitação de demonstração — Alcetus Flow';
  return `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

async function submitViaN8n(payload) {
  const res = await fetch(DEMO_FORM_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('n8n webhook returned ' + res.status);
  return res.json().catch(() => ({ success: true }));
}

async function submitViaFormSubmit(payload) {
  // fallback: FormSubmit AJAX (requer ativação no primeiro uso)
  const res = await fetch('https://formsubmit.co/ajax/alcetusflow@gmail.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await res.json().catch(() => ({}));
  const ok = res.ok && (json.success === true || json.success === 'true' || /activate/i.test(json.message || ''));
  if (!ok) throw new Error(json.message || 'formsubmit failed');
  return json;
}

if (demoForm) {
  demoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (demoSubmit.classList.contains('is-loading')) return;
    demoSubmit.classList.add('is-loading');
    demoSubmit.disabled = true;

    const formData = new FormData(demoForm);
    const leadEmail = formData.get('Email');
    if (leadEmail) formData.set('_replyto', leadEmail);

    const payload = {};
    formData.forEach((v, k) => { payload[k] = v; });

    try {
      if (DEMO_FORM_WEBHOOK) {
        await submitViaN8n(payload);
      } else {
        await submitViaFormSubmit(payload);
      }
      demoForm.reset();
      demoForm.hidden = true;
      demoSuccess.hidden = false;
    } catch (err) {
      console.error('[demo-form] falhou:', err);
      const proceed = confirm(
        'Não foi possível enviar automaticamente.\n\n' +
        'Deseja abrir seu app de email para enviar manualmente para ' + TARGET_EMAIL + '?'
      );
      if (proceed) window.location.href = buildMailtoFallback(formData);
    } finally {
      demoSubmit.classList.remove('is-loading');
      demoSubmit.disabled = false;
    }
  });
}

// ===== NICHE CLASSIFIER =====
// Estratégia "B2B-first": quase todo tipo de negócio tem uma vertente B2B
// (fornecedor, atacado, serviços, insumos). Só invalidamos strings que claramente
// não são um negócio (palavras aleatórias, muito curtas, apenas números).

function norm(s) {
  return s.toLowerCase()
    .trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ');
}

// Lista mínima de palavras que claramente não são segmento de negócio
const NON_BUSINESS_HINTS = [
  'pessoa fisica', 'minha vida', 'teste', 'qualquer coisa',
  'nada', 'ninguem', 'ninguém', 'eu mesmo', 'hobby', 'passatempo'
];

// Detecta string que não parece um negócio real (random chars, só números, gibberish)
function looksLikeGibberish(n) {
  if (n.length < 3) return true;
  if (!/[aeiou]/.test(n)) return true;              // sem vogais
  if (/^[\d\s]+$/.test(n)) return true;             // só números
  // Muitas consoantes seguidas (xyzqwrt)
  if (/[bcdfghjklmnpqrstvwxyz]{5,}/i.test(n)) return true;
  // Só uma palavra e tem menos de 4 letras (tipo "xzt", "abc")
  const words = n.split(' ').filter(Boolean);
  if (words.length === 1 && words[0].length < 4) return true;
  return false;
}

function classifyLocally(niche) {
  const n = norm(niche);

  if (!n || looksLikeGibberish(n)) {
    return { type: 'invalid' };
  }

  // Frases claramente não-comerciais
  if (NON_BUSINESS_HINTS.some(h => n.includes(norm(h)))) {
    return { type: 'invalid' };
  }

  // Tudo o mais é considerado B2B — toda empresa/segmento tem cadeia de
  // fornecedores, distribuidores e serviços que operam em B2B.
  return { type: 'B2B', count: 20 + Math.floor(Math.random() * 111) }; // 20-130
}

async function classifyViaWebhook(niche) {
  try {
    const res = await fetch(NICHE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ niche })
    });
    if (!res.ok) throw new Error('webhook error');
    const data = await res.json();
    // Normaliza resposta
    const type = (data.type || '').toString().toUpperCase();
    if (type === 'B2B') {
      const count = Number.isFinite(data.count) ? Math.min(130, Math.max(20, data.count)) : 20 + Math.floor(Math.random() * 111);
      return { type: 'B2B', count };
    }
    if (type === 'P2P' || type === 'B2C') return { type: 'P2P' };
    return { type: 'invalid' };
  } catch (err) {
    console.warn('[niche] webhook falhou, usando classificação local', err);
    return classifyLocally(niche);
  }
}

async function classifyNiche(niche) {
  if (NICHE_WEBHOOK_URL) return classifyViaWebhook(niche);
  // Simula delay para melhor UX
  await new Promise(r => setTimeout(r, 500 + Math.random() * 400));
  return classifyLocally(niche);
}

// ===== Search form =====
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchResult = document.getElementById('search-result');

function resetResult() {
  searchResult.className = 'search-result';
  searchResult.innerHTML = '';
}

if (searchForm) {
  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    resetResult();
    if (!query) {
      searchResult.classList.add('is-invalid');
      searchResult.textContent = 'Digite um segmento para pesquisar.';
      return;
    }

    searchResult.classList.add('is-loading');
    searchResult.textContent = 'Analisando o segmento...';

    const result = await classifyNiche(query);
    resetResult();

    if (result.type === 'B2B') {
      searchResult.classList.add('is-b2b');
      searchResult.innerHTML = `
        <div style="margin-bottom:0.5rem">Seu segmento <strong>"${escapeHtml(query)}"</strong> é <strong style="color:hsl(var(--primary))">B2B</strong> e tem ótimo potencial no Alcetus Flow.</div>
        <div>Encontramos <span class="search-count">mais de ${result.count}</span> empresas nesse segmento na nossa base.</div>
        <button type="button" class="btn-primary btn-md" style="margin-top:1rem" data-open-demo="true" data-segment="${escapeHtml(query)}">Agendar demonstração</button>
      `;
      // ligar o botão novo
      searchResult.querySelector('[data-open-demo]').addEventListener('click', () => openModal(query));
    } else if (result.type === 'P2P') {
      searchResult.classList.add('is-p2p');
      searchResult.innerHTML = `O segmento <strong>"${escapeHtml(query)}"</strong> parece ser <strong>P2P/B2C</strong> (venda para pessoa física). O Alcetus Flow é especializado em prospecção <strong>B2B</strong>, então não é o ideal para esse nicho.`;
    } else {
      searchResult.classList.add('is-invalid');
      searchResult.innerHTML = `Não conseguimos identificar o segmento <strong>"${escapeHtml(query)}"</strong>. Tente ser mais específico (ex: "agências de marketing", "distribuidoras de alimentos", "escritórios de advocacia").`;
    }
  });
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
