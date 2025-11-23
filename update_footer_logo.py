#!/usr/bin/env python3
"""
Script para reemplazar el logo de texto por imagen en el footer
de todas las páginas HTML.
"""

import re
from pathlib import Path

HTML_DIR = Path(r'c:\Users\crizc\OneDrive\Escritorio\LaurenReposteria\html')
PAGES = ['inicio.html', 'tortas.html', 'alfajores.html', 'brownies-galletas.html', 'detalles.html']

# Nuevo logo con imagen
NEW_LOGO = '        <div class="footer-logo">\n            <img src="../assets/logos/footer-logo.png" alt="Lauren Repostería">\n        </div>'

def process_file(filepath):
    """Procesa un archivo HTML individual"""
    page_name = filepath.name
    print(f"\nProcesando {page_name}...")
    
    try:
        content = filepath.read_text(encoding='utf-8')
        original_content = content
        
        # Buscar y reemplazar el footer-logo con texto por el de imagen
        # Patrón: <div class="footer-logo">Lauren.</div>
        pattern = r'<div class="footer-logo">Lauren\.</div>'
        
        content_replaced, count = re.subn(
            pattern,
            NEW_LOGO,
            content,
            count=1
        )
        
        if count > 0:
            content = content_replaced
            print(f"  ✓ Logo de texto reemplazado por imagen")
        else:
            print(f"  ⚠ No se encontró el logo de texto")
            return False
        
        if content != original_content:
            filepath.write_text(content, encoding='utf-8')
            print(f"  ✓ Archivo guardado: {page_name}")
            return True
        else:
            print(f"  - Sin cambios")
            return False
            
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False

def main():
    """Función principal"""
    print("=" * 60)
    print("FOOTER LOGO - Reemplazo de Texto por Imagen")
    print("=" * 60)
    
    results = {}
    
    for page_name in PAGES:
        filepath = HTML_DIR / page_name
        
        if not filepath.exists():
            print(f"\n⚠ Archivo no encontrado: {page_name}")
            results[page_name] = False
            continue
        
        results[page_name] = process_file(filepath)
    
    print("\n" + "=" * 60)
    print("RESUMEN")
    print("=" * 60)
    
    successful = [k for k, v in results.items() if v]
    failed = [k for k, v in results.items() if not v]
    
    print(f"\n✅ Exitosos ({len(successful)}):")
    for page in successful:
        print(f"   - {page}")
    
    if failed:
        print(f"\n⚠ Sin cambios ({len(failed)}):")
        for page in failed:
            print(f"   - {page}")
    
    print(f"\nTotal: {len(successful)}/{len(PAGES)} logos actualizados")
    print("=" * 60)

if __name__ == "__main__":
    main()
