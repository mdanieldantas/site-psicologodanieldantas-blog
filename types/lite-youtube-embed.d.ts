declare module 'lite-youtube-embed';

declare namespace JSX {
  interface IntrinsicElements {
    'lite-youtube': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      videoid: string;
      title?: string;
      playlabel?: string;
      params?: string;
      poster?: string;
      style?: React.CSSProperties;
      class?: string;
    }, HTMLElement>;
  }
}
