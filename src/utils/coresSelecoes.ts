type CoresSel = { bg: string; text: string }

const cores: Record<string, CoresSel> = {
  // GRUPO A
  'México':           { bg: '#016f4a', text: '#ffffff' },
  'África do Sul':    { bg: '#007a4d', text: '#ffcf25' },
  'Coreia do Sul':    { bg: '#ff253a', text: '#ffffff' },
  'Tchéquia':         { bg: '#ff2727', text: '#ffffff' },

  // GRUPO B
  'Canadá':                { bg: '#d52b1e', text: '#ffffff' },
  'Bósnia e Herzegovina':  { bg: '#002395', text: '#fecb00' },
  'Catar':                 { bg: '#8d1b3d', text: '#ffffff' },
  'Suíça':                 { bg: '#ff0000', text: '#ffffff' },

  // GRUPO C
  'Brasil':    { bg: '#00a850', text: '#ffcf25' },
  'Marrocos':  { bg: '#c0262c', text: '#086839' },
  'Haiti':     { bg: '#0013ba', text: '#d21034' },
  'Escócia':   { bg: '#0065bd', text: '#ffffff' },

  // GRUPO D
  'Estados Unidos': { bg: '#0326de', text: '#ffffff' },
  'Paraguai':       { bg: '#de0000', text: '#ffffff' },
  'Austrália':      { bg: '#ffc100', text: '#086839' },
  'Turquia':        { bg: '#e30a17', text: '#ffffff' },

  // GRUPO E
  'Alemanha':        { bg: '#ffffff', text: '#000000' },
  'Curaçao':         { bg: '#012b7f', text: '#f7e516' },
  'Costa do Marfim': { bg: '#ff8a00', text: '#ffffff' },
  'Equador':         { bg: '#ffd600', text: '#0078c1' },

  // GRUPO F
  'Holanda':  { bg: '#ff7a00', text: '#000000' },
  'Japão':    { bg: '#2830e7', text: '#ffffff' },
  'Suécia':   { bg: '#005293', text: '#fecb00' },
  'Tunísia':  { bg: '#e30a17', text: '#ffffff' },

  // GRUPO G
  'Bélgica':       { bg: '#e31836', text: '#ffd200' },
  'Egito':         { bg: '#f1051f', text: '#000000' },
  'Irã':           { bg: '#df1818', text: '#ffffff' },
  'Nova Zelândia': { bg: '#272125', text: '#ffffff' },

  // GRUPO H
  'Espanha':        { bg: '#e31836', text: '#ffd200' },
  'Cabo Verde':     { bg: '#003893', text: '#ffffff' },
  'Arábia Saudita': { bg: '#005430', text: '#ffffff' },
  'Uruguai':        { bg: '#7ec1ff', text: '#000000' },

  // GRUPO I
  'França':   { bg: '#002395', text: '#ffffff' },
  'Senegal':  { bg: '#ffda17', text: '#000000' },
  'Iraque':   { bg: '#0d7053', text: '#ffffff' },
  'Noruega':  { bg: '#c70000', text: '#ffffff' },

  // GRUPO J
  'Argentina': { bg: '#6baddf', text: '#ffffff' },
  'Argélia':   { bg: '#006233', text: '#ffffff' },
  'Áustria':   { bg: '#ed3d32', text: '#ffffff' },
  'Jordânia':  { bg: '#ff1a1a', text: '#000000' },

  // GRUPO K
  'Portugal':    { bg: '#fc1432', text: '#008b4a' },
  'RD Congo':    { bg: '#007fff', text: '#f6d517' },
  'Uzbequistão': { bg: '#112bb3', text: '#ffffff' },
  'Colômbia':    { bg: '#ffd600', text: '#003893' },

  // GRUPO L
  'Inglaterra': { bg: '#ffffff', text: '#e31836' },
  'Croácia':    { bg: '#f30a0a', text: '#ffffff' },
  'Gana':       { bg: '#ffc100', text: '#000000' },
  'Panamá':     { bg: '#d21034', text: '#ffffff' },
}

export function getCoresSel(nome: string): CoresSel {
  return cores[nome] ?? { bg: '#334155', text: '#f1f5f9' }
}