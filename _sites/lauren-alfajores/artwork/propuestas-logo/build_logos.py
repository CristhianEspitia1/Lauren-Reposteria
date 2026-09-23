"""Vector logo proposals for the alfajor site; no production edits.

Run with Python + fontTools. Source fonts and OFL licenses live in fonts/.
Exported logos contain paths, so they need no installed or remote fonts.
"""
from pathlib import Path
from html import escape
import json
import re
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen

ROOT = Path(__file__).parent
INK = '#2c2132'
PAPER = '#fffdfb'
LILAC = '#dfd0ee'


def font(name, **axes):
    face = TTFont(ROOT / 'fonts' / f'{name}.ttf')
    return instantiateVariableFont(face, axes, inplace=True) if 'fvar' in face else face


CREAM = font('Fraunces', opsz=144, wght=900, SOFT=100, WONK=1)
BITE = font('BricolageGrotesque', opsz=96, wght=800, wdth=85)
LABEL = font('Outfit', wght=600)
HEADING = font('Outfit', wght=800)
HEAVY = font('Outfit', wght=900)
ROUND = font('Baloo2', wght=800)
CLUB = font('LilitaOne')
SIGNATURE = font('Pacifico')
MAICENA = font('Fraunces', opsz=9, wght=900, SOFT=100, WONK=1)
CLOUD = font('Fredoka', wght=700, wdth=112)
BONBON = font('Coiny')


def lettering(value, face, tracking=0):
    glyphs = face.getGlyphSet()
    cmap = face.getBestCmap()
    svg, bounds = SVGPathPen(glyphs), BoundsPen(glyphs)
    x = 0
    for char in value:
        glyph = glyphs[cmap[ord(char)]]
        transform = (1, 0, 0, 1, x, 0)
        glyph.draw(TransformPen(svg, transform))
        glyph.draw(TransformPen(bounds, transform))
        x += glyph.width + tracking
    return svg.getCommands(), bounds.bounds


def word(value, face, x, y, width=None, height=None, tracking=0, fill='currentColor'):
    d, (x0, y0, x1, y1) = lettering(value, face, tracking)
    scale = width / (x1 - x0) if width else height / (y1 - y0)
    return (f'<g transform="translate({x - x0 * scale:.3f} {y + y1 * scale:.3f}) scale({scale:.6f} {-scale:.6f})" fill="{fill}"><path d="{d}"/></g>',
            (x1-x0)*scale, (y1-y0)*scale)


def label(value, x, y, width, fill='currentColor'):
    return word(value, LABEL, x, y, width=width, tracking=230, fill=fill)[0]


def svg(content, viewbox, title, color=INK):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" color="{color}" fill="currentColor" role="img" aria-label="{escape(title)}"><title>{escape(title)}</title>{content}</svg>'


def alfajor(x=0, y=0, scale=1):
    # Two soft biscuit caps and a generous filling, drawn as one-color shapes.
    return f'''<g transform="translate({x} {y}) scale({scale})">
      <path d="M16 3Q53-6 90 3C106 7 106 23 90 27Q53 36 16 27C0 23 0 7 16 3Z"/>
      <path d="M14 38Q52 47 91 38L91 51C91 64 14 64 14 51Z"/>
      <path d="M6 65Q52 79 100 65L100 77C100 97 6 97 6 77Z"/>
    </g>'''


def cream_icon():
    # Lowercase L with soft terminals, in the same lettering as the main mark.
    return word('l', CREAM, 28, 8, height=99)[0] + alfajor(75, 76, .31)


def bite_icon():
    return '''<defs><mask id="bite-icon"><rect width="145" height="140" fill="white"/><circle cx="111" cy="17" r="20" fill="black"/><circle cx="130" cy="45" r="20" fill="black"/>
      <path d="M48 35H66V85H97V103H48Z" fill="black"/></mask></defs>
      <circle cx="70" cy="70" r="62" mask="url(#bite-icon)"/>
      <circle cx="124" cy="9" r="4"/><circle cx="139" cy="26" r="3"/>'''


