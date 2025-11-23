#!/usr/bin/env python3
"""
Script para REEMPLAZAR los footers antiguos con el nuevo Luxury Footer
en todas las páginas HTML de Lauren Repostería.
"""

import re
from pathlib import Path

# Footer HTML completo
FOOTER_HTML = '''
    <!-- LUXURY FOOTER - Minimalista High-End -->
    <footer class="luxury-footer">
        <!-- Logo -->
        <div class="footer-logo">Lauren.</div>

        <!-- Iconos de Redes Sociales con colores de marca -->
        <div class="footer-social">
            <!-- Instagram con gradiente característico -->
            <a href="https://instagram.com/laurenreposteria22" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="instagram-gradient-footer" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:#FD5949;stop-opacity:1" />
                            <stop offset="50%" style="stop-color:#D6249F;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#285AEB;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="url(#instagram-gradient-footer)" />
                </svg>
            </a>

            <!-- WhatsApp verde característico -->
            <a href="https://wa.me/573104442796" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="#25D366" />
                </svg>
            </a>

            <!-- TikTok negro característico -->
            <a href="https://www.tiktok.com/@laurenreposteria" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" fill="#000000" />
                </svg>
            </a>
        </div>

        <!-- Línea Separadora -->
        <div class="footer-divider"></div>

        <!-- Copyright -->
        <p class="footer-copyright">
            © 2025 Lauren Repostería<br>
            Creando momentos dulces y memorables desde 2022.<br>
            Repostería artesanal con amor en cada detalle.<br>
            Medellín, Colombia
        </p>
    </footer>'''

# CSS del footer
FOOTER_CSS_LINK = '    <link rel="stylesheet" href="../css/luxury-footer.css">'

HTML_DIR = Path(r'c:\Users\crizc\OneDrive\Escritorio\LaurenReposteria\html')

# Páginas a procesar
PAGES = ['inicio.html', 'tortas.html', 'alfajores.html', 'brownies-galletas.html', 'detalles.html']

def process_file(filepath):
    """Procesa un archivo HTML individual"""
    page_name = filepath.name
    print(f"\nProcesando {page_name}...")
    
    try:
        # Leer archivo
        content = filepath.read_text(encoding='utf-8')
        original_content = content
        
        # 1. Agregar luxury-footer.css si no existe
        if 'luxury-footer.css' not in content:
            content = content.replace('</head>', FOOTER_CSS_LINK + '\n</head>')
            print(f"  ✓ luxury-footer.css agregado")
        
        # 2. REEMPLAZAR footer antiguo con nuevo usando regex
        # Buscar desde <footer hasta </footer> (cualquier clase)
        footer_pattern = r'<footer[^>]*>.*?</footer>'
        
        # Hacer el reemplazo
        content_replaced, count = re.subn(
            footer_pattern,
            FOOTER_HTML.strip(),
            content,
            count=1,
            flags=re.DOTALL
        )
        
        if count > 0:
            content = content_replaced
            print(f"  ✓ Footer antiguo reemplazado por Luxury Footer")
        else:
            # Si no hay footer, agregarlo antes de </body>
            if '<footer' not in content:
                content = content.replace('</body>', FOOTER_HTML + '\n</body>')
                print(f"  ✓ Luxury Footer agregado (no había footer previo)")
        
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
    print("LUXURY FOOTER - Reemplazo de Footers Antiguos")
    print("=" * 60)
    
    results = {}
    
    for page_name in PAGES:
        filepath = HTML_DIR / page_name
        
        if not filepath.exists():
            print(f"\n⚠ Archivo no encontrado: {page_name}")
            results[page_name] = False
            continue
        
        results[page_name] = process_file(filepath)
    
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
        print(f"\n⚠ Sin cambios ({len(failed)}):")
        for page in failed:
            print(f"   - {page}")
    
    print(f"\nTotal: {len(successful)}/{len(PAGES)} footers reemplazados")
    print("=" * 60)

if __name__ == "__main__":
    main()
