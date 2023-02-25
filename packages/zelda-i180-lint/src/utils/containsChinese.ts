const HAN_REGEX =
    /[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DB5\u4E00-\u9FD5\uF900-\uFA6D\uFA70-\uFAD9]/;

/**
 * Returns true if the `text` contains at least one Chinese characters;
 */

const containsChinese = (text: string) => {
    if (!text)
        return false;

    return !!text.match(HAN_REGEX);
};

export default containsChinese