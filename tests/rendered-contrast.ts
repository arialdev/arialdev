import type { Page } from "@playwright/test";

// Axe cannot resolve the glass panels over a gradient. Sample their rendered
// backgrounds separately from the CSS foreground, without text antialiasing.
export async function renderedContrast(page: Page) {
  // Let focus, scrolling and touch hover reach the same painted state before
  // reading foreground colors and capturing the background separately.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
  const samples = await page.evaluate(() => {
    const samples = [];
    const dialog = document.querySelector("dialog[open]");
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const parent = node.parentElement;
      if (
        !node.textContent?.trim() ||
        !parent ||
        parent.closest("script, style, astro-dev-toolbar, .project-art, .sr-only, [inert]") ||
        !parent.checkVisibility({ checkVisibilityCSS: true, checkOpacity: true }) ||
        (dialog && !dialog.contains(parent))
      )
        continue;
      const style = getComputedStyle(parent);
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) {
        if (
          rect.width < 1 ||
          rect.height < 1 ||
          rect.bottom <= 0 ||
          rect.top >= innerHeight ||
          rect.right <= 0 ||
          rect.left >= innerWidth
        )
          continue;
        samples.push({
          text: node.textContent.trim(),
          color: style.color,
          fontSize: parseFloat(style.fontSize),
          fontWeight: parseInt(style.fontWeight),
          x: Math.max(0, rect.x),
          y: Math.max(0, rect.y),
          width: Math.min(innerWidth, rect.right) - Math.max(0, rect.x),
          height: Math.min(innerHeight, rect.bottom) - Math.max(0, rect.y),
        });
      }
    }
    return samples;
  });
  const hideText = await page.addStyleTag({
    content:
      "* { color: transparent !important; text-shadow: none !important; } astro-dev-toolbar { display: none !important; }",
  });
  try {
    const screenshot = await page.screenshot({ scale: "css" });
    return await page.evaluate(
      async ({ samples, png }) => {
        const image = new Image();
        image.src = `data:image/png;base64,${png}`;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d")!;
        context.drawImage(image, 0, 0);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const luminance = (rgb: number[]) =>
          rgb
            .map((value) => value / 255)
            .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4))
            .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index]!, 0);
        return samples.map((sample) => {
          const color = sample.color.match(/[\d.]+/g)!.map(Number);
          let minimum = Infinity;
          for (let y = Math.ceil(sample.y); y < sample.y + sample.height; y += 2) {
            for (let x = Math.ceil(sample.x); x < sample.x + sample.width; x += 2) {
              const index = (y * canvas.width + x) * 4;
              const background = [pixels[index]!, pixels[index + 1]!, pixels[index + 2]!];
              const bg = luminance(background);
              const fg = luminance(
                color
                  .slice(0, 3)
                  .map(
                    (value, index) =>
                      value * (color[3] ?? 1) + background[index]! * (1 - (color[3] ?? 1)),
                  ),
              );
              minimum = Math.min(minimum, (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05));
            }
          }
          const threshold =
            sample.fontSize >= 24 || (sample.fontSize >= 18.6667 && sample.fontWeight >= 700)
              ? 3
              : 4.5;
          return { text: sample.text, color: sample.color, minimum, threshold };
        });
      },
      { samples, png: screenshot.toString("base64") },
    );
  } finally {
    await hideText.evaluate((element) => element.parentNode?.removeChild(element));
  }
}
