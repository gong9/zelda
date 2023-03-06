const toObject = (diffStr: string) => {
    let temStr = diffStr;

    if (temStr[temStr.length - 1] === ',') {
        temStr = temStr.slice(0, temStr.length - 1);
    }

    try {
        return JSON.parse(`{${temStr}}`);
    } catch (error) {
        console.error(error);
        return {};
    }
};

export default toObject;