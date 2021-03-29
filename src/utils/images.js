export function urlToImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
    img.src = url;
  });
}

export function fileToImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });
}

export function rotateImage(img, compression) {
  const canvas = document.createElement("canvas");
  canvas.width = img.height;
  canvas.height = img.width;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  const ctx = canvas.getContext("2d");

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-Math.PI / 2);
  ctx.drawImage(img, -cy, -cx, canvas.height, canvas.width);
  ctx.restore();

  const { type, q } = { type: "image/jpeg", q: 0.75, ...compression };
  return canvas.toDataURL(type, q);
}

export function rotateImageBase64(base64) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  var img = new Image();
  img.src = base64;

  canvas.height = img.width;
  canvas.width = img.height;

  ctx.rotate((90 * Math.PI) / 180);
  ctx.translate(0, -canvas.width);
  ctx.drawImage(img, 0, 0);

  return canvas.toDataURL("image/jpeg", 100);
}

export function compressImage(img, compression) {
  const { maxArea, type, q } = {
    maxArea: 640 * 320,
    q: 0.75,
    type: "image/jpeg",
    ...compression,
  };
  const canvas = document.createElement("canvas");
  const ratio = Math.min(Math.sqrt(maxArea / (img.width * img.height)), 1);
  canvas.width = img.width * ratio;
  canvas.height = img.height * ratio;

  const ctx = canvas.getContext("2d");

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL(type, q);
}
