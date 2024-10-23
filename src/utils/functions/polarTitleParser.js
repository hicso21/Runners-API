export default function polarTitleParser(text) {
    return text
        .split('_')
        .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');
}
