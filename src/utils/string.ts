export function capitalizeLastWord(str: string) {
    return str.replace(/\w+$/, (match) => {
        return match.charAt(0) + match.slice(1).toLowerCase();
    });
}
