const siteData = window.TEAM_SITE_DATA;

/**
 * Создает DOM-элемент с необязательным классом и текстовым содержимым.
 */
function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined && text !== null) el.textContent = text;
  return el;
}

/**
 * Рендерит общую информацию о команде в шапке, разделе «О команде» и подвале.
 */
function renderTeamInfo(team) {
  document.getElementById('header-team-name').textContent = team.name;
  document.getElementById('header-team-motto').textContent = team.motto;

  document.getElementById('hero-university').textContent = `${team.university} • ${team.course}`;
  document.getElementById('hero-title').textContent = team.name;
  document.getElementById('hero-motto').textContent = team.motto;

  document.getElementById('about-intro').textContent = team.aboutIntro;
  document.getElementById('about-faculty').textContent = team.faculty;

    // Строка мотивации берется из src/data/team.js
  document.getElementById('about-motivation').textContent = team.motivation || '';

  document.getElementById('footer-university').textContent = `${team.university}, ${team.faculty}`;
  document.getElementById('captain-contact').textContent = team.captainContact;

  const repoLink = document.getElementById('repo-link');
  repoLink.href = team.repoUrl;

  document.getElementById('footer-copy').textContent = `© 2026 Команда «${team.name}»`;
}

/**
 * Рендерит список тегов (навыков или технологий).
 */
function renderTags(container, items) {
  container.replaceChildren();
  if (!Array.isArray(items) || items.length === 0) return;

  items.forEach((item) => {
    container.appendChild(createEl('span', 'tag', item));
  });
}

/**
 * Заполняет аватар участника: фото (если указано) или инициалы на цветном фоне.
 */
function fillAvatar(container, member) {
  container.replaceChildren();
  if (member.photo) {
    container.style.backgroundColor = 'transparent';
    const img = createEl('img', 'avatar-img');
    img.src = member.photo;
    img.alt = member.name;
    container.appendChild(img);
  } else {
    container.style.backgroundColor = member.avatarBg;
    container.textContent = member.avatarInitials;
  }
}

/**
 * Открывает модальное окно с подробной карточкой участника.
 */
function openMemberModal(member) {
  const modal = document.getElementById('member-modal');
  const avatar = document.getElementById('modal-avatar');

  fillAvatar(avatar, member);

  document.getElementById('modal-name').textContent = member.name;
  document.getElementById('modal-role').textContent = member.role;
  const groupEl = document.getElementById('modal-group');
  groupEl.textContent = member.group || '';
  groupEl.hidden = !member.group;

  document.getElementById('modal-bio').textContent = member.bio;
  document.getElementById('modal-contact').textContent = member.contact;

  renderTags(document.getElementById('modal-skills'), member.skills);

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeMemberModal() {
  const modal = document.getElementById('member-modal');
  modal.hidden = true;
  document.body.style.overflow = '';
}

/**
 * Рендерит карточки всех участников из src/data/team.js.
 */
function renderMembers(members) {
  const grid = document.getElementById('members-grid');
  grid.replaceChildren();

  members.forEach((member) => {
    const card = createEl('article', 'member-card');

    const top = createEl('div', 'member-top');
    const avatar = createEl('div', 'avatar');
    fillAvatar(avatar, member);

    const info = createEl('div');
    info.appendChild(createEl('h3', 'member-name', member.name));
    info.appendChild(createEl('p', 'member-role', member.role));
    if (member.group) {
      info.appendChild(createEl('p', 'member-group', member.group));
    }

    top.appendChild(avatar);
    top.appendChild(info);

    const bio = createEl('p', 'member-bio', member.bio);
    const tags = createEl('div', 'tags');
    renderTags(tags, member.skills);

    const footer = createEl('div', 'member-footer');
    footer.appendChild(createEl('span', '', member.contact));

    const detailsBtn = createEl('button', 'btn-link', 'Подробнее');
    detailsBtn.type = 'button';
    detailsBtn.addEventListener('click', () => openMemberModal(member));
    footer.appendChild(detailsBtn);

    card.appendChild(top);
    card.appendChild(bio);
    card.appendChild(tags);
    card.appendChild(footer);

    grid.appendChild(card);
  });
}

/**
 * Рендерит раздел общих навыков команды.
 */
function renderSkills(skillsGroups) {
  const grid = document.getElementById('skills-grid');
  grid.replaceChildren();

  skillsGroups.forEach((group) => {
    const card = createEl('div', 'skill-card');
    card.appendChild(createEl('h3', '', group.category));

    const tags = createEl('div', 'tags');
    renderTags(tags, group.items);
    card.appendChild(tags);

    grid.appendChild(card);
  });
}

/**
 * Рендерит список проектов и идей.
 */
function renderProjectsSection(projects) {
  const grid = document.getElementById('projects-grid');
  grid.replaceChildren();

  projects.forEach((project) => {
    const card = createEl('article', 'project-card');

    const meta = createEl('div', 'project-meta');
    meta.appendChild(createEl('span', 'project-status', project.status));
    meta.appendChild(createEl('span', 'project-category', project.category));

    card.appendChild(meta);
    card.appendChild(createEl('h3', '', project.title));
    card.appendChild(createEl('p', '', project.description));

    const tags = createEl('div', 'tags');
    renderTags(tags, project.stack);
    card.appendChild(tags);

    grid.appendChild(card);
  });
}

/**
 * Настраивает мобильное меню и закрытие модального окна.
 */
function setupUIControls() {
  const menuBtn = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');

  menuBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  const modal = document.getElementById('member-modal');
  document.getElementById('modal-close').addEventListener('click', closeMemberModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeMemberModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closeMemberModal();
  });
}

function init() {
  renderTeamInfo(siteData.team);
  renderMembers(siteData.members);
  renderSkills(siteData.skills);
  renderProjectsSection(siteData.projects);
  setupUIControls();
}

init();
