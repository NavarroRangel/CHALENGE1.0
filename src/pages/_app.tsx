import type { AppProps } from 'next/app';
import '../styles/globals.css'; // Importe o arquivo de estilos global

// Definição do componente App
const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default MyApp;