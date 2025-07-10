import Header from './header';
import Footer from './footer';

export default function Layout({ children, usuario }) {
  return (
    <>
      <Header usuario={usuario} />
      <main className="container my-5">{children}</main>
      <Footer />
    </>
  );
}