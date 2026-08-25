interface PhotoStrings {
  addPhoto: string;
  hint: string;
}

const STRINGS: Record<string, PhotoStrings> = {
  en: { addPhoto: "Add a photo", hint: "Paste an image URL in the editor" },
  ko: { addPhoto: "사진 추가", hint: "편집기에서 이미지 URL을 붙여넣으세요" },
  ja: { addPhoto: "写真を追加", hint: "エディタで画像URLを貼り付け" },
  zh: { addPhoto: "添加照片", hint: "在编辑器中粘贴图片链接" },
  de: { addPhoto: "Foto hinzufügen", hint: "Bild-URL im Editor einfügen" },
  fr: { addPhoto: "Ajouter une photo", hint: "Colle une URL d'image dans l'éditeur" },
  es: { addPhoto: "Añadir foto", hint: "Pega una URL de imagen en el editor" },
};

export function getPhotoStrings(locale: string): PhotoStrings {
  return STRINGS[locale.slice(0, 2)] ?? STRINGS.en;
}
