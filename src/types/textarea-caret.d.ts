declare module 'textarea-caret' {
  type TCaretCoordinates = {
    top: number;
    left: number;
    height: number;
  };

  const getCaretCoordinates: (
    element: HTMLTextAreaElement | HTMLInputElement,
    position: number,
  ) => TCaretCoordinates;

  export default getCaretCoordinates;
}