def sparkle(x, y, scale=1):
    return f'<g transform="translate({x} {y}) scale({scale})"><path d="M0-22C3-7 7-3 22 0C7 3 3 7 0 22C-3 7-7 3-22 0C-7-3-3-7 0-22Z"/></g>'


def alfi():
    # An original alfajor character, with its face on the upper biscuit.
    # The outlines stay transparent, including all gaps between the two caps.
    return '''<g transform="rotate(-8 70 75)" fill="none" stroke="currentColor" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="70" cy="43" rx="56" ry="31"/>
      <path d="M14 44V58C14 98 126 98 126 58V44"/>
      <path d="M25 80V94C40 110 103 112 116 91V80"/>
      <path d="M18 97L17 110C21 144 124 146 129 113L129 101M18 97C41 117 106 124 129 101"/>
      <path d="M56 47Q67 60 82 48"/>
      <path d="M49 35V38M88 35V38" stroke-width="8"/>
    </g>'''


def monogram():
    return '''<defs><mask id="monogram-l"><rect width="150" height="150" fill="white"/>
      <path d="M45 32H68V91Q68 103 81 103H112V126H78Q45 126 45 93Z" fill="black"/>
      <path d="M79 35H112M79 47H112" fill="none" stroke="black" stroke-width="5" stroke-linecap="round"/></mask></defs>
      <rect x="4" y="4" width="138" height="138" rx="48" mask="url(#monogram-l)"/>'''


def extra_concepts():
    rounded = word('lauren', ROUND, 55, 23, width=532, tracking=-35)[0]
    rounded += sparkle(608, 38, .8)
    rounded += label('ALFAJORES', 223, 213, 208)

    friend = '<g transform="translate(14 24) scale(1.06)">' + alfi() + '</g>'
    friend += word('lauren', HEADING, 179, 49, width=432, tracking=-45)[0]
    friend += label('ALFAJORES', 294, 198, 212)

    club = '<ellipse cx="325" cy="121" rx="233" ry="103" fill="none" stroke="currentColor" stroke-width="6"/>'
    club += word('LAUREN', CLUB, 150, 70, width=350, tracking=10)[0]
    club += label('ALFAJORES', 239, 160, 173)
    club += sparkle(70, 121, .65) + sparkle(580, 121, .65)

    compact = '<g transform="translate(24 34) scale(1.07)">' + monogram() + '</g>'
    compact += word('LAUREN', HEAVY, 206, 72, width=418, tracking=-10)[0]
    compact += label('ALFAJORES', 209, 167, 247)

    signed = word('Lauren', SIGNATURE, 57, 9, width=525, tracking=-4)[0]
    signed += '<path d="M102 200C205 172 418 177 574 170C487 184 238 184 106 208Z"/>'
    signed += label('ALFAJORES', 294, 216, 211)

    return [
        dict(id='04-redondo', name='Redondo', line='Directo. Suave. Memorable.', detail='Un nombre grueso y redondo, con un pequeño destello. La opción más cercana al estilo que buscas en Crumbl.', content=rounded, icon=word('l', ROUND, 42, 9, height=119)[0]+sparkle(111, 38, .5), vb='0 0 650 260', bg=LILAC),
        dict(id='05-alfi', name='Alfi', line='Un alfajor con personalidad.', detail='Un alfajor sonriente como personaje propio. Cercano, reconocible y con juego para cajas y etiquetas.', content=friend, icon=alfi(), vb='0 0 650 260', bg='#f5eddf'),
        dict(id='06-club', name='Club del antojo', line='Un sello para llevar contigo.', detail='Un sello ovalado, letras contundentes y dos destellos. Pensado para cajas, stickers y la web.', content=club, icon=sparkle(72,70,2.8), vb='0 0 650 260', bg='#eadbde'),
        dict(id='07-monograma', name='La L', line='Compacto. Fuerte. Reconocible.', detail='Una L protagonista y una firma firme. Una marca compacta que se reconoce en tamaños pequeños.', content=compact, icon=monogram(), vb='0 0 650 260', bg='#eee8f4'),
        dict(id='08-firma', name='La firma', line='Espontáneo. Cálido. Con ritmo.', detail='Una firma con ritmo de repostería, más expresiva y cálida. Un guiño al lado artesanal del alfajor.', content=signed, icon=word('L', SIGNATURE, 18, 2, height=119)[0], vb='0 0 650 260', bg='#f3e4d8'),
    ]


