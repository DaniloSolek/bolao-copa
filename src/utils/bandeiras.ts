const bandeiras: Record<string, string> = {
  // GRUPO A
  'México':           '🇲🇽',
  'África do Sul':    '🇿🇦',
  'Coreia do Sul':    '🇰🇷',
  'Tchéquia':         '🇨🇿',

  // GRUPO B
  'Canadá':                '🇨🇦',
  'Bósnia e Herzegovina':  '🇧🇦',
  'Catar':                 '🇶🇦',
  'Suíça':                 '🇨🇭',

  // GRUPO C
  'Brasil':    '🇧🇷',
  'Marrocos':  '🇲🇦',
  'Haiti':     '🇭🇹',
  'Escócia':   '🏴󠁧󠁢󠁳󠁣󠁴󠁿',

  // GRUPO D
  'Estados Unidos':  '🇺🇸',
  'Paraguai':        '🇵🇾',
  'Austrália':       '🇦🇺',
  'Turquia':         '🇹🇷',

  // GRUPO E
  'Alemanha':        '🇩🇪',
  'Curaçao':         '🇨🇼',
  'Costa do Marfim': '🇨🇮',
  'Equador':         '🇪🇨',

  // GRUPO F
  'Holanda':  '🇳🇱',
  'Japão':    '🇯🇵',
  'Suécia':   '🇸🇪',
  'Tunísia':  '🇹🇳',

  // GRUPO G
  'Bélgica':       '🇧🇪',
  'Egito':         '🇪🇬',
  'Irã':           '🇮🇷',
  'Nova Zelândia': '🇳🇿',

  // GRUPO H
  'Espanha':       '🇪🇸',
  'Cabo Verde':    '🇨🇻',
  'Arábia Saudita':'🇸🇦',
  'Uruguai':       '🇺🇾',

  // GRUPO I
  'França':   '🇫🇷',
  'Senegal':  '🇸🇳',
  'Iraque':   '🇮🇶',
  'Noruega':  '🇳🇴',

  // GRUPO J
  'Argentina': '🇦🇷',
  'Argélia':   '🇩🇿',
  'Áustria':   '🇦🇹',
  'Jordânia':  '🇯🇴',

  // GRUPO K
  'Portugal':    '🇵🇹',
  'RD Congo':    '🇨🇩',
  'Uzbequistão': '🇺🇿',
  'Colômbia':    '🇨🇴',

  // GRUPO L
  'Inglaterra': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Croácia':    '🇭🇷',
  'Gana':       '🇬🇭',
  'Panamá':     '🇵🇦',
}

export function getBandeira(nome: string): string {
  return bandeiras[nome] ?? '🏳️'
}