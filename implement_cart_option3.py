#!/usr/bin/env python3
"""
Script para implementar la Opción 3 (Sólida) del ícono del carrito
en el header de todas las páginas HTML.
"""

import re
from pathlib import Path

HTML_DIR = Path(r'c:\Users\crizc\OneDrive\Escritorio\LaurenReposteria\html')
PAGES = ['inicio.html', 'tortas.html', 'alfajores.html', 'brownies-galletas.html', 'detalles.html']

# Nuevo icono SVG - Opción 3: Sólida
NEW_CART_ICON = '''                <div class="nav-icon" role="button" aria-label="Carrito de compras">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <path d="M16 6V5a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v1H4a1 1 0 0 0-1 1v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a1 1 0 0 0-1-1h-4zm-6-1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4V5z"/>
                    </svg>
                    <span class="cart-badge">0</span>
                </div>'''

def process_file(filepath):
    """Procesa un archivo HTML individual"""
    page_name = filepath.name
    print(f"\nProcesando {page_name}...")
    
    try:
        content = filepath.read_text(encoding='utf-8')
        original_content = content
        
        # Patrón para buscar el div nav-icon completo (con img o svg)
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
            print(f"  ✓ Ícono del carrito reemplazado por Opción 3 (Sólida)")
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
    print("CART ICON - Implementando Opción 3 (Sólida)")
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
