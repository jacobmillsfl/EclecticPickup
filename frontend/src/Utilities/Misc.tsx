export default class Misc {
    static formatDate = (date: Date) => {
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const dayOfWeek = days[date.getDay()];
        const dayOfMonth = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${dayOfWeek}, ${dayOfMonth} ${month} ${year}`;
    };

    static formatType = (item: unknown) => {
        if (typeof item === "string") {
            return item.toString();
        } else if (item instanceof Date) {
            return Misc.formatDate(item);
        } else {
            return String(item); // Convert to string (fallback for other types)
        }
    }

    static capitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}