def concepts():
    # 01 — The soft axis deliberately changes the sharper serif used on the site.
    creamy = word('lauren', CREAM, 26, 28, width=523, tracking=-50)[0]
    creamy += alfajor(568, 114, .42)
    creamy += label('ALFAJORES', 213, 205, 205)

    # 02 — Custom geometric lettering, not a typeset font. Rounded terminals,
    # a single-storey a and wide counters keep this version friendly and clear.
    custom = '''<g fill="none" stroke="currentColor" stroke-width="22" stroke-linecap="round" stroke-linejoin="round">
      <path d="M13 9V91Q13 108 30 108"/>
      <g transform="translate(70)"><ellipse cx="28" cy="79" rx="28" ry="29"/><path d="M56 50V108"/></g>
      <path d="M160 50V81C160 118 220 118 220 81V50"/>
      <path d="M254 108V51M254 75C254 54 274 43 292 52"/>
      <path d="M355 108C333 116 313 101 313 79C313 43 363 43 373 67Q379 79 365 79H315"/>
      <path d="M407 108V51M407 75C407 42 467 42 467 77V108"/>
    </g>'''
    double = '<g transform="translate(15 52) rotate(-9 53 48)">' + alfajor() + '</g>'
    double += '<g transform="translate(160 23) scale(.94)">' + custom + '</g>'
    double += label('ALFAJORES', 290, 174, 197)

    # 03 — Compressed heavy uppercase, rising baseline and a real cutout in N.
    bite_word, _, bite_height = word('LAUREN', BITE, 31, 31, width=549, tracking=-32)
    bite = f'''<defs><mask id="word-bite"><rect width="640" height="220" fill="white"/>
      <circle cx="581" cy="36" r="14" fill="black"/>
      <circle cx="588" cy="58" r="12" fill="black"/></mask></defs>
      <g transform="rotate(-6 320 100)"><g mask="url(#word-bite)">{bite_word}</g>
      <circle cx="599" cy="13" r="5.5"/><circle cx="618" cy="37" r="4"/>
      {label('ALFAJORES', 219, 204, 202)}</g>'''
    return [
        dict(id='01-cremoso', name='Cremoso', line='Suave. Cercano. Irresistible.', detail='Letras con curvas generosas y un pequeño alfajor como punto final.', content=creamy, icon=cream_icon(), vb='0 0 650 260', bg=LILAC),
        dict(id='02-dos-tapas', name='Dos tapas', line='Simple. Redondo. Muy alfajor.', detail='Letras dibujadas a medida y un símbolo de dos tapas con mucho relleno.', content=double, icon=alfajor(17, 24, 1), vb='0 0 650 240', bg='#f5eddf'),
        dict(id='03-mordisco', name='Mordisco', line='Potente. Juguetón. Con actitud.', detail='Un nombre que sube, un mordisco y dos migas: el antojo hecho logo.', content=bite, icon=bite_icon(), vb='0 0 650 240', bg='#eadbde'),
    ]


def mini_alfajor(x, y, scale=1):
    return f'''<g transform="translate({x} {y}) scale({scale})">
      <path d="M2 26C2-8 78-8 78 26Q40 17 2 26Z"/>
      <path d="M7 35Q40 27 73 35V45Q40 56 7 45Z"/>
      <path d="M2 55Q40 65 78 55C80 91 0 91 2 55Z"/>
    </g>'''


def duo_alfajor():
    # Soft biscuit caps and an irregular filling band. The symbol shares the
    # rounded geometry of the lettering, instead of adding fine illustration.
    return '''<g transform="rotate(-11 66 65)">
      <rect x="8" y="6" width="116" height="31" rx="15.5"/>
      <path d="M17 47C31 40 42 48 55 46C75 39 86 49 115 45V63C106 82 94 69 79 74C61 81 53 71 40 73C25 80 14 72 17 61Z"/>
      <rect x="8" y="86" width="116" height="31" rx="15.5"/>
    </g>'''


