export function setCookie(name, value, maxAge) {
  if (typeof document === "undefined") {
    return;
  }
  const date = new Date(Date.now() + maxAge * 1000);
  document.cookie = `${name}=${
    value || ""
  }; expires=${date.toUTCString()}; path=/`;
}

export function getCookie(name) {
  if (typeof document === "undefined") {
    return null;
  }
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) == 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}

export function eraseCookie(name) {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}
