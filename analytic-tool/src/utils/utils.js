export function localUserReadableDateFormat(text) {
    if(!text) return '';
    return text.replace(/(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2}).*/gm, "$3.$2.$1 $4:$5:$6");
}