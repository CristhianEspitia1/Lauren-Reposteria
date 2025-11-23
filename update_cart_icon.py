#!/usr/bin/env python3
"""
Script para reemplazar el ícono SVG del carrito por imagen PNG
en el header de todas las páginas HTML.
"""

import re
from pathlib import Path

HTML_DIR = Path(r'c:\Users\crizc\OneDrive\Escritorio\LaurenReposteria\html')
PAGES = ['inicio.html', 'tortas.html', 'alfajores.html', 'brownies-galletas.html', 'detalles.html']

# Nuevo icono con imagen
NEW_CART_ICON = '''                <div class="nav-icon" role="button" aria-label="Carrito de compras">
                    <img src="../assets/icons/cart-icon.png" alt="Carrito">
                    <span class="cart-badge">0</span>
                </div>'''

def process_file(filepath):
    """Procesa un archivo HTML individual"""
    page_name = filepath.name
    print(f"\nProcesando {page_name}...")
    
    try:
        content = filepath.read_text(encoding='utf-8')
        original_content = content
        
        # Patrón para buscar el div nav-icon con SVG del carrito
        # Incluye todo desde <div class="nav-icon" hasta </div> que cierra ese div
        pattern = r'<div class="nav-icon"[^>]*>.*?</div>\s*</div>'
        
        # Reemplazar
        content_replaced, count = re.subn(
            pattern,
            NEW_CART_ICON + '\n            </div>',
            content,
            count=1,
            flags=re.DOTALL
        )
        
        if count > 0:
            content = content_replaced
            print(f"  ✓ Ícono SVG del carrito reemplazado por imagen PNG")
        else:
            print(f"  ⚠ No se encontró el ícono del carrito")
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
        import traceback
        traceback.print_exc()
        return False

def main():
    """Función principal"""
    print("=" * 60)
    print("HEADER CART ICON - Reemplazo de SVG por Imagen PNG")
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
    
    print(f"\nTotal: {len(successful)}/{len(PAGES)} íconos actualizados")
    print("=" * 60)

if __name__ == "__main__":
    main()
