const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const IMAGE_DIR = path.join(__dirname, "public", "images");

(async () => {
  const files = fs.readdirSync(IMAGE_DIR);

  for (const file of files) {
    if (!/\.(jpg|jpeg|png)$/i.test(file)) continue;

    const inputPath = path.join(IMAGE_DIR, file);
    const ext = path.extname(file).toLowerCase();

    try {
      let image = sharp(inputPath).resize({
        width: 1600,
        withoutEnlargement: true,
      });

      // 🔥 REAL COMPRESSION
      if (ext === ".jpg" || ext === ".jpeg") {
        image = image.jpeg({
          quality: 75,
          mozjpeg: true,
        });
      }

      if (ext === ".png") {
        image = image.png({
          compressionLevel: 9,   // max PNG compression
          palette: true,         // huge size reduction
        });
      }

      const buffer = await image.toBuffer();
      fs.writeFileSync(inputPath, buffer);

      console.log(`✅ Optimized: ${file}`);
    } catch (err) {
      console.error(`❌ Failed: ${file}`, err.message);
    }
  }

  console.log("🎉 All images resized + compressed successfully");
})();