def refined_concepts():
    # Round two is deliberately close to the user's three selected directions.
    maicena, _, cream_h = word('lauren', MAICENA, 43, 29, width=565, tracking=-62)
    maicena += label('ALFAJORES', 224, max(201, 29+cream_h+28), 202)

    nube, _, cloud_h = word('lauren', CLOUD, 32, 33, width=539, tracking=-43)
    nube += mini_alfajor(591, 33+cloud_h-38, .47)
    nube += label('ALFAJORES', 218, max(203, 33+cloud_h+28), 214)

    # A new, heavier interpretation of the custom lettering of option 02.
    filled_letters = '''<g fill="none" stroke="currentColor" stroke-width="26" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 9V88Q14 111 37 107"/>
      <g transform="translate(76)"><ellipse cx="29" cy="78" rx="29" ry="30"/><path d="M58 49V108"/></g>
      <path d="M169 49V78C169 122 231 122 231 78V49"/>
      <path d="M270 108V49M270 76C270 52 289 43 308 50"/>
      <path d="M392 108C369 117 346 101 346 78C346 24 405 32 410 65Q415 80 399 80H348"/>
      <path d="M452 108V49M452 75C452 39 514 40 514 77V108"/>
    </g>'''
    relleno = '<g transform="translate(31 35) scale(1.1)">' + filled_letters + '</g>'
    relleno += label('ALFAJORES', 216, 210, 218)

    bombon, _, bonbon_h = word('lauren', BONBON, 49, 34, width=552, tracking=-62)
    bombon += label('ALFAJORES', 220, max(204, 34+bonbon_h+30), 210)

    duo = '<g transform="translate(10 47) scale(.95)">' + duo_alfajor() + '</g>'
    duo_word, _, duo_h = word('lauren', ROUND, 164, 33, width=453, tracking=-48)
    duo += duo_word + label('ALFAJORES', 285, max(201, 33+duo_h+26), 211)
    return [
        dict(id='09-maicena', name='Maicena', line='La suavidad del 01, más compacta.', detail='Parte del 01: letras cremosas, serifs redondeados y proporciones más compactas.', content=maicena, icon=word('l', MAICENA, 39, 9, height=116)[0], vb='0 0 650 260', bg=LILAC, parent='01'),
        dict(id='10-nube', name='Nube', line='Redondo, con un pequeño antojo.', detail='Une el 02 y el 04: minúsculas muy redondas y un mini alfajor como punto final.', content=nube, icon=mini_alfajor(20, 13, 1.3), vb='0 0 650 260', bg='#f5eddf', parent='02 + 04'),
        dict(id='11-relleno', name='Relleno', line='Letras con más cuerpo.', detail='Una evolución del 02 con trazos más gruesos, una l curva y el nombre como protagonista.', content=relleno, icon='<g transform="translate(30 8)" fill="none" stroke="currentColor" stroke-width="29" stroke-linecap="round"><path d="M16 12V91Q16 122 61 110"/></g>', vb='0 0 650 260', bg=LILAC, parent='02'),
        dict(id='12-bombon', name='Bombón', line='Redondo y un poco más juguetón.', detail='Lleva el 04 a letras más infladas, con curvas orgánicas y un ritmo suave.', content=bombon, icon=word('l', BONBON, 34, 8, height=117)[0], vb='0 0 650 260', bg='#f5eddf', parent='04'),
        dict(id='13-duo', name='Dúo', line='Dos tapas. Una marca redonda.', detail='Combina el símbolo del 02 con el carácter redondo del 04. Tapas suaves y relleno ondulado.', content=duo, icon=duo_alfajor(), vb='0 0 650 260', bg=LILAC, parent='02 + 04'),
    ]


