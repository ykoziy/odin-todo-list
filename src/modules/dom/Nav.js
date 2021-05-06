const markup = `
    <div id="navigation">
    <div id="search">
        <input type="text" name="search-query" size="15"> 
    </div>
    <nav>
        <ul>
            <li>Inbox</li>
            <li>Upcoming</li>
            <li>Due Today</li>
            <li>Urgent</li>
        </ul>
    </nav>
    </div>
`;

function renderHTML(parentElement) {
    return markup;
}

export { renderHTML };