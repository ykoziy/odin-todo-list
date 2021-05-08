const markup = `
    <div id="navigation">
    <div id="search">
        <input type="text" name="search-query" size="15"> 
    </div>
    <nav>
        <ul>
            <li data-name="inbox">Inbox</li>
            <li data-name="upcoming">Upcoming</li>
            <li data-name="today">Due Today</li>
            <li data-name="urgent">Urgent</li>
        </ul>
    </nav>
    </div>
`;

function renderHTML(parentElement) {
    return markup;
}

export { renderHTML };