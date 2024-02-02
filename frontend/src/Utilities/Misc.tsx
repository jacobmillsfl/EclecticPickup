import Image from 'react-bootstrap/Image';

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
            const imageTypes = [".png", ".jpg", ".jpeg", ".gif"]
            for (const ext of imageTypes) {
                if (item.endsWith(ext)) {
                    return <Image src={`${item}`} className="hover-zoom" style={{ "maxWidth": "100px", "maxHeight": "100px" }} thumbnail />
                }
            }
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

    static shuffleArray(array: Array<any>) {
        let currentIndex = array.length, randomIndex;

        while (currentIndex > 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    static isValidUrl(url: string): boolean {
        try {
            const parsedUrl = new URL(url);
            const isSafeUrl = url === parsedUrl.href || `${url}/` === parsedUrl.href;

            return isSafeUrl;
        } catch (error) {
            return false;
        }
    }
}