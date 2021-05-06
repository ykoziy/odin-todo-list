import Project from '../Project';

const placeHolderProjects = [];
generateProjects(4);

function generateProjects(count) {
    for (let i = 1; i <= count; i++) {
        let proj = new Project(`Project ${i}`);
        placeHolderProjects.push(proj);
    }
}

function renderProjects(projects) {
    return `${projects.map(proj => `<li><div class="circle-status"></div>${proj.title}</li>`).join('')}`;
}

function setProgress(percent, circleElement) {
  let angle = percent * 3.6;
  let secondGradient = 'linear-gradient(-90deg, green 50%, transparent 50%';
  if (percent > 100) {
      percent = 100;
  }
  if (percent <= 50) {
        circleElement.style.backgroundImage = `linear-gradient(${angle - 90}deg, white 50%, transparent 50%), ${secondGradient})`;
  } else {
        circleElement.style.backgroundImage = `linear-gradient(${angle - 270}deg, green 50%, transparent 50%), ${secondGradient})`;
  }
}

const markup = `
    <div id="projects">
    <ul>
    ${renderProjects(placeHolderProjects)}
    </ul>
    </div>
`;

function renderHTML() {
    return markup;
}

export { renderHTML };