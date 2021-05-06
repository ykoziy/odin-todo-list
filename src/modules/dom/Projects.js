import Project from '../Project';

const placeHolderProjects = [];

function generateProjects() {
    for (let i = 0; i <= 4; i++) {

    }
}
// ! just for testing purposes....
function renderProjects(projects) {

}

function updateProgress(percent, circleElement) {
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
        <li><div class="circle-status"></div>Project 1</li>
        <li><div class="circle-status fifty"></div>Project 2</li>
        <li><div class="circle-status"></div>Project 3</li>
        <li><div class="circle-status hundred"></div> Project 4</li>
    </ul>
    </div>
`;

function renderHTML(parentElement) {
    return markup;
}

export { renderHTML };