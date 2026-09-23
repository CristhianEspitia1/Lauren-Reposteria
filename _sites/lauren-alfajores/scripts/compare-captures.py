"""Comparación sin tolerancias de las capturas reales de Chrome. Requiere Pillow."""
import json
from pathlib import Path
from PIL import Image, ImageChops

evidence = Path(__file__).resolve().parent.parent / 'evidence'
results = []
for viewport in ['desktop', 'mobile']:
    for section in ['', '-flavors', '-boxes', '-builder', '-cart']:
        capture = viewport + section
        original = Image.open(evidence / f'original-{capture}.png').convert('RGB')
        public = Image.open(evidence / f'public-{capture}.png').convert('RGB')
        assert original.size == public.size, f'Dimensiones distintas: {capture}'
        diff = ImageChops.difference(original, public)
        changed = [pixel for pixel in diff.getdata() if pixel != (0, 0, 0)]
        results.append({
            'capture': capture,
            'originalSize': original.size,
            'publicSize': public.size,
            'differentPixels': len(changed),
            'maxChannelDifference': max((max(pixel) for pixel in changed), default=0),
            'boundingBox': diff.getbbox(),
        })
(evidence / 'pixel-comparison.json').write_text(json.dumps(results, indent=2) + '\n')
for result in results:
    print(f"{result['capture']}: {result['differentPixels']} píxeles distintos; "
          f"diferencia máxima por canal: {result['maxChannelDifference']}/255")
