import Header from './Header';
import Footer from './Footer';

export default function Layout({ children, usuario }) {
  return (
    <>
      <Header usuario={usuario} />
      <main className="container my-5">{children}</main>
      <Footer />
    </>
  );
}