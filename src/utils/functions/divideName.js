export default function divideName(name) {
    const words = name.split(' ');
    const wordsQuantity = words.length;
    
    let firstname = '';
    let lastname = '';

    const half = Math.ceil(wordsQuantity / 2);

    for (let i = 0; i < wordsQuantity; i++) {
        if (i < half) {
            firstname += words[i] + ' ';
        } else {
            lastname += words[i] + ' ';
        }
    }

    firstname = firstname.trim();
    lastname = lastname.trim();

    return {
        firstname: firstname,
        lastname: lastname,
    };
}
