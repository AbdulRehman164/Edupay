export default function getMonthAndYear() {
    const currentDate = new Date();
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    return {
        month: months[currentDate.getMonth()],
        year: currentDate.getFullYear(),
    };
}
