import {isSameDay, parseISO} from "date-fns";

export function sortData(data, searchText, searchTags) {
    const selectedTags = searchTags.filter(tag => tag.value).map(tag => tag.key.toLowerCase());

    return data.filter((event) => {
        const nameMatches = event.name.toLowerCase().replace(/\s/g, '')
            .includes(searchText.toLowerCase().replace(/\s/g, ''));

        const tagsMatch = selectedTags.length === 0 || selectedTags.includes(event.eventType.toLowerCase());

        return nameMatches && tagsMatch;
    });
}

export function filterLessonsByDate(lessonsData, selectedDate) {
    const dateToCompare = typeof selectedDate === 'string' ? new Date(selectedDate) : selectedDate;
    
    return lessonsData.filter(lesson => {
        const lessonDate = parseISO(lesson.startTime);
        return isSameDay(lessonDate, dateToCompare);
    });
}
