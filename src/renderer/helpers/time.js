export function nowJson(){
    return new Date().toJSON();
}

export function todayJSON(){
    return new Date().toJSON().split('T')[0] + 'T00:00:00.000Z';
}

export function month(){
    return ('0' + (new Date().getMonth() + 1)).substr(-2)
}

export function today(){
    return new Date().toJSON().split('T')[0];
}

export function thisMonth(){
    const [year, month] = new Date().toJSON().split('-');
    return `${year}-${month}`;
}

export function floorDate(date){
    const d = date instanceof Date ? date : new Date(date);
    return d.toJSON().split('T')[0] + 'T00:00:00.000Z';
}

export function oneWeekAgoJSON(){
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return floorDate(d);
}

export function year(){
    return new Date().getFullYear();
}

export const currentYear = year;

export const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
export function getMonthName(date){
    const d = date ? (date instanceof Date ? date : new Date(date)) : new Date();
    return monthNames[d.getMonth()]
}

const millisPerDay = 1000 * 60 * 60 * 24;
export function daysDiff(date1, date2){ // TODO: fix innacuracy
    const d1 = new Date(date1);
    const d2 = date2 ? new Date(date2) : new Date();
    d1.setHours(0, 0, 0);
    d2.setUTCHours(0, 0, 0);
    const t1 = d1.getTime();
    const t2 = d2.getTime();
    const timeDiff = t1 - t2;
    return Math.floor(timeDiff / millisPerDay);
}