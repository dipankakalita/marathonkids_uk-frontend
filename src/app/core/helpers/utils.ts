import * as moment from 'moment';

export function getFirstItem(obj): any {
    const firstAccount = obj[Object.keys(obj)[0]];
    return firstAccount;
}

export function getDecimal(value): any {
    const decimal = (value + '').split('.');
    if (decimal.length > 1) {
        return decimal[1];
    } else {
        return '00';
    }
}

export function getInteger(value): any {
    return Math.floor(value);
}

export function genExpandArgs(expands): string {
    let expandArg = '';
    if (expands) {
        expandArg = '?expand=';
        for (let i = 0; i < expands.length; i++) {
            if (i !== 0) {
                expandArg += ',';
            }
            expandArg += expands[i];
        }
    }

    return expandArg;
}

export function getDeviceName(): any {
    const sourceInformation: any = {
        browser: {},
        machine: {}
    };

    sourceInformation.browser.url = window.location.href;
    sourceInformation.browser.useragent = navigator.userAgent.toLowerCase();
    sourceInformation.browser.version =
        (sourceInformation.browser.useragent.match(/.*(?:rv|chrome|webkit|opera|ie)[\/: ](.+?)([ \);]|$)/) || [])[1];
    sourceInformation.browser.cookies = navigator.cookieEnabled;
    sourceInformation.browser.size = window.screen.availWidth + 'x' + window.screen.availHeight;

    if (/chrome/.test(sourceInformation.browser.useragent)) {
        sourceInformation.browser.browser = 'Chrome';
    } else if (/webkit/.test(sourceInformation.browser.useragent)) {
        sourceInformation.browser.browser = 'Webkit';
    } else if (/opera/.test(sourceInformation.browser.useragent)) {
        sourceInformation.browser.browser = 'Opera';
    } else if (/mozilla/.test(sourceInformation.browser.useragent)) {
        sourceInformation.browser.browser = 'Mozilla';
    } else if (/msie/.test(sourceInformation.browser.useragent)) {
        sourceInformation.browser.browser = 'IE';
    } else {
        sourceInformation.browser.browser = 'Unknown';
    }

    if (!! /windows/.test(sourceInformation.browser.useragent)) {
        sourceInformation.machine.device = 'Windows';
    } else if (!! /iphone/.test(sourceInformation.browser.useragent)) {
        sourceInformation.machine.device = 'iPhone';
    } else if (!! /ipad/.test(sourceInformation.browser.useragent)) {
        sourceInformation.machine.device = 'iPad';
    } else if (!! /android/.test(sourceInformation.browser.useragent)) {
        sourceInformation.machine.device = 'Android';
    } else if (!! /macintosh/.test(sourceInformation.browser.useragent)
        || (/mac os x/.test(sourceInformation.browser.useragent)
            && !/like mac os x/.test(sourceInformation.browser.useragent))) {
        sourceInformation.machine.device = 'Mac';
    } else {
        sourceInformation.machine.device = 'Unknown';
    }

    return `${sourceInformation.machine.device} / ${sourceInformation.browser.browser}`;
}

export function serializeParams(params): any {
    const s = [];
    const rbracket = /\[\]$/;
    const isArray = (obj) => {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    const add = (k, v) => {
        v = typeof v === 'function' ? v() : v === null ? '' : v === undefined ? '' : v;
        s[s.length] = encodeURIComponent(k) + '=' + encodeURIComponent(v);
    };

    const buildParams = (prefix, obj) => {
        let i;
        let len;
        let key;

        if (prefix) {
            if (isArray(obj)) {
                for (i = 0, len = obj.length; i < len; i++) {
                    if (rbracket.test(prefix)) {
                        add(prefix, obj[i]);
                    } else {
                        buildParams(prefix + '[' + (typeof obj[i] === 'object' ? i : '') + ']', obj[i]);
                    }
                }
            } else if (obj && String(obj) === '[object Object]') {
                for (key in obj) {
                    if (key in obj) {
                        buildParams(prefix + '[' + key + ']', obj[key]);
                    }
                }
            } else {
                add(prefix, obj);
            }
        } else if (isArray(obj)) {
            for (i = 0, len = obj.length; i < len; i++) {
                add(obj[i].name, obj[i].value);
            }
        } else {
            for (key in obj) {
                if (key in obj) {
                    buildParams(key, obj[key]);
                }
            }
        }
        return s;
    };

    return buildParams('', params).join('&')
        .replace(/%20/g, '+')
        .replace(/%5B%5D/g, '')
        .replace(/%5B/g, '[')
        .replace(/%5D/g, ']');
}

export function getCurrentYearID(validYears): any {
    for (const year of validYears) {
        if (moment(year.start_date) < moment()
            && moment(year.end_date) > moment()) {
            return year._id;
        }
    }

    return false;
}

export function getMultiSortOption(obj) {
    const options = [];
    for (const key in obj) {
        if (key in obj && obj[key].direction !== '') {
            options.push({...obj[key], ...{ key }});
        }
    }

    options.sort((a, b) => {
        return b.order - a.order;
    });

    let res: any = {};

    if (options.length > 0) {
        for (const option of options) {
            res[option.key] = option.direction;
        }
    } else {
        res = null;
    }

    return res;
}
