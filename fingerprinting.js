// 动态加载 CryptoJS
const loadCryptoJS = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.bootcdn.net/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
});

// 加载 FingerprintJS 和获取 fingerprint
const getFingerprint = () => {
    return import('https://openfpcdn.io/fingerprintjs/v4')
        .then((FingerprintJS) => FingerprintJS.load())
        .then((fp) => fp.get())
        .then((result) => result.components)
        .catch((error) => console.error(error));
};

// 计算 hash 值
const hashString = (inputString) => {
    const hash = CryptoJS.SHA256(inputString);
    return hash.toString(CryptoJS.enc.Hex);
};

// 生成 fingerprint 对象
const generateFingerprintObject = async () => {
    await loadCryptoJS;

    const result = await getFingerprint();

    const hashValues = {
        fonts: hashString(JSON.stringify(result.fonts.value)),
        version: "test",
        deviceMemory: hashString(JSON.stringify(result.deviceMemory.value)),
        hardwareConcurrency: hashString(JSON.stringify(result.hardwareConcurrency.value)),
        timezone: hashString(JSON.stringify(result.timezone.value)),
        cpuClass: hashString(JSON.stringify(result.cpuClass.value)),
        platform: hashString(JSON.stringify(result.platform.value))
    };

    const concatenatedString = Object.values(hashValues).join('');
    const finalHash = hashString(concatenatedString);

    return {
        ...hashValues,
        fingerprint: finalHash
    };
};
