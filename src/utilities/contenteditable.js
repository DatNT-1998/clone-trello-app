// Select all inline text when click
export const selectAllInlineText = (e) => {
  e.target.focus();
  e.target.select();
};

// on Keydown
export const saveContentAfterPressEnter = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    e.target.blur();
  }
};
