let openmhzWindow;

const LOCAL_STORAGE_KEY = 'openMhzLauncherSettings';
const SAVED_SETTINGS = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

const serverSelect = document.getElementById('server-select');
const messageElement = document.getElementById('message');

const settings = {
    server: SAVED_SETTINGS?.server ?? 'psern1',
    groups: SAVED_SETTINGS?.groups ?? '1399',
    get src() {
        return `https://openmhz.com/system/${this.server}?filter-type=talkgroup&filter-code=${this.groups}`
    },
}

serverSelect.value = settings.server;
document.querySelectorAll('.talkgroup input').forEach(el => el.checked = settings.groups.split(',').includes(el.dataset.value));

const getSelectedGroups = () => Array.from(document.querySelectorAll('.talkgroup input:checked')).map(f => Number(f.dataset.value)).join(",");

function updateScanner() {
  if (openmhzWindow) {
    openmhzWindow.src = settings.src;
    const { server, groups } = settings;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ server, groups }));
  };
  return true;
}

function copyUrl() {
  navigator.clipboard.writeText(settings.src);
  messageElement.innerText = "Copied URL to clipboard!";
  setTimeout(() => {
    messageElement.innerText = "";
  }, 3000);
}

serverSelect.addEventListener('change', evt => {
    settings.server = evt.target.value;
    updateScanner();
});

// Channel change handler(s)
function talkGroupHandler(evt) {
  const groups = getSelectedGroups();
  if (!groups) {
    alert('Must keep at least one talk group active');
    evt.target.checked = !evt.target.checked;
    return;
  }
  settings.groups = groups;
  updateScanner();
};
for (const box of document.querySelectorAll('.talkgroup')) {
  box.addEventListener('change', talkGroupHandler);
}

const hamburgerIcon = 'Launcher Options &#9776;';
const closeIcon = 'Launcher Options &times;';

// Slide-out menu logic
const menu = document.getElementById('menu');
const menuToggle = document.getElementById('menu-toggle');
menuToggle.addEventListener('click', () => {
  menu.classList.toggle('open');
  document.body.classList.toggle('menu-open');
  menuToggle.innerHTML = menu.classList.contains('open') ? closeIcon : hamburgerIcon;
});

// Close menu when clicking outside
window.addEventListener('click', (e) => {
  if (
    menu.classList.contains('open') &&
    !menu.contains(e.target) &&
    e.target !== menuToggle
  ) {
    menu.classList.remove('open');
    document.body.classList.remove('menu-open');
  }
});

// initialize
(function(){
  let groups = getSelectedGroups();
  if (!groups) {
    const firstOption = element.querySelector('option');
    firstOption.checked = true; // Ensure at least one group is checked
    groups = firstOption.dataset.value;
  }
  
  document.getElementById("right").innerHTML = `<iframe id="openmhzFrame" style="flex: 1 1 auto;" src="about:blank"></iframe>`;
  openmhzWindow = document.getElementById("openmhzFrame");
  
  if (openmhzWindow) {
    openmhzWindow.contentWindow.document.write("<h3>Loading OpenMHz ...</h3>");
    settings.groups = groups;
    updateScanner();
  } else {
    alert("Popup blocked or failed.");
  }
  return true;
})();