def main():
    items = concepts() + extra_concepts() + refined_concepts()
    for item in items:
        name = item['id']
        for suffix, color in [('', INK), ('-claro', PAPER)]:
            content = item['content'].replace('VAR_PAPER', INK if suffix else PAPER)
            (ROOT / f'{name}{suffix}.svg').write_text(svg(content, item['vb'], f"Lauren Alfajores · {item['name']}", color))
        (ROOT / f'{name}-simbolo.svg').write_text(svg(item['icon'].replace('VAR_PAPER', PAPER), '0 0 145 140', item['name']))
    # A portable, entirely outlined comparison sheet (no remote fonts).
    header = word('Un Lauren para estos alfajores.', HEADING, 66, 62, width=1068)[0]
    header += word('TRES PERSONALIDADES · UNA MISMA WEB', LABEL, 68, 141, height=15, tracking=140)[0]
    board = f'<rect width="1200" height="1420" fill="{PAPER}"/>{header}'
    for index, item in enumerate(items[:3]):
        top = 202 + index * 384
        bg = item['bg']
        board += f'<rect x="32" y="{top}" width="1136" height="360" rx="4" fill="{bg}"/>'
        board += word(f"0{index+1} / {item['name']}", HEADING, 63, top+33, height=26)[0]
        board += f'<g transform="translate(69 {top+100}) scale(.96)">{item["content"]}</g>'
        board += f'<path d="M759 {top+42}V{top+315}" stroke="{INK}" stroke-opacity=".12"/>'
        board += word('EN LA CABECERA', LABEL, 795, top+42, height=12, tracking=140)[0]
        board += f'<rect x="790" y="{top+77}" width="336" height="111" rx="9" fill="{PAPER}"/>'
        board += f'<path d="M810 {top+125}h16m-16 6h16m-16 6h16" fill="none" stroke="{INK}" stroke-width="1.5"/>'
        board += f'<g transform="translate(861 {top+99}) scale(.29)">{item["content"]}</g>'
        board += f'<path d="M1090 {top+125}h15l2 16h-19Z M1093 {top+125}v-4a4.5 4.5 0 0 1 9 0v4" fill="none" stroke="{INK}" stroke-width="1.5"/>'
        board += word(item['line'], LABEL, 796, top+220, width=308)[0]
        # Reverse one-ink use, useful for the filled buttons and stickers on the site.
        board += f'<rect x="790" y="{top+258}" width="336" height="66" rx="33" fill="{INK}"/>'
        board += f'<g color="{PAPER}" transform="translate(876 {top+261}) scale(.25)">{item["content"]}</g>'
    board += word('LAUREN ALFAJORES · PROPUESTAS DE IDENTIDAD', LABEL, 66, 1378, height=12, tracking=120)[0]
    (ROOT / 'tres-propuestas.svg').write_text(svg(board, '0 0 1200 1420', 'Tres logos nuevos para Lauren Alfajores'))
    # Eight choices in one sheet, with enough room to compare the lettering.
    eight = f'<rect width="1600" height="1570" fill="{PAPER}"/>'
    eight += word('Ocho formas de ser Lauren.', HEADING, 60, 48, height=67)[0]
    eight += word('TUS TRES PROPUESTAS + CINCO NUEVAS PERSONALIDADES', LABEL, 64, 143, height=17, tracking=110)[0]
    for index, item in enumerate(items[:8]):
        left = 42 + (index % 2) * 773
        top = 204 + (index // 2) * 320
        eight += f'<rect x="{left}" y="{top}" width="741" height="298" rx="3" fill="{item["bg"]}"/>'
        eight += word(f'{index+1:02d} / {item["name"]}', LABEL, left+28, top+25, height=22)[0]
        if index >= 3:
            eight += word('NUEVA', LABEL, left+628, top+29, height=11, tracking=100)[0]
        content = item['content'].replace('VAR_PAPER', item['bg'])
        eight += f'<g transform="translate({left+55} {top+60}) scale(.965)">{content}</g>'
    eight += word('LAUREN ALFAJORES · PROPUESTAS DE IDENTIDAD', LABEL, 61, 1521, height=14, tracking=110)[0]
    (ROOT / 'ocho-propuestas.svg').write_text(svg(eight, '0 0 1600 1570', 'Ocho propuestas de logo para Lauren Alfajores'))
    # New proposals 09–13 with the three selected references beside them.
    refinements = f'<rect width="1600" height="1250" fill="{PAPER}"/>'
    refinements += word('Cinco más, en tu estilo.', HEADING, 60, 48, height=67)[0]
    refinements += word('A PARTIR DE TUS FAVORITOS: 01, 02 Y 04', LABEL, 64, 143, height=17, tracking=110)[0]
    for index, item in enumerate(items[8:]):
        left = 42 + (index % 2) * 773
        top = 204 + (index // 2) * 320
        refinements += f'<rect x="{left}" y="{top}" width="741" height="298" rx="3" fill="{item["bg"]}"/>'
        refinements += word(f'{index+9:02d} / {item["name"]}', LABEL, left+28, top+25, height=22)[0]
        refinements += f'<g transform="translate({left+55} {top+60}) scale(.965)">{item["content"]}</g>'
    # Reference panel is clearly separate from the five new logo proposals.
    refinements += f'<rect x="815" y="844" width="741" height="298" rx="3" fill="{PAPER}" stroke="{INK}" stroke-opacity=".12"/>'
    refinements += word('TUS FAVORITOS', LABEL, 846, 873, height=17, tracking=100)[0]
    for offset, original_index in enumerate([0, 1, 3]):
        item = items[original_index]
        refinements += f'<g transform="translate({837+offset*237} 924) scale(.325)">{item["content"]}</g>'
        refinements += word(f'{original_index+1:02d}', LABEL, 922+offset*237, 1050, height=17)[0]
    refinements += word('Suaves, redondos y con mucho cuerpo.', LABEL, 847, 1098, height=17)[0]
    refinements += word('LAUREN ALFAJORES · SEGUNDA RONDA', LABEL, 61, 1201, height=14, tracking=110)[0]
    (ROOT / 'cinco-favoritos.svg').write_text(svg(refinements, '0 0 1600 1250', 'Cinco nuevos logos inspirados en los favoritos 01, 02 y 04'))
    metadata = [{key: value for key, value in item.items() if key not in ('content', 'icon')} for item in items]
    (ROOT / 'concepts.json').write_text(json.dumps(metadata, ensure_ascii=False, indent=2))
    # Keep the preview static and accessible; data only controls the comparison.
    page = (ROOT / 'index.html').read_text()
    cards = []
    favorites = {'01-cremoso', '02-dos-tapas', '04-redondo'}
    ordered = items[8:] + [item for item in items[:8] if item['id'] in favorites]
    for item in ordered:
        name, ident = escape(item['name']), item['id']
        number = ident[:2]
        tag = ' · NUEVA' if int(number) >= 9 else ' · TU FAVORITO' if ident in favorites else ''
        cards.append(f'''<article class="option" id="{ident}">
          <div class="art" style="background:{item['bg']}"><span class="number">{number}{tag}</span><img src="{ident}.svg" alt="Lauren Alfajores, propuesta {number} {name}" width="650" height="260"></div>
          <h2>{name}</h2><p>{escape(item['detail'])}</p>
          <div class="links"><button data-logo="{ident}">Ver en la web <span aria-hidden="true">↓</span></button><a href="{ident}.svg" download>SVG <span aria-hidden="true">↗</span></a></div>
        </article>''')
    page = re.sub(r'(<section class="options wrap"[^>]*>).*?(</section>)', lambda m: m[1]+'\n'+''.join(cards)+'\n'+m[2], page, count=1, flags=re.S)
    switches = ''.join(f'<button data-select="{item["id"]}" aria-pressed="{str(item["id"] == "09-maicena").lower()}">{item["id"][:2]} {escape(item["name"])}</button>' for item in ordered)
    page = re.sub(r'(<div class="switcher"[^>]*>).*?(</div>)', lambda m: m[1]+switches+m[2], page, count=1, flags=re.S)
    (ROOT / 'index.html').write_text(page)
    print('13 path-only logos, including five refinements from the chosen favorites.')


if __name__ == '__main__':
    main()
