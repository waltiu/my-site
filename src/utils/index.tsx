

// 下载url
export const downloadUrl = (url: string) => {
  if (url) {
    const link = document.createElement("a");
    link.href = url.replace(/^http:\/\//i, "https://");
    link.click();
  }
};

// 下载文件
export const downloadFile = (url: string, fileName?: string) => {
  // 使用xhr下载文件
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob";
  xhr.onload = (e) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const targetUrl = e?.target?.responseURL;
    // 下载之后生成文件url 模拟a标签点击下载
    const url = window.URL.createObjectURL(xhr.response);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || targetUrl;
    a.click();
  };
  xhr.send();
};

// 生成32位uuid
export const uuid = () => {
  const s = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 32; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  // @ts-ignore
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23];
  const uuid = s.join("");
  return uuid;
};

// 获取url参数
export const getUrlParams = () => {
  const url = new URLSearchParams(window.location.search);
  return Object.fromEntries(url.entries());
};



export const copyText = (text: string) => {
  const oInput = document.createElement("input");
  oInput.value = text;
  document.body.appendChild(oInput);
  oInput.select(); // 选择对象
  document.execCommand("Copy"); // 执行浏览器复制命令
  Toast.show({
    icon: "success",
    content: "复制成功"
  });
  oInput.className = "oInput";
  oInput.style.display = "none";
  document.body.removeChild(oInput);
};
