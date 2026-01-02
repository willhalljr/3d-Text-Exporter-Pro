
import opentype from 'opentype.js';
import * as THREE from 'three';

export class FontService {
  private static cache: Map<string, opentype.Font> = new Map();

  static async loadFont(url: string): Promise<opentype.Font> {
    if (this.cache.has(url)) return this.cache.get(url)!;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error(`The URL returned HTML instead of a font file. The file path might be incorrect (404).`);
      }

      const buffer = await response.arrayBuffer();
      
      // Basic check for HTML error pages masquerading as 200 OK (common in some environments)
      const view = new DataView(buffer);
      if (buffer.byteLength > 4) {
        const magic = view.getUint32(0);
        if (magic === 0x3C21444F || magic === 0x3C68746D) { // "<!DO" or "<htm"
          throw new Error("Invalid font data: The server returned an HTML page instead of a font file.");
        }
      }

      const font = opentype.parse(buffer);
      this.cache.set(url, font);
      return font;
    } catch (e: any) {
      console.error(`Font Load Failed [${url}]:`, e);
      throw new Error(`Font fetch error: ${e.message}. Please try a different font or upload a .ttf/.otf file.`);
    }
  }

  static createShapesFromFont(
    text: string,
    font: opentype.Font,
    size: number,
    letterSpacing: number = 0,
    lineHeight: number = 1.2,
    invert: boolean = false
  ): THREE.Shape[] {
    const lines = text.split('\n');
    const allShapes: THREE.Shape[] = [];
    
    lines.forEach((line, lineIndex) => {
      const baselineY = -lineIndex * size * lineHeight;
      const linePath = font.getPath(line, 0, -baselineY, size, {
        kerning: true,
        letterSpacing: letterSpacing * size
      });

      const shapePath = new THREE.ShapePath();
      
      linePath.commands.forEach((cmd) => {
        const y = -cmd.y; 
        switch (cmd.type) {
          case 'M': shapePath.moveTo(cmd.x, y); break;
          case 'L': shapePath.lineTo(cmd.x, y); break;
          case 'Q': shapePath.quadraticCurveTo(cmd.x1, -cmd.y1, cmd.x, y); break;
          case 'C': shapePath.bezierCurveTo(cmd.x1, -cmd.y1, cmd.x2, -cmd.y2, cmd.x, y); break;
          case 'Z': break;
        }
      });

      const shapes = shapePath.toShapes(invert);
      allShapes.push(...shapes);
    });

    return allShapes;
  }
}
