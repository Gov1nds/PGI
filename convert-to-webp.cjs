const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const imagesDir = path.join(__dirname, "public", "images");

fs.readdirSync(imagesDir).forEach((file) => {
  const ext = path.extname(file).toLowerCase();
  if (![".png", ".jpg", ".jpeg"].includes(ext)) return;

  const inputPath = path.join(imagesDir, file);
  const outputPath = path.join(
    imagesDir,
    path.basename(file, ext) + ".webp"
  );

  sharp(inputPath)
    .webp({ quality: 75 })
    .toFile(outputPath)
    .then(() => console.log(`✔ Converted: ${file} → WebP`))
    .catch((err) => console.error(`❌ Error converting ${file}`, err));
});
