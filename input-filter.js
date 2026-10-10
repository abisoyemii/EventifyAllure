const emojiPattern = /[\p{Extended_Pictographic}\p{Regional_Indicator}\p{Emoji_Modifier}\uFE0F\u20E3\u200D\u{E0020}-\u{E007F}]/gu;

document.addEventListener('input', (event) => {
  const field = event.target;
  if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;

  const value = field.value;
  const cursor = field.selectionStart;
  const cleanedValue = value.replace(emojiPattern, '');
  if (cleanedValue === value) return;

  field.value = cleanedValue;
  if (cursor !== null) {
    const cleanedCursor = value.slice(0, cursor).replace(emojiPattern, '').length;
    field.setSelectionRange(cleanedCursor, cleanedCursor);
  }
});
