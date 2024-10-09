export default function toStringWithSpecialChars(string) {
    const replacements = {
        "&aacute;": "á",
        "&eacute;": "é",
        "&iacute;": "í",
        "&oacute;": "ó",
        "&uacute;": "ú",
        "&ntilde;": "ñ",
        "&Aacute;": "Á",
        "&Eacute;": "É",
        "&Iacute;": "Í",
        "&Oacute;": "Ó",
        "&Uacute;": "Ú",
        "&Ntilde;": "Ñ",
        "&uuml;": "ü",
        "&Uuml;": "Ü",
        "&agrave;": "à",
        "&Agrave;": "À",
        "&egrave;": "è",
        "&Egrave;": "È",
        "&ograve;": "ò",
        "&Ograve;": "Ò",
    };
    return string.replace(/&[a-zA-Z]+;/g, (match) => replacements[match]);
}
