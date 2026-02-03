function isObjectEqual(obj1, obj2) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
    let isEqual = true;
    Object.keys(obj1).forEach((key) => {
        if (obj1[key] !== obj2?.[key]) isEqual = false;
    });
    return isEqual;
}

export default isObjectEqual;
