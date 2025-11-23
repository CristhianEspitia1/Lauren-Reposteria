#!/usr/bin/env python3
"""
Script para reemplazar headers antiguos con el nuevo glass navigation header
en todas las páginas HTML de Lauren Repostería de forma segura.
"""

import re
from pathlib import Path

# Header HTML nuevo
NEW_HEADER = '''    <!-- Glass Navigation Header -->
    <nav class="glass-nav">
        <div class="glass-nav-container">
            <div class="glass-nav-content">
                <!-- Menú Desplegable (izquierda) -->
                <div class="nav-menu-wrapper">
                    <button class="nav-menu-btn">Menú</button>
                    <div class="nav-menu-dropdown">
                        <a href="inicio.html">Inicio</a>
                        <a href="tortas.html"{TORTAS_CLASS}>Tortas</a>
                        <a href="alfajores.html"{ALFAJORES_CLASS}>Alfajores</a>
                        <a href="brownies-galletas.html"{BROWNIES_CLASS}>Brownies y Galletas</a>
                        <a href="detalles.html"{DETALLES_CLASS}>Detalles</a>
                    </div>
                </div>
                
                <!-- Logo Centrado -->
                <div class="nav-logo-wrapper">
                    <a href="inicio.html" class="nav-logo">Lauren</a>
                </div>
                
                <!-- Ícono Carrito (derecha) -->
                <div class="nav-icon" role="button" aria-label="Carrito de compras">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 2L7.17 4H3C1.9 4 1 4.9 1 6V18C1 19.1 1.9 20 3 20H21C22.1 20 23 19.1 23 18V6C23 4.9 22.1 4 21 4H16.83L15 2H9Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M1 8H23" stroke-width="2" stroke-linecap="round"/>
                        <circle cx="12" cy="13" r="3" stroke-width="2"/>
                    </svg>
                    <span class="cart-badge">0</span>
                </div>
            </div>
        </div>
    </nav>'''

# Configuración de páginas
PAGES = {
    'tortas.html': {'TORTAS_CLASS': ' class="active"', 'ALFAJORES_CLASS': '', 'BROWNIES_CLASS': '', 'DETALLES_CLASS': ''},
    'brownies-galletas.html': {'TORTAS_CLASS': '', 'ALFAJORES_CLASS': '', 'BROWNIES_CLASS': ' class="active"', 'DETALLES_CLASS': ''},
    'detalles.html': {'TORTAS_CLASS': '', 'ALFAJORES_CLASS': '', 'BROWNIES_CLASS': '', 'DETALLES_CLASS': ' class="active"'},
    'inicio.html': {'TORTAS_CLASS': '', 'ALFAJORES_CLASS': '', 'BROWNIES_CLASS': '', 'DETALLES_CLASS': ''},
}

# Google Fonts y CSS a agregar
FONTS_AND_CSS = '''    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="../css/glass-nav.css">
'''

HTML_DIR = Path(r'c:\Users\crizc\OneDrive\Escritorio\LaurenReposteria\html')

def process_file(filepath, page_name):
    """Procesa un archivo HTML individual"""
    print(f"\nProcesando {page_name}...")
    
    try:
        # Leer archivo
        content = filepath.read_text(encoding='utf-8')
        original_content = content
        
        # 1. Agregar Google Fonts y CSS si no existen
        if 'glass-nav.css' not in content:
            content = content.replace(
                '    <link rel="stylesheet" href="../css/header.css">',
                FONTS_AND_CSS + '    <link rel="stylesheet" href="../css/header.css">'
            )
            print(f"  ✓ Google Fonts y glass-nav.css agregados")
        
        # 2. Reemplazar header usando regex para encontrarlo de forma segura
        # Buscar desde <header class="minimal-header"> hasta </header>
        header_pattern = r'    <!-- Header minimalista -->.*?</header>'
        
        # Preparar nuevo header con clase active correcta
        new_header = NEW_HEADER
        for key, value in PAGES[page_name].items():
            new_header = new_header.replace(f'{{{key}}}', value)
        
        # Hacer el reemplazo
        content_replaced, count = re.subn(
            header_pattern,
            new_header,
            content,
            count=1,
            flags=re.DOTALL
        )
        
        if count > 0:
            content = content_replaced
            print(f"  ✓ Header reemplazado exitosamente")
        else:
            print(f"  ⚠ No se encontró el header para reemplazar")
            return False
        
        # 3. Guardar solo si hubo cambios
        if content != original_content:
            filepath.write_text(content, encoding='utf-8')
            print(f"  ✓ Archivo guardado: {page_name}")
            return True
        else:
            print(f"  - Sin cambios necesarios")
            return False
            
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False

def main():
    """Función principal"""
    print("=" * 60)
    print("GLASS NAVIGATION HEADER - Implementación Automatizada")
    print("=" * 60)
    
    results = {}
    
    for page_name, config in PAGES.items():
        filepath = HTML_DIR / page_name
        
        if not filepath.exists():
            print(f"\n⚠ Archivo no encontrado: {page_name}")
            results[page_name] = False
            continue
        
        results[page_name] = process_file(filepath, page_name)
    
    # Resumen
    print("\n" + "=" * 60)
    print("RESUMEN")
    print("=" * 60)
    
    successful = [k for k, v in results.items() if v]
    failed = [k for k, v in results.items() if not v]
    
    print(f"\n✅ Exitosos ({len(successful)}):")
    for page in successful:
        print(f"   - {page}")
    
    if failed:
        print(f"\n❌ Fallidos ({len(failed)}):")
        for page in failed:
            print(f"   - {page}")
    
    print(f"\nTotal: {len(successful)}/{len(PAGES)} páginas actualizadas")
    print("=" * 60)

if __name__ == "__main__":
    main()
