const markup = `
    <div id="navigation">
    <div id="search">
        <input type="text" name="search-query" size="15"> 
    </div>
    <nav>
        <ul>
            <li data-name="inbox" id="inbox-nav"><i class="fas fa-inbox"></i><p>Inbox</p></li>
            <li data-name="upcoming" id="upcoming-nav"><i class="fas fa-calendar-alt"></i><p>Upcoming</p></li>
            <li data-name="today" id="today-nav"><i class="fas fa-star"></i><p>Due Today</p></li>
            <li data-name="urgent" id="urgent-nav"><i class="fas fa-exclamation-circle"></i><p>Urgent</p></li>
        </ul>
    </nav>
    </div>
`;

function renderHTML() {
    return markup;
}

export { renderHTML };